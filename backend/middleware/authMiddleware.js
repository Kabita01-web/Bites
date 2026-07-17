import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const ROLES = {
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
};

// Protect middleware - requires authentication
export const protect = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies.token;

    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1]; // Bearer TOKEN
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Authorize middleware - checks user role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. ${req.user.role} role cannot access this resource`,
      });
    }

    next();
  };
};

// Admin auth (convenience function)
export const adminAuth = async (req, res, next) => {
  await protect(req, res, async () => {
    if (req.user.role !== ROLES.ADMIN && req.user.role !== ROLES.MODERATOR) {
      return res.status(403).json({
        message: `Access denied. ${req.user.role} role cannot access this resource`,
      });
    }
    next();
  });
};

// ✨ NEW: isAdmin middleware (for paymentRoutes.js)
export const isAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (req.user.role !== ROLES.ADMIN && req.user.role !== ROLES.MODERATOR) {
    return res.status(403).json({
      success: false,
      message: `Access denied. ${req.user.role} role cannot access this resource`,
    });
  }

  next();
};

// For backward compatibility
export default protect;
