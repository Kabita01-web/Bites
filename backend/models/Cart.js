import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1, default: 1 },
});

// backend/models/Cart.js
const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
      quantity: { type: Number, default: 1 },
    },
  ],
});

export default mongoose.model("Cart", cartSchema);
