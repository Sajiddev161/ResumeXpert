import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import fs from "fs";

// ✅ Setup path handling for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load environment variables
dotenv.config();

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Initialize Express App
const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Multer (for temporary image storage before upload)
const upload = multer({ dest: "uploads/" });

// ✅ Cloudinary Image Upload Route
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "resume_images",
    });

    // Delete file from local uploads folder after upload
    fs.unlinkSync(req.file.path);

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

// ✅ API Routes
app.use("/api/auth", userRoutes);
app.use("/api/resume", resumeRoutes);

// ✅ Serve uploaded images (if still needed locally)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "/uploads"), {
    setHeaders: (res, filePath) => {
      res.set("Access-Control-Allow-Origin", "http://localhost:5173");
    },
  })
);

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("✅ API is running successfully...");
});

// ✅ Handle Undefined Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "❌ Route not found",
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
});
