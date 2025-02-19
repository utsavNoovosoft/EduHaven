import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import ChatListItem from "./ChatListItem";

// Personal Chats
const personalChats = [
  {
    id: 1,
    name: "ABC user",
    lastMessage: "People Have Already...",
    date: "Jan 30",
  },
  {
    id: 2,
    name: "Aman Sharma",
    lastMessage: "Hey buddy!",
    date: "Feb 4",
  },
  {
    id: 3,
    name: "Indian",
    lastMessage: "Disabled the auto-delete timer",
    date: "Feb 4",
  },
  {
    id: 4,
    name: "Sophia",
    lastMessage: "I am a large language model...",
    date: "Feb 10",
  },
  {
    id: 5,
    name: "Manish",
    lastMessage: "A Happy New Year to you all...",
    date: "Dec 29",
  },
];

// Community Groups/Chats
const communityChats = [
  {
    id: 101,
    name: "Community Chat",
    lastMessage: "Join the community chat...",
    date: "Feb 14",
  },
  {
    id: 102,
    name: "Dev Group",
    lastMessage: "We are discussing React tips...",
    date: "Feb 18",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1, // delay each item
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState("chat");
  const chatsToRender =
    activeSection === "chat" ? personalChats : communityChats;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900">
        <h1 className="px-4 py-3 text-xl font-bold text-white">Chat Room</h1>
        <div className="relative flex items-center p-1">
          <button
            className={`relative flex-1 text-center px-3 py-1 text-sm font-medium ${
              activeSection === "chat" ? "text-white" : "text-gray-300"
            }`}
            onClick={() => setActiveSection("chat")}
          >
            Chat
          </button>
          <button
            className={`relative flex-1 text-center px-3 py-1 text-sm font-medium ${
              activeSection === "community" ? "text-white" : "text-gray-300"
            }`}
            onClick={() => setActiveSection("community")}
          >
            Community
          </button>

          {/* Sliding underline */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 w-1/2 bg-white"
            animate={{ x: activeSection === "chat" ? "0%" : "100%" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </div>
      </div>

      {/* Search box */}
      <div className="p-2">
        <div className="flex items-center bg-gray-800 rounded-md px-2 py-1">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent outline-none px-2 text-sm text-gray-100 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Chat list (staggered animation) */}
      <motion.div
        key={activeSection}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto"
      >
        {chatsToRender.map((chat) => (
          <motion.div key={chat.id} variants={itemVariants}>
            <ChatListItem
              name={chat.name}
              lastMessage={chat.lastMessage}
              date={chat.date}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Sidebar;
