import { useState, useEffect } from "react";
import axios from "axios";

const MonthlyLevel = () => {
  const [monthlyData, setMonthlyData] = useState({
    currentLevel: 1,
    xp: 0,
    xpInCurrentLevel: 0,
    xpNeededForNextLevel: 100,
    progressPercentage: 0,
    totalSessions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_API_URL;

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/user/stats`, getAuthHeader());
        setMonthlyData(response.data.monthlyLevel);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching monthly data:", error);
        setError("Failed to load monthly data");
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="bg-[var(--bg-sec)] rounded-3xl shadow-lg p-6 flex flex-col items-center w-full">
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-6 bg-gray-300 rounded w-32"></div>
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="h-3 bg-gray-300 rounded-full w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-32"></div>
          <div className="grid grid-cols-2 gap-2 w-full">
            <div className="h-16 bg-gray-300 rounded-md"></div>
            <div className="h-16 bg-gray-300 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--bg-sec)] rounded-3xl shadow-lg p-6 flex flex-col items-center w-full">
        <p className="text-red-400 text-sm mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-sec)] rounded-3xl shadow-lg p-6 flex flex-col items-center w-full">
      <h3 className="text-xl font-bold mb-2">Monthly Level</h3>
      <p className="mb-4">
        Level <span className="font-semibold">{monthlyData.currentLevel}</span>
      </p>
      <div className="w-full">
        <div className="h-3 bg-slate-500 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-500" 
            style={{ width: `${monthlyData.progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs mt-1 text-center">
          {monthlyData.progressPercentage}% to next level
        </p>
      </div>
      <div className="mt-4 w-full grid grid-cols-2 gap-2">
        <div className="bg-[var(--bg-ter)] rounded-md p-2 text-center">
          <p className="text-sm">XP</p>
          <p className="font-semibold">{monthlyData.xp}</p>
        </div>
        <div className="bg-[var(--bg-ter)] rounded-md p-2 text-center">
          <p className="text-sm">Needed</p>
          <p className="font-semibold">{monthlyData.xpNeededForNextLevel}</p>
        </div>
      </div>
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          {monthlyData.totalSessions} sessions this month
        </p>
      </div>
    </div>
  );
};

export default MonthlyLevel;
