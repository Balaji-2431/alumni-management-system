const User = require("../models/User");
const Job = require("../models/Job");
const Event = require("../models/Event");
const asyncHandler = require("../middleware/asyncHandler");

const getAlumniDashboard = asyncHandler(async (req, res) => {
  const alumniId = req.user.id;


  // 1️⃣ Basic alumni info
  const alumni = await User.findById(alumniId)
    .select(
      "name registerNumber department batch profileCompletion status approvedBy role profileUpdatedAt"
    )
    .populate("approvedBy", "name role");
    

  if (!alumni || alumni.role !== "alumni") {
    return res.status(404).json({ success: false, message: "Alumni not found" });
  }

  // 2️⃣ Counts
  const [jobCount, eventCount] = await Promise.all([
    Job.countDocuments({ createdBy: alumniId }),
    Event.countDocuments({ createdBy: alumniId }),
  ]);

  // 3️⃣ Your activities
  const myJobs = await Job.find({ createdBy: alumniId })
    .populate("createdBy", "name department email profilePic")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const myEvents = await Event.find({ createdBy: alumniId })
    .populate("createdBy", "name department email profilePic")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const formattedJobs = myJobs.map((job) => ({ 
      type: "job", 
      title: job.title,
      company: job.company,
      location: job.location,
      qualification: job.qualification,
      image: job.image,
      experience: job.experience,
      skills: job.skills,
      salary: job.salary,
      applyLink: job.applyLink,
      isApproved: job.isApproved,
      createdBy: job.createdBy,
      createdAt: job.createdAt
    }))
  
  const formattedEvents = myEvents.map((event)=>({
    type:"event",
    title: event.title,
    category: event.category,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    mode: event.mode,
    location: event.location,
    organizerName: event.organizerName,
    image: event.image,
    description: event.description,
    registrationRequired: event.registrationRequired,
    registrationLink: event.registrationLink,
    lastRegistrationDate: event.lastRegistrationDate,
    eventLink: event.eventLink,
    isApproved: event.isApproved,
    createdBy: event.createdBy,
    createdAt: event.createdAt
  }))
  const yourPosts = [
    ...formattedJobs,
    ...formattedEvents
  ]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 6);

  // 4️⃣ Send response directly

  const otherJobs = await Job.find({
    createdBy: { $ne: alumniId },
    isApproved: true,
  })
    .populate("createdBy", "name profilePic")
    .select("title createdBy createdAt")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const otherEvents = await Event.find({
    createdBy: { $ne: alumniId },
    isApproved: true,
  })
    .populate("createdBy", "name profilePic")
    .select("title createdBy createdAt")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

const myJobActivities = myJobs.flatMap((job) => {
  const activities = [];

  // CREATED activity
  activities.push({
    type: "job",
    action: "created",
    message: `You created a job post "${job.title}"`,
    createdAt: job.createdAt,
    isSelf: true,
  });

  // APPROVED activity (only if approved)
  if (job.isApproved && job.updatedAt > job.createdAt) {
    activities.push({
      type: "job",
      action: "approved",
      message: `Your job post "${job.title}" was approved`,
      createdAt: job.updatedAt,
      isSelf: true,
    });
  }

  return activities;
});

const myEventActivities = myEvents.flatMap((event) => {
  const activities = [];

  activities.push({
    type: "event",
    action: "created",
    message: `You created an event "${event.title}"`,
    createdAt: event.createdAt,
    isSelf: true,
  });

  if (event.isApproved && event.updatedAt > event.createdAt) {
    activities.push({
      type: "event",
      action: "approved",
      message: `Your event "${event.title}" was approved`,
      createdAt: event.updatedAt,
      isSelf: true,
    });
  }

  return activities;
});
  const otherJobActivities = otherJobs.map((job) => ({
    type: "job",
    action: "created",
    message: `${job.createdBy.name} created a new job post "${job.title}"`,
    createdAt: job.createdAt,
    actor: {
      name: job.createdBy.name,
      profilePic: job.createdBy.profilePic,
    },
    isSelf: false,
  }));
  
  const otherEventActivities = otherEvents.map((event) => ({
    type: "event",
    action: "created",
    message: `${event.createdBy.name} created a new event "${event.title}"`,
    createdAt: event.createdAt,
    actor: {
      name: event.createdBy.name,
      profilePic: event.createdBy.profilePic,
    },
    isSelf: false,
  }));

  /* ================= PROFILE UPDATE ACTIVITY ================= */
//   const PROFILE_ACTIVITY_DAYS = 7;

// const showProfileActivity =
//   alumni.profileUpdatedAt &&
//   Date.now() - new Date(alumni.profileUpdatedAt) <
//     PROFILE_ACTIVITY_DAYS * 24 * 60 * 60 * 1000;

// const profileActivity = showProfileActivity
//   ? {
//       type: "profile",
//       action: "updated",
//       message: "You updated your profile",
//       createdAt: alumni.profileUpdatedAt,
//     }
//   : null;

const profileActivity = alumni.profileUpdatedAt
  ? {
      type: "profile",
      action: "updated",
      message: "You updated your profile",
      createdAt: alumni.profileUpdatedAt,
      isSelf: true,
    }
  : null;

  /* ================= MERGE + SORT ================= */
const recentActivity = [
  ...(profileActivity ? [profileActivity] : []),
  ...myJobActivities,
  ...myEventActivities,
  ...otherJobActivities,
  ...otherEventActivities,
]
  .sort((a, b) => b.createdAt - a.createdAt)
  .slice(0, 7);

  
  // 4️⃣ Send response directly
  res.status(200).json({
    success: true,
    data: {
      alumni: {
        name: alumni.name,
        registerNumber: alumni.registerNumber,
        department: alumni.department,
        batch: alumni.batch,
        profileCompletion: alumni.profileCompletion,
        status: alumni.status,
        approvedBy: alumni.approvedBy ? alumni.approvedBy.name : "Not approved",
      },
      stats: {
        jobsCreated: jobCount,
        eventsCreated: eventCount,
      },
      yourPosts,
      recentActivity
    },
  });
});

module.exports = {
  getAlumniDashboard,
};
