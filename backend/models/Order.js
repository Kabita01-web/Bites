// backend/models/Order.js
import mongoose from "mongoose";
// backend/models/Order.js

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    // ✅ Nested deliveryAddress object
    deliveryAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      landmark: { type: String },
    },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    currency: { type: String, default: "NPR" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    esewaMerchantOrderId: { type: String, unique: true, sparse: true },
    esewaTransactionId: { type: String, unique: true, sparse: true },
    esewaReferenceId: { type: String },
    esewaResponseData: { type: Object },
  },
  {
    timestamps: true,
  },
);

// Auto-generate orderNumber if it's not already set.
orderSchema.pre("save", async function () {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `BITES-${timestamp}-${random}`;
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
