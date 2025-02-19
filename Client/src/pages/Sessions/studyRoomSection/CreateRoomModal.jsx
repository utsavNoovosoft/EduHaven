import { useState } from "react";

function CreateRoomModal({ isOpen, onClose, onCreate }) {
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomName.trim() === "") return;
    onCreate(roomName);
    setRoomName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
      <div className="bg-gray-900 p-8 rounded-2xl w-96 shadow-2xl transition-all">
        <h2 className="text-2xl font-bold text-white mb-6">
          Create a New Room
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            className="w-full px-4 py-3 mb-6 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRoomModal;
