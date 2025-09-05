import { useAllSuggestedUsers } from "@/queries/friendQueries";
import { useEffect, useMemo, useState } from "react";
import SearchBar from "../SearchBar";
import UserCard from "../UserCard";

export default function SuggestedFriends() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users = [], isLoading } = useAllSuggestedUsers();

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredUsers = useMemo(() => {
    const term = searchTerm;
    if (!term.trim()) {
      return users;
    }

    return users.filter((user) => {
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
  }, [users, searchTerm]);

  if (isLoading)
    return <div className="text-center text-gray-500">Loading...</div>;

  if (!users || users.length === 0)
    return <div className="text-center text-gray-500">No suggestions</div>;

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
          <UserCard key={user._id} user={user} selectedTab="suggested" />
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
