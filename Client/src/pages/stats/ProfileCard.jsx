import React, { useState, useEffect } from "react";
import { User, MessageCircle, ThumbsUp, Edit, UserPlus } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

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
          `http://localhost:3000/user/details?id=${decoded.id}`,
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
      <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-3xl shadow-2xl p-6 w-full animate-pulse">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-700 rounded-full mb-4"></div>
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl shadow-2xl pt-6 w-full relative overflow-hidden">
      {/* Profile  */}
      <div className="mx-4">
        <div className="relative flex justify-center mb-4 gap-4">
          <div className="w-28 h-28 rounded-full shadow-lg overflow-hidden">
            {user.ProfilePicture ? (
              <img
                src={user.ProfilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-indigo-600/50 flex items-center justify-center">
                <User className="w-16 h-16 text-white/70" />
              </div>
            )}
          </div>

          <div className=" flex items-center gap-2 space-x-4 ">
            <div className="">
              <span className="block text-xl font-bold">342</span>
              <span className="text-sm text-white/70">Kudos</span>
            </div>
            <div className="">
              <span className="block text-xl font-bold">56</span>
              <span className="text-sm text-white/70">Friends</span>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className=" text-white">
          <h2 className="text-xl font-bold">
            {user.FirstName} {user.LastName}
          </h2>
          <p className="text-white/80 mb-4 max-w-xs">
            {user?.Bio || "No bio available"}
          </p>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 my-4">
            <button className="bg-white/20 hover:bg-white/30 transition-colors text-white px-6 py-2 rounded-full flex items-center space-x-2">
              <ThumbsUp className="w-5 h-5" />
              <span>Kudos</span>
            </button>
            <button className="bg-white/20 hover:bg-white/30 transition-colors text-white px-6 py-2 rounded-full flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>chat</span>
            </button>
          </div>
          <button className="bg-white/20 w-full text-center hover:bg-white/30 transition-colors text-white px-6 py-2 rounded-full flex items-center space-x-2 mb-4">
            <UserPlus  className="w-5 h-5" />
            <span>Add friend</span>
          </button>
        </div>
      </div>

      {/* Additional Details */}
      <div className="bg-white/10 rounded-2xl p-4 space-y-2">
        <div className="flex justify-between text-white/80">
          <span>University</span>
          <span>{user.University || "Not specified"}</span>
        </div>
        <div className="flex justify-between text-white/80">
          <span>Country</span>
          <span>{user.Country || "Not specified"}</span>
        </div>
        <div className="flex justify-between text-white/80">
          <span>Field of Study</span>
          <span>{user.FieldOfStudy || "Not specified"}</span>
        </div>
        <div className="flex justify-between text-white/80">
          <span>Member Since</span>
          <span>{new Date(user.createdAt).getFullYear()}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
