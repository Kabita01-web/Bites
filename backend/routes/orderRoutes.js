import express from "express";
import { protect, authorize, isAdmin } from "../middleware/authMiddleware.js";
import {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import Order from "../models/Order.js";

const router = express.Router();

// ---------------------------------------------------------------------------
// User routes - requires authentication
// ---------------------------------------------------------------------------
router.post("/", protect, createOrder);
router.get("/", protect, getUserOrders);
router.get("/:id", protect, getOrder);
router.put("/:id/status", protect, updateOrderStatus);

// ---------------------------------------------------------------------------
// Admin routes
// ---------------------------------------------------------------------------
router.get(
  "/admin/all",
  protect,
  authorize("admin", "moderator"),
  async (req, res) => {
    try {
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate("user", "name email")
        .populate("items.menuItem", "name price image");

      res.json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      console.error("Admin get all orders error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch orders",
      });
    }
  },
);

// Admin: Update order status (full control)
router.put(
  "/admin/:id/status",
  protect,
  authorize("admin", "moderator"),
  updateOrderStatus,
);

// Admin: Get single order by ID
router.get("/admin/:id", protect, authorize("admin", "moderator"), getOrder);

export default router;
