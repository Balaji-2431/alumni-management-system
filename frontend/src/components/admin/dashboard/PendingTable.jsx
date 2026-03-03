// import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { FaUser, FaBriefcase, FaCalendarAlt } from "react-icons/fa";


// const PendingTable = ({ data = [], onApprove, onReject }) => {
//   if (!data.length) {
//     return (
//       <div className="bg-white rounded-2xl p-8 text-center text-gray-600 font-medium">
//         All approvals are clear 👍
//       </div>
//     );
//   }
// const navigate = useNavigate();

// const TYPE_CONFIG = {
//   Alumni: {
//     icon: FaUser,
//     style: "bg-blue-50 text-blue-600 border border-blue-200",
//   },
//   Job: {
//     icon: FaBriefcase,
//     style: "bg-purple-50 text-purple-600 border border-purple-200",
//   },
//   Event: {
//     icon: FaCalendarAlt,
//     style: "bg-red-50 text-red-600 border border-red-200",
//   },
// };
//   return (
//     <div className="bg-white rounded-2xl shadow-sm  border border-gray-100 rounded-2xl overflow-hidden">
      
//       {/* HEADER */}
// <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
//   <h2 className="text-lg font-semibold">Pending Approvals</h2>

//   <button
//     onClick={() => navigate("/admin/alumni")}
//     className="text-sm font-medium text-blue-600 hover:underline"
//   >
//     View All →
//   </button>
// </div>


//       <div className="w-full overflow-x-auto">
//         <table className="w-full text-sm text-center">
//           <thead className="bg-gray-50">
//             <tr className="text-center">
//               <th className="px-6 py-3">Type</th>
//               <th className="px-6 py-3">Name / Title</th>
//               <th className="px-6 py-3">Info</th>
//               <th className="px-6 py-3 hidden md:table-cell">Create By</th>
//               <th className="px-6 py-3 text-center">Details</th>
//               {/* <th className="px-6 py-3">Status</th> */}
//               <th className="px-6 py-3 text-center">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {data.map((item) => (
//               <tr
//                 key={item.id}
//                 className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-200 capitalize"
//               >
//                 <td className="px-6 py-4">
//                   {(() => {
//                     const config = TYPE_CONFIG[item.type];
//                     if (!config) return item.type;

//                     const Icon = config.icon;

//                     return (
//                       <span
//                         className={`mx-auto flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full w-fit ${config.style}`}
//                       >
//                         <Icon size={12} />
//                         {item.type}
//                       </span>
//                     );
//                   })()}
//                 </td>

//                 <td className="px-6 py-4 ">
//                   {item.type === "Alumni" && (
//                     <div className="flex flex-col">
//                       <span className="font-medium">
//                         {item.title || "-"}
//                       </span>
//                       <span className="text-xs text-gray-500">
//                         {item.registerNumber || "-"}
//                       </span>
//                     </div>                    
//                   )}

//                     {item.type != "Alumni" && (
//                       <span className="font-medium">{item.title}</span>
//                     )}
//                 </td>

//                 <td className="px-6 py-4 ">
//                   {item.type === "Alumni" && (
//                     <div className="flex flex-col">
//                       <span className="font-medium uppercase">
//                         {item.department || "-"}
//                       </span>
//                       <span className="text-xs text-gray-500">
//                         {item.batch || "-"}
//                       </span>
//                     </div>
//                   )}

//                   {item.type === "Job" && (
//                     <div className="flex flex-col">
//                       <span className="font-medium">
//                         {item.company || "-"}
//                       </span>
//                       <span className="text-xs text-gray-500">
//                         {item.jobType || "-"}
//                       </span>
//                     </div>
//                   )}

//                   {item.type === "Event" && (
//                     <div className="flex flex-col">
//                       <span className="font-medium">
//                         {item.category || "-"}
//                       </span>
//                       <span className="text-xs text-gray-500">
//                         {item.date
//                           ? new Date(item.date).toLocaleDateString("en-IN", {
//                               day: "2-digit",
//                               month: "short",
//                               year: "numeric",
//                             })
//                           : "-"}
//                       </span>
//                     </div>
//                   )}
//                 </td>

//                 <td className="px-6 py-4 hidden md:table-cell">
//                   {item.createdBy || "-"}
//                 </td>

