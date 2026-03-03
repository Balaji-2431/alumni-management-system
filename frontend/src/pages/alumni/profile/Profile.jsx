// import { useEffect, useState } from "react";
// import api from "../../../api/axios";
// import { FaUserCircle, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaBirthdayCake, FaUser, FaBriefcase, FaGraduationCap } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { formatDate } from "../../../utils/formatDate";
// import Loader from "../../../components/common/Loader";

// const Profile = () => {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await api.get("/profile");
//         console.log("Profile data:", res.data);
//         setProfile(res.data.data);
//       } catch (err) {
//         console.error("Profile fetch failed", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-500">
//         <Loader />
//       </div>
//     );
//   }

//   const job = profile.jobDetails || {};
//   const studies = profile.higherStudies || [];

//   return (
//     <div className="min-h-screen flex justify-center items-start bg-gray-100 p-4">
//       <div className="w-full min-h-[95vh] flex flex-col md:flex-row gap-3 bg-white rounded-xl shadow-lg p-4">

//         {/* LEFT SIDE */}
//         <div className="flex flex-col gap-3 flex-[0_0_38%]">
//           <div className="">
//             <button onClick={() => navigate("/alumni/dashboard")} className="text-sm px-4 py-2 border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition">Back</button>
//           </div>
//           {/* PROFILE IMAGE */}
//           <motion.div
//             className="flex items-center justify-center"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//           >
//             <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
//               {profile.profilePic ? (
//                 <img src={`http://localhost:3000${profile.profilePic}`} alt="Profile" className="w-full h-full object-cover" />
//               ) : (
//                 <FaUserCircle className="w-full h-full text-gray-400" />
//               )}
//             </div>
//           </motion.div>

//           {/* HIGHER STUDIES & WORK */}
//           <motion.div
//             className="h-full bg-white/40 backdrop-blur-md rounded-xl shadow-md p-6 space-y-6"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4, delay: 0.1 }}
//           >
//             {/* Higher Studies */}
//             <div>
//               <h3 className="flex items-center gap-2 text-xs uppercase text-gray-500 border-b border-gray-300 pb-1 mb-2">
//                 <FaGraduationCap /> Higher Studies
//               </h3>
//               {studies.length > 0 ? (
//                 <div className="space-y-2">
//                   {studies.map((hs, idx) => (
//                     <div key={idx} className="flex flex-col">
//                       <span className="uppercase text-sm font-medium text-gray-800">
//                         {hs.degreeName} ({hs.startYear} - {hs.endYear || "Present"})
//                       </span>
//                         {hs.institution && (
//                           <span className="text-xs text-gray-500">
//                             {hs.institution.charAt(0).toUpperCase() + hs.institution.slice(1)}
//                           </span>
//                         )}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-400 text-center">Not Applicable</p>
//               )}
//             </div>

//             {/* Work */}
//             <div>
//               <h3 className="flex items-center gap-2 text-xs uppercase text-gray-500 border-b border-gray-300 pb-1 mb-2">
//                 <FaBriefcase /> Work
//               </h3>
//               <div className="flex flex-col gap-1">
//                 <span className="text-sm font-medium text-gray-800">
//                   {job.jobTitle
//                     ? job.jobTitle.charAt(0).toUpperCase() + job.jobTitle.slice(1)
//                     : "—"}
//                 </span>

//                 {job.companyName && (
//                   <span className="text-xs text-gray-500">
//                     {job.companyName.charAt(0).toUpperCase() + job.companyName.slice(1)}
//                   </span>
//                 )}

//                 {/* {job.industry && <span className="text-xs text-gray-500">{job.industry}</span>} */}
//                 {job.experienceYears != null && (
//                   <span className="text-xs text-gray-500">{job.experienceYears} years experience</span>
//                 )}
//               </div>
//             </div>

