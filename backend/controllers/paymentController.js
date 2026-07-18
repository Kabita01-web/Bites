import crypto from "crypto";
import axios from "axios";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Cart from "../models/Cart.js";
import { generateMerchantOrderId } from "../utils/esewa.js";

// ============================================================
// 1) INITIATE eSEWA PAYMENT
// ============================================================
export const initiateEsewaPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user._id;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify order belongs to user
    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Check if already paid
    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: "Order already paid",
      });
    }

    // Generate merchant order ID if not exists
    if (!order.esewaMerchantOrderId) {
      order.esewaMerchantOrderId = generateMerchantOrderId();
      await order.save();
    }

    // ✅ Ensure all amounts are integers (no decimals)
    const amount = Math.round(order.subtotal || 0);
    const taxAmount = Math.round(order.tax || 0);
    const deliveryCharge = Math.round(order.deliveryFee || 0);
    const serviceCharge = 0;

    const totalAmount = amount + taxAmount + deliveryCharge + serviceCharge;

    const formData = {
      amount: amount.toString(),
      tax_amount: taxAmount.toString(),
      product_service_charge: serviceCharge.toString(),
      product_delivery_charge: deliveryCharge.toString(),
      total_amount: totalAmount.toString(),

      transaction_uuid: order.esewaMerchantOrderId,
      product_code: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST",
      success_url:
        process.env.ESEWA_SUCCESS_URL ||
        "http://localhost:5000/api/payments/esewa-success",
      failure_url:
        process.env.ESEWA_FAILURE_URL ||
        "http://localhost:5000/api/payments/esewa-failure",
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    // Generate signature
    const signatureString = `total_amount=${formData.total_amount},transaction_uuid=${formData.transaction_uuid},product_code=${formData.product_code}`;

    console.log("🔐 Signature string:", signatureString);

    const signature = crypto
      .createHmac("sha256", process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q")
      .update(signatureString)
      .digest("base64");

    formData.signature = signature;

    console.log("📤 Sending to eSewa:", {
      gatewayUrl: process.env.ESEWA_GATEWAY_URL,
      formData: formData,
    });

    res.status(200).json({
      success: true,
      gatewayUrl:
        process.env.ESEWA_GATEWAY_URL ||
        "https://uat.esewa.com.np/api/epay/main/v2/form",
      formData: formData,
      merchantOrderId: order.esewaMerchantOrderId,
      orderId: order._id,
    });
  } catch (error) {
    console.error("❌ Initiate eSewa payment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to initiate payment",
    });
  }
};

