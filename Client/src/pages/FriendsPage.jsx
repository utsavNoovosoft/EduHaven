import { useState, useEffect } from "react";
import axios from "axios";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css'; 

const backendUrl = import.meta.env.VITE_API_URL;

function FriendsPage() {
  const [selectedTab, setSelectedTab] = useState("suggested");
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const sendRequest = async (friendId) => {
    try {
      const response = await axios.post(
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
      toast.success("Friend request sent!"); 
    } catch (error) {
      console.error("Error adding friend:", error.response.data);
      toast.error("Error sending friend request!"); 
    }
  };

  const cancelRequest = async (friendId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/friends/sent-requests/${friendId}`,
        getAuthHeader()
      );
      console.log(response.data.message);
      setSentRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== friendId)
      );
      toast.info("Friend request canceled."); 
    } catch (error) {
      console.error("Error canceling friend request:", error.response?.data || error.message);
      toast.error("Error canceling friend request!"); 
    }
  };

  const rejectRequest = async (friendId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/friends/reject/${friendId}`,
        getAuthHeader()
      );
      console.log(response.data.message);
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== friendId)
      );
      toast.error("Friend request rejected."); 
    } catch (error) {
      console.error("Error rejecting friend request:", error.response?.data || error.message);
      toast.error("Error rejecting friend request!"); 
    }
  };

  const acceptRequest = async (friendId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/friends/accept/${friendId}`,
        null,
        getAuthHeader()
      );
      console.log(response.data.message);
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== friendId)
      );
      setAllFriends((prevFriends) => [
        ...prevFriends,
        { ...friendRequests.find((user) => user._id === friendId) },
      ]);
      toast.success("Friend request accepted!"); 
    } catch (error) {
      console.error("Error accepting friend request:", error.response?.data || error.message);
      toast.error("Error accepting friend request!"); 
    }
  };

  const removeFriend = async (friendId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/friends/${friendId}`,
        getAuthHeader()
      );
      console.log(response.data.message);
      setAllFriends((prevFriends) =>
        prevFriends.filter((friend) => friend._id !== friendId)
      );
      toast.success("Friend removed!"); 
    } catch (error) {
      console.error("Error removing friend:", error.response?.data || error.message);
      toast.error("Error removing friend!");
    }
  };

  const fetchData = (tab) => {
    setLoading(true); // Start loading
    switch (tab) {
      case "suggested":
        axios
          .get(`${backendUrl}/friends/friend-suggestions`, getAuthHeader())
          .then((response) => {
            setSuggestedFriends(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching suggested friends:", error);
            setLoading(false); 
          });
        break;
      case "friendRequests":
        axios
          .get(`${backendUrl}/friends/requests`, getAuthHeader())
          .then((response) => {
            setFriendRequests(response.data);
            setLoading(false); 
          })
          .catch((error) => {
            console.error("Error fetching friend requests:", error);
            setLoading(false); 
          });
        break;
      case "sentRequests":
        axios
          .get(`${backendUrl}/friends/sent-requests`, getAuthHeader())
          .then((response) => {
            setSentRequests(response.data);
            setLoading(false); 
          })
          .catch((error) => {
            console.error("Error fetching sent requests:", error);
            setLoading(false); 
          });
        break;
      case "allFriends":
        axios
          .get(`${backendUrl}/friends`, getAuthHeader())
          .then((response) => {
            setAllFriends(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching all friends:", error);
            setLoading(false);
          });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchData(selectedTab);
  }, [selectedTab]);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const renderUserCard = (user) => (
    <div key={user._id} className="bg-white p-4 rounded-xl shadow-md mb-4">
      <div className="flex items-center">
        <img
          src={user.ProfilePicture}
          alt="Profile"
          className="w-14 h-14 rounded-full"
        />
        <div className="ml-4 flex-1">
          <h4 className="text-lg font-semibold">{`${user.FirstName} ${user.LastName || ""}`}</h4>
          <p className="text-sm text-gray-500">{user.Bio}</p>
        </div>
      </div>
      <div className="mt-3">
        {selectedTab === "suggested" && !user.requestSent && (
          <button
            onClick={() => sendRequest(user._id)}
            className="w-full bg-ter text-sm px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition hover:bg-[var(--btn-hover)] txt"
          >
            <UserPlus className="w-5 h-5" />
            Add Friend
          </button>
        )}
        {selectedTab === "friendRequests" && (
          <div className="flex gap-2">
            <button
              onClick={() => acceptRequest(user._id)}
              className="w-1/2 bg-green-500 text-sm px-3 py-1.5 rounded-lg transition hover:bg-green-600 txt"
            >
              Accept
            </button>
            <button
              onClick={() => rejectRequest(user._id)}
              className="w-1/2 bg-red-500 text-sm px-3 py-1.5 rounded-lg transition hover:bg-red-600 txt"
            >
              Reject
            </button>
          </div>
        )}
        {selectedTab === "sentRequests" && (
          <button
            onClick={() => cancelRequest(user._id)}
            className="w-full bg-yellow-500 text-sm px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition hover:bg-yellow-600 txt"
          >
            Cancel Request
          </button>
        )}
        {selectedTab === "allFriends" && (
          <button
            onClick={() => removeFriend(user._id)}
            className="w-full bg-red-500 text-sm px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition hover:bg-red-600 txt"
          >
            Remove Friend
          </button>
        )}
      </div>
    </div>
  );

  const renderEmptyMessage = () => (
    <div className="text-center text-gray-500">
      <p>Nothing to display</p>
    </div>
  );

  const renderLoadingMessage = () => (
    <div className="text-center text-gray-500">
      <p>Loading...</p>
    </div>
  );

  return (
    <div className="flex">
      {/* Left Tab Navigation */}
      <div className="w-1/4 bg-gray-100 p-4 rounded-xl mr-6">
        <h3 className="text-xl font-semibold mb-4">Friends</h3>
        <div className="space-y-2">
          <button
            onClick={() => handleTabClick("suggested")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              selectedTab === "suggested" ? "bg-blue-100" : "hover:bg-gray-200"
            }`}
          >
            Suggested
          </button>
          <button
            onClick={() => handleTabClick("friendRequests")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              selectedTab === "friendRequests" ? "bg-blue-100" : "hover:bg-gray-200"
            }`}
          >
            Friend Requests
          </button>
          <button
            onClick={() => handleTabClick("sentRequests")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              selectedTab === "sentRequests" ? "bg-blue-100" : "hover:bg-gray-200"
            }`}
          >
            Sent Requests
          </button>
          <button
            onClick={() => handleTabClick("allFriends")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              selectedTab === "allFriends" ? "bg-blue-100" : "hover:bg-gray-200"
            }`}
          >
            All Friends
          </button>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="w-3/4 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          {selectedTab === "suggested"
            ? "Suggested Friends"
            : selectedTab === "friendRequests"
            ? "Friend Requests"
            : selectedTab === "sentRequests"
            ? "Sent Requests"
            : "All Friends"}
        </h2>
        <div className="space-y-4">
          {loading ? (
            renderLoadingMessage() 
          ) : (
            <>
              {selectedTab === "suggested" &&
                (suggestedFriends.length > 0 ? (
                  suggestedFriends.map(renderUserCard)
                ) : (
                  renderEmptyMessage()
                ))}
              {selectedTab === "friendRequests" &&
                (friendRequests.length > 0 ? (
                  friendRequests.map(renderUserCard)
                ) : (
                  renderEmptyMessage()
                ))}
              {selectedTab === "sentRequests" &&
                (sentRequests.length > 0 ? (
                  sentRequests.map(renderUserCard)
                ) : (
                  renderEmptyMessage()
                ))}
              {selectedTab === "allFriends" &&
                (allFriends.length > 0 ? (
                  allFriends.map(renderUserCard)
                ) : (
                  renderEmptyMessage()
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FriendsPage;
