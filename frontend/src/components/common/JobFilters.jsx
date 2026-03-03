import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
const JobFilters = ({
  rawSearch,
  setRawSearch,
  jobType,
  setJobType,
  experience,
  setExperience,
  location,
  setLocation,
  status,
  setStatus
}) => {
  const {user,role} = useAuth()
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [tempStatus, setTempStatus] = useState(status);
  const [tempJobType, setTempJobType] = useState(jobType);
  const [tempExperience, setTempExperience] = useState(experience);
  const [tempLocation, setTempLocation] = useState(location);

  const clearFilters = () => {
    setRawSearch("");
    setStatus("all")
    setJobType("");
    setExperience("");
    setLocation("");
  };

  const clearMobileFilters = () => {
    setTempStatus("all")
    setTempJobType("");
    setTempExperience("");
    setTempLocation("");
    clearFilters();
    setShowMobileFilters(false);
  };

  return (
    <section className="p-4">
      <div className="flex items-center gap-2 w-full">
        {/* SEARCH */}
        <div className="relative flex-1">
          <input
            type="search"
            placeholder="Search jobs or companies..."
            value={rawSearch}
            onChange={(e) => {
              setRawSearch(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <svg
            className="absolute left-3 top-3 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </div>

        {/* MOBILE FILTER ICON */}
        <button
          className="md:hidden p-2 bg-gray-200 rounded-lg"
          onClick={() => setShowMobileFilters(true)}
        >
          <FaFilter />
        </button>

        {/* DESKTOP FILTERS */}
        <div className="hidden md:flex items-center gap-2">
          {role === "admin" && <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="py-2 px-3 text-sm border rounded-lg"
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>}

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="py-2 px-3 text-sm border rounded-lg"
          >
            <option value="">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
          </select>

          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="py-2 px-3 text-sm border rounded-lg"
          >
            <option value="">All Experience</option>
            <option value="fresher">Fresher</option>
            <option value="1-3">1-3 Years</option>
            <option value="3+">3+ Years</option>
          </select>

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="py-2 px-3 border rounded-lg w-24 lg:w-32"
          />

          <button
            onClick={clearFilters}
            className="py-2 px-3 border rounded-lg hover:bg-gray-100"
          >
            Clear
          </button>
        </div>
      </div>

      {/* MOBILE FILTER POPUP */}
      <AnimatePresence>
        {showMobileFilters && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
           <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowMobileFilters(false)}
            />

            <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-[90%] max-w-sm bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-4"
            >
                <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition"
                >
                    ✕
                </button>
                </div>
            <div className="flex flex-col gap-3">
          {role === "admin" && 
          <select
            value={tempStatus}
            onChange={(e) => setTempStatus(e.target.value)}
            className="py-2 px-4 text-sm border rounded-lg"
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>}
              <select
                value={tempJobType}
                onChange={(e) => setTempJobType(e.target.value)}
                className="py-2 px-4 border rounded-lg"
              >
                <option value="">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
              </select>

              <select
                value={tempExperience}
                onChange={(e) => setTempExperience(e.target.value)}
                className="py-2 px-4 border rounded-lg"
              >
                <option value="">All Experience</option>
                <option value="fresher">Fresher</option>
                <option value="1-3">1-3 Years</option>
                <option value="3+">3+ Years</option>
              </select>

              <input
                type="text"
                placeholder="Location"
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                className="py-2 px-4 border rounded-lg"
              />
            </div>
              <div className="flex gap-3">
                <button
                  onClick={clearMobileFilters}
                  className="flex-1 py-2 border rounded-lg"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    setJobType(tempJobType);
                    setExperience(tempExperience);
                    setLocation(tempLocation);
                    setStatus(tempStatus)
                    setShowMobileFilters(false);
                  }}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default JobFilters;