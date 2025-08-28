import express from "express";
import {
  createStudySession,
  getLeaderboard,
  getStudySessionStats,
  getUserStudyStats,
} from "../Controller/StudySessionController.js";
import authMiddleware from "../Middlewares/authMiddleware.js";

const router = express.Router();

// Record new session
router.post("/", authMiddleware, createStudySession);

// Get statistics
router.get("/stats", authMiddleware, getStudySessionStats);

// Get comprehensive study statistics for current user
router.get("/user-stats", authMiddleware, getUserStudyStats);

// get the leaderboard for the stats page.
router.get("/leaderboard", authMiddleware, getLeaderboard);

export default router;
