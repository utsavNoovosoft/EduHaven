import express from "express";
import {
  friendList,
  userList,
  sendRequest,
  incomingRequests,
  acceptRequest,
  rejectRequest,
//   addFriend,
  removeFriend,
} from "../Controller/FriendsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, friendList);
router.get("/friend-suggestions", authMiddleware, userList);
router.post("/request/:friendId", authMiddleware, sendRequest);
router.get("/requests", authMiddleware, incomingRequests);
router.post("/accept/:friendId", authMiddleware, acceptRequest);
router.post("/reject/:friendId", authMiddleware, rejectRequest);

// router.post("/:friendId", authMiddleware, addFriend);
router.delete("/:friendId", authMiddleware, removeFriend);

export default router;
