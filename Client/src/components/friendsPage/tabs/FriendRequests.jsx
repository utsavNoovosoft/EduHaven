import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";
import UserCard from "../UserCard";
import SearchBar from "../SearchBar";
import FriendsSkeletonLoader from "../../skeletons/FriendsSkeletonLoader"; // 1. Import skeleton loader

export default function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // 2. Set initial loading to true

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get("/friends/requests");
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load friend requests");
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (friendId) => {
    try {
      await axiosInstance.post(`/friends/accept/${friendId}`, null);
      setRequests((prev) => prev.filter((r) => r._id !== friendId));
      toast.success("Friend request accepted!");
    } catch (err) {
      console.error(err);
      toast.error("Error accepting friend request!");
    }
  };

  const rejectRequest = async (friendId) => {
    try {
      await axiosInstance.delete(`/friends/reject/${friendId}`);
      setRequests((prev) => prev.filter((r) => r._id !== friendId));
      toast.info("Friend request rejected.");
    } catch (err) {
      console.error(err);
      toast.error("Error rejecting friend request!");
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredRequests(requests);
      return;
    }
    const filtered = requests.filter((user) => {
      const fullName = `${user.FirstName} ${user.LastName || ""}`.toLowerCase();
      if (fullName.includes(term.toLowerCase())) return true;
      if (user.OtherDetails?.skills?.toLowerCase().includes(term.toLowerCase())) return true;
      if (user.OtherDetails?.interests?.toLowerCase().includes(term.toLowerCase())) return true;
      return false;
    });
    setFilteredRequests(filtered);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    setFilteredRequests(requests);
  }, [requests]);

  // 3. Render skeleton loader while loading
  if (loading) {
    return <FriendsSkeletonLoader />;
  }

  if (!requests.length) {
    return <div className="text-center text-gray-500">No requests</div>;
  }

  return (
    <div>
      {requests.length > 0 && (
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search friend requests..."
        />
      )}

      {/* 4. Update container to use CSS Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredRequests.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            selectedTab="friendRequests"
            onAcceptRequest={acceptRequest}
            onRejectRequest={rejectRequest}
          />
        ))}
      </div>

      {filteredRequests.length === 0 && searchTerm && (
        <div className="text-center text-gray-500 mt-4">
          No matching friend requests found
        </div>
      )}
    </div>
  );
}