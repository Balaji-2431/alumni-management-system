import {
  FaUsers,
  FaUserClock,
  FaBriefcase,
  FaCalendarAlt,
} from "react-icons/fa";
import StatCard from "../../common/StatCard";

const DashboardStats = ({ counts }) => (
  //max-w-sm sm:max-w-3xl lg:max-w-7xl mx-auto
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
    <StatCard title="Total Alumni" value={counts.totalAlumni} color="border-brand-primary" icon={FaUsers} />
    <StatCard title="Pending Alumni" value={counts.pendingAlumni} color="border-brand-accent" icon={FaUserClock} />
    <StatCard title="Pending Jobs" value={counts.pendingJobs} color="border-brand-success" icon={FaBriefcase} />
    <StatCard title="Pending Events" value={counts.pendingEvents} color="border-brand-danger" icon={FaCalendarAlt} />
  </div>
);

export default DashboardStats;
