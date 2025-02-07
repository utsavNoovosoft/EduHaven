import {useState} from "react";
import { ChevronDown } from "lucide-react";

function StudyStats() {
  const [selectedTime, setSelectedTime] = useState("Today");
  const [isOpen, setIsOpen] = useState(false);
  const studyData = {
    Today: "0.5 h",
    "This week": "3.2 h",
    "This month": "10.4 h",
    "All time": "45.8 h",
  };
  return (
    <div className="bg-gray-900 text-white pl-6 rounded-2xl w-80 min-w-64 space-y-4 h-auto">
      {/* Study Time */}
      <div className="bg-gray-800 p-3 rounded-lg relative">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-300">Study time</span>

        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-1 text-gray-300 hover:text-white"
          >
            <span>{selectedTime}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-gray-900 text-white rounded-lg shadow-lg overflow-hidden z-10">
              {Object.keys(studyData).map((time) => (
                <button
                  key={time}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  onClick={() => {
                    setSelectedTime(time);
                    setIsOpen(false);
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-2xl font-bold mt-1">{studyData[selectedTime]}</p>
    </div>

      {/* Monthly Level */}
      <div className="bg-gray-800 p-3 rounded-lg">
        <p className="ont-semibold text-gray-300">Beginner (1-3h)</p>
        <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
          <div
            className="bg-purple-500 h-2 rounded-full"
            style={{ width: "40%" }}
          ></div>
        </div>
        <p className="text-sm text-gray-300 mt-1">
          1.8 hours left until:{" "}
          <span className="text-purple-400">Intermediate (3-6h)</span>
        </p>
      </div>

      {/* Leaderboard Rank */}
      <div className="bg-gray-800 p-3 rounded-lg">
        <p className="font-semibold text-gray-300">Leaderboard rank</p>
        <p className="text-2xl font-bold text-yellow-400">#36385</p>
      </div>
    </div>
  );
}

export default StudyStats;
