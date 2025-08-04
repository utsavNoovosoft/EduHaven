import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import axios from "axios";

import RoomCard from "./RoomCard";
import CreateRoomModal from "./CreateRoomModal";

export default function YourRooms({ myRooms }) {
  const [sessions, setSessions] = useState(myRooms);

  useEffect(() => {
    setSessions(myRooms.map((r) => ({ ...r, joins: r.joins ?? 0 })));
  }, [myRooms]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const backendUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const handleCreate = async (data) => {
    try {
      const res = await axios.post(`${backendUrl}/session-room`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      setSessions((s) => [...s, res.data]); 
    } catch (err) {
      console.error("Create room failed:", err);
    }
  };

  const handleDelete = async (room) => {
    try {
      await axios.delete(`${backendUrl}/session-room/${room._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions((s) => s.filter((r) => r._id !== room._id));
    } catch (err) {
      console.error("Delete room failed:", err);
    }
  };

  return (
    <div className="flex-1">
      <h1 className="text-lg 2xl:text-2xl font-semibold txt mb-3 2xl:mb-6">Your Rooms</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 2xl:gap-6">
        {sessions.map((room) => (
          <RoomCard
            key={room._id}
            room={room}
            onDelete={handleDelete}
            showCategory={true}
          />
        ))}

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center justify-center gap-4 bg-sec px-6 py-2.5 rounded-3xl transition-all aspect-square h-full w-fit border-8 border-[var(--bg-sec)] hover:border-[var(--btn-hover)]"
        >
          <PlusCircle className="size-14" strokeWidth={1} />
          <h3 className="font-semibold">Create Room</h3>
        </button>
      </div>

      <CreateRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
