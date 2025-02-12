import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const EventPopup = ({ date, onClose, refreshEvents }) => {
  const [event, setEvent] = useState(null);
  const [title, setTitle] = useState("");
  // Set default time to "08:00"
  const [time, setTime] = useState("08:00");
  const [id, setId] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/events-by-date?date=${date}`
        );
        const eventData = response.data.data[0]; // Assuming one event per date
        if (eventData) {
          setId(eventData._id);
          setEvent(eventData);
          setTitle(eventData.title || "");
          // Use event time or default to "08:00"
          setTime(eventData.time || "08:00");
        } else {
          setEvent(null);
          setTitle("");
          setTime("08:00");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [date]);

  const handleCreateOrUpdate = async () => {
    try {
      const eventData = { title, time, date };
      if (id) {
        await axios.put(`http://localhost:3000/events/${id}`, eventData);
      } else {
        await axios.post("http://localhost:3000/events", eventData);
      }
      refreshEvents();
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (id) {
        await axios.delete(`http://localhost:3000/events/${id}`);
        refreshEvents();
        onClose();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-96 bg-gray-800 rounded-3xl p-8 shadow-2xl shadow-gray-900 border border-gray-700"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Header with title, date and close icon */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                {event ? "Edit Event" : "New Event"}
              </h2>
              <p className="text-sm text-gray-500">{date}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300 transition mb-auto"
            >
              <X size={24} />
            </button>
          </div>
          {/* Input for event title */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl bg-transparent border border-gray-700 px-4 py-2 text-gray-100 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>
          {/* Input for event time */}
          <div className="mb-6">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-xl bg-transparent border border-gray-700 px-4 py-2 text-gray-100 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition "
            />
          </div>
          {/* Action buttons */}
          <div className="flex space-x-3">
            {event && (
              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-gray-600 py-2 text-center text-white font-semibold shadow hover:bg-red-700 transition"
              >
                Delete
              </button>
            )}
            <button
              onClick={handleCreateOrUpdate}
              className="flex-1 m-auto w-min rounded-lg bg-purple-600 py-2 text-center text-white font-semibold shadow hover:bg-purple-700 transition"
            >
              {event ? "Update" : "Create"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventPopup;
