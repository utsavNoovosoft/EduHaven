import { useState, useEffect } from "react";
import { X } from "lucide-react";

function CreateRoomModal({ isOpen, onClose, onCreate }) {
  // Local state for the room name input.
  const [roomName, setRoomName] = useState("");

  // Reset input when modal is reopened.
  useEffect(() => {
    if (isOpen) {
      setRoomName("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomName.trim() === "") return;
    // Invoke the onCreate callback with the room name.
    onCreate(roomName);
    setRoomName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-800 p-6 rounded-3xl w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4">Create Your Room</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 mb-4 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            Create Room
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRoomModal;
