import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="bg-[var(--bg-ter)] p-4 rounded-xl shadow-md">
      {/* {console.log(user)} */}
      <div className="flex items-center">
        <img
          src={user.ProfilePicture}
          alt="Profile"
          className="w-14 h-14 rounded-full"
        />
        <div className="ml-4 flex-1">
          <h4 className="text-lg font-semibold">{`${user.FirstName} ${user.LastName || ""}`}</h4>
          <p className="text-sm text-gray-500">{user.Bio}</p>

          <div className="mt-2">
            {user.OtherDetails?.interests ? (
              <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full inline-block">
                {user.OtherDetails.interests  }
              </span>
            ) : (
              <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-full inline-block">
                No interests available
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3">
        {selectedTab === "suggested" && !user.requestSent && (
          <Button
            onClick={() => onSendRequest(user._id)}
            variant="primary"
            className="w-full bg-[var(--btn)] text-sm px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition text-white hover:bg-[var(--btn-hover)] txt"
          >
            <UserPlus className="w-5 h-5" />
            Add Friend
          </Button>
        )}

        {selectedTab === "friendRequests" && (
          <div className="flex gap-2">
            <Button
              onClick={() => onAcceptRequest(user._id)}
              variant="primary"
              className="w-1/2 bg-[var(--btn)] text-white text-sm px-3 py-1.5 rounded-lg transition hover:bg-[var(--btn-hover)] txt"
            >
              Accept
            </Button>
            <Button
              onClick={() => onRejectRequest(user._id)}
              variant="danger"
              className="w-1/2 bg-[var(--btn)] text-sm text-white px-3 py-1.5 rounded-lg transition hover:bg-[var(--btn-hover)] txt"
            >
              Reject
            </Button>
          </div>
        )}

        {selectedTab === "sentRequests" && (
          <Button
            onClick={() => onCancelRequest(user._id)}
            variant="secondary"
            className="w-full bg-[var(--btn)] text-sm text-white px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition hover:bg-[var(--btn-hover)] txt"
          >
            Cancel Request
          </Button>
        )}

        {selectedTab === "allFriends" && (
          <Button
            onClick={() => onRemoveFriend(user._id)}
            variant="danger"
            className="w-full bg-[var(--btn)] text-sm text-white px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition hover:bg-[var(--btn-hover)] txt"
          >
            Remove Friend
          </Button>
        )}
      </div>
    </div>
  );
}

export default UserCard;
