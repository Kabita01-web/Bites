import express from "express";
import {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
} from "../controllers/reservationController.js";
import { protect, authorize, ROLES } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReservation);
router.get("/my", protect, getMyReservations);
router.get("/", protect, authorize(ROLES.ADMIN), getAllReservations);
router.put(
  "/:id/status",
  protect,
  authorize(ROLES.ADMIN),
  updateReservationStatus,
);

export default router;