// ============================================================
// 2) HANDLE eSEWA SUCCESS CALLBACK
// ============================================================
export const handleEsewaSuccess = async (req, res) => {
  try {
    console.log("✅ eSewa Success Callback Received");
    console.log("Query params:", req.query);

    const { data, q } = req.query;

    if (!data) {
      console.error("❌ No data parameter in callback");
      return res.redirect(
        `${process.env.PAYMENT_FAILURE_REDIRECT || "http://localhost:5173/payment/failure"}?error=no_data`,
      );
    }

    // Decode the base64 data
    let decodedData;
    try {
      const decodedString = Buffer.from(data, "base64").toString("utf-8");
      decodedData = JSON.parse(decodedString);
      console.log("✅ Decoded eSewa Data:", decodedData);
    } catch (error) {
      console.error("❌ Failed to decode eSewa data:", error);
      return res.redirect(
        `${process.env.PAYMENT_FAILURE_REDIRECT || "http://localhost:5173/payment/failure"}?error=invalid_data`,
      );
    }

    // Find order by merchant order ID
    const order = await Order.findOne({
      esewaMerchantOrderId: decodedData.transaction_uuid,
    });

    if (!order) {
      console.error(
        "❌ Order not found for UUID:",
        decodedData.transaction_uuid,
      );
      return res.redirect(
        `${process.env.PAYMENT_FAILURE_REDIRECT || "http://localhost:5173/payment/failure"}?error=order_not_found`,
      );
    }

    console.log("✅ Order found:", order._id);

    // Verify payment with eSewa API
    try {
      const verificationResponse = await axios.get(
        `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${process.env.ESEWA_PRODUCT_CODE || "EPAYTEST"}&total_amount=${order.total}&transaction_uuid=${order.esewaMerchantOrderId}`,
      );

      console.log("🔍 Verification Response:", verificationResponse.data);

      if (verificationResponse.data.status === "COMPLETE") {
        // Mark order as paid
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentStatus = "paid";
        order.esewaTransactionId =
          decodedData.transaction_code || decodedData.transaction_id || "N/A";
        order.esewaReferenceId = decodedData.ref_id || "N/A";
        order.esewaResponseData = decodedData;
        await order.save();

        // Create the Payment record — required fields per schema:
        // order, user, esewaProductCode, esewaMerchantOrderId, esewaAmount, amount
        try {
          await Payment.create({
            order: order._id,
            user: order.user,
            esewaProductCode: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST",
            esewaMerchantOrderId: order.esewaMerchantOrderId,
            esewaTransactionId: order.esewaTransactionId,
            esewaReferenceId: order.esewaReferenceId,
            esewaAmount: order.total,
            esewaStatus: verificationResponse.data.status,
            esewaPaymentDate: new Date(),
            status: "succeeded",
            amount: order.total,
            currency: "NPR",
          });
        } catch (paymentLogErr) {
          // Don't let a logging failure block the user's success redirect —
          // the order itself is already correctly marked as paid.
          console.error(
            "⚠️ Order paid but failed to create Payment record:",
            paymentLogErr,
          );
        }

        // Clear cart
        await Cart.findOneAndDelete({ user: order.user });

        console.log("✅ Order marked as paid:", order._id);

        // Redirect to success page
        return res.redirect(
          `${process.env.PAYMENT_SUCCESS_REDIRECT || "http://localhost:5173/payment/success"}?orderId=${order._id}&method=esewa`,
        );
      } else {
        // Payment verification failed
        order.paymentStatus = "failed";
        await order.save();

        try {
          await Payment.create({
            order: order._id,
            user: order.user,
            esewaProductCode: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST",
            esewaMerchantOrderId: order.esewaMerchantOrderId,
            esewaStatus: verificationResponse.data.status,
            esewaAmount: order.total,
            status: "failed",
            amount: order.total,
            currency: "NPR",
            failureReason: `eSewa verification returned status: ${verificationResponse.data.status}`,
          });
        } catch (paymentLogErr) {
          console.error("⚠️ Failed to log failed payment:", paymentLogErr);
        }

        console.log(
          "❌ Verification failed:",
          verificationResponse.data.status,
        );
        return res.redirect(
          `${process.env.PAYMENT_FAILURE_REDIRECT || "http://localhost:5173/payment/failure"}?orderId=${order._id}&error=verification_failed`,
        );
      }
    } catch (error) {
      console.error("❌ Verification API error:", error);
      order.paymentStatus = "failed";
      await order.save();

      try {
        await Payment.create({
          order: order._id,
          user: order.user,
          esewaProductCode: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST",
          esewaMerchantOrderId: order.esewaMerchantOrderId,
          esewaAmount: order.total,
          status: "failed",
          amount: order.total,
          currency: "NPR",
          failureReason: "eSewa verification API error",
        });
      } catch (paymentLogErr) {
        console.error("⚠️ Failed to log failed payment:", paymentLogErr);
      }

      return res.redirect(
        `${process.env.PAYMENT_FAILURE_REDIRECT || "http://localhost:5173/payment/failure"}?orderId=${order._id}&error=verification_error`,
      );
    }
  } catch (error) {
    console.error("❌ eSewa Success Error:", error);
    return res.redirect(
      `${process.env.PAYMENT_FAILURE_REDIRECT || "http://localhost:5173/payment/failure"}?error=server_error`,
    );
  }
};

