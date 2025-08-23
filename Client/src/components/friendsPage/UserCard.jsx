import { UserPlus } from "lucide-react";
import { useState } from "react";

function UserCard({
  user,
  selectedTab,
  onSendRequest,
  onCancelRequest,
  onAcceptRequest,
  onRejectRequest,
  onRemoveFriend,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[var(--bg-ter)] py-8 px-4 rounded-xl shadow-md">
      {/* {console.log(user)} */}
      <div className="flex flex-col  items-center justify-center">
        <img
          src={user.ProfilePicture}
          alt="Profile"
          className="w-18 aspect-square border rounded-full"
        />
        <div className="flex flex-col items-center justify-center px-2 gap-2 mt-2">
          <h4 className="text-2xl font-semibold">{`${user.FirstName} ${user.LastName || ""}`}</h4>
          <p className={`text-sm text-gray-500 ${isExpanded? "":"line-clamp-3"}`}>{user.Bio}</p>

          <div className="mt-2">
            {user.OtherDetails?.interests && (
              <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full inline-block">
                {user.OtherDetails.interests  }
              </span>
            ) }
          </div>
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
