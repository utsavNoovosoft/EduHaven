import { UserPlus } from "lucide-react";
import { useState } from "react";
import DefaultProfilePic from "../../assets/profilePic.avif";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

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
    <div className="bg-sec p-6 rounded-3xl flex-1 basis-[250px] max-w-sm">
      <Link
        to={`/user/${user._id}`}
        className="flex flex-col items-center justify-center hover:brightness-90 transition"
      >
        <img
          src={user.ProfilePicture || DefaultProfilePic}
          onError={(e) => (e.target.src = DefaultProfilePic)}
          alt="Profile"
          className="w-24 object-cover aspect-square rounded-full cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center px-2 gap-2 mt-2">
          <div className="text-2xl">
            {`${user.FirstName} ${user.LastName || ""}`}
          </div>
          <p
            className={`text-sm text-gray-500 mb-2 text-center h-10 overflow-hidden ${
              isExpanded ? "" : "line-clamp-2"
            }`}
          >
            {user.Bio}
          </p>
        </div>
      </Link>

      <div>
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

// PropTypes validation to fix linting errors
UserCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    FirstName: PropTypes.string,
    LastName: PropTypes.string,
    ProfilePicture: PropTypes.string,
    Bio: PropTypes.string,
    requestSent: PropTypes.bool
  }).isRequired,
  selectedTab: PropTypes.string.isRequired,
  onSendRequest: PropTypes.func,
  onCancelRequest: PropTypes.func,
  onAcceptRequest: PropTypes.func,
  onRejectRequest: PropTypes.func,
  onRemoveFriend: PropTypes.func
};

export default UserCard;
