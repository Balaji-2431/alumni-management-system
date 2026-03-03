// import { useEffect, useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import DataTable from "../../../components/admin/DataTable";
// import ConfirmModal from "../../../components/common/ConfirmModal";
// import jobColumns from "./JobColumns";
// import JobDetails from "./JobDetails";
// import api from "../../../api/axios";
// import { toast } from "react-hot-toast";
// import { FaPlus } from "react-icons/fa";
// import Loader from "../../../components/common/Loader";
// import Pagination from "../../../components/common/Pagination";
// import JobFilters from "../../../components/common/JobFilters";

// const AdminJobsPage = () => {
//   const navigate = useNavigate();

//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedJob, setSelectedJob] = useState(null);

//   const [filter, setFilter] = useState("all"); // all | approved | pending
//   const [page, setPage] = useState(1);
//   const limit = 10;
//   const [total, setTotal] = useState(0);

//   const [confirm, setConfirm] = useState({
//     open: false,
//     title: "",
//     message: "",
//     action: null,
//   });

//   /* ================= FETCH JOBS ================= */
//   const fetchJobs = async () => {
//     try {
//       setLoading(true);

//       const res = await api.get("/jobs", {
//         params: {
//           page,
//           limit,
//           status: filter !== "all" ? filter : undefined,
//         },
//       });

//       setJobs(res.data.data || []);
//       setTotal(res.data.count || 0);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch jobs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* Reset page when filter changes */
//   useEffect(() => {
//     setPage(1);
//   }, [filter]);

//   useEffect(() => {
//     fetchJobs();
//   }, [page, filter]);

//   /* ================= ACTIONS ================= */
//   const handleApprove = (id) => {
//     setConfirm({
//       open: true,
//       title: "Approve this job?",
//       message: "This job will be visible to all alumni.",
//       action: async () => {
//         try {
//           await api.put(`/jobs/admin/${id}/approve`);
//           toast.success("Job approved");
//           fetchJobs();
//         } catch {
//           toast.error("Approve failed");
//         } finally {
//           setConfirm((p) => ({ ...p, open: false }));
//         }
//       },
//     });
//   };

//   const handleDelete = (id) => {
//     setConfirm({
//       open: true,
//       title: "Delete this job?",
//       message: "This action cannot be undone.",
//       action: async () => {
//         try {
//           await api.delete(`/jobs/${id}`);
//           toast.success("Job deleted");
//           fetchJobs();
//         } catch {
//           toast.error("Delete failed");
//         } finally {
//           setConfirm((p) => ({ ...p, open: false }));
//         }
//       },
//     });
//   };

//   const handleApply = (job) => {
//     if (job.applyLink) window.open(job.applyLink, "_blank");
//   };

//   const columns = useMemo(
//     () =>
//       jobColumns({
//         onView: setSelectedJob,
//         onApprove: handleApprove,
//         onDelete: handleDelete,
//         onApply: handleApply,
//       }),
//     []
//   );

//   return (
//     <div className="relative flex max-w-7xl mx-auto">
//       <div className="flex-1 p-4 sm:p-6 lg:p-8">
//         {/* HEADER */}
//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-2xl sm:text-3xl font-semibold">
//             Jobs Management
//           </h1>

//           <button
//             onClick={() => navigate("/admin/jobs/create")}
//             className="px-4 py-2 bg-black text-white rounded-xl flex items-center gap-2"
//           >
//             <FaPlus />
//             <span className="hidden md:inline">Create Job</span>
//           </button>
//         </div>

//         {/* FILTERS */}
//         <div className="flex gap-3 mb-6">
//           {["pending", "approved", "all"].map((f) => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`px-4 py-2 rounded-xl text-sm font-medium ${
//                 filter === f
//                   ? "bg-black text-white"
//                   : "bg-gray-100 hover:bg-gray-200"
//               }`}
//             >
//               {f.toUpperCase()}
//             </button>
//           ))}
//         </div>

//         {/* TABLE */}
//         {loading ? (
//           <Loader />
//         ) : jobs.length === 0 ? (
//           <div className="text-center py-12 text-gray-500">
//             No jobs found
//           </div>
//         ) : (
//           <>
//             <DataTable columns={columns} data={jobs} />

//             <Pagination
//               page={page}
//               total={total}
//               limit={limit}
//               onPageChange={setPage}
//             />
//           </>
//         )}
//       </div>

//       {/* SLIDE PANEL */}
//       {selectedJob && (
//         <JobDetails
//           job={selectedJob}
//           onClose={() => setSelectedJob(null)}
//         />
//       )}

