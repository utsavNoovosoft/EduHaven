import axiosInstance from "@/utils/axios";

// Fetch all notes
export const getAllNotes = async () => {
  const { data } = await axiosInstance.get("/notes");
  return data.data;
};

// Fetch single note by ID
export const getNoteById = async (id) => {
  const { data } = await axiosInstance.get(`/notes/${id}`);
  return data.data;
};

// Create a note
export const createNote = async (noteData) => { 
  const { data } = await axiosInstance.post("/notes", noteData);
  return data.data;
};

// Update a note
export const updateNote = async ({ id, ...noteData }) => {
  const { data } = await axiosInstance.put(`/notes/${id}`, noteData);
  return data.data;
};

// Delete a note
export const deleteNote = async (id) => {
  const { data } = await axiosInstance.delete(`/notes/${id}`);
  return data.message;
};
