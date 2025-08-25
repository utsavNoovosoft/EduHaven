import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axios";
import { User, UserPlus, MoreVertical } from "lucide-react";
const backendUrl = import.meta.env.VITE_API_URL;

function SuggestedFriends({ onViewSentRequests }) {
  const navigate = useNavigate();
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdrownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdrownRef.current &&
        !dropdrownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const sendRequest = async (friendId) => {
    try {
      const response = await axiosInstance.post(
        `${backendUrl}/friends/request/${friendId}`,
        null,
        getAuthHeader()
      );
      console.log("Response:", response.data.message);
      setSuggestedFriends((prevUsers) =>
        prevUsers.map((user) =>
          user._id === friendId ? { ...user, requestSent: true } : user
        )
      );
    } catch (error) {
      console.error("Error adding friend:", error.response.data);
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/user/${userId}`);
  };

  useEffect(() => {
    axiosInstance
      .get(`${backendUrl}/friends/friend-suggestions`, getAuthHeader())
      .then((response) => {
        setSuggestedFriends(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  if (suggestedFriends.length === 0) return null;

  // Limit to the first 15 results
  const limitedFriends = suggestedFriends.slice(0, 15);

  return (
    <section className="bg-sec rounded-3xl p-4 relative ">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold txt">Suggested Friends</h3>
        <div className="relative" ref={dropdrownRef}>
          <button onClick={() => setShowDropdown(!showDropdown)}>
            <MoreVertical className="w-5 h-5 txt" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-ter rounded-md shadow-lg z-10">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  onViewSentRequests();
                }}
                className="block w-full text-left px-4 py-2 text-sm txt hover:bg-sec"
                style={{ borderColor: "var(--txt-dim)" }}
              >
                Show Sent Requests
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {limitedFriends
          .slice()
          .reverse()
          .map((user) => (
            <div key={user._id} className=" relative group py-1 bg-slate-400">
              <div className="flex items-center">
                <Link to={`/user/${user._id}`}>
                  {user.ProfilePicture ? (
                    <img
                      src={user.ProfilePicture}
                      className="w-11 h-11 rounded-full transition hover:brightness-90 cursor-pointer"
                      alt="Profile"
                    />
                  ) : (
                    <div className="p-2 bg-ter rounded-full transition hover:brightness-90 cursor-pointer">
                      <User className="w-7 h-7" />
                    </div>
                  )}
                </Link>
                <div className="ml-4 flex-1 overflow-hidden">
                  <Link
                    to={`/user/${user._id}`}
                    className="text-lg font-medium line-clamp-1 txt hover:underline"
                  >
                    {user.FirstName
                      ? `${user.FirstName} ${user.LastName || ""}`
                      : "old-user"}
                  </Link>
                  <p className="text-sm txt-dim line-clamp-1">{user.Bio}</p>
                </div>
              </div>
              <div className="absolute top-[8%] right-0 bg-sec p-1.5 px-2 transition-all opacity-0 group-hover:opacity-100 flex gap-2">
                <button
                  onClick={() => handleViewProfile(user._id)}
                  className="bg-ter text-sm px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition hover:bg-[var(--btn-hover)] txt"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                {user.requestSent ? (
                  <button
                    disabled
                    className="border border-gray-500/50 text-sm px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition bg-sec txt"
                  >
                    Request Sent
                  </button>
                ) : (
                  <button
                    onClick={() => sendRequest(user._id)}
                    className="bg-ter text-sm px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition hover:bg-[var(--btn-hover)] txt"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
      {/* Find More Users Link */}
      {suggestedFriends.length > 15 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/friends")}
            className="text-sm text-blue-500 hover:underline"
          >
            Find More Users
          </button>
        </div>
      )}
    </section>
  );
}

export default SuggestedFriends;
