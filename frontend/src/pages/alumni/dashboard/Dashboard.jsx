import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { motion } from "framer-motion";
import AlumniDashboardHeader from "../../../components/alumni/dashboard/AlumniDashboardHeader";
import AlumniDashboardStats from "../../../components/alumni/dashboard/AlumniDashboardStats";
import YourPosts from "../../../components/alumni/dashboard/YourPosts";
import AlumniRecentActivity from "../../../components/alumni/dashboard/AlumniRecentActivity";
import Loader from "../../../components/common/Loader"

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/alumni/dashboard");
        setDashboard(res.data.data);

      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <Loader/>;
  }

  if (!dashboard) {
    return <div className="p-6 text-red-500">No dashboard data</div>;
  }

  const { alumni, stats, yourPosts, recentActivity } = dashboard;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-brand-surface min-h-screen">

      <div className="px-6 py-8 space-y-8 max-w-[1450px] mx-auto">
    
        <AlumniDashboardHeader alumni={alumni}/>
        <AlumniDashboardStats alumni={alumni} stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <YourPosts yourPosts={yourPosts} />
          </div>
          <div className="lg:col-span-1">
            <AlumniRecentActivity activities={recentActivity}/>
          </div>
        </div>

      </div>

    </motion.div>
  );
};

export default Dashboard;