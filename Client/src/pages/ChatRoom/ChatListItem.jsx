import { motion } from "framer-motion";

const ChatListItem = ({ name, lastMessage, date }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between px-4 py-3 hover:bg-gray-800 cursor-pointer"
    >
      <div className="flex flex-col">
        <span className="font-medium text-sm text-gray-100">{name}</span>
        <span className="text-xs text-gray-400 truncate w-40">
          {lastMessage}
        </span>
      </div>
      <div>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
    </motion.div>
  );
};

export default ChatListItem;
