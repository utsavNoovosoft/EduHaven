import { useEffect, useState } from "react";
import axios from "axios";
import { User, UserPlus, MoreVertical } from "lucide-react";

function SuggestedFriends({ onViewSentRequests }) {
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const sendRequest = async (friendId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/friends/request/${friendId}`,
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

  useEffect(() => {
    axios
      .get("http://localhost:3000/friends/friend-suggestions", getAuthHeader())
      .then((response) => {
        setSuggestedFriends(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  if (suggestedFriends.length === 0) return null;

  return (
    <section className="bg-gray-800 rounded-3xl p-4 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Suggested Friends</h3>
        <div className="relative">
          <button onClick={() => setShowDropdown(!showDropdown)}>
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-700 rounded-md shadow-lg z-10">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  onViewSentRequests();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
              >
                Show Sent Requests
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {suggestedFriends
          .slice()
          .reverse()
          .map((user) => (
            <div key={user._id} className="!mt-7">
              <div className="flex items-center">
                {user.ProfilePicture ? (
                  <img
                    src={user.ProfilePicture}
                    className="w-9 h-9 rounded-full"
                    alt="Profile"
                  />
                ) : (
                  <div className="p-2 bg-gray-700 rounded-full">
                    <User className="w-7 h-7" />
                  </div>
                )}
                <div className="ml-4">
                  <h4 className="text-lg font-medium line-clamp-1">
                    {user.FirstName
                      ? `${user.FirstName} ${user.LastName || ""}`
                      : "old-user"}
                  </h4>
                  <p className="text-sm text-gray-400 line-clamp-1">
                    {user.Bio}
                  </p>
                </div>
              </div>
              <div className="m-4">
                {user.requestSent ? (
                  <button
                    disabled
                    className="w-full border border-gray-700 bg-gray-600 text-white text-sm px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition"
                  >
                    Request Sent
                  </button>
                ) : (
                  <button
                    onClick={() => sendRequest(user._id)}
                    className="w-full border border-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition"
                  >
                    <UserPlus className="w-5 h-5" />
                    Add Friend
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

export default SuggestedFriends;
