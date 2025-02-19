import Sidebar from "./Sidebar";
import ChatView from "./ChatView";

const ChatRooms = () => {
  return (
    <div className="flex w-full h-screen dark:bg-gray-900 dark:text-gray-100">
      <div className="w-1/3 md:w-1/4 border-r border-gray-700">
        <Sidebar />
      </div>
      <div className="flex-1">
        <ChatView />
      </div>
    </div>
  );
};

export default ChatRooms;
