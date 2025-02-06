import ProfileCard from "./ProfileCard";
import MonthlyLevel from "./MonthlyLevel";
import Achievements from "./Achievements";
import Badges from "./Badges";
import StudyStats from "./StudyStats";
import Goals from "./Goals";
import Leaderboard from "./Leaderboard";

const Stats = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Anaylitics</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Great! keep it up</span>
        </div>
      </div>
      {/* content */}
      <div className="flex flex-col lg:flex-row gap-6 w-full content-center">
        <div>
          <ProfileCard />
        </div>
        <div className="flex-1 ">
          <div className="mb-6">
            <StudyStats />
          </div>
          <div className="flex gap-6 mb-6">
            <MonthlyLevel />
            <Badges />
          </div>
          <div className="flex gap-6 mb-6 flex-col xl:flex-col 2xl:flex-row">
            <Goals />
          </div>
        </div>
        <div>
          <Achievements />
          <Leaderboard />
        </div>
      </div>
    </>
  );
};

export default Stats;
