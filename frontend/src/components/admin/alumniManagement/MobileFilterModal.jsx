import { motion, AnimatePresence } from "framer-motion";

const MobileFilterModal = ({
  open,
  onClose,
  status,
  setStatus,
  department,
  setDepartment,
  batch,
  setBatch,
  setPage,
}) => {
  const clearFilters = () => {
    setStatus("all");
    setDepartment("");
    setBatch("");
    setPage(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-[90%] max-w-sm bg-white rounded-2xl shadow-xl p-5 space-y-4"
          >
            <div className="flex justify-between">
              <h2 className="font-semibold">Filters</h2>
              <button onClick={onClose}>✕</button>
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
            </select>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
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
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />

            <div className="flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-2 border rounded-lg"
              >
                Clear
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileFilterModal;
