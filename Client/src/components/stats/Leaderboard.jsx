import { useState, useEffect } from "react";
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

const Leaderboard = () => {
  const [view, setView] = useState("weekly");
  const [friendsOnly, setFriendsOnly] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserId(payload.id);
    } catch (err) {
      console.error("Invalid token", err);
    }
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${backendUrl}/leaderboard?period=${view}&friendsOnly=${friendsOnly}`,
          getAuthHeader()
        );
        setTimeout(() => {
          setLeaderboard(res.data);
          setLoading(false);
        }, 300); 
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [friendsOnly, view]);

  const handleDropdownClick = (viewType) => setView(viewType);
  const handleFriendsOnlyToggle = () => setFriendsOnly((prev) => !prev);

  const currentUser = leaderboard.find((user) => user.userId === currentUserId);

  const getBadge = (rank) => {
    const baseBadgeStyle = `inline-flex items-center gap-1 rounded-full text-xs font-medium px-2 py-1`;

    switch (rank) {
      case 0:
        return (
          <span className={`${baseBadgeStyle} bg-[var(--btn)] text-white`}>
            🥇 <span>1st</span>
          </span>
        );
      case 1:
        return (
          <span className={`${baseBadgeStyle} bg-[var(--bg-sec)] text-[var(--txt)]`}>
            🥈 <span>2nd</span>
          </span>
        );
      case 2:
        return (
          <span className={`${baseBadgeStyle} bg-[var(--bg-ter)] text-[var(--txt)]`}>
            🥉 <span>3rd</span>
          </span>
        );
      default:
        return (
          <span className="text-[var(--txt-dim)] font-medium text-sm">
            {rank + 1}.
          </span>
        );
    }
  };

  return (
    <div className="p-6 w-full bg-[var(--bg-sec)] mx-auto shadow-2xl rounded-3xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3 ">
        <h2 className="text-3xl font-bold text-[var(--txt)]">Leaderboard</h2>

        <div className="flex items-center gap-4">
          {/* Timeframe Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-sm"
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}{" "}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white shadow-lg">
              {["daily", "weekly", "monthly"].map((period) => (
                <DropdownMenuItem
                  key={period}
                  onSelect={() => handleDropdownClick(period)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Friends Only Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Friends Only</span>
            <button
              onClick={handleFriendsOnlyToggle}
              className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
                friendsOnly ? "bg-[var(--btn)]" : "bg-[var(--bg-ter)]"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  friendsOnly ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Cards */}
      <div
        className={`space-y-3 transform transition-all duration-500 ${
          loading ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        {leaderboard.slice(0, 10).map((user, index) => {
          const isCurrentUser = user.userId === currentUserId;
          return (
            <div
              key={user.userId}
              className={`flex items-center justify-between px-5 py-4 rounded-xl transition-all border ${
                isCurrentUser
                  ? "bg-[var(--btn)] border-[var(--btn-hover)]"
                  : "bg-[var(--bg-primary)] hover:bg-[var(--bg-ter)] border-gray-200"
              }`}
            >
              {/* Username & Badge */}
              <div className="flex flex-col">
                <span className="font-semibold text-md text-[var(--txt)]">
                  {user.username}
                </span>
                {getBadge(index)}
              </div>

              <span className="text-sm font-medium text-[var(--txt-dim)]">
                {user.totalDuration} mins
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {currentUser && (
        <div className="mt-6 text-center text-lg font-semibold text-[var(--txt-dim)]">
          Your Position:{" "}
          {leaderboard.findIndex((u) => u.userId === currentUserId) + 1}{" "}
          ({currentUser.totalDuration} mins)
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
