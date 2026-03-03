
// import React,{useState, useEffect, useRef} from "react";
// import { motion } from "framer-motion";
// import { formatRelativeTime } from "../../../utils/formatRelativeTime";
// import { BsThreeDotsVertical } from "react-icons/bs";

// const cardMotion = {
//   hidden: { opacity: 0, y: 12, scale: 0.98 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: {
//       opacity: { duration: 0.35, ease: "easeOut" },
//       y: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
//       scale: { duration: 0.5, ease: "easeOut" },
//     },
//   },
//   exit: {
//     opacity: 0,
//     y: 8,
//     scale: 0.985,
//     transition: { duration: 0.18, ease: "easeInOut" },
//   },
// };

// const EventCard = ({ event }) => {
//   const dateObj = new Date(event.date);
//   const day = dateObj.getDate();
//   const month = dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase();
//   const dropdownRef = useRef(null);
//     const [showDetails, setShowDetails] = useState(false);
  
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDetails(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const to12Hour = (time) => {
//     if (!time) return "";
//     const [h, m] = time.split(":");
//     const hour = ((+h % 12) || 12);
//     return `${hour}${m ? `:${m}` : ""}${+h >= 12 ? "PM" : "AM"}`;
//   };

//   const start = to12Hour(event.startTime);
//   const end = to12Hour(event.endTime);

//   const getRegistrationStatus = (lastDate) => {
//     if (!lastDate) return null;

//     const now = new Date();
//     const end = new Date(lastDate);
//     const diffMs = end - now;

//     if (diffMs <= 0) return { status: "closed" };

//     const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//     const diffDays = Math.floor(diffHours / 24);

//     if (diffDays > 0) {
//       return { status: "open", label: `!${diffDays} day${diffDays > 1 ? "s" : ""}` };
//     }

//     return { status: "open", label: `!${diffHours}h` };
//   };

//   const registrationInfo = getRegistrationStatus(event.lastRegistrationDate);


//   const categoryStyles = {
//     technical: "bg-model-primary/10 text-model-primary",
//     career: "bg-emerald-500/10 text-emerald-600",
//     networking: "bg-violet-500/10 text-violet-600",
//     cultural: "bg-pink-500/10 text-pink-600",
//   };

//   const categoryClass = categoryStyles[event.category] || "bg-model-muted/10 text-model-text";
//   return (
//     <motion.div
//       layout="position"
//       variants={cardMotion}
//       initial="hidden"
//       animate="visible"
//       exit="exit"
//       className="
//         flex-[45%] min-w-[150px] sm:min-w-[230px] max-w-[280px]
//         bg-model-card-bg border border-model-border
//         rounded-xl shadow-sm hover:shadow-md
//         overflow-hidden transition group
//       "
//     >
//       {/* IMAGE */}
//       <div className="relative">
//         <img
//           src={`http://localhost:3000${event.image}`}
//           alt={event.title}
//           className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//         />

//         {/* DATE */}
//         <div className="
//           absolute -bottom-10 right-1 sm:right-3 md:right-4
//           bg-model-card-bg border border-model-border
//           rounded-xl p-2 md:p-3 text-center shadow flex flex-col items-center
//         ">
//           <div className="sm:text-lg font-bold text-model-heading">
//             {day}-{month}
//           </div>
//           <div className="flex flex-col md:flex-row md:gap-1 text-xs text-model-muted mt-1">
//              <span className="">{start}</span>
//              <span className="">to</span>
//              <span className="">{end}</span>          
//           </div>
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="p-3 sm:p-4 pt-6 flex flex-col gap-1 sm:gap-2">
        
//         <span className={`-ml-0.5 w-fit text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full font-medium ${categoryClass}`}>
//           {event.category}
//         </span>
        
//         <h2 className="sm:text-lg capitalize font-bold text-model-heading leading-snug line-clamp-2">
//           {event.title}
//           {event.mode === "online" && (
//             <span className="text-sm font-medium text-model-primary ml-1">
//               (Online)
//             </span>
//           )}
//           {event.mode === "hybrid" && (
//             <span className="text-sm font-medium text-model-primary ml-1">
//               (Hybrid)
//             </span>
//           )}
//         </h2>

//         <p className="capitalize text-sm text-model-text line-clamp-3">
//           {event.description}
//         </p>

//         <div className="">
//           <p className="text-xs sm:text-sm capitalize text-model-text font-medium">
//             Organizer: {event.organizerName}
//           </p>

//     {(event.mode === "online" || event.mode === "hybrid") && (
//       <>
//         {/* REGISTRATION REQUIRED */}
//         {event.registrationRequired ? (
//           registrationInfo?.status === "open" ? (
//             <div className="flex items-center gap-2">
//               <a
//                 href={event.registrationLink}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="text-sm text-blue-600 hover:underline font-medium"
//               >
//                 Register
//               </a>
//               {registrationInfo?.label && (
//                 <span className="text-xs text-red-500 font-semibold">
//                   ({registrationInfo.label})
//                 </span>
//               )}
//             </div>
//           ) : (
//             <p className="text-xs text-model-muted font-medium">
//               Registration closed
//             </p>
//           )
//         ) : (
//           event.eventLink && (
//             <a
//               href={event.eventLink}
//               target="_blank"
//               rel="noreferrer"
//               className="mt-1.5 inline-block text-sm font-medium
//                 text-white bg-model-primary
//                 px-1.5 py-0.25 rounded-lg
//                 hover:bg-model-primary-hover"
//             >
//               Join Event
//             </a>
//           )
//         )}
//       </>
//     )}

//             <div className="pt-2 border-t border-model-border flex items-center gap-2 sm:gap-3">
//           {event.createdBy?.profilePic && (
//             <img
//               src={`http://localhost:3000${event.createdBy.profilePic}`}
//               className="w-8 h-8 rounded-full object-cover"
//               alt={event.createdBy.name}
//             />
//           )}
//           <div className="flex flex-col text-xs text-model-muted">
//             <div>{event.createdBy?.name}</div>
//             <div>{formatRelativeTime(event.createdAt)}</div>
//           </div>
//         </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default EventCard;

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { formatRelativeTime } from "../../../utils/formatRelativeTime";

/* ================= CARD ANIMATION ================= */
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

/* ================= COMPONENT ================= */
const EventCard = ({ event }) => {
  /* ===== DATE LOGIC ===== */
  const dateObj = new Date(event.date);
  const day = dateObj.getDate();
  const month = dateObj
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();

  /* ===== STATE & REFS ===== */
  const dropdownRef = useRef(null);
  const [showDetails, setShowDetails] = useState(false);

  /* ===== CLICK OUTSIDE ===== */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDetails(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ===== TIME FORMAT ===== */
  const to12Hour = (time) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    const hour = (+h % 12) || 12;
    return `${hour}${m ? `:${m}` : ""}${+h >= 12 ? "PM" : "AM"}`;
  };

  const start = to12Hour(event.startTime);
  const end = to12Hour(event.endTime);

  /* ===== REGISTRATION STATUS ===== */
  const getRegistrationStatus = (lastDate) => {
    if (!lastDate) return null;

    const now = new Date();
    const end = new Date(lastDate);
    const diffMs = end - now;

    if (diffMs <= 0) return { status: "closed" };

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return {
        status: "open",
        label: `!${diffDays} day${diffDays > 1 ? "s" : ""}`,
      };
    }

    return { status: "open", label: `!${diffHours}h` };
  };

  const registrationInfo = getRegistrationStatus(
    event.lastRegistrationDate
  );

  /* ===== CATEGORY STYLES ===== */
  const categoryStyles = {
    technical: "bg-model-primary/10 text-model-primary",
    career: "bg-emerald-500/10 text-emerald-600",
    networking: "bg-violet-500/10 text-violet-600",
    cultural: "bg-pink-500/10 text-pink-600",
  };

  const categoryClass =
    categoryStyles[event.category] ||
    "bg-model-muted/10 text-model-text";

  /* ===== JOIN STATUS ===== */
  const getEventJoinStatus = (event) => {
    if (!event.date || !event.startTime || !event.endTime) {
      return "disabled";
    }

    const now = new Date();
    const eventDate = new Date(event.date);

    const [sh, sm] = event.startTime.split(":");
    const [eh, em] = event.endTime.split(":");

    const start = new Date(eventDate);
    start.setHours(sh, sm, 0, 0);

    const end = new Date(eventDate);
    end.setHours(eh, em, 0, 0);

    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "live";
    return "finished";
  };

  const joinStatus = getEventJoinStatus(event);

  /* ================= RENDER ================= */
  return (
    <motion.div
      variants={cardMotion}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout="position"
      className="
        flex-[45%] min-w-[150px] sm:min-w-[230px] max-w-[280px]
        bg-model-card-bg border border-model-border
        rounded-xl shadow-sm hover:shadow-md
        overflow-hidden transition group
      "
    >
      {/* IMAGE */}
      <div className="relative">
        <img
          src={`http://localhost:3000${event.image}`}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* DATE BADGE */}
        <div className="
          absolute -bottom-10 right-1 sm:right-3 md:right-4
          bg-model-card-bg border border-model-border
          rounded-xl p-2 md:p-3 text-center shadow
          flex flex-col items-center
        ">
          <div className="sm:text-lg font-bold text-model-heading">
            {day}-{month}
          </div>

          <div className="flex flex-col md:flex-row md:gap-1 text-xs text-model-muted mt-1">
            <span>{start}</span>
            <span>to</span>
            <span>{end}</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3 sm:p-4 pt-6 flex flex-col gap-1 sm:gap-2">
        {/* CATEGORY */}
        <span
          className={`-ml-0.5 w-fit text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full font-medium ${categoryClass}`}
        >
          {event.category}
        </span>

        {/* TITLE */}
        <h2 className="sm:text-lg capitalize font-bold text-model-heading leading-snug line-clamp-2">
          {event.title}

          {event.mode === "online" && (
            <span className="text-xs font-medium text-model-primary ml-1">
              (Online)
            </span>
          )}

          {event.mode === "hybrid" && (
            <span className="text-xs font-medium text-model-primary ml-1">
              (Hybrid)
            </span>
          )}
        </h2>

        {/* DESCRIPTION */}
        <p className="capitalize text-sm text-model-text line-clamp-3">
          {event.description}
        </p>

        {/* ORGANIZER */}
        <p className="text-xs font-medium text-gray-700">
          Organizer: {event.organizerName}
        </p>
        {joinStatus === "finished" && (
          <span className="text-sm font-medium text-gray-500">
            Event finished
          </span>
        )}
{(event.mode === "online" || event.mode === "hybrid") && joinStatus !== "finished" && (
  <>
    {event.registrationRequired ? (
      registrationInfo?.status === "open" ? (
        <div className="flex items-center gap-2">
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Register
          </a>
          {registrationInfo?.label && (
            <span className="text-xs text-red-500 font-semibold">
              ({registrationInfo.label})
            </span>
          )}
        </div>
      ) : (
        <p className="text-xs text-model-muted font-medium">
          Registration closed
        </p>
      )
    ) : (
      event.eventLink && joinStatus === "live" && (
        <a
          href={event.eventLink}
          target="_blank"
          rel="noreferrer"
          className="
            mt-1 text-center px-4 py-1.5 rounded-full
            text-sm font-medium text-white
            bg-model-primary hover:bg-model-primary-hover
            transition
          "
        >
          Join Event
        </a>
      )
    )}
  </>
)}

      </div>
        {/* FOOTER */}
      <div className="mt-auto px-3 pb-3 flex items-center gap-3">
        {event.createdBy?.profilePic && (
          <img
            src={`http://localhost:3000${event.createdBy.profilePic}`}
            alt={event.createdBy.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}

        <div className="text-xs text-gray-500 leading-tight">
          <div className="font-medium text-gray-700">
            {event.createdBy?.name}
          </div>
          <div>{formatRelativeTime(event.createdAt)}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
