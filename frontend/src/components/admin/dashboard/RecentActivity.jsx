// import { formatRelativeTime } from "../../../utils/formatRelativeTime";
// import { useNavigate } from "react-router-dom";
// import { FaUser, FaBriefcase, FaCalendarAlt } from "react-icons/fa";

// /* ================= CAPITALIZE HELPER ================= */
// const capitalizeWords = (text = "") =>
//   text
//     .toLowerCase()
//     .split(" ")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");

// /* ================= TYPE CONFIG ================= */
// const TYPE_CONFIG = {
//   alumni: {
//     icon: FaUser,
//     label: "Alumni",
//     style: "bg-blue-50 text-blue-600 border border-blue-200",
//   },
//   job: {
//     icon: FaBriefcase,
//     label: "Job",
//     style: "bg-purple-50 text-purple-600 border border-purple-200",
//   },
//   event: {
//     icon: FaCalendarAlt,
//     label: "Event",
//     style: "bg-red-50 text-red-600 border border-red-200",
//   },
// };

// /* ================= MESSAGE MAP ================= */
// const MESSAGE_MAP = {
//   alumni: {
//     created: (item) =>
//       `${capitalizeWords(item.name)} registered as a new alumni.`,
//     approved: (item) =>
//       `${capitalizeWords(item.name)}'s alumni registration was approved.`,
//   },
//   job: {
//     created: (item) =>
//       `${capitalizeWords(item.createdBy?.name || "An Alumni")} created a new job: "${item.title}".`,
//     approved: (item) =>
//       `The job "${item.title}" was approved.`,
//   },
//   event: {
//     created: (item) =>
//       `${capitalizeWords(item.createdBy?.name || "An Alumni")} created a new event: "${item.title}".`,
//     approved: (item) =>
//       `The event "${item.title}" was approved.`,
//   },
// };

// const ActivityItem = ({ item }) => {
//   const navigate = useNavigate();

//   /* ================= ROUTE MAP ================= */
//   const routeMap = {
//     alumni: `/admin/alumni/${item.id}`,
//     job: `/admin/jobs/${item.id}`,
//     event: `/admin/events/${item.id}`,
//   };

//   const handleClick = () => {
//     if (routeMap[item.type]) {
//       navigate(routeMap[item.type]);
//     }
//   };

//   /* ================= PROFILE PIC ================= */
//   const profilePic =
//     item.type === "alumni"
//       ? item.profilePic
//       : item.createdBy?.profilePic;

//   /* ================= CONFIG ================= */
//   const config = TYPE_CONFIG[item.type];
//   const Icon = config?.icon;

//   /* ================= MESSAGE ================= */
//   const message =
//     MESSAGE_MAP[item.type]?.[item.action]?.(item) || "Activity Update";

//   return (
//     <div
//       onClick={handleClick}
//       className="cursor-pointer flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition"
//     >
//       {/* Profile Picture */}
//       <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
//         {profilePic ? (
//           <img
//             src={`http://localhost:3000${profilePic}`}
//             alt="profile"
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full bg-gray-300" />
//         )}
//       </div>

//       {/* Content */}
//       <div className="flex-1 min-w-0 flex flex-col gap-2">
//         {/* Message */}
//         <p className="text-sm font-medium text-gray-800 leading-snug break-words">
//           {message}
//         </p>

//         {/* Badge + Time */}
//         <div className="flex items-center gap-2">
//           {config && (
//             <span
//               className={`flex items-center gap-2 px-2 py-0.5 text-xs font-medium rounded-full w-fit ${config.style}`}
//             >
//               {Icon && <Icon size={12} />}
//               {config.label}
//             </span>
//           )}

//           <p className="text-xs text-gray-500">
//             {formatRelativeTime(item.updatedAt)}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const RecentActivity = ({ data }) => {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
//       <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-3">
//         Recent Activity
//       </h3>

//       {!data?.length ? (
//         <p className="text-sm text-gray-500">No recent activity</p>
//       ) : (
//         <div className="divide-y divide-gray-100">
//           {data.map((item) => (
//             <div key={item.id} className="py-2">
//               <ActivityItem item={item} />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RecentActivity;


import { formatRelativeTime } from "../../../utils/formatRelativeTime";
import { FaUser, FaBriefcase, FaCalendarAlt } from "react-icons/fa";

/* ================= CAPITALIZE HELPER ================= */
const capitalizeWords = (text = "") =>
  text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/* ================= TYPE CONFIG ================= */
const TYPE_CONFIG = {
  alumni: {
    icon: FaUser,
    label: "Alumni",
    style: "bg-blue-50 text-blue-600 border border-blue-200",
  },
  job: {
    icon: FaBriefcase,
    label: "Job",
    style: "bg-purple-50 text-purple-600 border border-purple-200",
  },
  event: {
    icon: FaCalendarAlt,
    label: "Event",
    style: "bg-red-50 text-red-600 border border-red-200",
  },
};

/* ================= MESSAGE MAP ================= */
const MESSAGE_MAP = {
  alumni: {
    created: (item) =>
      `${capitalizeWords(item.name)} registered as a new alumni.`,
    approved: (item) =>
      `${capitalizeWords(item.name)}'s alumni registration was approved.`,
  },
  job: {
    created: (item) =>
      `${capitalizeWords(item.createdBy?.name || "An Alumni")} created a new job: "${item.title}".`,
    approved: (item) => `The job "${item.title}" was approved.`,
  },
  event: {
    created: (item) =>
      `${capitalizeWords(item.createdBy?.name || "An Alumni")} created a new event: "${item.title}".`,
    approved: (item) => `The event "${item.title}" was approved.`,
  },
};

const ActivityItem = ({ item, onView }) => {
  /* ================= CLICK HANDLER ================= */
  const handleClick = () => {
    if (!onView) return;

    const type = item.type?.toLowerCase();

    if (type === "job") {
      onView({ type: "Job", job: item });
    }

    if (type === "event") {
      onView({ type: "Event", event: item });
    }
  };

  /* ================= PROFILE PIC ================= */
  const profilePic =
    item.type === "alumni"
      ? item.profilePic
      : item.createdBy?.profilePic;

  const config = TYPE_CONFIG[item.type];
  const Icon = config?.icon;

  const message =
    MESSAGE_MAP[item.type]?.[item.action]?.(item) || "Activity Update";

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition"
    >
      {/* Profile */}
      <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
        {profilePic ? (
          <img
            src={`http://localhost:3000${profilePic}`}
            alt="profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-800 leading-snug break-words">
          {message}
        </p>

        <div className="flex items-center gap-2">
          {config && (
            <span
              className={`flex items-center gap-2 px-2 py-0.5 text-xs font-medium rounded-full w-fit ${config.style}`}
            >
              {Icon && <Icon size={12} />}
              {config.label}
            </span>
          )}

          <p className="text-xs text-gray-500">
            {formatRelativeTime(item.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

const RecentActivity = ({ data, onView }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
      <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-3">
        Recent Activity
      </h3>

      {!data?.length ? (
        <p className="text-sm text-gray-500">No recent activity</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {data.map((item) => (
            <div key={item.id} className="py-2">
              <ActivityItem item={item} onView={onView} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;