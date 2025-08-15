import { useState, useEffect } from "react";
import { Award, Trophy, Star, Target, Users, Calendar, BookOpen, Zap, Flame } from "lucide-react";
import axios from "axios";

const Badges = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_API_URL;

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await axios.get(`${backendUrl}/user/stats`, getAuthHeader());
        setBadges(response.data.badges || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching badges:", error);
        setError("Failed to load badges");
        setLoading(false);
      }
    };

    fetchBadges();
  }, [backendUrl]);

  const getBadgeIcon = (badgeName) => {
    switch (badgeName) {
      case "Week Warrior":
        return <Flame className="w-8 h-8 text-orange-500" />;
      case "Monthly Master":
        return <Star className="w-8 h-8 text-yellow-500" />;
      case "Study Champion":
        return <BookOpen className="w-8 h-8 text-blue-500" />;
      case "Time Titan":
        return <Target className="w-8 h-8 text-purple-500" />;
      case "Social Butterfly":
        return <Users className="w-8 h-8 text-pink-500" />;
      case "Networker":
        return <Zap className="w-8 h-8 text-green-500" />;
      case "Consistent Learner":
        return <Calendar className="w-8 h-8 text-indigo-500" />;
      case "Dedicated Student":
        return <Trophy className="w-8 h-8 text-yellow-600" />;
      default:
        return <Award className="w-8 h-8 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-[var(--bg-sec)] rounded-3xl shadow-lg p-6 w-full">
        <h3 className="text-xl font-bold mb-4 text-center">Badges Earned</h3>
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center animate-pulse">
              <div className="w-8 h-8 bg-gray-300 rounded-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--bg-sec)] rounded-3xl shadow-lg p-6 w-full">
        <h3 className="text-xl font-bold mb-4 text-center">Badges Earned</h3>
        <div className="text-center">
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="bg-[var(--bg-sec)] rounded-3xl shadow-lg p-6 w-full">
        <h3 className="text-xl font-bold mb-4 text-center">Badges Earned</h3>
        <div className="text-center text-gray-500">
          <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium">No badges yet</p>
          <p className="text-sm">Keep studying to earn your first badge!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-sec)] rounded-3xl shadow-lg p-6 w-full">
      <h3 className="text-xl font-bold mb-4 text-center">
        Badges Earned ({badges.length})
      </h3>
      <div className="grid grid-cols-5 gap-4">
        {badges.map((badge) => (
          <div key={badge.id} className="flex flex-col items-center group relative">
            <div className="transition-transform duration-200 group-hover:scale-110">
              {getBadgeIcon(badge.name)}
            </div>
            <p className="text-xs mt-1 text-center group-hover:text-blue-400 transition-colors">
              {badge.name}
            </p>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              {badge.description}
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress indicator */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          {badges.length} of 8 badges earned
        </p>
        <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(badges.length / 8) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Badges;
