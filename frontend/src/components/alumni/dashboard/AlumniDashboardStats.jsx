import {
  FaUserEdit,
  FaBriefcase,
  FaCalendarAlt,
  FaUserCheck,
} from "react-icons/fa";
import StatCard from "../../common/StatCard";
import { useNavigate } from "react-router-dom";

const AlumniDashboardStats = ({ alumni, stats }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
    {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> */}
      
      <div onClick={() => navigate("/alumni/profile")}>
        <StatCard
          title="Profile Completion"
          value={`${alumni.profileCompletion}%`}
          color="border-brand-primary"
          icon={FaUserEdit}
        />
      </div>

      <div onClick={() => navigate("/alumni/jobs")}>
        <StatCard
          title="Jobs Created"
          value={stats.jobsCreated}
          color="border-brand-success"
          icon={FaBriefcase}
        />
      </div>

      <div onClick={() => navigate("/alumni/events")}>
        <StatCard
          title="Events Created"
          value={stats.eventsCreated}
          color="border-brand-accent"
          icon={FaCalendarAlt}
        />
      </div>

      <StatCard
        title="Account Status"
        value={alumni.status}
        color={
          alumni.status === "Approved"
            ? "border-green-500"
            : alumni.status === "Rejected"
            ? "border-red-500"
            : "border-yellow-500"
        }
        icon={FaUserCheck}
      />
    </div>
  );
};

export default AlumniDashboardStats;