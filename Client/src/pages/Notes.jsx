import Highlight from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImgIcn,
  Italic,
  Link as LinkIcn,
  List,
  ListOrdered,
  Minus,
  Plus,
  Quote,
  Search,
  Strikethrough,
  Table as TableIcn,
  Underline as UnderlineIcn,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import NoteCard from "../components/notes/NoteCard.jsx";
import ToolbarButton from "../components/notes/ToolbarButton.jsx";

const colors = [
  { name: "default", style: { backgroundColor: "var(--bg-sec)" } },
  { name: "red", style: { backgroundColor: "var(--red-light)" } },
  { name: "orange", style: { backgroundColor: "var(--orange-light)" } },
  { name: "yellow", style: { backgroundColor: "var(--yellow-light)" } },
  { name: "green", style: { backgroundColor: "var(--green-light)" } },
  { name: "blue", style: { backgroundColor: "var(--blue-light)" } },
  { name: "purple", style: { backgroundColor: "var(--purple-light)" } },
  { name: "pink", style: { backgroundColor: "var(--pink-light)" } },
];

const Notes = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Welcome to Eduhaven Notes!",
      content: `<h1>Welcome to Eduhaven Notes!</h1><p>This is a modern notes feature with rich text editing capabilities, similar to Notion.</p><p>You can:</p><ul><li>Create <strong>bold</strong> and <em>italic</em> text</li><li>Add headers, lists, and more</li><li>Use the toolbar above for formatting</li><li>Create task lists</li></ul><p>Try selecting text and using the formatting toolbar above!</p>`,
      createdAt: new Date().toISOString(),
      isPinned: false,
      color: "default",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return `Heading ${node.attrs.level}`;
          }
          return 'Type "/" for commands, or just start writing...';
        },
      }),
      Typography,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: selectedNote?.content || "",
    onUpdate: ({ editor }) => {
      if (selectedNote) {
        const content = editor.getHTML();
        updateNote(selectedNote.id, { content });
      }
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && selectedNote) {
      const currentContent = editor.getHTML();
      if (currentContent !== selectedNote.content) {
        editor.commands.setContent(selectedNote.content);
      }
    }
  }, [selectedNote, editor]);

  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: "",
      content: "",
      createdAt: new Date().toISOString(),
      isPinned: false,
      color: "default",
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  const updateNote = (id, updates) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, ...updates } : note))
    );
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote({ ...selectedNote, ...updates });
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
    }
  };

  const togglePin = (id) => {
    const note = notes.find((n) => n.id === id);
    updateNote(id, { isPinned: !note.isPinned });
  };

  const changeColor = (id, color) => {
    updateNote(id, { color });
    setShowColorPicker(null);
  };

  const duplicateNote = (note) => {
    const newNote = {
      ...note,
      id: Date.now(),
      title: note.title + " (Copy)",
      createdAt: new Date().toISOString(),
      isPinned: false,
    };
    setNotes([newNote, ...notes]);
  };

  const exportNote = (note) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = note.content;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    const content = `# ${note.title}\n\n${textContent}`;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title || "note"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url && editor) {
      if (editor.state.selection.empty) {
        const text = prompt("Enter link text:") || url;
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${url}">${text}</a>`)
          .run();
      } else {
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
  };

  const insertTable = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    }
  };

  const getPlainTextPreview = (htmlContent) => {
    if (!htmlContent) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.substring(0, 100) + (text.length > 100 ? "..." : "");
  };

  const filteredNotes = notes.filter((note) => {
    const plainContent = getPlainTextPreview(note.content);
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plainContent.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const pinnedNotes = filteredNotes.filter((note) => note.isPinned);
  const unpinnedNotes = filteredNotes.filter((note) => !note.isPinned);

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--txt)" }}
    >
      {/* Header */}
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

      <div className="flex" style={{ height: "calc(100vh - 73px)" }}>
        {/* Notes List */}
        <div
          className={`${selectedNote ? "w-80" : "w-full"} ${
            selectedNote ? "border-r" : ""
          } overflow-auto p-4`}
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--bg-sec)",
          }}
        >
          {pinnedNotes.length > 0 && (
            <div className="mb-6">
              <h3
                className="text-xs font-medium uppercase mb-2 mt-0"
                style={{ color: "var(--txt-dim)" }}
              >
                Pinned
              </h3>
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                }}
              >
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onSelect={setSelectedNote}
                    onPin={togglePin}
                    onDelete={deleteNote}
                    onDuplicate={duplicateNote}
                    onExport={exportNote}
                    onColorChange={changeColor}
                    showColorPicker={showColorPicker}
                    setShowColorPicker={setShowColorPicker}
                    colors={colors}
                    getPlainTextPreview={getPlainTextPreview}
                  />
                ))}
              </div>
            </div>
          )}

          {unpinnedNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <h3
                  className="text-xs font-medium uppercase mb-2 mt-0"
                  style={{ color: "var(--txt-dim)" }}
                >
                  Others
                </h3>
              )}
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                }}
              >
                {unpinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onSelect={setSelectedNote}
                    onPin={togglePin}
                    onDelete={deleteNote}
                    onDuplicate={duplicateNote}
                    onExport={exportNote}
                    onColorChange={changeColor}
                    showColorPicker={showColorPicker}
                    setShowColorPicker={setShowColorPicker}
                    colors={colors}
                    getPlainTextPreview={getPlainTextPreview}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredNotes.length === 0 && (
            <div
              className="text-center mt-10"
              style={{ color: "var(--txt-dim)" }}
            >
              {searchTerm
                ? "No notes found"
                : "No notes yet. Create your first note!"}
            </div>
          )}
        </div>

        {/* Note Editor */}
        {selectedNote && (
          <div
            className="flex-1 flex flex-col rounded-tl-3xl"
            style={{ backgroundColor: "var(--bg-ter)" }}
          >
            {/* Editor Header */}
            <div
              className="p-4 border-b flex flex-col gap-3"
              style={{ borderColor: "var(--bg-sec)" }}
            >
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Untitled"
                  value={selectedNote.title}
                  onChange={(e) =>
                    updateNote(selectedNote.id, { title: e.target.value })
                  }
                  className="flex-1 border-none outline-none text-2xl font-semibold bg-transparent font-inherit"
                  style={{ color: "var(--txt)" }}
                />

                <button
                  onClick={() => setSelectedNote(null)}
                  className="p-2 border-none bg-transparent cursor-pointer"
                  style={{
                    color: "var(--txt-dim)",
                    borderRadius: "var(--radius)",
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Formatting Toolbar */}
              <div
                className="flex items-center gap-0.5 flex-wrap p-2 bg-red-500"
                style={{
                  backgroundColor: "var(--bg-sec)",
                  borderRadius: "var(--radius)",
                }}
              >
                {/* Headings */}
                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  isActive={editor?.isActive("heading", { level: 1 })}
                  icon={<Heading1 size={16} />}
                  title="Heading 1"
                />

                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  isActive={editor?.isActive("heading", { level: 2 })}
                  icon={<Heading2 size={16} />}
                  title="Heading 2"
                />

                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  isActive={editor?.isActive("heading", { level: 3 })}
                  icon={<Heading3 size={16} />}
                  title="Heading 3"
                />

                <div
                  className="w-px h-5 mx-1"
                  style={{ backgroundColor: "var(--txt-disabled)" }}
                />

                {/* Text Formatting */}
                <ToolbarButton
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  isActive={editor?.isActive("bold")}
                  icon={<Bold size={16} />}
                  title="Bold"
                />

                <ToolbarButton
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  isActive={editor?.isActive("italic")}
                  icon={<Italic size={16} />}
                  title="Italic"
                />

                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().toggleUnderline().run()
                  }
                  isActive={editor?.isActive("underline")}
                  icon={<UnderlineIcn size={16} />}
                  title="Underline"
                />

                <ToolbarButton
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                  isActive={editor?.isActive("strike")}
                  icon={<Strikethrough size={16} />}
                  title="Strikethrough"
                />

                <ToolbarButton
                  onClick={() => editor?.chain().focus().toggleCode().run()}
                  isActive={editor?.isActive("code")}
                  icon={<Code size={16} />}
                  title="Code"
                />

                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().toggleHighlight().run()
                  }
                  isActive={editor?.isActive("highlight")}
                  icon={<Highlighter size={16} />}
                  title="Highlight"
                />

                <div
                  className="w-px h-5 mx-1"
                  style={{ backgroundColor: "var(--txt-disabled)" }}
                />

                {/* Lists */}
                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                  isActive={editor?.isActive("bulletList")}
                  icon={<List size={16} />}
                  title="Bullet List"
                />

                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                  isActive={editor?.isActive("orderedList")}
                  icon={<ListOrdered size={16} />}
                  title="Numbered List"
                />

                <ToolbarButton
                  onClick={() => editor?.chain().focus().toggleTaskList().run()}
                  isActive={editor?.isActive("taskList")}
                  icon={
                    <div className="w-4 h-4 border-2 border-current rounded-sm flex items-center justify-center">
                      ✓
                    </div>
                  }
                  title="Task List"
                />

                <div
                  className="w-px h-5 mx-1"
                  style={{ backgroundColor: "var(--txt-disabled)" }}
                />

                {/* Other formatting */}
                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().toggleBlockquote().run()
                  }
                  isActive={editor?.isActive("blockquote")}
                  icon={<Quote size={16} />}
                  title="Quote"
                />

                <ToolbarButton
                  onClick={() =>
                    editor?.chain().focus().setHorizontalRule().run()
                  }
                  isActive={false}
                  icon={<Minus size={16} />}
                  title="Horizontal Rule"
                />

                <div
                  className="w-px h-5 mx-1"
                  style={{ backgroundColor: "var(--txt-disabled)" }}
                />

                {/* Media & Links */}
                <ToolbarButton
                  onClick={insertLink}
                  isActive={editor?.isActive("link")}
                  icon={<LinkIcn size={16} />}
                  title="Insert Link"
                />

                <ToolbarButton
                  onClick={insertImage}
                  isActive={false}
                  icon={<ImgIcn size={16} />}
                  title="Insert Image"
                />

                <ToolbarButton
                  onClick={insertTable}
                  isActive={editor?.isActive("table")}
                  icon={<TableIcn size={16} />}
                  title="Insert Table"
                />
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 p-4 overflow-auto">
              <EditorContent editor={editor} className="min-h-full" />
            </div>
          </div>
        )}
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
        }

        /* TipTap Editor Styles */
        .ProseMirror {
          outline: none;
          font-size: 16px;
          line-height: 1.6;
          color: var(--txt);
        }

        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
          font-weight: 600;
          margin: 1.5em 0 0.5em 0;
          color: var(--txt);
        }

        .ProseMirror h1 {
          font-size: 2em;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
        }

        .ProseMirror h3 {
          font-size: 1.25em;
        }

        .ProseMirror p {
          margin: 0.5em 0;
        }

        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }

        .ProseMirror li {
          margin: 0.25em 0;
        }

        .ProseMirror blockquote {
          border-left: 3px solid var(--btn);
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: var(--txt-dim);
        }

        .ProseMirror code {
          background-color: var(--bg-sec);
          padding: 2px 4px;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
          font-size: 0.9em;
        }

        .ProseMirror pre {
          background-color: var(--bg-sec);
          padding: 1em;
          border-radius: var(--radius);
          margin: 1em 0;
          overflow-x: auto;
        }

        .ProseMirror pre code {
          background: none;
          padding: 0;
        }

        .ProseMirror strong {
          font-weight: 600;
        }

        .ProseMirror em {
          font-style: italic;
        }

        .ProseMirror u {
          text-decoration: underline;
        }

        .ProseMirror s {
          text-decoration: line-through;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          color: var(--txt-dim);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .ProseMirror .task-list {
          list-style: none;
          padding: 0;
        }

        .ProseMirror .task-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .ProseMirror .task-list input[type="checkbox"] {
          margin: 0;
          margin-top: 4px;
        }

        .ProseMirror mark {
          background-color: var(--yellow-light);
          border-radius: 2px;
          padding: 0 2px;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: var(--radius);
          margin: 8px 0;
        }

        .ProseMirror a {
          color: var(--btn);
          text-decoration: underline;
        }

        .ProseMirror a:hover {
          color: var(--btn-hover);
        }

        .ProseMirror hr {
          border: none;
          border-top: 2px solid var(--bg-sec);
          margin: 2em 0;
        }

        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1em 0;
          border: 1px solid var(--bg-sec);
          border-radius: var(--radius);
          overflow: hidden;
        }

        .ProseMirror table td,
        .ProseMirror table th {
          min-width: 100px;
          border: 1px solid var(--bg-sec);
          padding: 8px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }

        .ProseMirror table th {
          font-weight: 600;
          background-color: var(--bg-sec);
        }
      `}</style>
    </div>
  );
};

export default Notes;