// ============================================================
// 3) HANDLE eSEWA FAILURE CALLBACK
// ============================================================
export const handleEsewaFailure = async (req, res) => {
  try {
    console.log("❌ eSewa Failure Callback Received");
    console.log("Query params:", req.query);

    const { data, q } = req.query;

    let orderId = null;

    if (data) {
      try {
        const decodedString = Buffer.from(data, "base64").toString("utf-8");
        const decodedData = JSON.parse(decodedString);
        console.log("❌ Decoded Failure Data:", decodedData);

        const order = await Order.findOne({
          esewaMerchantOrderId: decodedData.transaction_uuid,
        });

        if (order) {
          order.paymentStatus = "failed";
          order.esewaResponseData = decodedData;
          await order.save();
          orderId = order._id;
          console.log("❌ Order marked as failed:", orderId);

          // Log the failed/cancelled attempt too, so it shows up in the
          // admin Payment Transactions list instead of vanishing silently.
          try {
            await Payment.create({
              order: order._id,
              user: order.user,
              esewaProductCode: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST",
              esewaMerchantOrderId: order.esewaMerchantOrderId,
              esewaStatus: decodedData.status || "CANCELED",
              esewaAmount: order.total,
              status: "failed",
              amount: order.total,
              currency: "NPR",
              failureReason: "eSewa payment failed or was cancelled",
            });
          } catch (paymentLogErr) {
            console.error("⚠️ Failed to log failed payment:", paymentLogErr);
          }
        }
      } catch (error) {
        console.error("❌ Failed to decode failure data:", error);
      }
    }

    return res.redirect(
      `${process.env.PAYMENT_FAILURE_REDIRECT || "http://localhost:5173/payment/failure"}?orderId=${orderId || ""}&error=payment_cancelled`,
    );
  } catch (error) {
    console.error("❌ eSewa Failure Error:", error);
    return res.redirect(
      `${process.env.PAYMENT_FAILURE_REDIRECT || "http://localhost:5173/payment/failure"}?error=server_error`,
    );
  }
};

// ============================================================
// 4) VERIFY eSEWA PAYMENT
// ============================================================
export const verifyEsewaPayment = async (req, res) => {
  try {
    const { merchantOrderId } = req.query;

    if (!merchantOrderId) {
      return res.status(400).json({
        success: false,
        message: "Merchant order ID is required",
      });
    }

    const order = await Order.findOne({
      esewaMerchantOrderId: merchantOrderId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order: {
        id: order._id,
        isPaid: order.isPaid,
        paymentStatus: order.paymentStatus,
        esewaTransactionId: order.esewaTransactionId,
      },
    });
  } catch (error) {
    console.error("Verify eSewa payment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify payment",
    });
  }
};

// ============================================================
// 5) GET PAYMENT STATUS
// ============================================================
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      order: {
        id: order._id,
        isPaid: order.isPaid,
        paidAt: order.paidAt,
        paymentStatus: order.paymentStatus,
        esewaTransactionId: order.esewaTransactionId,
        total: order.total,
        items: order.items,
        deliveryAddress: order.deliveryAddress,
      },
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get payment status",
    });
  }
};

// ============================================================
// 6) GET ALL PAYMENTS (Admin only)
// ============================================================
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("order", "total status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get all payments error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get payments",
    });
  }
};

// ============================================================
// 7) REFUND PAYMENT (Admin only)
// ============================================================
export const refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Update payment status
    payment.status = "refunded";
    await payment.save();

    // Update order
    const order = await Order.findById(payment.order);
    if (order) {
      order.isPaid = false;
      order.paymentStatus = "refunded";
      await order.save();
    }

    return res.status(200).json({
      success: true,
      message: "Payment refunded successfully",
      payment,
    });
  } catch (error) {
    console.error("Refund payment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to refund payment",
    });
  }
};
