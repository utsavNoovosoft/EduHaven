import express from "express";
import { 
    getAllNotes, 
    getNoteById, 
    createNote, 
    updateNote, 
    deleteNote 
} from "../Controller/NotesController.js";

import authMiddleware from '../Middlewares/authMiddleware.js';


const router = express.Router();

// Route to create a new note
router.post("/note",authMiddleware, createNote);

// Route to get all notes
router.get("/note",authMiddleware, getAllNotes);

// Route to get a specific note by its ID
router.get("/note/:id", authMiddleware,getNoteById);

// Route to update a specific note by its ID
router.put("/note/:id",authMiddleware, updateNote);

// Route to delete a specific note by its ID
router.delete("/note/:id",authMiddleware, deleteNote);

export default router;
