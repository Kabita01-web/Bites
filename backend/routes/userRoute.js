import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  updateUser,
  getUserStats,
  getAllUsers,
} from "../controllers/userController.js";

const router = express.Router();

// IMPORTANT: specific routes before dynamic/catch-all ones
router.get("/stats", authMiddleware, getUserStats);
router.get("/", authMiddleware, getAllUsers);

// update profile
router.put("/editprofile/:userid", authMiddleware, updateUser);

export default router;
