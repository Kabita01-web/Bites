// backend/routes/statsRoute.js
import express from "express";
import { getSystemStats } from "../controllers/systemStatsController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // adjust filename/path to match your actual auth middleware

const router = express.Router();

// Admin-only. If you have a role-check middleware (e.g. adminOnly / authorize(["admin"])),
// add it here the same way your other admin routes do it.
router.get("/system", authMiddleware, getSystemStats);

export default router;
