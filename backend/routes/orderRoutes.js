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

// ✅ SPECIFIC routes FIRST (before generic ones)
router.get("/my", protect, getUserOrders); // ✅ This must be FIRST

// ✅ Generic routes AFTER specific ones
router.post("/", protect, createOrder);
router.get("/", protect, getUserOrders); // This catches everything else
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

router.put(
  "/admin/:id/status",
  protect,
  authorize("admin", "moderator"),
  updateOrderStatus,
);

router.get("/admin/:id", protect, authorize("admin", "moderator"), getOrder);

export default router;
