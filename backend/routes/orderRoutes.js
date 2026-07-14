import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js"; // ✅ Using auth.js
import {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import Order from "../models/Order.js";

const router = express.Router();

// User routes - requires authentication
router.post("/", protect, createOrder);
router.get("/", protect, getUserOrders);
router.get("/:id", protect, getOrder);
router.put("/:id/status", protect, updateOrderStatus);

// Admin routes
router.get(
  "/admin/all",
  protect,
  authorize("admin", "moderator"),
  async (req, res) => {
    try {
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate("userId", "username email");
      res.json({ success: true, orders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
);

export default router;
