import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../../components/admin/DataTable";
import ConfirmModal from "../../../components/common/ConfirmModal";
import eventColumns from "./EventColumns";
import EventDetails from "./EventDetails";
import api from "../../../api/axios";
import { toast } from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import Loader from "../../../components/common/Loader";
import Pagination from "../../../components/common/Pagination";

const AdminEventsPage = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);

  // filter
  const [filter, setFilter] = useState("all");

  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
  });

  /* =========================
     FETCH EVENTS
  ========================= */
  const fetchEvents = async () => {
    try {
      setLoading(true);

      const params = { page, limit };
      if (filter !== "all") params.isApproved = filter === "approved";

      const res = await api.get("/events", { params });

      setEvents(res.data.data || []);
      setTotal(res.data.count || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     EFFECTS
  ========================= */
  useEffect(() => {
    fetchEvents();
  }, [page, filter]);

  useEffect(() => {
    setPage(1); // reset page on filter change
  }, [filter]);

  /* =========================
     ACTIONS
  ========================= */
  const handleApprove = (id) => {
    setConfirm({
      open: true,
      title: "Approve this event?",
      message: "This event will be visible to all alumni.",
      action: async () => {
        try {
          await api.put(`/events/admin/${id}/approve`);
          toast.success("Event approved");
          fetchEvents();
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
    title: "Delete this event?",
    message: "This action cannot be undone.",
    action: async () => {
      try {
        await api.delete(`/events/${id}`);
        toast.success("Event deleted");

        // 👇 calculate remaining items
        const remaining = total - 1;
        const lastPage = Math.ceil(remaining / limit);

        // 👇 if current page is now invalid, move back
        if (page > lastPage && lastPage > 0) {
          setPage(lastPage);
        } else {
          fetchEvents();
        }
      } catch {
        toast.error("Delete failed");
      } finally {
        setConfirm({ open: false });
      }
    },
  });
};

  const columns = eventColumns({
    onView: setSelectedEvent,
    onApprove: handleApprove,
    onDelete: handleDelete,
  });

  /* =========================
     UI
  ========================= */
  return (
    <div className="relative flex max-w-7xl mx-auto">
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Events Management
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Total: {total} event{total !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/events/create")}
            className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium flex items-center gap-2"
          >
            <FaPlus className="w-4 h-4" />
            <span className="hidden md:inline">Create Event</span>
          </button>
        </div>

        {/* FILTER */}
        <div className="flex flex-wrap gap-3 mb-6">
          {["pending", "approved", "all"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === f
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* TABLE */}
        {loading ? (
          <Loader />
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No events found
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={events} />

            <Pagination
              page={page}
              total={total}
              limit={limit}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* DETAILS SLIDE */}
      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* CONFIRM MODAL */}
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

export default AdminEventsPage;