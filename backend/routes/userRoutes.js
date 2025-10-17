import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧾 Register a new user
router.post("/register", registerUser);

// 🔐 Login user and return JWT
router.post("/login", loginUser);

// 👤 Get logged-in user profile (protected route)
router.get("/profile", protect, getUserProfile);

export default router;
