import express from "express";
import {
  friendList,
  userList,
  sendRequest,
  incomingRequests,
  acceptRequest,
  rejectRequest,
  viewSentRequests,
  removeFriend,
  getUserStats,
} from "../Controller/FriendsController.js";

import authMiddleware from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, friendList);
router.get("/friend-suggestions", authMiddleware, userList);
router.post("/request/:friendId", authMiddleware, sendRequest);
router.get("/sent-requests", authMiddleware, viewSentRequests);
router.get("/requests", authMiddleware, incomingRequests);
router.post("/accept/:friendId", authMiddleware, acceptRequest);
router.post("/reject/:friendId", authMiddleware, rejectRequest);
router.delete("/:friendId", authMiddleware, removeFriend);
// Add to your existing routes file or create a new UsersController.js
router.get("/:userId/stats", authMiddleware, getUserStats);  // Add this line

export default router;
