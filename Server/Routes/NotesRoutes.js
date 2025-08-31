import express from "express";
import {
    getAllNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote
} from "../Controller/NotesController.js";

import authMiddleware from '../Middlewares/authMiddleware.js';

// these are added -> for security --
import { updateNoteValidationRules, createNoteValidationRules } from '../security/validation'
import { validate } from '../security/validationMiddleware'
import { sanitizeFields } from "../security/sanitizeMiddleware.js";
// ------


const router = express.Router();

// Route to create a new note
// router.post("/",authMiddleware, createNote);
router.post("/", authMiddleware, createNoteValidationRules(), validate, sanitizeFields(['title', 'content']), createNote);



// Route to get all notes
router.get("/", authMiddleware, getAllNotes);

// Route to get a specific note by its ID
router.get("/:id", authMiddleware, getNoteById);

// Route to update a specific note by its ID
// router.put("/:id", authMiddleware, updateNote);
router.put("/:id", authMiddleware, updateNoteValidationRules(), validate, sanitizeFields(['title', 'content']), updateNote);


// Route to delete a specific note by its ID
router.delete("/:id", authMiddleware, deleteNote);

export default router;