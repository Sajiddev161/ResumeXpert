import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { join } from "path";
import { fileURLToPath } from "url";

// Setup path handling for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

// Load environment variables
dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // Allow frontend URL
  credentials: true,
}));
app.use(express.json({ limit: "50mb" })); // Increase payload size for image uploads
app.use(express.urlencoded({ extended: true }));

// Multer Configuration for Vercel (use /tmp for serverless)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/tmp"); // Use /tmp for Vercel’s writable directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Cloudinary Image Upload Route
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "resume_images",
    });

    // Clean up temporary file
    import("fs").then((fs) => fs.unlinkSync(req.file.path)).catch((err) => console.error("Error deleting temp file:", err));

    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message,
    });
  }
});

// API Routes
app.use("/api/auth", userRoutes);
app.use("/api/resume", resumeRoutes);

// Root Route (optional for API health check)
app.get("/api", (req, res) => {
  res.json({ success: true, message: "API is running successfully" });
});

// Handle Undefined Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Export for Vercel serverless
export default app;