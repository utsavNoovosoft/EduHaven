import { useState, useEffect } from "react";
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
import axios from "axios";

// ──────────────────────────────────────────────────────────────
// Helper functions for date formatting
// ──────────────────────────────────────────────────────────────

const formatLocalHour = (date) => {
  // Format as "YYYY-MM-DD-HH" using local date values.
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  return `${year}-${month}-${day}-${hour}`;
};

const formatLocalDate = (date) => {
  // Format as "YYYY-MM-DD"
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Compute ISO week string ("YYYY-WW") for a given date.
const getISOYearWeek = (date) => {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);
  // Shift date to Thursday in current week: ISO weeks start on Monday.
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  const year = tempDate.getFullYear();
  const week1 = new Date(year, 0, 4);
  const diff = tempDate - week1;
  const weekNumber =
    1 + Math.round((diff / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${year}-${weekNumber.toString().padStart(2, "0")}`;
};

// ──────────────────────────────────────────────────────────────
// Timeline Generators
// ──────────────────────────────────────────────────────────────

const generateHourlyTimeline = () => {
  const timeline = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const hourDate = new Date(now.getTime() - i * 60 * 60 * 1000);
    const label = hourDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    timeline.push({
      value: formatLocalHour(hourDate), // key: "YYYY-MM-DD-HH"
      label,
      totalHours: 0,
      studyRoomHours: 0,
    });
  }
  return timeline;
};

const generateDailyTimeline = () => {
  const timeline = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const dayDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - i
    );
    const label = dayDate.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const value = formatLocalDate(dayDate); // key: "YYYY-MM-DD"
    timeline.push({
      value,
      label,
      totalHours: 0,
      studyRoomHours: 0,
    });
  }
  return timeline;
};

const generateWeeklyTimeline = () => {
  const timeline = [];
  const now = new Date();
  for (let i = 4; i >= 0; i--) {
    const weekDate = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const label = `Week ${getISOYearWeek(weekDate).split("-")[1]}`;
    const value = getISOYearWeek(weekDate);
    timeline.push({
      value,
      label,
      totalHours: 0,
      studyRoomHours: 0,
    });
  }
  return timeline;
};

const generateMonthlyTimeline = () => {
  const timeline = [];
  const now = new Date();
  for (let i = 4; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = monthDate.toLocaleDateString([], {
      month: "short",
    });
    const value = `${monthDate.getFullYear()}-${(monthDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    timeline.push({
      value,
      label,
      totalHours: 0,
      studyRoomHours: 0,
    });
  }
  return timeline;
};

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────

const StudyStats = () => {
  const [view, setView] = useState("daily");
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const [userStats, setUserStats] = useState({
    rank: 0,
    totalUsers: 0,
    streak: 0,
    maxStreak: 0
  });
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_API_URL;

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Fetch user stats (rank and streak)
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await axios.get(`${backendUrl}/user/stats`, getAuthHeader());
        setUserStats({
          rank: response.data.rank || 0,
          totalUsers: response.data.totalUsers || 0,
          streak: response.data.streaks?.current || 0,
          maxStreak: response.data.streaks?.max || 0
        });
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchUserStats();
  }, [backendUrl]);

  useEffect(() => {
    const handleGetStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${backendUrl}/timerstats?period=${view}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        let timeline = [];

        if (view === "hourly") {
          timeline = generateHourlyTimeline();
          result.periodData.forEach((item) => {
            const found = timeline.find((entry) => entry.value === item._id);
            if (found) {
              found.totalHours = item.totalHours || 0;
              found.studyRoomHours = item.studyRoomHours || 0;
            }
          });
          setStats(
            timeline.map((entry) => ({
              name: entry.label,
              totalHours: entry.totalHours,
              studyRoomHours: entry.studyRoomHours,
            }))
          );
        } else if (view === "daily") {
          timeline = generateDailyTimeline();
          result.periodData.forEach((item) => {
            const found = timeline.find((entry) => entry.value === item._id);
            if (found) {
              found.totalHours = item.totalHours || 0;
              found.studyRoomHours = item.studyRoomHours || 0;
            }
          });
          setStats(
            timeline.map((entry) => ({
              name: entry.label,
              totalHours: entry.totalHours,
              studyRoomHours: entry.studyRoomHours,
            }))
          );
        } else if (view === "weekly") {
          timeline = generateWeeklyTimeline();
          result.periodData.forEach((item) => {
            const found = timeline.find((entry) => entry.value === item._id);
            if (found) {
              found.totalHours = item.totalHours || 0;
              found.studyRoomHours = item.studyRoomHours || 0;
            }
          });
          setStats(
            timeline.map((entry) => ({
              name: entry.label,
              totalHours: entry.totalHours,
              studyRoomHours: entry.studyRoomHours,
            }))
          );
        } else if (view === "monthly") {
          timeline = generateMonthlyTimeline();
          result.periodData.forEach((item) => {
            const found = timeline.find((entry) => entry.value === item._id);
            if (found) {
              found.totalHours = item.totalHours || 0;
              found.studyRoomHours = item.studyRoomHours || 0;
            }
          });
          setStats(
            timeline.map((entry) => ({
              name: entry.label,
              totalHours: entry.totalHours,
              studyRoomHours: entry.studyRoomHours,
            }))
          );
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };

    handleGetStats();
  }, [view, backendUrl]);

  const handleDropdownClick = (viewType) => {
    setView(viewType);
    setIsOpen(false);
  };

  // Calculate summary statistics
  const summary = stats.reduce(
    (acc, item) => {
      acc.totalStudyHours += item.totalHours || 0;
      acc.maxStudyHours = Math.max(acc.maxStudyHours, item.totalHours || 0);
      return acc;
    },
    { totalStudyHours: 0, maxStudyHours: 0 }
  );

  summary.avgDaily = summary.totalStudyHours / Math.max(stats.length, 1);

  return (
    <div className="bg-[var(--bg-sec)] rounded-3xl shadow-lg p-6 flex flex-col h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="text-sm text-[var(--txt-dim)]">
          Total Study Hours:{" "}
          <strong>{summary.totalStudyHours.toFixed(2)}</strong>
          <span className="mx-4"></span>
          Average: <strong>{Number(summary.avgDaily).toFixed(2)}</strong>
          <span className="mx-4"></span>
          Maximum: <strong>{summary.maxStudyHours.toFixed(2)}</strong>
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
            <DropdownMenuContent align="end" classname="border-none">
              <DropdownMenuItem onClick={() => handleDropdownClick("hourly")}>
                Hourly
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDropdownClick("daily")}>
                Daily
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDropdownClick("weekly")}>
                Weekly
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDropdownClick("monthly")}
              >
                Monthly
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={stats}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--btn)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="var(--btn)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--txt-disabled)" strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="var(--txt-dim)" />
          <YAxis stroke="var(--txt-dim)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--bg-primary)",
              border: "none",
              borderRadius: "0.8rem",
              color: "var(--txt)",
            }}
            itemStyle={{ color: "var(--txt)" }}
            labelStyle={{ color: "var(--btn)" }}
          />
          <Area
            type="monotone"
            dataKey="totalHours"
            stroke="var(--btn-hover)"
            strokeWidth={2}
            fill="url(#colorHours)"
            dot={{ r: 2, fill: "var(--btn-hover)" }}
            activeDot={{ r: 6 }}
          />
          <Area
            type="monotone"
            dataKey="studyRoomHours"
            stroke="var(--btn)"
            strokeWidth={2}
            fill="url(#colorHours)"
            dot={{ r: 0 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="text-sm p-6 mt-auto text-left w-fit">
        Rank:
        <div className="text-4xl mb-8 font-bold text-blue-500">
          {loading ? (
            <div className="animate-pulse bg-gray-300 h-12 w-20 rounded"></div>
          ) : (
            `#${userStats.rank || 0}`
          )}
        </div>
        Current Streak:
        <div className="text-4xl mb-8 font-bold text-yellow-500">
          {loading ? (
            <div className="animate-pulse bg-gray-300 h-12 w-20 rounded"></div>
          ) : (
            <>
              {userStats.streak || 0} <span className="text-lg font-normal">days</span>
            </>
          )}
        </div>
        Max Streak:
        <div className="text-4xl mb-8 font-bold text-green-500">
          {loading ? (
            <div className="animate-pulse bg-gray-300 h-12 w-20 rounded"></div>
          ) : (
            <>
              {userStats.maxStreak || 0} <span className="text-lg font-normal">days</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyStats;
