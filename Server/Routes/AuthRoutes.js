import express from "express";
import {
  deleteAccount,
  googleAuth,
  googleCallback,
  login,
  logout,
  refreshAccessToken,
  signup,
  verifyUser,
} from "../Controller/AuthController.js";

const router = express.Router();

// OAuth routes 
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

// Normal auth routes
router.post("/signup", signup);
router.post("/verify", verifyUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshAccessToken);
router.post("/delete", deleteAccount);

export default router;
