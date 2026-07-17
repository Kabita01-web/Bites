import express from "express";
import rateLimit from "express-rate-limit";
import {
  initiateEsewaPayment,
  handleEsewaSuccess,
  handleEsewaFailure,
  verifyEsewaPayment,
  getPaymentStatus,
  getAllPayments,
} from "../controllers/paymentController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many payment requests from this IP, please try again later.",
  },
});

router.post("/initiate-esewa", paymentLimiter, protect, initiateEsewaPayment);

// eSewa's redirect callbacks — public, GET requests with query params.
// These cannot carry your normal auth token (the browser is being
// redirected by eSewa's server, not by your frontend's authenticated
// requests), so integrity relies entirely on signature + status-check
// verification inside the handlers, not on the `protect` middleware.
router.get("/esewa-success", handleEsewaSuccess);
router.get("/esewa-failure", handleEsewaFailure);

router.get("/esewa-verify", protect, verifyEsewaPayment);
router.get("/status/:orderId", protect, getPaymentStatus);
router.get("/", protect, isAdmin, getAllPayments);

export default router;