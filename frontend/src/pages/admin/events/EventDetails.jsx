// const EventDetails = ({ event, onClose }) => {
//   if (!event) return null;

//   return (
//     <>
//       {/* BACKDROP */}
//       <div
//         className="fixed inset-0 bg-black/50 z-40"
//         onClick={onClose}
//       />

//       {/* PANEL */}
//       <div className="fixed right-0 top-0 h-full w-[400px] bg-white z-50 shadow-xl flex flex-col">
        
//         {/* HEADER */}
//         <div className="flex items-center justify-between px-5 py-4 border-b">
//           <h2 className="text-lg font-semibold">Event Details</h2>
//           <button
//             onClick={onClose}
//             className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
//           >
//             Close
//           </button>
//         </div>

//         {/* CONTENT */}
//         <div className="p-5 overflow-y-auto">
          
//           {/* IMAGE */}
//           <div className="relative mb-4">
//             <img
//               src={
//                 event.image
//                   ? `http://localhost:3000${event.image}`
//                   : "http://localhost:3000/uploads/default.webp"
//               }
//               alt="Event"
//               className="w-full h-52 object-cover rounded-lg"
//             />
//             <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/40 to-transparent" />
//           </div>

//           {/* TITLE */}
//           <h3 className="text-xl font-bold mb-3">
//             {event.title}
//           </h3>

//           {/* META INFO */}
//           <div className="space-y-3 text-sm">
//             <Info label="Date">
//               {new Date(event.date).toLocaleDateString()}
//             </Info>

//             <Info label="Time">
//               {event.time || "-"}
//             </Info>

//             <Info label="Type">
//               <span className="capitalize">
//                 {event.eventType}
//               </span>
//             </Info>

//             {event.eventType === "offline" && (
//               <Info label="Location">
//                 {event.location || "-"}
//               </Info>
//             )}

//             {event.eventType === "online" && (
//               <Info label="Meeting Link">
//                 <a
//                   href={event.meetingLink}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="text-blue-600 hover:underline"
//                 >
//                   Open link
//                 </a>
//               </Info>
//             )}
//           </div>

//           {/* DESCRIPTION */}
//           <div className="mt-6">
//             <p className="text-sm font-semibold mb-1">
//               Description
//             </p>
//             <p className="text-sm text-gray-700 leading-relaxed">
//               {event.description || "No description provided."}
//             </p>
//           </div>

//           {/* POSTED BY */}
//           <div className="mt-6 border-t pt-4">
//             <p className="text-sm font-semibold mb-2">
//               Posted By
//             </p>

//             <div className="text-sm space-y-1 text-gray-700">
//               <Info label="Name">
//                 {event.createdBy?.name || "-"}
//               </Info>

//               <Info label="Role">
//                 <span className="capitalize">
//                   {event.createdByRole}
//                 </span>
//               </Info>

//               {event.createdByRole === "alumni" && (
//                 <>
//                   <Info label="Department">
//                     {event.createdBy?.department || "-"}
//                   </Info>
//                   <Info label="Batch">
//                     {event.createdBy?.batch || "-"}
//                   </Info>
//                 </>
//               )}

//               {event.createdByRole === "admin" && (
//                 <p className="text-xs text-gray-500 mt-1">
//                   Posted by administrator
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// /* SMALL HELPER COMPONENT */
// const Info = ({ label, children }) => (
//   <p className="flex justify-between gap-4">
//     <span className="text-gray-500">{label}</span>
//     <span className="font-medium text-right">{children}</span>
//   </p>
// );

// export default EventDetails;

import Modal from "../../../components/common/Modal";

const EventDetails = ({ event, onClose }) => {
  if (!event) return null;
  const to12Hour = (time) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    const hour = (+h % 12) || 12;
    return `${hour}${m ? `:${m}` : ""}${+h >= 12 ? "PM" : "AM"}`;
  };

  const start = to12Hour(event.startTime);
  const end = to12Hour(event.endTime);

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

  return (
    <Modal open={!!event} onClose={onClose} createdBy={event.createdBy} createdAt={event.createdAt}>
      <div className="space-y-6 text-sm">

        {/* Image */}
        <div className="relative">
          <img
            src={
              event.image
                ? `http://localhost:3000${event.image}`
                : "http://localhost:3000/uploads/default.webp"
            }
            alt="Event"
            className="w-full h-52 object-cover rounded-xl"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-xl font-semibold">{event.title}</h2>
          <p className="text-gray-500 capitalize">{event.category} event</p>
        </div>

        {/* Event Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Info label="Date">
            {new Date(event.date).toLocaleDateString()}
          </Info>

          <Info label="Time">
          <div className="text-xs text-model-muted mt-1">
            <span>{start} - {end}</span>
          </div>         
          </Info>

          {event.eventType === "offline" && (
            <Info label="Location">
              {event.location || "—"}
            </Info>
          )}

          {event.eventType === "online" && (
            <Info label="Meeting Link">
              <a
                href={event.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                Open Link
              </a>
            </Info>
          )}
        </div>

        {/* Description */}
        <div>
          <p className="text-sm font-semibold mb-2">Description</p>
          <p className="text-gray-700 leading-relaxed text-sm">
            {event.description || "No description provided."}
          </p>
        </div>
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
        {/* Posted By Section */}
        <div className="border-t pt-4">
          <p className="text-sm font-semibold mb-3">Posted By</p>

          <div className="space-y-2">
            <Info label="Name">
              {event.createdBy?.name || "—"}
            </Info>

            <Info label="Role">
              <span className="capitalize">
                {event.createdByRole}
              </span>
            </Info>

            {event.createdByRole === "alumni" && (
              <>
                <Info label="Department">
                  {event.createdBy?.department || "—"}
                </Info>
                <Info label="Batch">
                  {event.createdBy?.batch || "—"}
                </Info>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

/* Reusable Info Row */
const Info = ({ label, children }) => (
  <div>
    <p className="text-xs text-gray-400">{label}</p>
    <p className="font-medium">{children}</p>
  </div>
);

export default EventDetails;