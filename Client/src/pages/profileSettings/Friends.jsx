import { useEffect, useState } from "react";
import { User } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const Friends = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/friends",
        getAuthHeader()
      );
      // Add an `isRemoved` property to each friend (initially false)
      const friendsWithFlag = response.data.map((friend) => ({
        ...friend,
        isRemoved: false,
      }));
      setFriends(friendsWithFlag);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const removeFriend = async (friendId) => {
    try {
      await axios.delete(
        `http://localhost:3000/friends/${friendId}`,
        getAuthHeader()
      );
      // Instead of removing the friend from the list, mark it as removed
      setFriends(
        friends.map((friend) =>
          friend._id === friendId ? { ...friend, isRemoved: true } : friend
        )
      );
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Friends List</h1>
        <Link to={"/study-room"} className="hover:underline">
          Find friends
        </Link>
      </div>
      {friends.length === 0 ? (
        <p>No friends yet.</p>
      ) : (
        <ul className="space-y-2 min-w-[600px] rounded-2xl overflow-hidden">
          {friends.map((friend) => (
            <li
              key={friend._id}
              className="p-4 rounded-md flex justify-between bg-gray-800"
            >
              <div className="flex items-center gap-4">
                {friend.ProfilePicture ? (
                  <img
                    src={friend.ProfilePicture}
                    className="w-9 h-9 rounded-full"
                    alt="profile"
                  />
                ) : (
                  <div className="p-2 bg-gray-700 rounded-full">
                    <User className="w-7 h-7" />
                  </div>
                )}
                <h4 className="text-lg font-medium line-clamp-1">
                  {friend.FirstName
                    ? `${friend.FirstName} ${friend.LastName || ""}`
                    : "old-user"}
                </h4>
              </div>
              <button
                onClick={() => removeFriend(friend._id)}
                disabled={friend.isRemoved}
                className={`transition-colors duration-300 text-white px-3 py-1 rounded ${
                  friend.isRemoved
                    ? "bg-gray-700"
                    : "bg-gray-700 hover:bg-red-500"
                }`}
              >
                {friend.isRemoved ? "Friend Removed" : "Remove"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Friends;
