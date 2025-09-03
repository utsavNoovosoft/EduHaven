import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";
import UserCard from "../UserCard";
import SearchBar from "../SearchBar";
import FriendsSkeletonLoader from "../../skeletons/FriendsSkeletonLoader"; // 1. Import skeleton loader

export default function SentRequests() {
  const [sent, setSent] = useState([]);
  const [filteredSent, setFilteredSent] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // 2. Set initial loading to true

  const fetchSent = async () => {
    try {
      const res = await axiosInstance.get(`/friends/sent-requests`);
      setSent(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load sent requests");
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (friendId) => {
    try {
      await axiosInstance.delete(`/friends/sent-requests/${friendId}`);
      setSent((prev) => prev.filter((r) => r._id !== friendId));
      toast.info("Friend request canceled.");
    } catch (err) {
      console.error(err);
      toast.error("Error canceling friend request!");
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredSent(sent);
      return;
    }
    const filtered = sent.filter((user) => {
      const fullName = `${user.FirstName} ${user.LastName || ""}`.toLowerCase();
      if (fullName.includes(term.toLowerCase())) return true;
      if (user.OtherDetails?.skills?.toLowerCase().includes(term.toLowerCase())) return true;
      if (user.OtherDetails?.interests?.toLowerCase().includes(term.toLowerCase())) return true;
      return false;
    });
    setFilteredSent(filtered);
  };

  useEffect(() => {
    fetchSent();
  }, []);

  useEffect(() => {
    setFilteredSent(sent);
  }, [sent]);

  // 3. Render skeleton loader while loading
  if (loading) {
    return <FriendsSkeletonLoader />;
  }
  
  if (!sent.length) {
    return <div className="text-center text-gray-500">No sent requests</div>;
  }

  return (
    <div>
      {sent.length > 0 && (
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search sent requests..."
        />
      )}

      {/* 4. Update container to use CSS Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredSent.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            selectedTab="sentRequests"
            onCancelRequest={cancelRequest}
          />
        ))}
      </div>

      {filteredSent.length === 0 && searchTerm && (
        <div className="text-center text-gray-500 mt-4">
          No matching sent requests found
        </div>
      )}
    </div>
  );
}