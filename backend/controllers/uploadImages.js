import Resume from "../models/resumeModel.js";
import upload from "../middleware/uploadMiddleware.js";

// ✅ Promise wrapper for multer
const runUpload = (req, res) =>
  new Promise((resolve, reject) => {
    const handler = upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "profileImage", maxCount: 1 },
    ]);
    handler(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

export const uploadResumeImage = async (req, res) => {
  try {
    // ✅ Wait for multer to finish
    await runUpload(req, res);

    const resumeId = req.params.id;
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    // ✅ Cloudinary returns secure URLs automatically
    const newThumbnail = req.files?.thumbnail?.[0];
    const newProfileImage = req.files?.profileImage?.[0];

    if (newThumbnail) {
      resume.thumbnailLink = newThumbnail.path; // Cloudinary URL
    }
    if (newProfileImage) {
      resume.profileInfo.profilePreviewUrl = newProfileImage.path; // Cloudinary URL
    }

    await resume.save();

   const messagelog= res.status(200).json({
      message: "✅ Images uploaded successfully to Cloudinary",
      thumbnailLink: resume.thumbnailLink,
      profilePreviewUrl: resume.profileInfo.profilePreviewUrl,
    });
    console.log(messagelog)
  } catch (error) {
    console.log(error)
    console.error("❌ Upload error:", error);
    res.send(500).json({
      message: "Image upload failed",
      error: error.message,
    });
  }
};
