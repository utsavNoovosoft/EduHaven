import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ProfileCard from "../components/stats/ProfileCard";
import MonthlyLevel from "../components/stats/MonthlyLevel";
import Achievements from "../components/stats/Achievements";
import Badges from "../components/stats/Badges";
import StudyStats from "../components/stats/StudyStats";
import Goals from "../components/stats/Goals";
import Leaderboard from "../components/stats/Leaderboard";
import Test from "../components/stats/Test.jsx";

const backendUrl = import.meta.env.VITE_API_URL;

const Stats = () => {
  const { userId } = useParams(); // Get userId from URL parameters
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine if we're showing current user or another user
  const isOwnProfile = !userId;

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        let targetUserId;
        
        if (isOwnProfile) {
          // For /stats route, get current user's ID from JWT
          const decoded = jwtDecode(token);
          targetUserId = decoded.id;
        } else {
          // For /stats/:userId route, use the userId from params
          targetUserId = userId;
        }

        const response = await axios.get(
          `${backendUrl}/user/details?id=${targetUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to fetch user data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, isOwnProfile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-3xl shadow-2xl p-6 w-full max-w-sm animate-pulse">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-700 rounded-full mb-4"></div>
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  // Determine the title and subtitle based on whether it's own profile or not
  const title = isOwnProfile ? "Analytics" : `${user?.FirstName} ${user?.LastName}`;
  const subtitle = isOwnProfile ? "Great! keep it up" : null;

  return (
    <div className="m-6">
      {/* Header with dynamic title */}
      {isOwnProfile ? (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{subtitle}</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center my-6 group">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-400 drop-shadow-lg cursor-pointer">
            {title}
          </h1>
          <div className="mt-3 mb-3 h-1 w-48 rounded-full bg-gradient-to-r from-purple-500 via-indigo-400 to-blue-500 transition-all duration-300 ease-in-out group-hover:w-2/4 shadow-md" />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-6 w-full content-center">
        <ProfileCard userId={userId} user={user} isOwnProfile={isOwnProfile} />
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
              <div className="gap-6 mb-6">
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