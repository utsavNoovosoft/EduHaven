import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Sample time-series data for study stats (with study room hours included)
const studyStatsData = {
  daily: [
    { name: "Mon", totalHours: 2, studyRoomHours: 1 },
    { name: "Tue", totalHours: 3, studyRoomHours: 1.5 },
    { name: "Wed", totalHours: 1.5, studyRoomHours: 0.5 },
    { name: "Thu", totalHours: 2.5, studyRoomHours: 1.5 },
    { name: "Fri", totalHours: 3, studyRoomHours: 2 },
    { name: "Sat", totalHours: 4, studyRoomHours: 2.5 },
    { name: "Sun", totalHours: 0, studyRoomHours: 0 },
  ],
  weekly: [
    { name: "Week 1", totalHours: 15, studyRoomHours: 7 },
    { name: "Week 2", totalHours: 20, studyRoomHours: 10 },
    { name: "Week 3", totalHours: 18, studyRoomHours: 8 },
    { name: "Week 4", totalHours: 22, studyRoomHours: 11 },
  ],
  monthly: [
    { name: "Jan", totalHours: 70, studyRoomHours: 35 },
    { name: "Feb", totalHours: 65, studyRoomHours: 32 },
    { name: "Mar", totalHours: 80, studyRoomHours: 40 },
    { name: "Apr", totalHours: 90, studyRoomHours: 45 },
  ],
};

// Summary statistics for each view
const summaryStats = {
  daily: {
    rank: "Null",
    currentStreak: 3,
    maxStreak: 5,
    totalStudyHours: 16,
    avgDaily: 2.29,
  },
  weekly: {
    rank: "Null",
    currentStreak: 2,
    maxStreak: 4,
    totalStudyHours: 75,
    avgDaily: 2.68,
  },
  monthly: {
    rank: "Null",
    currentStreak: 6,
    maxStreak: 10,
    totalStudyHours: 325,
    avgDaily: 2.78,
  },
};

const StudyStats = () => {
  const [view, setView] = useState("weekly");
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdownClick = (viewType) => {
    setView(viewType);
    setIsOpen(false);
  };

  const currentStats = summaryStats[view];

  return (
    <div className="bg-gray-800 rounded-xl text-center w-full">
      {/* Header with summary study stats */}
      <div className="flex flex-col md:flex-row justify-between items-center p-6">
        <div className="font-semibold">
          Total Study Hours: <strong>{currentStats.totalStudyHours}</strong>
          <span>&nbsp; &nbsp;&nbsp;&nbsp;</span>
          Average: <strong>{currentStats.totalStudyHours % 7}</strong>
          <span>&nbsp; &nbsp;&nbsp;&nbsp;</span>
          Maximum: <strong>{currentStats.totalStudyHours / 2}</strong>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex items-center gap-1 hover:bg-gray-700 mt-4 md:mt-0"
              onClick={() => setIsOpen(!isOpen)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}{" "}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          {isOpen && (
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDropdownClick("daily")}>
                Daily
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDropdownClick("weekly")}>
                Weekly
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDropdownClick("monthly")}>
                Monthly
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>

      {/* Chart showing Total Study Hours and Study-Room Hours with gradients */}
      <div className="flex">
        <div className="w-full" style={{ background: "#1e293b" }}>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={studyStatsData[view]}
              margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
            >
              {/* Define gradients for both series */}
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border:"0",
                  borderRadius:"0.8rem"
                }}
                itemStyle={{ color: "#fff" }}
                labelStyle={{ color: "#d09eff" }}
              />

              {/* Gradient Area for Total Study Hours */}
              <Area
                type="monotone"
                dataKey="totalHours"
                stroke="#a855f7"
                strokeWidth={2}
                fill="url(#colorHours)"
                dot={{
                  r: 2,
                  fill: "#a855f7",
                }}
                activeDot={{ r: 6 }}
              />

              <Area
                type="monotone"
                dataKey="studyRoomHours"
                stroke="#7b3eb5"
                strokeWidth={2}
                fill="url(#colorHours)"
                dot={{
                  r: 0,
                }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="text-sm text-gray-300 pr-6 my-auto text-left w-32">
          Rank:
          <div className="text-4xl mb-8 font-bold text-blue-500">
            {currentStats.rank}
          </div>
          Current Streak:
          <div className="text-4xl mb-8 font-bold text-yellow-500">
            {currentStats.currentStreak}{" "}
            <span className="text-lg font-normal"> days</span>
          </div>
          Max Streak:
          <div className="text-4xl mb-8 font-bold text-green-500">
            {currentStats.maxStreak}{" "}
            <span className="text-lg font-normal"> days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyStats;
