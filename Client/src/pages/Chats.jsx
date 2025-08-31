import React from "react";
import UserList from "../components/chats/userlist";
import ChatWindow from "../components/chats/chatwindow";

// Dummy data for demonstration
const dummyUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "/public/userProfile.webp",
    lastMessage: "Hey, are you ready for the study session?",
    timestamp: "2 min ago",
    isOnline: true,
    unreadCount: 2
  },
  {
    id: 2,
    name: "Sarah Chen",
    avatar: null,
    lastMessage: "Thanks for helping with the math problem!",
    timestamp: "15 min ago",
    isOnline: true,
    unreadCount: 0
  },
  {
    id: 3,
    name: "Mike Wilson",
    avatar: "/public/userProfile.webp",
    lastMessage: "Can we reschedule our meeting?",
    timestamp: "1 hour ago",
    isOnline: false,
    unreadCount: 1
  },
  {
    id: 4,
    name: "Emma Davis",
    avatar: null,
    lastMessage: "Great job on the presentation today!",
    timestamp: "3 hours ago",
    isOnline: false,
    unreadCount: 0
  },
];

function Chats() {
  const [selectedUser, setSelectedUser] = React.useState(null);

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-primary), black 15%)' }}>
      {/* User List Sidebar - Responsive width */}
      {/* xl: 320px, lg: 280px, md: 240px, sm: 200px */}
      <div className="w-48 sm:w-52 md:w-60 lg:w-72 xl:w-80 border-r border-gray-200/20">
        <UserList 
          users={dummyUsers} 
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser} 
        />
      </div>
      
      {/* Chat Window - Takes remaining space */}
      <div className="flex-1">
        <ChatWindow selectedUser={selectedUser} />
      </div>
    </div>
  );
}

export default Chats;