//                 <td className="px-6 py-4 text-center ">
//                   <button
//                     onClick={() => {
//                       const base =
//                         item.type === "Alumni"
//                           ? "/admin/alumni"
//                           : item.type === "Job"
//                           ? "/jobs"
//                           : "/events";

//                       navigate(`${base}/${item.id}`);
//                     }}
//                     className="text-sm font-medium text-brand-primary hover:underline cursor-pointer "
//                   >
//                     View
//                   </button>
//                 </td>


//                 {/* <td className="px-6 py-4">
//                   <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
//                     {item.status}
//                   </span>
//                 </td> */}

//                 <td className="px-6 py-4">
//                   <div className="flex justify-center gap-1">
//                     <button
//                       onClick={() => onApprove(item.type.toLowerCase(), item.id)}
//                       className="cursor-pointer p-1 rounded-full text-brand-success hover:bg-brand-success/10 transition"
//                     >
//                       <FaCheckCircle size={18} />
//                     </button>

//                     <button
//                       onClick={() => onReject(item.type.toLowerCase(), item.id)}
//                       className="cursor-pointer p-1 rounded-full text-brand-danger hover:bg-brand-danger/10 transition"
//                     >
//                       <FaTimesCircle size={18} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PendingTable;

import { FaCheckCircle, FaTimesCircle, FaUser, FaBriefcase, FaCalendarAlt } from "react-icons/fa";

const TYPE_CONFIG = {
  Alumni: {
    icon: FaUser,
    style: "bg-blue-50 text-blue-600 border border-blue-200",
  },
  Job: {
    icon: FaBriefcase,
    style: "bg-purple-50 text-purple-600 border border-purple-200",
  },
  Event: {
    icon: FaCalendarAlt,
    style: "bg-red-50 text-red-600 border border-red-200",
  },
};

const PendingTable = ({ data = [], onApprove, onReject, onView }) => {
  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-gray-600 font-medium">
        All approvals are clear 👍
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* HEADER */}
      <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pending Approvals</h2>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Name / Title</th>
              <th className="px-6 py-3">Info</th>
              <th className="px-6 py-3 hidden md:table-cell">Created By</th>
              <th className="px-6 py-3">Details</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => {
              const config = TYPE_CONFIG[item.type];
              const Icon = config?.icon;

              return (
                <tr
                  key={item.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  {/* TYPE */}
                  <td className="px-6 py-4">
                    {config ? (
                      <span
                        className={`mx-auto flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full w-fit ${config.style}`}
                      >
                        <Icon size={12} />
                        {item.type}
                      </span>
                    ) : (
                      item.type
                    )}
                  </td>

                  {/* TITLE */}
                  <td className="px-6 py-4">
                    <span className="font-medium capitalize">{item.title}</span>
                  </td>

                  {/* INFO */}
                  <td className="px-6 py-4">
                    {item.type === "Job" && (
                      <div className="flex flex-col capitalize">
                        <span className="font-medium ">
                          {item.company || "-"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.jobType || "-"}
                        </span>
                      </div>
                    )}

                    {item.type === "Event" && (
                      <div className="flex flex-col capitalize">
                        <span className="font-medium">
                          {item.category || "-"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.date
                            ? new Date(item.date).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                    )}

                    {item.type === "Alumni" && (
                      <div className="flex flex-col">
                        <span className="font-medium uppercase">
                          {item.department || "-"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.batch || "-"}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* CREATED BY */}
                  <td className="px-6 py-4 hidden md:table-cell capitalize">
                    {item.createdBy || "-"}
                  </td>

                  {/* VIEW BUTTON */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onView(item)}
                      className="cursor-pointer text-sm font-medium text-brand-primary hover:underline"
                    >
                      View
                    </button>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          onApprove(item.type, item.id)
                        }
                        className="p-1 rounded-full text-brand-success hover:bg-brand-success/10"
                      >
                        <FaCheckCircle size={18} />
                      </button>

                      <button
                        onClick={() =>
                          onReject(item.type, item.id)
                        }
                        className="p-1 rounded-full text-brand-danger hover:bg-brand-danger/10"
                      >
                        <FaTimesCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingTable;