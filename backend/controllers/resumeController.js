import Resume from "../models/resumeModel.js";
import fs from "fs";
import path from "path";

// CREATE Resume
export const createResume = async (req, res) => {
  try {
    const { title } = req.body;

    // Default resume structure
    const defaultResumeData = {
      profileInfo: {
        profilePreviewUrl: "",
        fullName: "",
        designation: "",
        summary: "",
      },
      contactInfo: {
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
      },
      workExperience: [
        {
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      education: [
        {
          degree: "",
          institution: "",
          startDate: "",
          endDate: "",
        },
      ],
      skills: [{ name: "", progress: 0 }],
      projects: [
        {
          title: "",
          description: "",
          github: "",
          liveDemo: "",
        },
      ],
      certifications: [
        {
          title: "",
          issuer: "",
          year: "",
        },
      ],
      languages: [{ name: "", progress: 0 }],
      interests: [""],
    };

    // ✅ Make sure userId field matches your schema (not "user")
    const newResume = await Resume.create({
      userId: req.user._id,
      title,
      ...defaultResumeData,
      ...req.body, // merge custom data from frontend
    });

    res.status(201).json(newResume);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create resume",
      error: error.message,
    });
  }
};

// GET all resumes for logged-in user
export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve resumes",
      error: error.message,
    });
  }
};

// GET a single resume by ID
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve resume",
      error: error.message,
    });
  }
};

// UPDATE resume
export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or not authorized" });
    }

    // Merge updated fields
    Object.assign(resume, req.body);

    const savedResume = await resume.save();
    res.json(savedResume);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update resume",
      error: error.message,
    });
  }
};

// DELETE resume
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or not authorized" });
    }

    const uploadFolder = path.join(process.cwd(), "uploads");

    // Delete associated thumbnail
    if (resume.thumbnailLink) {
      const oldThumbnail = path.join(
        uploadFolder,
        path.basename(resume.thumbnailLink)
      );
      if (fs.existsSync(oldThumbnail)) {
        fs.unlinkSync(oldThumbnail);
      }
    }

    // Delete profile preview if exists
    if (resume.profileInfo?.profilePreviewUrl) {
      const oldProfile = path.join(
        uploadFolder,
        path.basename(resume.profileInfo.profilePreviewUrl)
      );
      if (fs.existsSync(oldProfile)) {
        fs.unlinkSync(oldProfile);
      }
    }

    // ✅ Correct deletion call
    await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete resume",
      error: error.message,
    });
  }
};