//             {/* ACHIEVEMENTS */}
//             <div className="">
//               <h3 className="flex items-center gap-2 text-xs uppercase text-gray-500 border-b border-gray-300 pb-1 mb-2">
//                 <FaGraduationCap /> Achievements
//               </h3>
//               {profile.achievements && profile.achievements.length > 0 ? (
//                 <div className="space-y-2">
//                   {profile.achievements.map((ach, idx) => (
//                     <div key={idx} className="flex flex-col">
//                       <span className="text-sm font-semibold text-gray-800">{ach.year} - {ach.title}</span>
//                       {/* {ach.description && <span className="text-xs text-gray-500">{ach.description}</span>} */}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-sm text-gray-400 text-center">No achievements yet</p>
//               )}
//             </div>
//           </motion.div>


//         </div>

//         {/* RIGHT SIDE */}
//         <div className="mt-12 flex flex-col gap-3 flex-1">

//           {/* NAME, REGISTER, DEPARTMENT, BUTTONS */}
//           <motion.div
//             className="bg-white/40 backdrop-blur-md rounded-xl shadow-md p-6 flex flex-col gap-2"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4, delay: 0.2 }}
//           >
//             <h1 className="text-2xl font-bold capitalize">{profile.name}</h1>
//             <p className="text-sm text-gray-500">Register No: {profile.registerNumber}</p>
//             <p className="text-sm text-gray-600 uppercase">{profile.department} ({profile.batch})</p>

//             <div className="flex gap-3 mt-2">
//               <motion.button
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => navigate("edit")}
//          className="px-4 py-1.5 rounded-lg text-sm font-medium
//           bg-blue-600 text-white
//           hover:bg-blue-700 transition-colors"              >
//                 Edit Profile
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => navigate("change-password")}
//                 className="px-4 py-1.5 rounded-lg text-sm font-medium border border-gray-300 shadow hover:bg-gray-100 transition"
//               >
//                 Change Password
//               </motion.button>
//             </div>
//           </motion.div>

//           {/* CONTACT INFO & BASIC INFO */}
//           <motion.div
//             className="h-full bg-white/40 backdrop-blur-md rounded-xl shadow-md p-6 grid grid-cols-1 gap-6"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4, delay: 0.3 }}
//           >
//             {/* Contact Info */}
//             <div>
//               {/* <h3 className="flex items-center gap-2 text-xs uppercase text-gray-500 mb-3 tracking-wider">
//                 Contact Info
//               </h3> */}
//               <h3 className="flex items-center gap-2 text-xs uppercase text-gray-500 pb-1 mb-3">
//   <FaPhoneAlt /> Contact Info
// </h3>
// <ul className="space-y-3 text-sm text-gray-700">
//   {/* Phone */}
//   <li className="flex">
//     <span className="w-24 text-gray-500 font-medium">Phone:</span>
//     <span>{profile.phone ? `+91 ${profile.phone}` : "-"}</span>
//   </li>

//   {/* Email */}
//   <li className="flex">
//     <span className="w-24 text-gray-500 font-medium">Email:</span>
//     <span>
//       {profile.email ? (
//         <a
//           href={`mailto:${profile.email}`}
//           className="text-blue-600 hover:underline"
//         >
//           {profile.email}
//         </a>
//       ) : (
//         "-"
//       )}
//     </span>
//   </li>

//   {/* LinkedIn */}
//   <li className="flex">
//     <span className="w-24 text-gray-500 font-medium">LinkedIn:</span>
//     <span>
//       {profile.linkedinProfile ? (
//         <a
//           href={profile.linkedinProfile}
//           target="_blank"
//           rel="noreferrer"
//           className="text-blue-600 hover:underline break-all"
//         >
//           {profile.linkedinProfile}
//         </a>
//       ) : (
//         "-"
//       )}
//     </span>
//   </li>
//     {/* Address */}
//   <li className="flex">
//     <span className="w-24 text-gray-500 font-medium">Address:</span>
//     <span className="capitalize leading-relaxed">
//       {profile.address?.city ? (
//         <>
//           {profile.address.city}, <br />
//           {profile.address.district}, <br />
//           {profile.address.state}
//         </>
//       ) : (
//         "-"
//       )}
//     </span>
//   </li>
// </ul>
//             </div>

