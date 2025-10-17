import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createResume,
  getResumeById,
  getUserResumes,
  updateResume,
  deleteResume, // ✅ Added this missing import
} from "../controllers/resumeController.js";
import { uploadResumeImage } from "../controllers/uploadImages.js";

const resumeRouter = express.Router();

// ✅ Routes
resumeRouter.post("/", protect, createResume); // Create resume
resumeRouter.get("/", protect, getUserResumes); // Get all resumes of a user
resumeRouter.get("/:id", protect, getResumeById); // Get single resume by ID
resumeRouter.put("/:id", protect, updateResume); // Update resume
resumeRouter.delete("/:id", protect, deleteResume); // ✅ Delete resume
resumeRouter.post("/:id/upload-images", protect, uploadResumeImage); // Upload resume image
resumeRouter.put("/:id/upload-images", protect, uploadResumeImage); // Upload resume image

export default resumeRouter;
