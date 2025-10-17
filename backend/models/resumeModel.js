import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    thumbnailLink: {
      type: String,
    },

    template: {
      theme: String,
      colorPalette: [String],
    },

    profileInfo: {
      profilePreviewUrl: String,
      fullName: String,
      designation: String,
      summary: String,
    },

    contactInfo: {
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      website: String,
    },

    workExperience: [
      {
        company: String,
        role: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],

    education: [
      {
        degree: String,
        institution: String,
        startDate: Date,
        endDate: Date,
      },
    ],

    skills: [
      {
        name: String,
        progress: Number, // e.g. 80 for 80%
      },
    ],

    projects: [
      {
        title: String,
        description: String,
        github: String,
        liveDemo: String,
      },
    ],

    certifications: [
      {
        title: String,
        issuer: String,
        year: String,
      },
    ],

    languages: [
      {
        name: String,
        progress: Number,
      },
    ],

    interests: [String],
  },
  {
    timestamps: true, // ✅ this automatically creates createdAt & updatedAt fields
  }
);

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
