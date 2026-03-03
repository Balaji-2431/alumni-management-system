import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";


const AlumniFilters = ({
  rawSearch,
  setRawSearch,
  status,
  setStatus,
  department,
  setDepartment,
  batch,
  setBatch,
  setPage,
}) => {

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [tempStatus, setTempStatus] = useState(status);
  const [tempDepartment, setTempDepartment] = useState(department);
  const [tempBatch, setTempBatch] = useState(batch);
const clearMobileFilters = () => {
  setTempStatus("all");
  setTempDepartment("");
  setTempBatch("");
  setShowMobileFilters(false);
  setStatus("all");
  setDepartment("");
  setBatch("");
  setRawSearch("");
  setPage(1);
};

  const clearFilters = () => {
    setRawSearch("");
    setStatus("all");
    setDepartment("");
    setBatch("");
    setPage(1)
  };

  return (
      <section className="table__header p-4 border-gray-200">

        <div className="search-filter-bar flex items-center gap-2 w-full">
            {/* SEARCH INPUT */}
            <div className="relative flex-1">
            <input
                type="search"
                placeholder="Search by name or email..."
                value={rawSearch}
                onChange={(e) => setRawSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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


          {/* MOBILE FILTER ICON ONLY */}
          <button
            className="sm:hidden p-2 bg-gray-200 rounded-lg"
            onClick={() => setShowMobileFilters(true)}
          >
            <FaFilter />
          </button>

          {/* DESKTOP INLINE FILTERS */}
          <div className="hidden sm:flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="py-2 px-4 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
            </select>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            className="py-2 px-4 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              <option value="">All Depts</option>
              <option value="cse">CSE</option>
              <option value="ece">ECE</option>
              <option value="eee">EEE</option>
              <option value="mech">MECH</option>
              <option value="civil">CIVIL</option>
            </select>

            <input
              type="number"
              placeholder="Batch"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="py-2 px-3 border rounded-lg w-20"
            />

            <button
              className="clear-btn py-2 px-3 border rounded-lg hover:bg-gray-100"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </div>

        {/* MOBILE FILTER POPUP */}
          <AnimatePresence>
            {showMobileFilters && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                
                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  onClick={() => setShowMobileFilters(false)}
                />

                {/* Popup Panel */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-[90%] max-w-sm bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-4"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-col gap-3">
                    <select
                      value={tempStatus}
                      onChange={(e) => setTempStatus(e.target.value)}
                      className="py-2 px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                    </select>

                    <select
                      value={tempDepartment}
                      onChange={(e) => setTempDepartment(e.target.value)}
                      className="py-2 px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">All Depts</option>
                      <option value="cse">CSE</option>
                      <option value="ece">ECE</option>
                      <option value="eee">EEE</option>
                      <option value="mech">MECH</option>
                      <option value="civil">CIVIL</option>
                    </select>

                    <input
                      type="number"
                      placeholder="Batch"
                      value={tempBatch}
                      onChange={(e) => setTempBatch(e.target.value)}
                      className="py-2 px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={clearMobileFilters}
                      className="flex-1 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                    >
                      Clear
                    </button>

                    <button
                      onClick={() => {
                        setStatus(tempStatus);
                        setDepartment(tempDepartment);
                        setBatch(tempBatch);
                        setShowMobileFilters(false);
                      }}
                      className="flex-1 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
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

export default AlumniFilters;
