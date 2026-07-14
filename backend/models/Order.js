import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
      },
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  subtotal: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    default: 0,
  },
  deliveryFee: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["esewa", "khalti", "mobileBanking", "card", "cash"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  orderStatus: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "preparing",
      "out-for-delivery",
      "delivered",
      "cancelled",
    ],
    default: "pending",
  },
  shippingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    apartment: String,
    city: String,
    state: String,
    zipCode: String,
  },
  specialInstructions: String,
  orderNumber: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate order number before saving
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

// ✅ ADD THIS - Default export
const Order = mongoose.model("Order", orderSchema);
export default Order;
