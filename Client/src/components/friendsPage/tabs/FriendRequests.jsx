import { useFriendRequests } from "@/queries/friendQueries";
import { useMemo, useState } from "react";
import SearchBar from "../SearchBar";
import UserCard from "../UserCard";

export default function FriendRequests() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: requests = [], isLoading } = useFriendRequests();

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredRequests = useMemo(() => {
    const term = searchTerm;
    if (!term.trim()) {
      return requests;
    }

    return requests.filter((user) => {
      const fullName = `${user.FirstName} ${user.LastName || ""}`.toLowerCase();

      // Search by name
      if (fullName.includes(term.toLowerCase())) {
        return true;
      }

      // Search by skills
      if (
        user.OtherDetails?.skills &&
        user.OtherDetails.skills.toLowerCase().includes(term.toLowerCase())
      ) {
        return true;
      }

      // Search by interests
      if (
        user.OtherDetails?.interests &&
        user.OtherDetails.interests.toLowerCase().includes(term.toLowerCase())
      ) {
        return true;
      }

      return false;
    });
  }, [requests, searchTerm]);

  if (isLoading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (requests.length == 0)
    return <div className="text-center text-gray-500">No requests</div>;

  return (
    <div>
      {requests.length > 0 && (
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search friend requests..."
        />
      )}

      <div className="flex flex-wrap gap-3 2xl:gap-4 mt-4">
        {filteredRequests.map((user) => (
          <UserCard key={user._id} user={user} selectedTab="friendRequests" />
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
