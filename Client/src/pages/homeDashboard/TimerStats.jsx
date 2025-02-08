import { useState } from "react";
import { ChevronDown, Clock4, Flame, BarChart2 } from "lucide-react";

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
    <div className=" text-white m-4 mt-2 w-[25%] h-full">
      {/* Dropdown */}
      <div className=" relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1 text-gray-300 hover:text-white ml-auto"
        >
          <span>{selectedTime}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-5 mt-2 w-32 bg-gray-900 text-white rounded-lg shadow-lg overflow-hidden z-10">
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

      <div className="flex items-center gap-4 mb-3">
        <Clock4 className="h-12 w-12 p-2.5 bg-green-400/70 rounded-full text-gray-100" />
        <p className="text-2xl text-gray-300 font-bold ">
          {studyData[selectedTime]}
        </p>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <BarChart2 className="h-12 w-12 p-2.5 bg-blue-400/70 rounded-full text-gray-100" />
        <p className="text-2xl font-bold text-blue-400">#36385</p>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <Flame className="h-12 w-12 p-2.5 bg-yellow-400/70 rounded-full text-gray-100" />
        <p className="text-2xl font-bold text-yellow-400">20 days</p>
      </div>

      <p className="text-md text-gray-200 pl-2">Beginner (1-2h)</p>
      <div className="relative w-full bg-gray-700 h-5 rounded-2xl mt-2">
        <p className="absolute h-full w-full pr-5 text-gray-300 text-sm text-right">
          1.8h left
        </p>
        <div
          className="bg-purple-500 h-5 rounded-2xl"
          style={{ width: "40%" }}
        ></div>
      </div>
    </div>
  );
}

export default StudyStats;
