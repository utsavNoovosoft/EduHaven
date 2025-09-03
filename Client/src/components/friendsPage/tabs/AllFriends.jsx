import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";
import UserCard from "../UserCard";
import SearchBar from "../SearchBar";
import FriendsSkeletonLoader from "../../skeletons/FriendsSkeletonLoader"; // 1. Import skeleton loader

export default function AllFriends() {
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // 2. Set initial loading to true

  const fetchFriends = async () => {
    try {
      const res = await axiosInstance.get(`/friends`);
      setFriends(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load friends");
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async (friendId) => {
    try {
      await axiosInstance.delete(`/friends/${friendId}`);
      setFriends((prev) => prev.filter((f) => f._id !== friendId));
      toast.success("Friend removed!");
    } catch (err) {
      console.error(err);
      toast.error("Error removing friend!");
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredFriends(friends);
      return;
    }
    const filtered = friends.filter((user) => {
      const fullName = `${user.FirstName} ${user.LastName || ""}`.toLowerCase();
      if (fullName.includes(term.toLowerCase())) return true;
      if (user.OtherDetails?.skills?.toLowerCase().includes(term.toLowerCase())) return true;
      if (user.OtherDetails?.interests?.toLowerCase().includes(term.toLowerCase())) return true;
      return false;
    });
    setFilteredFriends(filtered);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    setFilteredFriends(friends);
  }, [friends]);

  // 3. Render skeleton loader while loading
  if (loading) {
    return <FriendsSkeletonLoader />;
  }

  if (!friends.length) {
    return <div className="text-center text-gray-500">No friends yet</div>;
  }

  return (
    <div>
      {friends.length > 0 && (
        <SearchBar onSearch={handleSearch} placeholder="Search friends..." />
      )}

      {/* 4. Update container to use CSS Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredFriends.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            selectedTab="allFriends"
            onRemoveFriend={removeFriend}
          />
        ))}
      </div>

      {filteredFriends.length === 0 && searchTerm && (
        <div className="text-center text-gray-500 mt-4">
          No matching friends found
        </div>
      )}
    </div>
  );
}