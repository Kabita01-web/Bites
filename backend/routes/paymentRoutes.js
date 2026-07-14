import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  initiateEsewa,
  verifyEsewa,
  initiateKhalti,
  verifyKhalti,
  processCashOnDelivery,
  webhook,
  getPaymentStatus, // ✅ This is now exported
} from "../controllers/paymentController.js";

const router = express.Router();

// Payment initiation
router.post("/esewa/initiate", protect, initiateEsewa);
router.post("/khalti/initiate", protect, initiateKhalti);
router.post("/cash", protect, processCashOnDelivery);

// Payment verification
router.post("/esewa/verify", protect, verifyEsewa);
router.post("/khalti/verify", protect, verifyKhalti);

// Webhook (no auth - called by payment gateway)
router.post("/webhook", webhook);

// Get payment status - requires authentication
router.get("/status/:transactionId", protect, getPaymentStatus);

export default router;
