const StudyStats = () => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col w-full">
      <h3 className="text-xl font-bold text-center mb-3">Study Stats</h3>
      <div className="flex justify-around">
        <div className="flex flex-col items-center">
          <p className="text-2xl font-semibold">3.5</p>
          <span className="text-sm text-gray-400">Hours Today</span>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-2xl font-semibold">24</p>
          <span className="text-sm text-gray-400">Days Streak</span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-300 mb-1">Weekly Progress</p>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500" style={{ width: "60%" }}></div>
        </div>
        <p className="text-xs text-gray-400 mt-1">60% completed</p>
      </div>
    </div>
  );
};

export default StudyStats;
