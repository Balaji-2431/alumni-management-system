import { Link } from "react-router-dom";
import { FaCheckCircle, FaTrash } from "react-icons/fa";

const AlumniDesktopTable = ({ alumni, onApprove, onDelete }) => {
  return (
      <section className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              {["Name", "Register Number", "Dept", "Batch", "Email", "Phone", "Details", "Status", "Action"].map((h) => {
                if (h === "Phone") {
                  return <th key={h} className="py-3 px-4 text-center hidden lg:table-cell">{h}</th>;
                }
                return <th key={h} className="py-3 px-4 text-center">{h}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {alumni.map((a, idx) => (
              <tr key={a._id} className={`text-center ${idx % 2 === 0 ? "bg-gray-50" : ""}`}>
                <td className="py-2 px-2">
                  <div className="order-2 mt-auto flex items-center gap-1.5">
                    {a.profilePic && (
                      <img
                        src={`http://localhost:3000${a.profilePic}`}
                        alt={a.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    )}

                    <div className="capitalize font-medium text-gray-700 text-sm text-gray-500 leading-tight">
                        {a.name}
                    </div>
                  </div>
                </td>
                <td className="py-2 px-4">{a.registerNumber || "-"}</td>
                <td className="py-2 px-4 uppercase">{a.department || "-"}</td>
                <td className="py-2 px-4">{a.batch || "-"}</td>
                <td className="py-2 px-4">{a.email}</td>
                <td className="py-2 px-4 hidden lg:block">{a.phone || "-"}</td>
                <td className="py-2 px-4">
                  <Link to={`/admin/alumni/${a._id}`} className="text-purple-700 hover:underline">View</Link>
                </td>
                <td className="py-2 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${a.isApproved ? "bg-green-300" : "bg-yellow-300"}`}>
                    {a.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="py-2 px-4 pointer flex justify-center gap-2">
                  {!a.isApproved && (
                    <button
                      onClick={() => onApprove(a._id)}
                      className="cursor-pointer p-2 rounded-md hover:bg-green-100 text-green-600 transition"
                    >
                      <FaCheckCircle />
                    </button>
                  )}
<button
  onClick={() => onDelete(a._id)}
  className="cursor-pointer p-2 rounded-md hover:bg-red-100 text-red-600 transition"
>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

  );
};

export default AlumniDesktopTable;
