import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";
import UserCard from "../UserCard";
import SearchBar from "../SearchBar";
import FriendsSkeletonLoader from "../../skeletons/FriendsSkeletonLoader"; // <-- Import the loader

export default function SuggestedFriends() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // Set initial loading state to true to show skeleton on component mount
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
  // Helper function to simulate network delay
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    const res = await axiosInstance.get(
      "/friends/friend-suggestions?all=true"
    );
    setUsers(res.data || []);
    } catch (err) {
      console.error("Fetch suggestions error:", err);
      toast.error("Failed to load suggestions");
    } finally {
      // Add this line to wait for 2 seconds (2000 ms) before hiding the skeleton
      await sleep(2000); 

      setLoading(false); // This will run after the delay
    }
  };

  // ... (sendRequest and handleSearch functions remain the same) ...
  const sendRequest = async (friendId) => {
    try {
      await axiosInstance.post(`/friends/request/${friendId}`, null);
      setUsers((prev) =>
        prev.map((u) => (u._id === friendId ? { ...u, requestSent: true } : u))
      );
      setFilteredUsers((prev) =>
        prev.map((u) => (u._id === friendId ? { ...u, requestSent: true } : u))
      );
      toast.success("Friend request sent!");
    } catch (err) {
      console.error(err);
      toast.error("Error sending friend request!");
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredUsers(users);
      return;
    }
    const filtered = users.filter((user) => {
      const fullName = `${user.FirstName} ${user.LastName || ""}`.toLowerCase();
      if (fullName.includes(term.toLowerCase())) return true;
      if (user.OtherDetails?.skills?.toLowerCase().includes(term.toLowerCase())) return true;
      if (user.OtherDetails?.interests?.toLowerCase().includes(term.toLowerCase())) return true;
      return false;
    });
    setFilteredUsers(filtered);
  };


  useEffect(() => {
    fetchSuggestions();
  }, []);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  // --- Main Change Here ---
  // If loading, display the skeleton loader.
  if (loading) {
    return <FriendsSkeletonLoader />;
  }

  if (!users.length) {
    return <div className="text-center text-gray-500">No suggestions</div>;
  }

  return (
    <div>
      {users.length > 0 && (
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by name, skills, or interests..."
        />
      )}

      <div className="flex flex-wrap gap-3 2xl:gap-4 mt-4">
        {filteredUsers.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            selectedTab="suggested"
            onSendRequest={sendRequest}
          />
        ))}
      </div>

      {filteredUsers.length === 0 && searchTerm && (
        <div className="text-center text-gray-500 mt-4">
          No matching friends found
        </div>
      )}
    </div>
  );
}