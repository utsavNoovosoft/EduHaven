import { useSentRequests } from "@/queries/friendQueries";
import { useEffect, useState } from "react";
import SearchBar from "../SearchBar";
import UserCard from "../UserCard";

export default function SentRequests() {
  const [filteredSent, setFilteredSent] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: sentRequests = [], isLoading } = useSentRequests();

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredSent(sentRequests);
      return;
    }

    const filtered = sentRequests.filter((user) => {
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

    setFilteredSent(filtered);
  };

  useEffect(() => {
    if (sentRequests.length) {
      setFilteredSent(sentRequests);
    }
  }, [sentRequests]);

  if (isLoading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (sentRequests.length == 0)
    return <div className="text-center text-gray-500">No sent requests</div>;

  return (
    <div>
      {sentRequests.length > 0 && (
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search sent requests..."
        />
      )}

      <div className="flex flex-wrap gap-3 2xl:gap-4 mt-4">
        {filteredSent?.map((user) => (
          <UserCard key={user._id} user={user} selectedTab="sentRequests" />
        ))}
      </div>

      {filteredSent?.length === 0 && searchTerm && (
        <div className="text-center text-gray-500 mt-4">
          No matching sent requests found
        </div>
      )}
    </div>
  );
}
