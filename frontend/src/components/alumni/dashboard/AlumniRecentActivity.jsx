import {
  FaBriefcase,
  FaCalendarAlt,
  FaUserEdit,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { formatRelativeTime } from "../../../utils/formatRelativeTime";

// const timeAgo = (date) => {
//   const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

//   const intervals = [
//     { label: "year", seconds: 31536000 },
//     { label: "month", seconds: 2592000 },
//     { label: "day", seconds: 86400 },
//     { label: "hour", seconds: 3600 },
//     { label: "minute", seconds: 60 },
//   ];

//   for (const interval of intervals) {
//     const count = Math.floor(seconds / interval.seconds);
//     if (count >= 1) {
//       return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
//     }
//   }

//   return "just now";
// };

const getIcon = (type, action) => {
  if (action === "approved")
    return <FaCheckCircle className="text-green-600 text-lg" />;
  if (type === "job")
    return <FaBriefcase className="text-blue-600 text-lg" />;
  if (type === "event")
    return <FaCalendarAlt className="text-purple-600 text-lg" />;
  return <FaUserEdit className="text-orange-600 text-lg" />;
};

const AlumniRecentActivity = ({ activities = [] }) => {
  const navigate = useNavigate();

  if (!activities.length) {
    return (
      <div className="bg-white rounded-lg p-5 shadow-sm text-gray-500">
        No recent activity
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

      <ul className="space-y-2">
        {activities.map((item, index) => {
          const isClickable = !item.isSelf && item.type !== "profile";

          return (
<li
  key={index}
  onClick={() => {
    if (!item.isSelf && item.type !== "profile") {
      navigate(`/alumni/${item.type}s`);
    }
  }}
  className={`flex items-center gap-3 p-3 rounded-md transition-all duration-200
    hover:bg-gray-100 hover:shadow-sm
    ${!item.isSelf && item.type !== "profile" ? "cursor-pointer" : "cursor-default"}
  `}
>
  {/* LEFT SIDE — ALWAYS CENTERED */}
  <div className="w-10 h-10 flex items-center justify-center shrink-0">
    {!item.isSelf && item.actor?.profilePic ? (
      <img
        src={`http://localhost:3000${item.actor.profilePic}`}
        alt={item.actor.name}
        className="w-10 h-10 rounded-full object-cover"
      />
    ) : (
      <span className="flex items-center justify-center">
        {getIcon(item.type, item.action)}
      </span>
    )}
  </div>

  {/* CONTENT */}
  <div className="flex-1">
    <p className="text-sm text-gray-800 leading-snug">
      {item.message}
    </p>
    <span className="text-xs text-gray-500">
      {formatRelativeTime(item.createdAt)}
    </span>
  </div>
</li>
          );
        })}
      </ul>
    </div>
  );
};

export default AlumniRecentActivity;