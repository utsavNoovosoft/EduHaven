import React from "react";
import { MoreVertical, Send, Headphones } from "lucide-react";

const ChatView = () => {
  // Example dummy messages
  const dummyMessages = [
    { id: 1, text: "Hey, how are you?", sender: "them" },
    { id: 2, text: "I'm good! How about you?", sender: "me" },
    { id: 3, text: "Doing great, thanks for asking.", sender: "them" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <div>
          <h2 className="font-semibold text-sm">Selected Chat Name</h2>
          <p className="text-xs text-gray-400">Last seen recently</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 hover:bg-gray-800 rounded-full flex items-center px-4 py-2">
            <Headphones size={16} className="mr-1 text-gray-300" />
            <span className="text-sm text-gray-300">Invite Session</span>
          </button>
          <button className="p-1 hover:bg-gray-800 rounded-full">
            <MoreVertical size={20} className="text-gray-300" />
          </button>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {dummyMessages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs md:max-w-sm lg:max-w-md break-words px-3 py-2 rounded-md text-sm ${
              msg.sender === "me"
                ? "bg-purple-700 text-white self-end ml-auto"
                : "bg-gray-800 text-gray-100 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-gray-700 p-2">
        <form className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 px-3 py-2 rounded-md bg-gray-800 focus:outline-none text-sm text-gray-100 placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-purple-700 text-white px-3 py-2 rounded-md hover:bg-purple-800 flex items-center"
          >
            <Send size={16} className="mr-1" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
