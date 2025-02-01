// import { Fire } from "lucide-react";

const StreakInfo = () => {
  return (
    <>
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center w-full">
        <p className="mt-2 text-gray-300">
          Current Streak:{" "}
          <span className="font-semibold text-white">30 days</span>
        </p>
      </div>
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center w-full">
        <p className="text-gray-300">
          Max Streak: <span className="font-semibold text-white">45 days</span>
        </p>
      </div>
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center w-full">
        <p className="text-gray-300">
          Games played: <span className="font-semibold text-white">15 days</span>
        </p>
      </div>
    </>
  );
};

export default StreakInfo;