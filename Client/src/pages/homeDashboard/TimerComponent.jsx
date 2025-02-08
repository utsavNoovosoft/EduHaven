import { useState, useEffect } from "react";
import {
  Clock12,
  PlayCircle,
  RotateCcw,
  Coffee,
  Edit3,
  Check,
} from "lucide-react";

// -----------------------------------------------------
// Study Timer Component (Connected to the backend)
// -----------------------------------------------------
function StudyTimer() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState("");

  const handlePostSession = async (endTimestamp) => {
    const totalMinutes = time.hours * 60 + time.minutes + time.seconds / 60;
    console.log(totalMinutes)
    if (totalMinutes < 1) {
      console.log("Timer needs to be at least 1 minute long to save in database.");
      return;
    }

    const sessionData = {
      startTime,
      endTime: endTimestamp,
      duration: Math.round(totalMinutes),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/timer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sessionData),
      });
      const result = await response.json();
      console.log("Session Saved:", result);
    } catch (error) {
      console.log("Error saving timer", error);
    }
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => {
          let newSeconds = prev.seconds + 1;
          let newMinutes = prev.minutes;
          let newHours = prev.hours;

          if (newSeconds === 60) {
            newMinutes++;
            newSeconds = 0;
          }
          if (newMinutes === 60) {
            newHours++;
            newMinutes = 0;
          }

          return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStartPause = () => {
    if (!isRunning) {
      const formattedTime = new Date().toISOString();
      setStartTime((prev) => (prev ? prev : formattedTime));
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = async () => {
    if (time.hours !== 0 || time.minutes !== 0 || time.seconds !== 0) {
      const formattedEndTime = new Date().toISOString();
      await handlePostSession(formattedEndTime);
    }
    setIsRunning(false);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
    setStartTime("");
  };

  return (
    <>
      <div className="text-center flex flex-col items-center justify-center h-full">
        <div className="text-6xl font-bold mb-4">
          <div className="flex items-center gap-1">
            <p>{String(time.hours).padStart(2, "0")}</p>
            <p className="text-gray-400 pb-3">:</p>
            <p>{String(time.minutes).padStart(2, "0")}</p>
            <p className="text-gray-400 pb-3">:</p>
            <p>{String(time.seconds).padStart(2, "0")}</p>
          </div>
        </div>
        <div className="flex gap-4 justify-center mt-4">
          <button
            onClick={handleStartPause}
            className={`relative px-6 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300 ease-in-out ${
              isRunning
                ? "bg-black/20 hover:bg-black/30"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            <span
              className={`flex items-center gap-2 transition-opacity duration-300 ${
                isRunning ? "opacity-0" : "opacity-100"
              }`}
            >
              <PlayCircle className="w-5 h-5" />
              <span>Start Studying</span>
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-300 ${
                isRunning ? "opacity-100" : "opacity-0"
              }`}
            >
              <Clock12 className="w-5 h-5 animate-spin" />
              <span>Pause</span>
            </span>
          </button>
          <button
            onClick={handleReset}
            className="hover:bg-red-700 p-2 rounded-lg flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}

// -----------------------------------------------------
// Break Timer Component (runs entirely on the frontend)
// -----------------------------------------------------
function BreakTimer() {
  const [breakTime, setBreakTime] = useState(600); // Default break time in seconds (10 min)
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customBreakTime, setCustomBreakTime] = useState(10);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setBreakTime((prev) => {
          if (prev <= 0) {
            alert("Break is over! Get back to studying.");
            setIsRunning(false);
            return customBreakTime * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, customBreakTime]);

  const handleStartPause = () => setIsRunning((prev) => !prev);
  const handleReset = () => {
    setIsRunning(false);
    setBreakTime(customBreakTime * 60);
  };
  const handleEditClick = () => setIsEditing(true);
  const handleApplyBreakTime = () => {
    setBreakTime(customBreakTime * 60);
    setIsEditing(false);
  };

  return (
    <>
      <div className="text-center flex flex-col items-center justify-center h-full ">
        <div className="text-6xl font-bold mb-4 flex items-center gap-1">
          {!isEditing ? (
            <>
              <div>{String(Math.floor(breakTime / 60)).padStart(2, "0")}</div>
              <div className="text-gray-400 pb-3">:</div>
              <div>{String(breakTime % 60).padStart(2, "0")}</div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={customBreakTime}
                onChange={(e) => setCustomBreakTime(Number(e.target.value))}
                className="px-2 py-1 text-white rounded-md w-44 bg-transparent border-none outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />

              <button
                onClick={handleApplyBreakTime}
                className="bg-green-600 p-2 rounded-lg"
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
          )}
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="m-4 text-gray-300 hover:text-white"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex gap-4 justify-center mt-4">
          <button
            onClick={handleStartPause}
            className={`relative px-6 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300 ease-in-out ${
              isRunning
                ? "bg-black/20 hover:bg-black/30"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            <span
              className={`flex items-center gap-2 transition-opacity duration-300 ${
                isRunning ? "opacity-0" : "opacity-100"
              }`}
            >
              <Coffee className="w-5 h-5" />
              <span>Start Break</span>
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-300 ${
                isRunning ? "opacity-100" : "opacity-0"
              }`}
            >
              <Clock12 className="w-5 h-5 animate-spin" />
              <span>Pause</span>
            </span>
          </button>
          <button
            onClick={handleReset}
            className="hover:bg-red-700 p-2 rounded-lg flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}

// -----------------------------------------------------
// Parent Component
// Allows switching between StudyTimer and BreakTimer
// -----------------------------------------------------
function TimerComponent() {
  const [isBreakMode, setIsBreakMode] = useState(false);

  return (
    <div
      className={`p-6 rounded-3xl flex-1 text-white min-w-72 transition-all duration-500 ${
        isBreakMode
          ? "bg-gradient-to-br from-emerald-800 to-sky-800"
          : "bg-gradient-to-br from-purple-900 to-indigo-800"
      }`}
    >
      <nav className="flex mb-4 absolute items-center gap-6">
        <button
          className={`text-xl transition-colors duration-300 ${
            !isBreakMode ? "font-semibold text-white" : "text-gray-300"
          }`}
          onClick={() => setIsBreakMode(false)}
        >
          Focus
        </button>
        <button
          className={`text-xl transition-colors duration-300 ${
            isBreakMode ? "font-semibold text-white" : "text-gray-300"
          }`}
          onClick={() => setIsBreakMode(true)}
        >
          Take a Break
        </button>
      </nav>
      {isBreakMode ? <BreakTimer /> : <StudyTimer />}
    </div>
  );
}

export default TimerComponent;