//             {/* Basic Info */}
//             <div>
//               {/* <h3 className="flex items-center gap-2 text-xs uppercase text-gray-500 mb-3 tracking-wider">
//                 Basic Info
//               </h3> */}
//               <h3 className="flex items-center gap-2 text-xs uppercase text-gray-500 pb-1 mb-3">
//   <FaUser /> Basic Info
// </h3>
// <ul className="space-y-3 text-sm text-gray-700">
//   {/* Date of Birth */}
//   <li className="flex">
//     <span className="w-28 text-gray-500 font-medium">Date of Birth:</span>
//     <span>
//       {profile.dateOfBirth ? formatDate(profile.dateOfBirth) : "-"}
//     </span>
//   </li>

//   {/* Gender */}
//   <li className="flex">
//     <span className="w-28 text-gray-500 font-medium">Gender:</span>
//     <span className="capitalize">
//       {profile.gender || "-"}
//     </span>
//   </li>
// </ul>
//             </div>
//           </motion.div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Profile;

import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { FaUserCircle, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaBirthdayCake, FaUser, FaBriefcase, FaGraduationCap } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDate } from "../../../utils/formatDate";
import Loader from "../../../components/common/Loader";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        setProfile(res.data.data);
      } catch (err) {
        console.error("Profile fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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

        {/* 1st row */}
          <div className="">
            <button onClick={() => navigate("/alumni/dashboard")} className="text-sm px-4 py-2 border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition">Back</button>
          </div>
        
         <div className="relative mt-3 gap-3 flex flex-col md:flex-row">
          {/* PROFILE IMAGE */}
          <motion.div
            className="
              absolute -top-20 sm:-top-14   right-[2%] sm:right-[9%] z-20
              md:static md:flex-[35%]  
              flex md:justify-center
            "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full overflow-hidden bg-gray-200">
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

          <motion.div
            className="flex-[60%] bg-white/40 backdrop-blur-md rounded-xl shadow-md p-6 flex flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold capitalize">{profile.name}</h1>
            <p className="text-sm text-gray-500">Register No: {profile.registerNumber}</p>
            <p className="text-sm text-gray-600 uppercase">{profile.department} ({profile.batch})</p>

            <div className="flex gap-3 mt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("edit")}
         className="px-4 py-1.5 rounded-lg text-sm font-medium
          bg-blue-600 text-white
          hover:bg-blue-700 transition-colors"              >
                Edit Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("change-password")}
                className="px-4 py-1.5 rounded-lg text-sm font-medium border border-gray-300 shadow hover:bg-gray-100 transition"
              >
                Change Password
              </motion.button>
            </div>
          </motion.div>

        </div>

        {/* 2nd row */}
        <div className=" gap-3 flex-1 flex flex-col md:flex-row">

          {/* HIGHER STUDIES & WORK */}
          <motion.div
            className="flex-[35%]  min-h-full bg-white/40 backdrop-blur-md rounded-xl shadow-md p-6 space-y-6 order-2 md:order-1"
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
                  {job.jobTitle
                    ? job.jobTitle.charAt(0).toUpperCase() + job.jobTitle.slice(1)
                    : "—"}
                </span>

                {job.companyName && (
                  <span className="text-xs text-gray-500">
                    {job.companyName.charAt(0).toUpperCase() + job.companyName.slice(1)}
                  </span>
                )}

                {/* {job.industry && <span className="text-xs text-gray-500">{job.industry}</span>} */}
                {job.experienceYears != null && (
                  <span className="text-xs text-gray-500">{job.experienceYears} years experience</span>
                )}
              </div>
            </div>

            {/* ACHIEVEMENTS */}
            <div className="">
              <h3 className="flex items-center gap-2 text-xs uppercase text-gray-500 border-b border-gray-300 pb-1 mb-2">
                <FaGraduationCap /> Achievements
              </h3>
              {profile.achievements && profile.achievements.length > 0 ? (
                <div className="space-y-2">
                  {profile.achievements.map((ach, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800">{ach.year} - {ach.title}</span>
                      {/* {ach.description && <span className="text-xs text-gray-500">{ach.description}</span>} */}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center">No achievements yet</p>
              )}
            </div>
          </motion.div>

          {/* CONTACT INFO & BASIC INFO */}
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
                    <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline">
                      {profile.email}
                    </a>
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
                <span className="leading-relaxed">
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

export default Profile;
