import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUserCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLinkedin,
  FaBirthdayCake,
  FaUser,
  FaBriefcase,
  FaGraduationCap
} from "react-icons/fa";
import api from "../../../api/axios";
import { formatDate } from "../../../utils/formatDate";
import Loader from "../../../components/common/Loader";

const SingleAlumniView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/admin/alumni/${id}`);
        console.log("Profile data:", res.data);
        setProfile(res.data.data);
      } catch (err) {
        console.error("Profile fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <Loader />
      </div>
    );
  }

  const job = profile.jobDetails || {};
  const studies = profile.higherStudies || [];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="w-full flex flex-col gap-6 bg-white rounded-xl shadow-lg p-4">

        {/* BACK BUTTON */}
        <div>
          <button
            onClick={() => navigate("/admin/alumni")}
            className="text-sm px-4 py-2 border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Back
          </button>
        </div>

        {/* TOP ROW: IMAGE + NAME/EDIT BUTTONS */}
        <div className="relative mt-3 gap-3 flex flex-col md:flex-row">
          {/* PROFILE IMAGE */}
          <motion.div
            className="absolute -top-8 right-[2%] sm:right-[9%] z-20 md:static md:flex-[35%] flex md:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 rounded-full overflow-hidden bg-gray-200">
              {profile.profilePic ? (
                <img
                  src={`http://localhost:3000${profile.profilePic}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-full h-full text-gray-400" />
              )}
            </div>
          </motion.div>

          {/* NAME + REGISTER + DEPARTMENT */}
          <motion.div
            className="flex-[60%] bg-white/40 backdrop-blur-md rounded-xl shadow-md p-6 flex flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold capitalize">{profile.name}</h1>
            <p className="text-sm text-gray-500">Register No: {profile.registerNumber}</p>
            <p className="text-sm text-gray-600 uppercase">{profile.department} ({profile.batch})</p>
          </motion.div>
        </div>

        {/* BOTTOM ROW: LEFT (Higher Studies, Work, Achievements) + RIGHT (Contact & Basic Info) */}
        <div className="flex gap-3 flex-1 flex-col md:flex-row mt-6">

          {/* LEFT SIDE */}
          <motion.div
            className="flex-[35%] min-h-full bg-white/40 backdrop-blur-md rounded-xl shadow-md p-6 space-y-6 order-2 md:order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Higher Studies */}
            <div>
              <h3 className="flex items-center gap-2 text-xs uppercase text-gray-500 border-b border-gray-300 pb-1 mb-2">
                <FaGraduationCap /> Higher Studies
              </h3>
              {studies.length > 0 ? (
                <div className="space-y-2">
                  {studies.map((hs, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="uppercase text-sm font-medium text-gray-800">
                        {hs.degreeName} ({hs.startYear} - {hs.endYear || "Present"})
                      </span>
                      {hs.institution && (
                        <span className="text-xs text-gray-500">
                          {hs.institution.charAt(0).toUpperCase() + hs.institution.slice(1)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center">Not Applicable</p>
              )}
            </div>

            {/* Work */}
            <div>
              <h3 className="flex items-center gap-2 text-xs uppercase text-gray-500 border-b border-gray-300 pb-1 mb-2">
                <FaBriefcase /> Work
              </h3>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-800">
                  {job.jobTitle ? job.jobTitle.charAt(0).toUpperCase() + job.jobTitle.slice(1) : "—"}
                </span>
                {job.companyName && (
                  <span className="text-xs text-gray-500">{job.companyName.charAt(0).toUpperCase() + job.companyName.slice(1)}</span>
                )}
                {job.industry && <span className="text-xs text-gray-500">{job.industry}</span>}
                {job.experienceYears != null && (
                  <span className="text-xs text-gray-500">{job.experienceYears} years experience</span>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="flex items-center gap-2 text-xs uppercase text-gray-500 border-b border-gray-300 pb-1 mb-2">
                <FaGraduationCap /> Achievements
              </h3>
              {profile.achievements && profile.achievements.length > 0 ? (
                <div className="space-y-2">
                  {profile.achievements.map((ach, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800">{ach.year} - {ach.title}</span>
                      {ach.description && <span className="text-xs text-gray-500">{ach.description}</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center">No achievements yet</p>
              )}
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            className="flex-[60%] min-h-full bg-white/40 backdrop-blur-md rounded-xl shadow-md p-6 grid grid-cols-1 gap-6 order-1 md:order-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {/* Contact Info */}
            <div>
              <h3 className="flex items-center gap-2 text-xs uppercase text-gray-500 pb-1 mb-4">
                <FaPhoneAlt /> Contact Info
              </h3>
              <div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm text-gray-700">
                <span className="text-gray-500 font-medium">Phone</span>
                <span>{profile.phone ? `+91 ${profile.phone}` : "-"}</span>

                <span className="text-gray-500 font-medium">Email</span>
                <span>
                  {profile.email ? (
                    <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline">{profile.email}</a>
                  ) : "-"}
                </span>

                <span className="text-gray-500 font-medium">LinkedIn</span>
                <span>
                  {profile.linkedinProfile ? (
                    <a
                      href={profile.linkedinProfile}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {profile.linkedinProfile}
                    </a>
                  ) : "-"}
                </span>

                <span className="text-gray-500 font-medium">Address</span>
                <span>
                  {profile.address?.city
                    ? `${profile.address.city}, ${profile.address.district}, ${profile.address.state}`
                    : "-"}
                </span>
              </div>
            </div>

            {/* Basic Info */}
            <div>
              <h3 className="flex items-center gap-2 text-xs uppercase text-gray-500 pb-1 mb-4">
                <FaUser /> Basic Info
              </h3>
              <div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm text-gray-700">
                <span className="text-gray-500 font-medium">Date of Birth</span>
                <span>{profile.dateOfBirth ? formatDate(profile.dateOfBirth) : "-"}</span>

                <span className="text-gray-500 font-medium">Gender</span>
                <span className="capitalize">{profile.gender || "-"}</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default SingleAlumniView;