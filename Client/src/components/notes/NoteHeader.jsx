import { Plus, Search } from "lucide-react";

const NoteHeader = ({ createNewNote, searchTerm, setSearchTerm }) => {
  return (
    <header className="px-6 py-3 flex items-center  justify-between gap-4 w-full">
      <div className="flex items-center gap-2">
        <h1 className="m-0 text-2xl font-bold">Notes</h1>
      </div>

      <div className="flex-1 max-w-2xl relative">
        <Search
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
          style={{ color: "var(--txt-dim)" }}
        />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-3 pl-10 pr-3 border text-sm outline-none"
          style={{
            borderColor: "var(--bg-sec)",
            borderRadius: "var(--radius)",
            backgroundColor: "var(--bg-sec)",
            color: "var(--txt)",
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={createNewNote}
          className="w-full p-2 px-6 border border-dashed bg-transparent cursor-pointer flex items-center justify-center gap-2"
          style={{
            borderColor: "var(--btn)",
            color: "var(--btn)",
            borderRadius: "var(--radius)",
          }}
        >
          <Plus size={18} />
          Create new Note
        </button>
      </div>
    </header>
  );
};

export default NoteHeader;
