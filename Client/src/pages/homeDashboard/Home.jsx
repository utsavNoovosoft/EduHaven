import { useState, useEffect } from "react";
import { User, Headphones, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

import Ai from "./AiChatbot.jsx";
import Calender from "./CalendarComponent.jsx";
import TimerComponent from "./TimerComponent.jsx";
import NotesComponent from "./NotesComponent.jsx";
import GoalsComponent from "./GoalsComponent.jsx";
import StudyStats from "./TimerStats.jsx";

function StudyRoom() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedId, setSelectedId] = useState(""); // for AI. donot remove

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <>
      <style>
        {`
          @media (max-width: 1200px) {
            .notes-goals-grid {
              grid-template-columns: repeat(1, 1fr);
            }
          }
        `}
      </style>
      <div className="m-6 space-y-4">
        {/* nav-bar */}
        <div className="flex justify-between items-center">
          <button className="flex gap-3 font-bold text-lg items-center">
            <ExternalLink />
            Links
          </button>
          <h1 className="text-2xl font-bold">Stay hungry; stay foolish.</h1>
          <div className="flex items-center gap-6">
            {/* ai */}
            <Ai onShowId={setSelectedId} />
            {!isLoggedIn && (
              <Link
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
                to="/authenticate"
              >
                <User className="w-5 h-5" />
                Login
              </Link>
            )}
          </div>
        </div>

        <div className="flex gap-6 w-full h-auto flex-col [min-width:700px]:flex-col lg:flex-row">
          <div className="flex-1 h-100 flex flex-col gap-6">
            <div className="flex bg-sec rounded-3xl shadow">
              <TimerComponent />
              <StudyStats />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 notes-goals-grid">
              <NotesComponent />
              <GoalsComponent />
            </div>
          </div>
          <Calender />
        </div>

        {/* Discussion Rooms */}
        <h1 className="text-2xl font-bold">Connect with friends</h1>
        <div className="grid grid-cols-3 gap-6">
          {["Room 1", "Room 2", "Room 3"].map((room) => (
            <div key={room} className="bg-sec p-6 rounded-3xl shadow">
              <h3 className="font-semibold mb-2">{room}</h3>
              <p className="txt-dim text-sm mb-4">4 students studying</p>
              <button className="bg-ter hover:bg-purple-700 px-4 py-2 rounded-lg w-full flex gap-3 transition-all duration-200 ease-in-out">
                <Headphones />
                Join Room
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default StudyRoom;
