
import { Button } from "@/components/ui/button"
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function TabNavigation() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabs = [
    { id: "suggested", label: "Suggested" },
    { id: "friendRequests", label: "Friend Requests" },
    { id: "sentRequests", label: "Sent Requests" },
    { id: "allFriends", label: "All Friends" },
  ];

  const defaultTab = "suggested";
  const currentTab = searchParams.get("tab");
  const isValidTab = tabs.some((tab) => tab.id === currentTab);
  const activeTab = isValidTab ? currentTab : defaultTab;

  useEffect(() => {
    if (!isValidTab) {
      setSearchParams({ tab: defaultTab });
    }
  }, [isValidTab, setSearchParams]);

  const handleTabClick = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="w-60 overflow-hidden hidden sm:flex flex-col p-4 h-screen mr-6 bg-[var(--bg-sec)]">
      <h3 className="text-xl font-semibold mb-4 text-[var(--txt)]">Friends</h3>
      <div className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activeTab === tab.id
                ? "bg-[var(--btn)] text-white"
                : "hover:bg-[var(--bg-ter)] duration-300"
            }`}
          >
            {tab.label}
          </button>
        ))}

      </div>
    </div>
  );
}

export default TabNavigation;
