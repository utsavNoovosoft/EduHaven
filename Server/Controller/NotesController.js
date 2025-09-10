import Note from "../Model/NoteModel.js";

export const getAllNotes = async (req, res) => {
  try {
    const userId = req.user._id;

    const notes = await Note.find({
      $or: [
        { owner: userId },
        { "collaborators.user": userId },
        { visibility: "public" },
      ],
    });

    res.status(200).json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const userId = req.user._id;
    const note = await Note.findById(req.params.id);

    if (
      !note ||
      (note.visibility !== "public" &&
        note.owner.toString() !== userId.toString() &&
        !note.collaborators.some(
          (c) => c.user.toString() === userId.toString()
        ))
    ) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    res.status(200).json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createNote = async (req, res) => {
  try {
    const { title, content, color, visibility, collaborators } = req.body;
    const userId = req.user._id;

    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, error: "Title and content are required." });
    }

    const newNote = new Note({
      title,
      content,
      color: color || "default",
      visibility: visibility || "private",
      collaborators: collaborators || [],
      owner: userId,
    });

    await newNote.save();
    res.status(201).json({ success: true, data: newNote });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { title, content, color, visibility, collaborators } = req.body;
    const userId = req.user._id;
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }

    const isOwner = note.owner.toString() === userId.toString();
    const isEditor = note.collaborators.some(
      (c) => c.user.toString() === userId.toString() && c.access === "edit"
    );

    if (!isOwner && !isEditor) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (color) note.color = color;
    if (visibility) note.visibility = visibility;
    if (isOwner && collaborators) {
      note.collaborators = collaborators;
    }

    const updatedNote = await note.save();
    res.status(200).json({ success: true, data: updatedNote });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const userId = req.user._id;
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }

    if (note.owner.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    await note.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
