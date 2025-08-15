import { useState, useEffect } from "react";
import {
  User,
  Edit3,
  UserPlus,
  Landmark,
  Earth,
  DraftingCompass,
  Puzzle,
} from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link, useParams } from "react-router-dom";

const backendUrl = import.meta.env.VITE_API_URL;

const ProfileCard = ({ isCurrentUser = false, user }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let response;
        if (isCurrentUser) {
          const token = localStorage.getItem("token");
          if (!token) return;

          const decoded = jwtDecode(token);
          
          // Fetch user profile and stats in parallel
          const [profileResponse, statsResponse] = await Promise.all([
            axios.get(`${backendUrl}/user/details?id=${decoded.id}`, {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`${backendUrl}/user/stats`, {
              headers: { Authorization: `Bearer ${token}` }
            })
          ]);
          
          setUserProfile(profileResponse.data);
          setUserStats(statsResponse.data);
        } else {
          // For non-current user, use the passed user prop
          setUserProfile(user);
          // You might want to fetch their stats separately if needed
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isCurrentUser, user, userId]);

  const handleSendFriendRequest = async () => {
    if (!userId) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        `${backendUrl}/friends/request/${userId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setRequestSent(true);
      // You could add a toast notification here
    } catch (error) {
      console.error("Error sending friend request:", error);
      // You could add an error toast here
    }
  };

  if (isLoading || !userProfile) {
    return (
      <div className="overflow-hidden bg-gradient-to-br from-indigo-500/50 to-purple-500/5 rounded-3xl shadow-2xl pt-6 w-full h-fit relative">
        {/* Skeleton nav */}
        <div className="flex justify-end gap-6 px-4">
          {isCurrentUser && <div className="w-6 h-6 rounded-full bg-gray-400/30"></div>}
        </div>

        <div className="mx-4">
          {/* Skeleton profile */}
          <div className="relative flex items-center mb-4 gap-4 ">
            <div className="shrink-0 w-28 h-28 rounded-full bg-gray-400/30"></div>
            <div className="text-center flex-1">
              <div className="h-8 w-14 mx-auto rounded-md bg-gray-400/30 mb-1"></div>
              <div className="h-4 w-18 mx-auto rounded-sm bg-gray-400/20"></div>
            </div>
          </div>

          {/* Skeleton user info */}
          <div className="mb-4">
            <div className="h-6 w-40 rounded-md bg-gray-400/30 mb-2"></div>
            <div className="h-4 w-64 rounded-sm bg-gray-400/20"></div>
          </div>

          {/* Skeleton buttons */}
          <div className="flex flex-wrap justify-center gap-4 my-4">
            <div className="h-10 rounded-lg bg-gray-400/30 w-full"></div>
          </div>
        </div>

        {/* Skeleton details */}
        <div className="bg-gray-500/20 rounded-3xl p-4 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-7 w-7 rounded-full bg-gray-400/30"></div>
              <div className="flex-1">
                <div className="h-3 w-16 rounded-sm bg-gray-400/20 mb-1"></div>
                <div className="h-5 w-32 rounded-md bg-gray-400/30"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500/50 to-purple-500/5 rounded-3xl shadow-2xl pt-6 w-full h-fit relative overflow-hidden">
      {/* nav */}
      <div className="flex justify-end gap-6 px-4">
        {isCurrentUser && (
          <Link to={"/settings/"}>
            <Edit3 className="h-6 w-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
          </Link>
        )}
      </div>

      <div className="mx-4">
        {/* Profile  */}
        <div className="relative flex items-center mb-4 gap-4">
          <div className="w-28 h-28 rounded-full shadow-lg overflow-hidden">
            {userProfile.ProfilePicture ? (
              <img
                src={userProfile.ProfilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-indigo-600/50 flex items-center justify-center">
                <User className="w-16 h-16 text-white/70" />
              </div>
            )}
          </div>
          <div className="text-center flex-1">
            <span className="block text-2xl font-bold text-[var(--text-primary)]">
              {userStats?.friendsCount || 0}
            </span>
            <span className="text-sm text-[var(--text-secondary)]">
              Friends
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="text-[var(--text-primary)]">
          <h2 className="text-xl font-bold">
            {userProfile.FirstName} {userProfile.LastName}
          </h2>
          {userProfile?.Bio && (
            <p className="text-[var(--text-secondary)] mb-4 max-w-xs">
              {userProfile.Bio}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 my-4">
          {!isCurrentUser && (
            <button
              onClick={handleSendFriendRequest}
              disabled={requestSent}
              className={`transition-colors text-[var(--text-primary)] px-6 py-2 h-10 rounded-lg flex items-center space-x-2 w-full sm:w-auto text-center flex-1 text-nowrap ${
                requestSent
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              <UserPlus className="w-5 h-5" />
              <span>{requestSent ? 'Request Sent' : 'Add friend'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Additional Details */}
      <div className="bg-gray-500/20 rounded-3xl p-4 space-y-4">
        {userProfile.FieldOfStudy && (
          <div className="flex items-center gap-4 text-[var(--text-secondary)]">
            <Landmark className="h-7 w-7" />
            <div>
              <p className="text-xs">{userProfile.University || "Field of Study"}</p>
              <p className="text-lg text-[var(--text-primary)]">
                {userProfile.FieldOfStudy}
                {userProfile.GraduationYear && `, ${userProfile.GraduationYear}`}
              </p>
            </div>
          </div>
        )}

        {userProfile.OtherDetails?.skills && (
          <div className="flex items-center gap-4 text-[var(--text-secondary)]">
            <Puzzle className="h-7 w-7" />
            <div>
              <p className="text-xs">Skills</p>
              <p className="text-lg text-[var(--text-primary)]">
                {userProfile.OtherDetails.skills}
              </p>
            </div>
          </div>
        )}
        
        {userProfile.OtherDetails?.interests && (
          <div className="flex items-center gap-4 text-[var(--text-secondary)]">
            <DraftingCompass className="h-7 w-7" />
            <div>
              <p className="text-xs">Interests</p>
              <p className="text-lg text-[var(--text-primary)]">
                {userProfile.OtherDetails.interests}
              </p>
            </div>
          </div>
        )}
        
        {userProfile.Country && (
          <div className="flex items-center gap-4 text-[var(--text-secondary)]">
            <Earth className="h-7 w-7" />
            <div>
              <p className="text-xs">Country</p>
              <p className="text-lg text-[var(--text-primary)]">
                {userProfile.Country}
              </p>
            </div>
          </div>
        )}
        
        {userProfile.OtherDetails?.additionalNotes && (
          <div className="flex gap-3 text-[var(--text-secondary)]">
            <span>{userProfile.OtherDetails.additionalNotes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
