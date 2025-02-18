import axios from "axios";
import { User, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

function Friends() {
  const [suggestedFriends, setUsers] = useState([]);
  const onlineFriends = [];
  const friendRequests = [
    {
      id: 1,
      name: "Alice Johnson",
      mutual: 2,
      bio: "Loves design and art. Available for a study session!",
    },
    {
      id: 2,
      name: "Bob Smith",
      mutual: 1,
      bio: "Computer science major and coding enthusiast.",
    },
  ];
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const addFriend = async (friendId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/friends/${friendId}`,
        null,
        getAuthHeader()
      );
      console.log('response:', response.data.message);
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/friends/add-new", getAuthHeader())
      .then((response) => {
        setUsers((prevUsers) => {
          return JSON.stringify(prevUsers) !== JSON.stringify(response.data)
            ? response.data
            : prevUsers;
        });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [suggestedFriends]);

  return (
    <aside className="pr-1 space-y-6">
      {/* Online Friends */}
      <section>
        <h2 className="text-xl font-bold mb-4">Online Friends</h2>
        {onlineFriends.length > 0 ? (
          <div className="flex space-x-4 overflow-x-auto">
            {onlineFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex flex-col items-center bg-gray-800 p-4 rounded-3xl shadow transition-colors min-w-[150px]"
              >
                <div className="p-2 bg-purple-500 rounded-full">
                  <User className="w-10 h-10" />
                </div>
                <h4 className="mt-2 text-sm font-medium text-center">
                  {friend.name}
                </h4>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No online friends.</p>
        )}
      </section>

      {/* Friend Requests */}
      <section className="bg-gray-800 rounded-3xl p-4">
        {friendRequests.length > 0 ? (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold ">Friend Requests</h3>
            {friendRequests.map((request) => (
              <div key={request.id} className="">
                <div className="flex items-center mt-4">
                  <div className="p-2 bg-gray-700 rounded-full">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">{request.name}</h4>
                    <p className=" text-sm text-gray-400 line-clamp-1">
                      {request.bio}
                    </p>
                  </div>
                </div>

                <div className="m-4 flex space-x-3">
                  <button className="flex-1 border border-gray-700 hover:bg-red-500 text-red-400 hover:text-white text-sm px-3 py-1 rounded-lg flex items-center justify-center gap-1 transition">
                    Decline
                  </button>
                  <button className="flex-1 border border-gray-600 hover:bg-purple-600 text-white text-sm px-3 py-1 rounded-lg flex items-center justify-center gap-1 transition">
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No friend requests.</p>
        )}
      </section>

      {/* Suggested Friends */}
      {suggestedFriends.length > 0 && (
        <section className="bg-gray-800 rounded-3xl p-4">
          <h3 className="text-xl font-semibold ">Suggested Friends</h3>
          <div className="space-y-4">
            {suggestedFriends.map((user) => (
              <div key={user.id} className="!mt-7">
                <div className="flex items-center">
                  {user.ProfilePicture ? (
                    <img
                      src={user.ProfilePicture}
                      className="w-9 h-9 rounded-full"
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
                <div className="m-4 ">
                  <button
                    onClick={() => addFriend(user._id)}
                    className="w-full border border-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition"
                  >
                    <UserPlus className="w-5 h-5" />
                    Add friend
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </aside>
  );
}

export default Friends;
