import { useMemo, useEffect, useState } from "react";
import { useFriendSuggestions } from "@/queries/friendQueries";
import SearchBar from "../SearchBar";
import UserCard from "../UserCard";

export default function SuggestedFriends() {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // stable options object
  const queryOptions = useMemo(() => ({ all: true }), []);
  const { data, isLoading } = useFriendSuggestions(queryOptions);

  const users = data?.pages.flatMap((page) => page.users) ?? [];

  const handleSearch = (term) => {
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredUsers(users);
      return;
    }

    const lowerTerm = term.toLowerCase();
    const filtered = users.filter((user) => {
      const fullName = `${user.FirstName} ${user.LastName || ""}`.toLowerCase();
      return (
        fullName.includes(lowerTerm) ||
        user.OtherDetails?.skills?.toLowerCase().includes(lowerTerm) ||
        user.OtherDetails?.interests?.toLowerCase().includes(lowerTerm)
      );
    });

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  if (isLoading)
    return <div className="text-center text-gray-500">Loading...</div>;

  if (!users.length)
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
