const User = require("../models/User");
const Job = require("../models/Job");
const Event = require("../models/Event");

const getAdminDashboard = async (req, res) => {
  try {
    /* ================= AUTH ================= */
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    /* ================= COUNTS ================= */
    const [
      totalAlumni,
      pendingAlumni,
      pendingJobs,
      pendingEvents,
    ] = await Promise.all([
      User.countDocuments({ role: "alumni" }),
      User.countDocuments({ role: "alumni", isApproved: false }),
      Job.countDocuments({ isApproved: false }),
      Event.countDocuments({ isApproved: false }),
    ]);

    /* ================= PENDING PREVIEW (FULL DATA – MAX 3) ================= */
    // const pendingAlumniPreview = await User.find({
    //   role: "alumni",
    //   isApproved: false,
    // })
    //   .select("-password")
    //   .sort({ createdAt: -1 })
    //   .limit(3)
    //   .lean();

    // const pendingJobsPreview = await Job.find({ isApproved: false })
    //   .populate("createdBy", "name department email")
    //   .sort({ createdAt: -1 })
    //   .limit(3)
    //   .lean();

    // const pendingEventsPreview = await Event.find({ isApproved: false })
    //   .populate("createdBy", "name department email")
    //   .sort({ createdAt: -1 })
    //   .limit(3)
    //   .lean();

const pendingTableAlumni = await User.find({
  role: "alumni",
  isApproved: false,
})
  .sort({ createdAt: -1 })
  .lean();

const pendingTableJobs = await Job.find({
  isApproved: false,
})
  .populate("createdBy", "name department profilePic")
  .sort({ createdAt: -1 })
  .lean();

const pendingTableEvents = await Event.find({
  isApproved: false,
})
  .populate("createdBy", "name department profilePic")
  .sort({ createdAt: -1 })
  .lean();

  const formattedPendingAlumni = pendingTableAlumni.map((item) => ({
    id: item._id,
    type: "Alumni",
    title: item.name,
    submittedBy: "-",
    department: item.department || "-",
    batch: item.batch,
    createdAt: item.createdAt,
    status: "Pending",
    registerNumber: item.registerNumber

  }));

const formattedPendingJobs = pendingTableJobs.map((item) => ({
  id: item._id,
  type: "Job",
  title: item.title,
  createdBy: item.createdBy?.name || "-",
  company: item.company,
  jobType: item.jobType,
  createdAt: item.createdAt,
  status: "Pending",
  job: item
}));

const formattedPendingEvents = pendingTableEvents.map((item) => ({
  id: item._id,
  type: "Event",
  title: item.title,
  createdBy: item.createdBy?.name || "-",
  date: item.date,
  category: item.category,
  createdAt: item.createdAt,
  status: "Pending",
  event: item
}));

const pendingTableData = [
  ...formattedPendingAlumni,
  ...formattedPendingJobs,
  ...formattedPendingEvents,
]
  .sort((a, b) => b.createdAt - a.createdAt)
  .slice(0, 10); // show only latest 10 in dashboard

    /* ================= RECENT ACTIVITY (APPROVED) ================= */

    const recentUsers = await User.find({ role: "alumni" })
      .select("-password")
      .sort({ updatedAt: -1 })
      .limit(8)
      .lean();

    const recentJobs = await Job.find({})
      .populate("createdBy", "name department email profilePic")
      .sort({ updatedAt: -1 })
      .limit(8)
      .lean();

    const recentEvents = await Event.find({})
      .populate("createdBy", "name department email profilePic")
      .sort({ updatedAt: -1 })
      .limit(8)
      .lean();

      // Add type field so frontend knows what it is
// Helper function
const getAction = (item) => {
  if (!item.isApproved) {
    return "created";
  }

  return "approved";
};

const formattedAlumni = recentUsers
  .map((item) => {
    const action = getAction(item);
    if (!action) return null;

return {
  id: item._id,
  type: "alumni",
  action,
  name: item.name,
  profilePic: item.profilePic,
  approvedBy: item.approvedBy?.name || null,
  updatedAt: item.updatedAt,
};

  })
  .filter(Boolean);



// Jobs
const formattedJobs = recentJobs
  .map((item) => {
    const action = getAction(item);
    if (!action) return null;

return {
  id: item._id,
  type: "job", // or event
  action,
  title: item.title,
  approvedBy: item.approvedBy?.name || null,
  updatedAt: item.updatedAt,
  createdBy: item.createdBy,
  job: item
};

  })
  .filter(Boolean);


// Events
const formattedEvents = recentEvents
  .map((item) => {
    const action = getAction(item);
    if (!action) return null;

return {
  id: item._id,
  type: "event", // or event
  action,
  title: item.title,
  approvedBy: item.approvedBy?.name || null,
  updatedAt: item.updatedAt,
  createdBy: item.createdBy,
  event: item

};

  })
  .filter(Boolean);



    // Merge all
const recentActivity = [
  ...formattedAlumni,
  ...formattedJobs,
  ...formattedEvents,
]
  .sort((a, b) => b.updatedAt - a.updatedAt)
  .slice(0, 7);



    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      data: {
        counts: {
          totalAlumni,
          pendingAlumni,
          pendingJobs,
          pendingEvents,
        },
        // pendingPreview: {
        //   alumni: pendingAlumniPreview,
        //   jobs: pendingJobsPreview,
        //   events: pendingEventsPreview,
        // },
        // recentActivity: {
        //   alumni: recentUsers,
        //   jobs: recentJobs,
        //   events: recentEvents,
        // },
        pendingTable: pendingTableData,
        recentActivity: recentActivity
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load dashboard data",
    });
  }
};

module.exports = { getAdminDashboard };
