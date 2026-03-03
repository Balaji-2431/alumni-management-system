import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";

import JobCard from "../../../components/alumni/jobs/JobCard";
import JobFilters from "../../../components/common/JobFilters";
import Loader from "../../../components/common/Loader";
import useDebounce from "../../../hooks/useDebounce";

const Jobs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  /* ================= STATE ================= */
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [rawSearch, setRawSearch] = useState("");
  const search = useDebounce(rawSearch, 400);
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");

  const [showAllUserJobs, setShowAllUserJobs] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  /* ================= RESIZE ================= */
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const params = { page: 1, limit: 50 };
        if (search?.trim()) params.search = search;
        if (jobType) params.jobType = jobType;
        if (experience) params.experience = experience;
        if (location?.trim()) params.location = location;
        const res = await api.get("/jobs", { params });

        setJobs(res.data.data || []);
        setTotal(res.data.count || 0);
      } catch (err) {
        console.error("FETCH JOBS ERROR:", err);
        setJobs([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [search, jobType, experience, location]);

  /* ================= DERIVED DATA ================= */
  const userJobs = jobs.filter((j) => j.createdBy?._id === user.id );
  const otherJobs = jobs.filter((j) => j.createdBy?._id !== user.id);

  /* ================= LAYOUT RULES ================= */
  let userJobsToShow = 2;
  if (windowWidth >= 1013 && windowWidth < 1317) userJobsToShow = 3;
  else if (windowWidth >= 1317) userJobsToShow = 4;

  return (
    <div className="min-h-screen bg-model-bg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">

        {/* ===== Header ===== */}
        <div className="flex justify-between items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-model-heading">Jobs</h1>
            <span className="text-sm text-model-muted">({total})</span>
          </div>

          <button
            onClick={() => navigate("/alumni/jobs/create")}
            className="flex items-center gap-2 bg-model-primary hover:bg-model-primary-hover text-model-card-bg px-4 sm:px-6 py-2 rounded-lg shadow-sm transition"
          >
            <FaPlus />
            <span className="hidden sm:inline">Create Job</span>
          </button>
        </div>

        <JobFilters
          rawSearch={rawSearch}
          setRawSearch={setRawSearch}
          jobType={jobType}
          setJobType={setJobType}
          experience={experience}
          setExperience={setExperience}
          location={location}
          setLocation={setLocation}
        />

        {loading && <Loader />}

        {!loading && jobs.length === 0 ? (
          <p className="text-center py-14 text-model-muted">
            No jobs available.
          </p>
          ) : (
          <>
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xl font-semibold text-model-heading sm:ml-6">
                  Your Posts
                </h2>
                <span className="text-sm text-model-muted">
                  ({userJobs.length})
                </span>
              </div>
              {userJobs.length <= 0 ? (<p className="text-center py-4 text-model-muted">You never create a post</p>) : (
                <motion.div className="flex flex-wrap justify-center gap-4">
                  <AnimatePresence>
                    {(showAllUserJobs
                      ? userJobs
                      : userJobs.slice(0, userJobsToShow)
                    ).map(job => (
                      <JobCard key={job._id} job={job} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
{userJobs.length > userJobsToShow && (
  <div className="flex items-center gap-3 my-4">
    <div className="flex-grow h-px bg-model-border" />

    <button
      onClick={() => setShowAllUserJobs(p => !p)}
      className="
        flex items-center gap-1
        text-sm text-blue-600
        cursor-pointer
        border-b border-transparent
        hover:border-blue-600
        transition
      "
    >
      {showAllUserJobs ? (
        <>
          <span>Show Less</span>
          <FaChevronUp />
        </>
      ) : (
        <>
          <span>Show More</span>
          <FaChevronDown />
        </>
      )}
    </button>

    <div className="flex-grow h-px bg-model-border" />
  </div>
)}
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xl font-semibold text-model-heading sm:ml-6">
                  Recent Posts
                </h2>
                <span className="text-sm text-model-muted">
                  ({otherJobs.length})
                </span>
              </div>
              {otherJobs.length <= 0 ? (<p className="text-center py-4 text-model-muted">No jobs available</p>) : (
                <motion.div className="flex flex-wrap justify-center gap-4">
                  <AnimatePresence>
                    {otherJobs.map(job => (
                      <JobCard key={job._id} job={job} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;

