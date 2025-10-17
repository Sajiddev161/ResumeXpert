import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ Check if token exists in header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      // ✅ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Find user and attach to request (without password)
      req.user = await User.findById(decoded.id).select("-password");

      // ✅ If no user found
      if (!req.user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      next(); // ✅ Continue to next middleware/controller
    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }
  } catch (error) {
    console.error("❌ JWT Error:", error);
    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid or expired token",
      error: error.message,
    });
  }
};
