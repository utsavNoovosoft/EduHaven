import { User, UserPlus, Activity } from "lucide-react";

function Friends({
  onlineFriends = ["sedf"],
  friendRequests = [],
  suggestedFriends = [],
}) {
  return (
    <section className="max-w-3xl mx-auto p-4 space-y-8">
      {/* Online Friends */}
      <div>
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
      </div>

      {/* Friend Requests */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Friend Requests</h3>
        {friendRequests.length > 0 ? (
          <div className="space-y-4">
            {friendRequests.map((request) => (
              <div key={request.id} className="bg-gray-800 p-4 rounded-3xl">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-700 rounded-full">
                    <User className="w-10 h-10" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">{request.name}</h4>
                    <p className=" text-sm text-gray-400 line-clamp-1">
                      {request.bio}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex space-x-2">
                  <button className="flex-1 border border-gray-700 hover:bg-red-500 text-red-400 hover:text-white text-sm px-3 py-1 rounded-lg flex items-center justify-center gap-1 transition">
                    Decline
                  </button>
                  <button className="flex-1 border border-gray-600 hover:bg-purple-600 text-white text-sm px-3 py-1 rounded-lg flex items-center justify-center gap-1 transition">
                    <Activity className="w-5 h-5" />
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No friend requests.</p>
        )}
      </div>

      {/* Suggested Friends */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Suggested Friends</h3>
        {suggestedFriends.length > 0 ? (
          <div className="space-y-4">
            {suggestedFriends.map((user) => (
              <div key={user.id} className="bg-gray-800 p-4 rounded-3xl ">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-700 rounded-full">
                    <User className="w-10 h-10" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">{user.name}</h4>
                    <p className=" text-sm text-gray-400 line-clamp-1">
                      {user.bio}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <button className="w-full border border-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1 rounded flex items-center justify-center gap-1 transition">
                    <UserPlus className="w-5 h-5" />
                    Add friend
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No suggestions available.</p>
        )}
      </div>
    </section>
  );
}

export default Friends;
