import {
  Copy,
  Download,
  MoreVertical,
  Palette,
  Pin,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const NoteCard = ({
  note,
  onSelect,
  onPin,
  onDelete,
  onDuplicate,
  onExport,
  onColorChange,
  showColorPicker,
  setShowColorPicker,
  colors,
  getPlainTextPreview,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getColorStyle = (colorName) => {
    const color = colors.find((c) => c.name === colorName);
    return color ? color.style : colors[0].style;
  };

  const truncateText = (text, limit) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
  };

  return (
    <div
      className="cursor-pointer relative flex flex-col transition-all p-4 rounded-xl"
      style={{
        ...getColorStyle(note.color),
        minHeight: "120px",
      }}
      onClick={() => onSelect(note)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          {note.title && (
            <h3
              className="text-sm font-semibold m-0 mb-1.5 leading-tight"
              style={{ color: "var(--txt)" }}
            >
              {truncateText(note.title, 40)}
            </h3>
          )}
          <div
            className="text-xs leading-snug"
            style={{ color: "var(--txt-dim)" }}
          >
            {truncateText(getPlainTextPreview(note.content), 100)}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 border-none bg-transparent cursor-pointer opacity-70 rounded"
            style={{ color: "var(--txt-dim)" }}
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <div
              className="absolute top-full right-0 border z-10 shadow-lg"
              style={{
                backgroundColor: "var(--bg-ter)",
                borderColor: "var(--bg-sec)",
                borderRadius: "var(--radius)",
                minWidth: "150px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPin(note.id);
                  setShowMenu(false);
                }}
                className="w-full py-2 px-3 border-none bg-transparent text-left cursor-pointer flex items-center gap-2 text-sm rounded"
                style={{ color: "var(--txt)" }}
              >
                <Pin size={14} />
                {note.isPinned ? "Unpin" : "Pin"}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColorPicker(
                    showColorPicker === note.id ? null : note.id
                  );
                }}
                className="w-full py-2 px-3 border-none bg-transparent text-left cursor-pointer flex items-center gap-2 text-sm rounded"
                style={{ color: "var(--txt)" }}
              >
                <Palette size={14} />
                Color
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(note);
                  setShowMenu(false);
                }}
                className="w-full py-2 px-3 border-none bg-transparent text-left cursor-pointer flex items-center gap-2 text-sm rounded"
                style={{ color: "var(--txt)" }}
              >
                <Copy size={14} />
                Duplicate
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExport(note);
                  setShowMenu(false);
                }}
                className="w-full py-2 px-3 border-none bg-transparent text-left cursor-pointer flex items-center gap-2 text-sm rounded"
                style={{ color: "var(--txt)" }}
              >
                <Download size={14} />
                Export
              </button>

              <hr
                className="my-1 border-none border-t"
                style={{ borderColor: "var(--bg-sec)" }}
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                  setShowMenu(false);
                }}
                className="w-full py-2 px-3 border-none bg-transparent text-left cursor-pointer flex items-center gap-2 text-sm rounded"
                style={{ color: "var(--danger)" }}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}

          {showColorPicker === note.id && (
            <div
              className="absolute top-full right-0 border p-2 shadow-lg z-20 flex gap-1 flex-wrap"
              style={{
                backgroundColor: "var(--bg-ter)",
                borderColor: "var(--bg-sec)",
                borderRadius: "var(--radius)",
                width: "120px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    onColorChange(note.id, color.name);
                  }}
                  className="w-6 h-6 cursor-pointer rounded-full border"
                  style={{
                    ...color.style,
                    borderColor:
                      note.color === color.name
                        ? "var(--btn)"
                        : "var(--bg-sec)",
                    borderWidth: note.color === color.name ? "2px" : "1px",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {note.isPinned && (
        <Pin
          size={12}
          className="absolute top-2 right-8"
          style={{ color: "var(--btn)" }}
        />
      )}

      <div className="text-xs mt-auto" style={{ color: "var(--txt-disabled)" }}>
        {new Date(note.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default NoteCard;
