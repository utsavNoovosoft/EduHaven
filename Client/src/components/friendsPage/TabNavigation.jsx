function TabNavigation({ selectedTab, onTabClick }) {
    const tabs = [
      { id: "suggested", label: "Suggested" },
      { id: "friendRequests", label: "Friend Requests" },
      { id: "sentRequests", label: "Sent Requests" },
      { id: "allFriends", label: "All Friends" },
    ];
  
    return (
      <div className="w-60 p-4 h-screen mr-6 bg-[var(--bg-sec)]">
        <h3 className="text-xl font-semibold mb-4 text-[var(--txt)]">Friends</h3>
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab.id)}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                selectedTab === tab.id
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
  