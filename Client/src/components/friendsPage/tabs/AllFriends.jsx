import { useFriends } from "@/queries/friendQueries";
import { useMemo, useState } from "react";
import SearchBar from "../SearchBar";
import UserCard from "../UserCard";

export default function AllFriends() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: friends = [], isLoading } = useFriends();

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredFriends = useMemo(() => {
    const term = searchTerm;
    if (!term.trim()) {
      return friends;
    }

    return friends.filter((user) => {
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
  }, [friends, searchTerm]);

  if (isLoading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (friends.length == 0)
    return <div className="text-center text-gray-500">No friends yet</div>;

  return (
    <div>
      {friends.length > 0 && (
        <SearchBar onSearch={handleSearch} placeholder="Search friends..." />
      )}

      <div className="flex flex-wrap gap-3 2xl:gap-4 mt-4">
        {filteredFriends.map((user) => (
          <UserCard key={user._id} user={user} selectedTab="allFriends" />
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