//       {/* CONFIRM MODAL */}
//       {confirm.open && (
//         <ConfirmModal
//           open={confirm.open}
//           title={confirm.title}
//           message={confirm.message}
//           onConfirm={confirm.action}
//           onCancel={() =>
//             setConfirm((p) => ({ ...p, open: false }))
//           }
//         />
//       )}
//     </div>
//   );
// };

// export default AdminJobsPage;

import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../../components/admin/DataTable";
import ConfirmModal from "../../../components/common/ConfirmModal";
import jobColumns from "./JobColumns";
import JobDetails from "./JobDetails";
import api from "../../../api/axios";
import { toast } from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import Loader from "../../../components/common/Loader";
import Pagination from "../../../components/common/Pagination";
import JobFilters from "../../../components/common/JobFilters";
import useDebounce from "../../../hooks/useDebounce"; // ✅ ADD

const AdminJobsPage = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);

  // ✅ SEARCH STATE
  const [rawSearch, setRawSearch] = useState("");
  const search = useDebounce(rawSearch, 400);
  const [status, setStatus] = useState("all");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");

  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
  });

  /* ================= FETCH ================= */
  const fetchJobs = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit,
      };

      if (status !== "all") params.isApproved = status === "approved";
      if (search?.trim()) params.search = search;
      if (jobType) params.jobType = jobType;
      if (experience) params.experience = experience;
      if (location?.trim()) params.location = location;
      const res = await api.get("/jobs", { params });

      setJobs(res.data.data || []);
      setTotal(res.data.count || 0);
      console.log(res.data.data)
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch jobs");
      setJobs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  /* 🔁 Reset page when filter/search changes */
  useEffect(() => {
    setPage(1);
  }, [ search,status, jobType, experience, location]);

  useEffect(() => {
    fetchJobs();
  }, [page, search,status, jobType, experience, location]);

  /* ================= ACTIONS ================= */
  const handleApprove = (id) => {
    setConfirm({
      open: true,
      title: "Approve this job?",
      message: "This job will be visible to all alumni.",
      action: async () => {
        try {
          await api.put(`/jobs/admin/${id}/approve`);
          toast.success("Job approved");
          fetchJobs();
        } catch {
          toast.error("Approve failed");
        } finally {
          setConfirm((p) => ({ ...p, open: false }));
        }
      },
    });
  };

  const handleDelete = (id) => {
    setConfirm({
      open: true,
      title: "Delete this job?",
      message: "This action cannot be undone.",
      action: async () => {
        try {
          await api.delete(`/jobs/${id}`);
          toast.success("Job deleted");
          fetchJobs();
        } catch {
          toast.error("Delete failed");
        } finally {
          setConfirm((p) => ({ ...p, open: false }));
        }
      },
    });
  };

  const handleApply = (job) => {
    if (job.applyLink) window.open(job.applyLink, "_blank");
  };

  const columns = useMemo(
    () =>
      jobColumns({
        onView: setSelectedJob,
        onApprove: handleApprove,
        onDelete: handleDelete,
        onApply: handleApply,
      }),
    []
  );

  return (
    <div className="relative flex max-w-7xl mx-auto">
      <div className="flex-1 p-4 sm:p-6 lg:p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Jobs Management
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Total: {total} job{total !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/jobs/create")}
            className="px-4 py-2 bg-black text-white rounded-xl flex items-center gap-2"
          >
            <FaPlus />
            <span className="hidden md:inline">Create Job</span>
          </button>
        </div>

        {/* 🔍 SEARCH */}
      <JobFilters
        status={status}
        setStatus={setStatus}
        rawSearch={rawSearch}
        setRawSearch={setRawSearch}
        jobType={jobType}
        setJobType={setJobType}
        experience={experience}
        setExperience={setExperience}
        location={location}
        setLocation={setLocation}
      />

        {/* TABLE */}
        {loading && <Loader />}

        {!loading && jobs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No jobs found
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <>
            <DataTable columns={columns} data={jobs} />

            <Pagination
              page={page}
              total={total}
              limit={limit}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* SLIDE PANEL */}
      {selectedJob && (
        <JobDetails
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

      {/* CONFIRM MODAL */}
      {confirm.open && (
        <ConfirmModal
          open={confirm.open}
          title={confirm.title}
          message={confirm.message}
          onConfirm={confirm.action}
          onCancel={() =>
            setConfirm((p) => ({ ...p, open: false }))
          }
        />
      )}
    </div>
  );
};

export default AdminJobsPage;