import ProfileCard from "../components/stats/ProfileCard";
import MonthlyLevel from "../components/stats/MonthlyLevel";
import Achievements from "../components/stats/Achievements";
import Badges from "../components/stats/Badges";
import StudyStats from "../components/stats/StudyStats";
import Goals from "../components/stats/Goals";
import Leaderboard from "../components/stats/Leaderboard";
import Test from "../components/stats/Test.jsx";

const Stats = () => {
  return (
    <div className="m-6 ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Anaylitics</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Great! keep it up</span>
        </div>
      </div>
      {/* content */}
      <div className="flex flex-col lg:flex-row gap-6 w-full content-center">
        <ProfileCard />
        <div className="flex-1">
          <div className="mb-6">
            <StudyStats />
          </div>
          <div className="flex flex-col xl:flex-col 2xl:flex-row">
            <div className="flex-1 mr-6">
              <div className="flex gap-6 mb-6">
                <MonthlyLevel />
                <Badges />
              </div>
              <div className=" gap-6 mb-6 ">
                <Goals />
              </div>
            </div>
            <div>
              <Achievements />
              <Leaderboard />
            </div>
          </div>
        </div>
      </div>
      <Test />
    </div>
  );
};

export default Stats;
