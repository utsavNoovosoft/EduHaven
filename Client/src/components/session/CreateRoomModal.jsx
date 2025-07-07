import { useState } from "react";

function CreateRoomModal({ isOpen, onClose, onCreate }) {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [cateogery, setcateogery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomName.trim() === "" || cateogery === "" || description.trim() === "") return;
    onCreate({ name: roomName, description, cateogery });
    setRoomName("");
    setDescription("");
    setcateogery("");
    onClose();
  };

  if (!isOpen) return null;

  const categories = [
    { value: "", label: "Select a cateogery" },
    { value: "study-room", label: "study-room" },
    { value: "general", label: "General" },
    { value: "Tech", label: "Tech" },
    { value: "Science", label: "Science" },
    { value: "Language-learning", label: "Language-learning" },
    { value: "Professional", label: " Professional" },
    { value: "Career-development", label: "Career-development" },
    { value: "Industry-Deep-dives", label: "Industry Deep-dives" },
    { value: "Entrepreneurship/startup", label: "Entrepreneurship/startup" },
    { value: "marketing", label: "Marketing" },
    { value: "Side-Hustles", label: "Side-Hustles" },
    { value: "Freelancing ", label: "Freelancing " },
    { value: "Hobbies", label: "Hobbies" },
    { value: "fitness", label: "fitness" },
    { value: "Art/design", label: "Art/Design" },
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
    >
      <div className="p-8 rounded-2xl w-96 shadow-2xl transition-all bg-sec">
        <h2 className="text-2xl font-semibold txt mb-6">Create a New Room</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium txt">Room Name</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            className="w-full px-4 py-3 mb-6 rounded-lg bg-sec txt placeholder:txt-dim border border-gray-500/50 focus:outline-none"
            style={{ "--tw-ring-color": "var(--btn)" }}
          />

          <label className="block mb-2 font-medium txt">cateogery</label>
          <select
            value={cateogery}
            onChange={(e) => setcateogery(e.target.value)}
            className="w-full px-4 py-3 mb-6 rounded-lg bg-sec txt border border-gray-500/50 focus:outline-none"
            style={{ "--tw-ring-color": "var(--btn)" }}
          >
            {categories.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.value === ""}
              >
                {opt.label}
              </option>
            ))}
          </select>

          <label className="block mb-2 font-medium txt">Room Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., A room for CS students"
            className="w-full px-4 py-3 mb-6 rounded-lg bg-sec txt placeholder:txt-dim border border-gray-500/50 focus:outline-none"
            style={{ "--tw-ring-color": "var(--btn)" }}
          />

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-txt-dim txt-dim hover:bg-sec transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg btn hover:bg-[var(--btn-hover)] txt transition-colors"
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
