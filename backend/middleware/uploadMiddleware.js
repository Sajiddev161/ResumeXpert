import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ✅ Allowed file types
const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

// ✅ Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const originalName = file.originalname.replace(/\s+/g, "-").toLowerCase();
    return {
      folder: "resumes", // Cloudinary folder name
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      public_id: `${Date.now()}-${originalName}`,
      transformation: [{ width: 800, height: 800, crop: "limit" }],
    };
  },
});

// ✅ File filter (only allow specific image types)
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only .jpg, .jpeg, .png, and .webp files are allowed"), false);
  }
};

// ✅ Multer instance for Cloudinary uploads
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB max file size
  },
});

// ✅ Export ready-to-use middleware
export default upload;
