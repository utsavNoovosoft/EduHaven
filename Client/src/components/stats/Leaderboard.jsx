import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const backendUrl = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const Leaderboard = ({ userId, isOwnProfile = true }) => {
  const [view, setView] = useState("weekly");
  const [isOpen, setIsOpen] = useState(false);
  const [friendsOnly, setFriendsOnly] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [targetUserId, setTargetUserId] = useState(null);

  // Theme state
  const [theme, setTheme] = useState({
    primary: "#ffffff",
    secondary: "#f0f0f0",
    tertiary: "#e0e0e0",
    text: "#000000",
    accent: "#000000",
  });

  // Load theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      try {
        setTheme(JSON.parse(storedTheme));
      } catch (err) {
        console.error("Failed to parse theme from localStorage", err);
      }
    }
  }, []);

  const getCurrentUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const base64Payload = token.split(".")[1];
      const payload = JSON.parse(atob(base64Payload));
      return payload.id;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };

  useEffect(() => {
    const currentId = getCurrentUserIdFromToken();
    setCurrentUserId(currentId);
    
    // Set target user ID based on context
    if (isOwnProfile) {
      setTargetUserId(currentId);
    } else {
      setTargetUserId(userId);
    }
  }, [userId, isOwnProfile]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Different API endpoints based on context
        let endpoint = `${backendUrl}/leaderboard?period=${view}`;
        
        if (isOwnProfile) {
          // For own profile, show full leaderboard with friends filter option
          endpoint += `&friendsOnly=${friendsOnly}`;
        } else {
          // For other user's profile, show leaderboard focused around that user
          endpoint += `&focusUserId=${targetUserId}`;
        }

        const res = await axios.get(endpoint, getAuthHeader());
        setLeaderboard(res.data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      }
    };

    if (targetUserId) {
      fetchLeaderboard();
    }
  }, [friendsOnly, view, targetUserId, isOwnProfile]);

  const handleDropdownClick = (viewType) => {
    setView(viewType);
    setIsOpen(false);
  };

  const handleFriendsOnlyToggle = () => {
    setFriendsOnly((prev) => !prev);
  };

  // Find the user we're focusing on (current user for own profile, target user for others)
  const focusUser = leaderboard.find((user) => user.userId === targetUserId);
  const currentUser = leaderboard.find((user) => user.userId === currentUserId);

  const getBadge = (rank) => {
    switch (rank) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `${rank + 1}.`;
    }
  };

  return (
    <div
      className="p-6 pl-0 rounded-3xl shadow-md text-center w-full"
      style={{
        backgroundColor: theme.secondary,
        color: theme.text,
      }}
    >
      <nav className="flex justify-between items-center pl-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <strong>Leaderboard</strong>
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex items-center gap-1"
              style={{
                backgroundColor: theme.tertiary,
                color: theme.text,
              }}
              onClick={() => setIsOpen(!isOpen)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}{" "}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          {isOpen && (
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDropdownClick("daily")}>
                Daily
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDropdownClick("weekly")}>
                Weekly
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDropdownClick("monthly")}>
                Monthly
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </nav>

      {/* Friends Only Toggle - only show for own profile */}
      {isOwnProfile && (
        <div className="mt-4 flex pl-6 items-center gap-2">
          <label className="text-sm" style={{ color: theme.text }}>
            Friends Only
          </label>
          <Button
            variant="outline"
            onClick={handleFriendsOnlyToggle}
            className="relative w-14 h-8 rounded-full px-0 border-2 transition-all duration-200"
            style={{
              backgroundColor: friendsOnly ? theme.accent : theme.tertiary,
              borderColor: friendsOnly ? theme.accent : theme.tertiary,
            }}
          >
            <span
              className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full transition-transform duration-200"
              style={{
                backgroundColor: theme.primary,
                transform: friendsOnly ? "translateX(24px)" : "translateX(0px)",
              }}
            ></span>
          </Button>
        </div>
      )}

      {/* Leaderboard */}
      <div className="mt-4">
        <ul
          className="rounded-lg overflow-hidden"
          style={{ backgroundColor: theme.primary }}
        >
          {leaderboard.slice(0, 10).map((user, index) => {
            const isCurrentUser = user.userId === currentUserId;
            const isFocusUser = user.userId === targetUserId;
            const shouldHighlight = isOwnProfile ? isCurrentUser : isFocusUser;

            return (
              <li
                key={user.userId}
                className="flex justify-between items-center py-3 px-5 transition-all duration-200"
                style={{
                  backgroundColor: shouldHighlight
                    ? theme.accent
                    : theme.secondary,
                  color: shouldHighlight ? theme.tertiary : theme.text,
                  fontWeight: shouldHighlight ? "600" : "normal",
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="w-6 text-right">{getBadge(index)}</span>
                  <span>{user.username}</span>
                </span>
                <span className="text-sm">{user.totalDuration} minutes</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* User Position Display */}
      {focusUser && (
        <div className="mt-4 text-lg font-semibold">
          {isOwnProfile ? "Your" : `${focusUser.username}'s`} Position:{" "}
          {leaderboard.findIndex((u) => u.userId === targetUserId) + 1} -{" "}
          ({focusUser.totalDuration} minutes)
        </div>
      )}

      {/* Additional context for viewing other user's profile */}
      {!isOwnProfile && currentUser && (
        <div className="mt-2 text-sm" style={{ color: theme.text + "80" }}>
          Your Position:{" "}
          {leaderboard.findIndex((u) => u.userId === currentUserId) + 1} -{" "}
          ({currentUser.totalDuration} minutes)
        </div>
      )}
    </div>
  );
};

Leaderboard.propTypes = {
  userId: PropTypes.string,
  isOwnProfile: PropTypes.bool,
};

Leaderboard.defaultProps = {
  userId: null,
  isOwnProfile: true,
};

export default Leaderboard;