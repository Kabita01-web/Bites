import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ---------------------------------------------------------------
    // eSewa-specific fields
    // ---------------------------------------------------------------
    esewaProductCode: {
      type: String,
      required: true, // e.g. "EPAYTEST" in UAT, your real merchant code in production
    },
    // Our own unique order reference, sent to eSewa as `transaction_uuid`
    // and used again in the status-check API call.
    esewaMerchantOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // eSewa's transaction identifier once payment completes
    // (`transaction_code` in eSewa's callback payload).
    esewaTransactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    esewaReferenceId: {
      type: String,
      default: null,
    },
    esewaAmount: {
      type: Number,
      required: true, // total_amount actually charged, in NPR
    },
    esewaStatus: {
      type: String, // raw status string as returned by eSewa, e.g. "COMPLETE", "PENDING", "FULL_REFUND", "CANCELED", "NOT_FOUND"
      default: null,
    },
    esewaPaymentDate: {
      type: Date,
      default: null,
    },

    // Normalized internal status, independent of eSewa's exact vocabulary,
    // used consistently across the rest of the app.
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded", "canceled"],
      default: "pending",
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "NPR",
    },
    failureReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
