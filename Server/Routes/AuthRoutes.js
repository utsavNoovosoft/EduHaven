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


// these are added -> for security --
import { signupValidationRules, loginValidationRules } from '../security/validation'
import { validate } from '../security/validationMiddleware'
import { sanitizeFields } from "../security/sanitizeMiddleware.js";
// ------

const router = express.Router();

// OAuth routes 
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

// Normal auth routes
// router.post("/signup", signup);
router.post("/signup", signupValidationRules(), validate, sanitizeFields(["FirstName", "LastName", "Email"]), signup);

router.post("/verify", verifyUser);

// router.post("/login", login);
router.post(
    "/login", loginValidationRules(), validate, sanitizeFields(["Email"]), login);


router.post("/logout", logout);
router.post("/refresh", refreshAccessToken);
router.post("/delete", deleteAccount);

export default router;