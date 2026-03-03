import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaTrash, FaChevronDown, FaEye } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AlumniMobileCards = ({ alumni, onApprove, onDelete }) => {
  const [openId, setOpenId] = useState(null);
    const toggleRow = (id) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
        <section className="md:hidden flex flex-col gap-4">
          <AnimatePresence>
            {alumni.map((a) => {
              const open = openId === a._id;

              return (
                <motion.div
                  key={a._id}
                  layout
                  initial={false}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`rounded-xl border p-4 transition-all duration-300 ${
                    open
                      ? "bg-blue-50 border-blue-200 shadow-md"
                      : "bg-white border-gray-200 shadow-sm"
                  }`}
                >
                  {/* HEADER */}
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleRow(a._id)}
                  >
                    <div>
                      {/* <h3 className="text-base font-semibold">{a.name}</h3> */}
                      
                  <div className="order-2 mt-auto flex items-center gap-1.5">
                    {a.profilePic && (
                      <img
                        src={`http://localhost:3000${a.profilePic}`}
                        alt={a.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}

                    <div className="capitalize font-medium text-gray-700 text-sm text-gray-500 leading-tight">
                        {a.name} ({a.registerNumber})
                                            {/* <h5 className="text-xs text-gray-500">{a.registerNumber || "-"}</h5> */}
                      <p className="text-sm text-gray-500">
                        {a.department?.toUpperCase()} ({a.batch})
                      </p>
                    </div>
                  </div>

                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                          a.isApproved
                            ? "bg-green-50 text-green-600"
                            : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        {a.isApproved ? "Approved" : "Pending"}
                      </span>

                      <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <FaChevronDown />
                      </motion.div>
                    </div>
                  </div>


                  {/* COLLAPSE CONTENT */}
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 border-t pt-4 border-gray-300 space-y-3 text-sm">
                          
                          <div className="flex justify-between">
                            <span className="text-gray-500">Email</span>
                            <span className="font-medium">{a.email}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-500">Phone</span>
                            <span className="font-medium">{a.phone || "-"}</span>
                          </div>

                          {/* ACTIONS */}
                          <div className="flex justify-between gap-3 pt-3">
                            
                            <Link
                              to={`/admin/alumni/${a._id}`}
                              className="flex-1 flex justify-center items-center py-2 rounded-lg bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition"
                            >
                              <FaEye />
                            </Link>

                            {!a.isApproved && (
                              <button
                                onClick={() => onApprove(a._id)}
                                className="flex-1 flex justify-center items-center py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition"
                              >
                                <FaCheckCircle />
                              </button>
                            )}

                            <button
                              onClick={() => onDelete(a._id)}
                              className="flex-1 flex justify-center items-center py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                            >
                              <FaTrash />
                            </button>

                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </section>
  );
};

export default AlumniMobileCards;
