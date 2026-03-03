// import SlideOver from "../../../components/common/SlideOver";
// import { formatRelativeTime } from "../../../utils/formatRelativeTime";
// const JobDetails = ({ job, onClose }) => {
//   if (!job) return null;

//   return (
//     <SlideOver open={!!job} onClose={onClose} title={job.title}>
//       <div className="space-y-4 text-sm">
//         <div className="mb-4">
//           <img
//             src={`http://localhost:3000${job.image}`}
//             alt="Job"
//             className="w-full h-48 object-cover rounded-md"
//           />
//         </div>
//         <p className="text-gray-500"><strong>Company:</strong> {job.company}</p>
//         {/* {job.description && <p><strong>Description:</strong> {job.description}</p>} */}
//         <p><strong>Location:</strong> {job.location || "—"}</p>
//         <p><strong>Type:</strong> {job.jobType || "—"}</p>
//         <p><strong>Experience:</strong> {job.experience || "—"}</p>
//         <p><strong>Qualification:</strong> {job.qualification || "—"}</p>
//         <p><strong>Skills:</strong> {job.skills?.length ? job.skills.join(", ") : "—"}</p>
//         <p><strong>Salary:</strong> {job.salary || "—"}</p>
//         <p><strong>Approved:</strong> {job.isApproved ? "Yes" : "No"}</p>
//         <p><strong>Created By:</strong> {job.createdBy?.name || job.createdBy || "—"}</p>
//         <p><strong>Created:</strong> {formatRelativeTime(job.createdAt)}</p>

//         {job.applyLink && (
//           <a
//             href={job.applyLink}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="mt-4 inline-block w-full text-center bg-black text-white py-2 rounded-lg hover:opacity-90 transition"
//           >
//             Apply Now
//           </a>
//         )}
//       </div>
//     </SlideOver>
//   );
// };

// export default JobDetails;

import Modal from "../../../components/common/Modal";
import { formatRelativeTime } from "../../../utils/formatRelativeTime";
const JobDetails = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <Modal open={!!job} onClose={onClose} createdBy={job?.createdBy} createdAt={job.createdAt}>
      <div className="space-y-4 text-sm">
        {job.image && (
          <div className="mb-4">
            <img
              src={`http://localhost:3000${job.image}`}
              alt="Job"
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        )}

        <p><strong>Company:</strong> {job.company}</p>
        <p><strong>Location:</strong> {job.location || "—"}</p>
        <p><strong>Type:</strong> {job.jobType || "—"}</p>
        <p><strong>Experience:</strong> {job.experience || "—"}</p>
        <p><strong>Qualification:</strong> {job.qualification || "—"}</p>
        <p><strong>Skills:</strong> {job.skills?.length ? job.skills.join(", ") : "—"}</p>
        <p><strong>Salary:</strong> {job.salary || "—"}</p>
        <p><strong>Approved:</strong> {job.isApproved ? "Yes" : "No"}</p>
        <p><strong>Created By:</strong> {job.createdBy?.name || job.createdBy || "—"}</p>
        <p><strong>Created:</strong> {formatRelativeTime(job.createdAt)}</p>

        {job.applyLink && (
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block w-full text-center bg-black text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Apply Now
          </a>
        )}
      </div>
    </Modal>
  );
};

export default JobDetails;