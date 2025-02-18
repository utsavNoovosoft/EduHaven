import express from "express";
import { addFriend, friendList, removeFriend, userList } from "../Controller/FriendsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/add-new",authMiddleware, userList);
router.get("/", authMiddleware, friendList);
router.post("/:friendId", authMiddleware, addFriend);
router.delete("/:friendId", authMiddleware, removeFriend);

export default router;
