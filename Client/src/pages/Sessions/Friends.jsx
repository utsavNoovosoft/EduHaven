import { User, UserPlus, Activity } from "lucide-react";

function Friends({ friendRequests, suggestedFriends }) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6">Friends</h2>

      {/* Friend Requests */}
      <div>
        <h3 className="text-xl font-bold mb-4">Friend Requests</h3>
        {friendRequests.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {friendRequests.map((request) => (
              <div
                key={request.id}
                className="bg-gray-800 p-6 rounded-xl shadow-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-500 rounded-full">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold">{request.name}</h4>
                    <p className="text-sm text-gray-300">
                      {request.mutual} mutual friend
                      {request.mutual > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-gray-400 text-sm">{request.bio}</p>
                <button className="mt-3 w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <Activity className="w-5 h-5" />
                  Accept Request
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No friend requests at the moment.</p>
        )}
      </div>

      {/* Suggested Friends */}
      <div>
        <h3 className="text-xl font-bold mb-4">Suggested Friends</h3>
        {suggestedFriends.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {suggestedFriends.map((user) => (
              <div
                key={user.id}
                className="bg-gray-800 p-6 rounded-xl shadow-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-500 rounded-full">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold">{user.name}</h4>
                    <p className="text-sm text-gray-300">
                      {user.mutual} mutual friend
                      {user.mutual > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-gray-400 text-sm">{user.bio}</p>
                <button className="mt-3 w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  <UserPlus className="w-5 h-5" />
                  Add Friend
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">
            No friend suggestions available right now.
          </p>
        )}
      </div>
    </section>
  );
}

export default Friends;
