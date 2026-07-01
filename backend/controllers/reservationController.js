import Reservation from "../models/Reservation.js";

// Create reservation
export const createReservation = async (req, res) => {
  try {
    const { date, time, guests, occasion, specialRequests } = req.body;

    const reservation = await Reservation.create({
      user: req.user._id, // comes from your auth middleware
      date,
      time,
      guests,
      occasion,
      specialRequests,
    });

    res.status(201).json(reservation);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create reservation", error: err.message });
  }
};

// Get logged-in user's reservations
export const getMyReservations = async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id }).sort({
    date: -1,
  });
  res.json(reservations);
};

// Admin: get all reservations
export const getAllReservations = async (req, res) => {
  const reservations = await Reservation.find()
    .populate("user", "username email")
    .sort({ date: -1 });
  res.json(reservations);
};

// Admin: update status
export const updateReservationStatus = async (req, res) => {
  const { status } = req.body;
  const reservation = await Reservation.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
  if (!reservation)
    return res.status(404).json({ message: "Reservation not found" });
  res.json(reservation);
};
