import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api/axios";
import useDebounce from "../../../hooks/useDebounce";

import AlumniFilters from "../../../components/admin/alumniManagement/AlumniFilters";
import AlumniDesktopTable from "../../../components/admin/alumniManagement/AlumniDesktopTable";
import AlumniMobileCards from "../../../components/admin/alumniManagement/AlumniMobileCards";

import ConfirmModal from "../../../components/common/ConfirmModal";
import Pagination from "../../../components/common/Pagination";

const AlumniManagement = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
  });

  // Filters
  const [rawSearch, setRawSearch] = useState("");
  const search = useDebounce(rawSearch, 400);
  const [status, setStatus] = useState("all");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);

  const fetchAlumni = async () => {
    try {
      setLoading(true);

      const params = { page, limit };

      if (search?.trim()) params.search = search;
      if (status !== "all") params.isApproved = status === "approved";
      if (department) params.department = department;
      if (batch?.trim()) params.batch = batch;

      const res = await api.get("/admin/alumni", { params });

      setAlumni(res.data.data);
      setTotal(res.data.count);
      console.log(res.data.data)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, [page, search, status, department, batch]);

  useEffect(() => {
    setPage(1);
  }, [search, status, department, batch]);

  const handleApprove = (id) => {
    setConfirm({
      open: true,
      title: "Approve this alumni?",
      message: "This alumni will be approved.",
      action: async () => {
        try {
          await api.put(`/admin/alumni/${id}/approve`);
          toast.success("Alumni approved");
          fetchAlumni();
        } catch {
          toast.error("Approve failed");
        } finally {
          setConfirm({ open: false });
        }
      },
    });
  };

  const handleDelete = (id) => {
    setConfirm({
      open: true,
      title: "Delete this alumni?",
      message: "This action cannot be undone.",
      action: async () => {
        try {
          await api.delete(`/admin/alumni/${id}`);
          toast.success("Alumni deleted");
          fetchAlumni();
        } catch {
          toast.error("Delete failed");
        } finally {
          setConfirm({ open: false });
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Alumni Management</h1>
          <span className="text-sm text-gray-600">Total: {total}</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <main className="w-full mx-auto p-2 bg-white border border-gray-200 shadow-sm">
                
                  <AlumniFilters
                    rawSearch={rawSearch}
                    setRawSearch={setRawSearch}
                    status={status}
                    setStatus={setStatus}
                    department={department}
                    setDepartment={setDepartment}
                    batch={batch}
                    setBatch={setBatch}
                    setPage={setPage}
                  />

                {!alumni.length ? (
                  <div className="py-12 text-center text-gray-500">
                    No Alumni Found
                  </div>
                ) : (
                  <>
                    <AlumniDesktopTable
                      alumni={alumni}
                      onApprove={handleApprove}
                      onDelete={handleDelete}
                    />

                    <AlumniMobileCards
                      alumni={alumni}
                      onApprove={handleApprove}
                      onDelete={handleDelete}
                    />
                  </>
                )}
                </main>
              </motion.div>
            </AnimatePresence>
          </div>

          <Pagination
            page={page}
            total={total}
            limit={limit}
            onPageChange={setPage}
          />
        </div>
      </div>

      {confirm.open && (
        <ConfirmModal
          open={confirm.open}
          title={confirm.title}
          message={confirm.message}
          onConfirm={confirm.action}
          onCancel={() => setConfirm({ ...confirm, open: false })}
        />
      )}
    </div>
  );
};

export default AlumniManagement;
