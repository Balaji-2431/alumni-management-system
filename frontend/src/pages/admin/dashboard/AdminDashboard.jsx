import { useEffect, useState, useContext } from "react";
import api from "../../../api/axios";
import { motion } from "framer-motion";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";
import Loader from "../../../components/common/Loader";
import ConfirmModal from "../../../components/common/ConfirmModal";
import DashboardHeader from "../../../components/admin/dashboard/DashboardHeader";
import DashboardStats from "../../../components/admin/dashboard/DashboardStats";
import RecentActivity from "../../../components/admin/dashboard/RecentActivity";
import PendingTable from "../../../components/admin/dashboard/PendingTable";
import JobDetails from "../jobs/JobDetails";
import EventDetails from "../events/EventDetails";

const APPROVE_API = {
  alumni: (id) => `/admin/alumni/${id}/approve`,
  job: (id) => `/jobs/admin/${id}/approve`,
  event: (id) => `/events/admin/${id}/approve`,
};

const REJECT_API = {
  alumni: (id) => `/admin/alumni/${id}`,
  job: (id) => `/jobs/${id}`,
  event: (id) => `/events/${id}`,
};

const capitalize = (s) => s[0].toUpperCase() + s.slice(1);

const AdminDashboard = () => {
const [selectedJob, setSelectedJob] = useState(null);
const [selectedEvent, setSelectedEvent] = useState(null);
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
  });
  useEffect(() => {
    api.get("/admin/dashboard").then((res) => {
      setData(res.data.data);
    }).catch(() => {
      toast.error("Failed to load dashboard data");
    }).finally(() => {
      setLoading(false);
    });
  }, []);

const handleApprove = (rawType, id) => {
  const type = rawType.toLowerCase(); // normalize

  setConfirm({
    open: true,
    title: `Approve this ${rawType}?`,
    message: `This ${rawType} will be approved.`,
    action: async () => {
      try {
        await api.put(APPROVE_API[type](id));
        toast.success(`${rawType} approved`);
        updateAfterAction(rawType, id);
      } catch {
        toast.error("Approve failed");
      } finally {
        setConfirm((prev) => ({ ...prev, open: false }));
      }
    },
  });
};


const handleReject = (rawType, id) => {
  const type = rawType.toLowerCase(); // normalize
  console.log(type)
  setConfirm({
    open: true,
    title: `Delete this ${rawType}?`,
    message: "This action cannot be undone.",
    action: async () => {
      try {
        await api.delete(REJECT_API[type](id));
        toast.success(`${rawType} deleted`);
        updateAfterAction(rawType, id);
      } catch(err) {
        console.log(err.message)
        toast.error("Delete failed");
      } finally {
        setConfirm((prev) => ({ ...prev, open: false }));
      }
    },
  });
};


const updateAfterAction = (rawType, id) => {
  const type = rawType.toLowerCase();

  setData((prev) => {
    if (!prev?.pendingTable) return prev;

    return {
      ...prev,
      pendingTable: prev.pendingTable.filter(
        (item) =>
          !(item.id === id && item.type.toLowerCase() === type)
      ),
      counts: {
        ...prev.counts,
        [`pending${capitalize(type)}`]: Math.max(
          0,
          (prev.counts?.[`pending${capitalize(type)}`] || 1) - 1
        ),
      },
    };
  });
};


  if (loading || !data) return <Loader />;

  const { counts, pendingTable, recentActivity } = data;

  return (

  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-brand-surface min-h-screen"
  >

    <div className="px-6 py-8 space-y-8 max-w-7xl mx-auto">

      <DashboardHeader user={user} />
      <DashboardStats counts={data.counts} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2">
<PendingTable
  data={data.pendingTable}
  onApprove={handleApprove}
  onReject={handleReject}
  onView={(item) => {
    if (item.type === "Job") {
      setSelectedJob(item.job);
    } else if (item.type === "Event") {
      setSelectedEvent(item.event);
    }
  }}
/>
        </div>

          <div className="lg:col-span-1">
            <RecentActivity
              data={recentActivity}
              onView={(item) => {
                if (item.type === "Job") {
                  setSelectedJob(item.job.job);
                }

                if (item.type === "Event") {
                  setSelectedEvent(item.event.event);
                  console.log(item.event.event)
                }
              }}
            />        
          </div>

      </div>
      {selectedJob && (
  <JobDetails
    job={selectedJob}
    onClose={() => setSelectedJob(null)}
  />
)}

{selectedEvent && (
  <EventDetails
    event={selectedEvent}
    onClose={() => setSelectedEvent(null)}
  />
)}

      {confirm && (
        <ConfirmModal
          open={confirm.open}
          title={confirm.title}
          message={confirm.message}
          onConfirm={confirm.action}
          onCancel={() => setConfirm({ ...confirm, open: false })}
        />
      )}
    </div>

  </motion.div>

  );
};

export default AdminDashboard;

