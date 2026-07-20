// backend/routes/reviewRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createReview,
  getReviewsByMenuItem,
  getMyReviews,
  updateReview,
  deleteReview,
  markHelpful,
} from "../controllers/reviewController.js";

const router = express.Router();

// Public routes
router.get("/menu/:menuItemId", getReviewsByMenuItem);

// Protected routes
router.post("/", protect, createReview);
router.get("/my", protect, getMyReviews);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);
router.put("/:id/helpful", protect, markHelpful);

export default router;
