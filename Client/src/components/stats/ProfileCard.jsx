import { useState, useEffect } from "react";
import {
  User,
  MessageCircle,
  ThumbsUp,
  Edit3,
  Share2,
  UserPlus,
  Landmark,
  Earth,
  DraftingCompass,
  Puzzle,
} from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
const backendUrl = import.meta.env.VITE_API_URL;

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const response = await axios.get(
          `${backendUrl}/user/details?id=${decoded.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  if (isLoading || !user) {
    return (
      <div className="bg-sec backdrop-blur-md rounded-3xl shadow p-6 w-full h-fit relative overflow-hidden">
        {/* Skeleton nav */}
        <div className="flex justify-end gap-6">
          <div className="w-6 h-6 rounded-full bg-[var(--bg-skeleton)]"></div>
          <div className="w-6 h-6 rounded-full bg-[var(--bg-skeleton)]"></div>
        </div>

        <div className="mt-4">
          {/* Skeleton profile */}
          <div className="relative flex items-center mb-4 gap-4">
            <div className="w-28 h-28 rounded-full shadow-lg overflow-hidden bg-[var(--bg-skeleton)]"></div>
            <div className="text-center flex-1">
              <div className="h-8 w-16 mx-auto rounded-md bg-[var(--bg-skeleton)] mb-1"></div>
              <div className="h-4 w-20 mx-auto rounded-sm bg-[var(--bg-skeleton-secondary)]"></div>
            </div>
            <div className="text-center flex-1">
              <div className="h-8 w-16 mx-auto rounded-md bg-[var(--bg-skeleton)] mb-1"></div>
              <div className="h-4 w-20 mx-auto rounded-sm bg-[var(--bg-skeleton-secondary)]"></div>
            </div>
          </div>

          {/* Skeleton user info */}
          <div className="mb-4">
            <div className="h-6 w-40 rounded-md bg-[var(--bg-skeleton)] mb-2"></div>
            <div className="h-4 w-64 rounded-sm bg-[var(--bg-skeleton-secondary)]"></div>
          </div>

          {/* Skeleton buttons */}
          <div className="flex flex-wrap justify-center gap-4 my-4">
            <div className="h-10 rounded-lg bg-[var(--bg-skeleton)] flex-1"></div>
            <div className="h-10 rounded-lg bg-[var(--bg-skeleton)] flex-1"></div>
            <div className="h-10 rounded-lg bg-[var(--bg-skeleton)] w-full"></div>
          </div>
        </div>

        {/* Skeleton details */}
        <div className="bg-ter rounded-3xl p-4 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-7 w-7 rounded-full bg-[var(--bg-skeleton)]"></div>
              <div className="flex-1">
                <div className="h-3 w-16 rounded-sm bg-[var(--bg-skeleton-secondary)] mb-1"></div>
                <div className="h-5 w-32 rounded-md bg-[var(--bg-skeleton)]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sec backdrop-blur-md rounded-3xl shadow p-6 w-full h-fit relative overflow-hidden">
      {/* nav */}
      <div className="flex justify-end gap-6">
        <Link to={"/settings/"}>
          <Edit3 className="h-6 w-6 txt-dim hover:txt" />
        </Link>
        <Share2 className="h-6 w-6 txt-dim hover:txt" />
      </div>

      <div className="mt-4">
        {/* Profile  */}
        <div className="relative flex items-center mb-4 gap-4">
          <div className="w-28 h-28 rounded-full shadow-lg overflow-hidden">
            {user.ProfilePicture ? (
              <img
                src={user.ProfilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full btn flex items-center justify-center">
                <User className="w-16 h-16 txt" />
              </div>
            )}
          </div>
          <div className="text-center flex-1">
            <span className="block text-2xl font-bold txt">342</span>
            <span className="text-sm txt-dim">Kudos</span>
          </div>
          <div className="text-center flex-1">
            <span className="block text-2xl font-bold txt">56</span>
            <span className="text-sm txt-dim">Friends</span>
          </div>
        </div>

        {/* User Info */}
        <div className="txt">
          <h2 className="text-xl font-bold">
            {user.FirstName} {user.LastName}
          </h2>
          {user?.Bio && (
            <p className="txt-dim mb-4 max-w-xs">{user.Bio}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 my-4">
          <button className="bg-ter hover:bg-quat transition-colors txt px-6 py-2 h-10 rounded-lg flex items-center space-x-2 flex-1">
            <ThumbsUp className="w-5 h-5" />
            <span>Kudos</span>
          </button>
          <button className="bg-ter hover:bg-quat transition-colors txt px-6 py-2 h-10 rounded-lg flex items-center space-x-2 flex-1">
            <MessageCircle className="w-5 h-5" />
            <span>Chat</span>
          </button>
          <button className="btn hover:btn-hover transition-colors txt px-6 py-2 h-10 rounded-lg flex items-center space-x-2 w-full sm:w-auto text-center flex-1 text-nowrap">
            <UserPlus className="w-5 h-5" />
            <span>Add friend</span>
          </button>
        </div>
      </div>

      {/* Additional Details */}
      <div className="bg-ter rounded-3xl p-4 space-y-4">
        {user.FieldOfStudy && (
          <div className="flex items-center gap-4 txt-dim">
            <Landmark className="h-7 w-7" />
            <div>
              <p className="text-xs">{user.University || "Field of Study"}</p>
              <p className="text-lg txt">
                {user.FieldOfStudy}
                {", " + user.GraduationYear || ""}
              </p>
            </div>
          </div>
        )}

        {user.OtherDetails?.skills && (
          <div className="flex items-center gap-4 txt-dim">
            <Puzzle className="h-7 w-7" />
            <div>
              <p className="text-xs">Skills</p>
              <p className="text-lg txt">{user.OtherDetails.skills}</p>
            </div>
          </div>
        )}
        {user.OtherDetails?.interests && (
          <div className="flex items-center gap-4 txt-dim">
            <DraftingCompass className="h-7 w-7" />
            <div>
              <p className="text-xs">Interests</p>
              <p className="text-lg txt">{user.OtherDetails.interests}</p>
            </div>
          </div>
        )}
        {user.Country && (
          <div className="flex items-center gap-4 txt-dim">
            <Earth className="h-7 w-7" />
            <div>
              <p className="text-xs">Country</p>
              <p className="text-lg txt">{user.Country}</p>
            </div>
          </div>
        )}
        {user.OtherDetails?.additionalNotes && (
          <div className="flex gap-3 txt-dim">
            <span>{user.OtherDetails.additionalNotes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;