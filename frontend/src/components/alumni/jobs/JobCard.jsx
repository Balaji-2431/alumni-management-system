import React, { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { formatRelativeTime } from "../../../utils/formatRelativeTime";

const cardMotion = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      opacity: { duration: 0.35, ease: "easeOut" },
      y: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
      scale: { duration: 0.5, ease: "easeOut" },
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.985,
    transition: { duration: 0.18, ease: "easeInOut" },
  },
};

const JobCard = ({ job }) => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDetails(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      layout="position"
      variants={cardMotion}
      initial="hidden"
      animate="visible"
      exit="exit"
      className=" will-change-transform group
        flex-[45%] min-w-[150px] sm:min-w-[230px] max-w-[280px]
        bg-model-card-bg border border-model-border
        rounded-2xl shadow-sm hover:shadow-md
        overflow-hidden transition-all duration-300
      "
    >
      {job.image && (
        <div className="overflow-hidden w-full aspect-[16/9]">
          <img
            src={`http://localhost:3000${job.image}`}
            alt={job.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex justify-between items-start px-3 sm:px-4 py-2 relative">
        <h2 className="capitalize sm:text-lg font-bold text-model-heading line-clamp-2">
          {job.title}
        </h2>

        <div ref={dropdownRef} className="relative">
          <BsThreeDotsVertical size={22}
            className="cursor-pointer text-model-muted p-1 rounded-full hover:bg-model-primary-hover hover:text-model-card-bg"
            onClick={() => setShowDetails(!showDetails)}
          />

          {showDetails && (
            <div className=" space-y-1
              absolute right-0 mt-2 w-40 sm:w-56
              bg-model-card-bg border border-model-border
              rounded-lg shadow p-3 text-xs text-model-text
            ">
              {job.jobType && <p className="capitalize">Type: {job.jobType}</p>}
              {job.qualification && <p>Qualification: <span className="uppercase">{job.qualification}</span></p>}
              {job.salary && <p>Salary: {job.salary}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="px-3 space-y-1 sm:px-4 mb-3 capitalize">
        <p className="text-sm sm:text-md text-model-text font-medium">{job.company}</p>
        <p className="text-sm text-model-muted">Location: {job.location}</p>
        <p className="text-sm text-model-muted">Experience: {job.experience}</p>
      </div>

      <div className="flex flex-col justify-between px-3 sm:px-4 pb-4 gap-3">
        <div className="order-2 mt-auto pt-3 flex items-center gap-3">
          {job.createdBy?.profilePic && (
            <img
              src={`http://localhost:3000${job.createdBy.profilePic}`}
              alt={job.createdBy.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}

          <div className="text-xs text-gray-500 leading-tight">
            <div className="font-medium text-gray-700">
              {job.createdBy?.name}
            </div>
            <div>{formatRelativeTime(job.createdAt)}</div>
          </div>
        </div>
        <button
          className=" cursor-pointer
            px-4 py-1.5 rounded-full text-sm font-medium
            bg-model-primary hover:bg-model-primary-hover
            text-white transition
          "
        >
          Apply
        </button>
      </div>
    </motion.div>
  );
};

export default JobCard;