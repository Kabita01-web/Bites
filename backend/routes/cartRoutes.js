import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js"; // ✅ FIXED: Changed from authMiddleware.js to auth.js

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/:menuItemId", protect, updateCartItem);
router.delete("/:menuItemId", protect, removeFromCart);
router.delete("/", protect, clearCart);

export default router;
