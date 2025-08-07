import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUserStats } from "../contexts/UserStats";
import OtherUserProfileCard from "../components/stats/OtherUserProfileCard";
import MonthlyLevel from "../components/stats/MonthlyLevel";
import Achievements from "../components/stats/Achievements";
import Badges from "../components/stats/Badges";
import StudyStats from "../components/stats/StudyStats";
import Goals from "../components/stats/Goals";
import Leaderboard from "../components/stats/Leaderboard";
import Test from "../components/stats/Test.jsx";
import AdCard from "@/components/AdCard";

const OtherUserProfile = () => {
  const { userId } = useParams();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserStats = async () => {
      try {
        const res = await fetchUserStats(userId);

        const mappedStats = {
          name: `${res.userInfo.firstName} ${res.userInfo.lastName}`,
          bio: res.userInfo.bio,
          profilePicture: res.userInfo.profilePicture,
          studyStats: {
            totalSessions: res.stats.totalSessions,
            totalHours: res.stats.totalHours,
            streak: res.stats.streak,
            lastActive: res.stats.lastActive,
          },
          monthlyLevel: res.stats.monthlyLevel || {},
          achievements: res.stats.achievements || [],
          badges: res.stats.badges || [],
          goals: res.stats.goals || [],
          leaderboard: res.stats.leaderboard || [],
          testData: res.stats.testData || {},
        };

        setUserStats(mappedStats);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserStats();
  }, [userId]);

  if (loading) return <div className="m-6">Loading profile...</div>;
  if (!userStats) return <div className="m-6">User not found or error loading profile.</div>;

  return (
    <div className="m-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{userStats.name}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full content-center">
        <div className="lg:w-[20%] min-w-72 space-y-6">
          <OtherUserProfileCard user={userStats} />
          <div className="h-auto w-full rounded-3xl bg-sec p-5 space-y-4">
            <AdCard />
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-6">
            <StudyStats stats={userStats.studyStats} />
          </div>
          <div className="flex flex-col xl:flex-col 2xl:flex-row">
            <div className="flex-1 mr-6">
              <div className="flex gap-6 mb-6">
                <MonthlyLevel data={userStats.monthlyLevel} />
                <Badges data={userStats.badges} />
              </div>
              <div className="gap-6 mb-6">
                <Goals goals={userStats.goals} />
              </div>
            </div>
            <div>
              <Achievements data={userStats.achievements} />
              <Leaderboard data={userStats.leaderboard} />
            </div>
          </div>
        </div>
      </div>

      <Test data={userStats.testData} />
    </div>
  );
};

export default OtherUserProfile;
