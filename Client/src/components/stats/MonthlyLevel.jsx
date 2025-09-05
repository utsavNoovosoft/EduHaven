import axiosInstance from "@/utils/axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MonthlyLevel = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const levels = [
    { name: "Bronze", min: 0, max: 10, color: "#cd7f32" },
    { name: "Silver", min: 10, max: 30, color: "#c0c0c0" },
    { name: "Gold", min: 30, max: 60, color: "#ffd700" },
    { name: "Platinum", min: 60, max: 100, color: "#1f75fe" },
    { name: "Diamond", min: 100, max: 150, color: "#00e5ff" },
    { name: "Emerald", min: 150, max: Infinity, color: "#50c878" },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get(
          "/study-sessions/stats?period=monthly"
        );
        setStats(res.data.periodData?.[0] || null);
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-[var(--bg-sec)] rounded-3xl shadow-md p-6 flex items-center justify-center w-full">
        <p>Loading...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-[var(--bg-sec)] rounded-3xl shadow-md p-6 flex items-center justify-center w-full">
        <p className="text-red-400">No data available</p>
      </div>
    );
  }

  const totalHours = stats.totalHours || 0;

  const currentLevel =
    levels.find((lvl) => totalHours >= lvl.min && totalHours < lvl.max) ||
    levels[levels.length - 1];

  const nextLevel = levels[levels.indexOf(currentLevel) + 1];

  const progress = nextLevel
    ? ((totalHours - currentLevel.min) / (nextLevel.min - currentLevel.min)) *
      100
    : 100;

  const hoursNeeded = nextLevel ? nextLevel.min - totalHours : 0;

  return (
    <div className="bg-[var(--bg-sec)] rounded-3xl shadow-md p-6 flex flex-col w-full">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold mb-4 txt">Monthly Level</h3>
        <p className="txt-dim">Total: {totalHours.toFixed(1)} h</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-28 h-28 flex items-center justify-center mb-4">
          <img
            src={`/EduhavenBadges/${currentLevel.name.toLowerCase()}Badge.svg`}
            alt={currentLevel.name}
            className="object-contain w-full h-full"
          />
        </div>
        <div className="flex flex-col">
          <p
            className="font-extralight text-5xl font-poppins"
            style={{ color: currentLevel.color }}
          >
            {currentLevel.name}
          </p>
          <p className="text-md mb-2 txt-dim">
            {nextLevel
              ? `${hoursNeeded.toFixed(1)} hrs to ${nextLevel.name}`
              : "Max level reached 🎉"}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full">
        <div className="h-10 bg-primary rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              backgroundColor: currentLevel.color,
            }}
          ></motion.div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyLevel;
