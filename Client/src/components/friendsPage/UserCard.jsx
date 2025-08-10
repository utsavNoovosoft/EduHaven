import { UserPlus } from "lucide-react";

function UserCard({
  user,
  selectedTab,
  onSendRequest,
  onCancelRequest,
  onAcceptRequest,
  onRejectRequest,
  onRemoveFriend,
}) {
  return (
    <div className="bg-[var(--bg-ter)] p-4 rounded-xl shadow-md mb-4">
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
            onClick={() => onSendRequest(user._id)}
            className="w-full bg-[var(--btn)] text-sm px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition text-white hover:bg-[var(--btn-hover)] txt"
          >
            <UserPlus className="w-5 h-5" />
            Add Friend
          </button>
        )}

        {selectedTab === "friendRequests" && (
          <div className="flex gap-2">
            <button
              onClick={() => onAcceptRequest(user._id)}
              className="w-1/2 bg-[var(--btn)] text-white text-sm px-3 py-1.5 rounded-lg transition hover:bg-[var(--btn-hover)] txt"
            >
              Accept
            </button>
            <button
              onClick={() => onRejectRequest(user._id)}
              className="w-1/2 bg-[var(--btn)] text-sm text-white px-3 py-1.5 rounded-lg transition hover:bg-[var(--btn-hover)] txt"
            >
              Reject
            </button>
          </div>
        )}

        {selectedTab === "sentRequests" && (
          <button
            onClick={() => onCancelRequest(user._id)}
            className="w-full bg-[var(--btn)] text-sm text-white px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition hover:bg-[var(--btn-hover)] txt"
          >
            Cancel Request
          </button>
        )}

        {selectedTab === "allFriends" && (
          <button
            onClick={() => onRemoveFriend(user._id)}
            className="w-full bg-[var(--btn)] text-sm text-white px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition hover:bg-[var(--btn-hover)] txt"
          >
            Remove Friend
          </button>
        )}
      </div>
    </div>
  );
}

export default UserCard;
