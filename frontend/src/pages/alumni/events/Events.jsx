import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import EventCard from "../../../components/alumni/events/EventCard";
import Loader from "../../../components/common/Loader";

const Events = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllUserEvents, setShowAllUserEvents] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  /* ---------- Handle Resize ---------- */
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------- Fetch Events ---------- */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const params = { page: 1, limit: 50 };
        const res = await api.get("/events", { params });
        setEvents(res.data.data || []);
      } catch (err) {
        console.error("FETCH EVENTS ERROR:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <Loader />;


  /* ---------- Separate User & Others ---------- */
  const userEvents = events.filter((e) => e.createdBy?._id === user.id);
  const otherEvents = events.filter((e) => e.createdBy?._id !== user.id);

  /* ---------- Layout Rules ---------- */
  let userEventsToShow = 2;
  if (windowWidth >= 1013 && windowWidth < 1317) userEventsToShow = 3;
  else if (windowWidth >= 1317) userEventsToShow = 4;

  return (
    <div className="min-h-screen bg-model-bg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">

        {/* ===== Header ===== */}
        <div className="flex justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-model-heading">Events</h1>
            <span className="text-sm text-model-muted">({events.length})</span>
          </div>

          <button
            onClick={() => navigate("/alumni/events/create")}
            className="flex items-center gap-2 bg-model-primary hover:bg-model-primary-hover text-model-card-bg px-4 sm:px-6 py-2 rounded-lg shadow-sm transition"
          >
            <FaPlus />
            <span className="hidden sm:inline">Create Event</span>
          </button>
        </div>
        {events.length === 0 &&
          <p className="text-center py-14 text-model-muted">No events available.</p>
        }
        {/* ===== Your Pending Events ===== */}
        {userEvents.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xl font-semibold text-model-heading sm:ml-6">
                Your Events
              </h2>
              <span className="text-sm text-model-muted">
                ({userEvents.length})
              </span>
            </div>

            <motion.div className="flex flex-wrap justify-center gap-4">
              <AnimatePresence>
                {(showAllUserEvents
                  ? userEvents
                  : userEvents.slice(0, userEventsToShow)
                ).map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </AnimatePresence>
            </motion.div>

{userEvents.length > userEventsToShow && (
  <div className="flex items-center gap-3 my-4">
    <div className="flex-grow h-px bg-model-border" />

    <button
      onClick={() => setShowAllUserEvents(p => !p)}
      className="
        flex items-center gap-1
        text-sm text-blue-600
        cursor-pointer
        border-b border-transparent
        hover:border-blue-600
        transition
      "
    >
      {showAllUserEvents ? (
        <>
          <span>Show Less</span>
          <FaChevronUp />
        </>
      ) : (
        <>
          <span>Show More</span>
          <FaChevronDown />
        </>
      )}
    </button>

    <div className="flex-grow h-px bg-model-border" />
  </div>
)}
          </section>
        )}

        {/* ===== Recent Events ===== */}
        {otherEvents.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xl font-semibold text-model-heading sm:ml-6">
                Recent Events
              </h2>
              <span className="text-sm text-model-muted">
                ({otherEvents.length})
              </span>
            </div>

            <motion.div className="flex flex-wrap justify-center gap-4">
              <AnimatePresence>
                {otherEvents.map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </AnimatePresence>
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Events;