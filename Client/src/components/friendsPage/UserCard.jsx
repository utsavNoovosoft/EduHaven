import { UserPlus } from "lucide-react";
import { useState } from "react";
import DefaultProfilePic from "../../../public/profilePic.avif";
import { Link } from "react-router-dom";

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
    <div className="bg-sec rounded-3xl flex flex-col justify-between items-center max-w-xs w-full min-h-[340px] p-6">
      <Link
        to={`/user/${user._id}`}
        className="flex flex-col items-center justify-center w-full"
      >
        <img
          src={user.ProfilePicture || DefaultProfilePic}
          onError={(e) => (e.target.src = DefaultProfilePic)}
          alt="Profile"
          className="w-24 h-24 object-cover rounded-full mb-4"
        />
        <div className="flex flex-col items-center px-2 gap-2 text-center flex-grow">
          <div className="text-2xl font-semibold">{`${user.FirstName} ${user.LastName || ""}`}</div>
          <p className={`text-sm text-gray-500 ${isExpanded ? "" : "line-clamp-3"}`}>
            {user.Bio}
          </p>
          <div className="mt-2">
            {user.OtherDetails?.interests && (
              <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full inline-block">
                {user.OtherDetails.interests}
              </span>
            )}
          </div>
        </div>
      </Link>
      
      <div className="mt-6 w-full">
        {selectedTab === "suggested" && !user.requestSent && (
          <button
            onClick={() => onSendRequest(user._id)}
            className="w-full bg-[var(--btn)] text-sm px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition text-white hover:bg-[var(--btn-hover)] txt"
          >
            <UserPlus className="w-5 h-5" />
            Add Friend
          </button>
        )}

        {selectedTab === "friendRequests" && (
          <div className="flex gap-2">
            <button
              onClick={() => onAcceptRequest(user._id)}
              className="w-1/2 bg-[var(--btn)] text-white text-sm px-3 py-2 rounded-lg transition hover:bg-[var(--btn-hover)] txt"
            >
              Accept
            </button>
            <button
              onClick={() => onRejectRequest(user._id)}
              className="w-1/2 bg-[var(--btn)] text-sm text-white px-3 py-2 rounded-lg transition hover:bg-[var(--btn-hover)] txt"
            >
              Reject
            </button>
          </div>
        )}

        {selectedTab === "sentRequests" && (
          <button
            onClick={() => onCancelRequest(user._id)}
            className="w-full bg-[var(--btn)] text-sm text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition hover:bg-[var(--btn-hover)] txt"
          >
            Cancel Request
          </button>
        )}

        {selectedTab === "allFriends" && (
          <button
            onClick={() => onRemoveFriend(user._id)}
            className="w-full bg-[var(--btn)] text-sm text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition hover:bg-[var(--btn-hover)] txt"
          >
            Remove Friend
          </button>
        )}
      </div>
    </div>
  );
}

export default UserCard;
