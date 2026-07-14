import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import axios from "axios";
import crypto from "crypto";

// Initialize eSewa payment
export const initiateEsewa = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const payment = new Payment({
      orderId: order._id,
      userId: userId,
      amount: order.total,
      method: "esewa",
      status: "pending",
    });
    await payment.save();

    const transactionUuid = `TXN${Date.now()}`;
    const productId = `PROD${order._id.toString().slice(-6)}`;

    const esewaData = {
      amount: order.total.toString(),
      product_id: productId,
      transaction_uuid: transactionUuid,
      product_delivery_charge: "0",
      product_service_charge: "0",
      tax_amount: "0",
      total_amount: order.total.toString(),
      success_url: `${process.env.FRONTEND_URL}/payment-success?orderId=${orderId}`,
      failure_url: `${process.env.FRONTEND_URL}/payment-failure?orderId=${orderId}`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      product_code: process.env.ESEWA_MERCHANT_ID || "EPAYTEST",
    };

    const signatureData = `total_amount=${esewaData.total_amount},transaction_uuid=${esewaData.transaction_uuid},product_code=${esewaData.product_code}`;
    const signature = crypto
      .createHmac("sha256", process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q")
      .update(signatureData)
      .digest("base64");

    esewaData.signature = signature;

    payment.transactionId = transactionUuid;
    await payment.save();

    res.json({
      success: true,
      paymentUrl: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
      data: esewaData,
      transactionId: transactionUuid,
    });
  } catch (error) {
    console.error("eSewa initiation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify eSewa payment
export const verifyEsewa = async (req, res) => {
  try {
    const { transactionId, orderId, amount, productId } = req.body;

    const payment = await Payment.findOne({ transactionId });
    if (payment) {
      payment.status = "paid";
      payment.gatewayResponse = { verified: true, transactionId };
      await payment.save();

      const order = await Order.findById(payment.orderId);
      if (order) {
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        await order.save();
      }
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      orderId: orderId,
    });
  } catch (error) {
    console.error("eSewa verification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Initialize Khalti payment
export const initiateKhalti = async (req, res) => {
  try {
    const { orderId, mobile } = req.body;
    const userId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const payment = new Payment({
      orderId: order._id,
      userId: userId,
      amount: order.total,
      method: "khalti",
      status: "pending",
    });
    await payment.save();

    const khaltiData = {
      amount: Math.round(order.total * 100),
      product_identity: `ORD${order._id.toString().slice(-6)}`,
      product_name: "Food Order",
      product_url: `${process.env.FRONTEND_URL}/`,
      mobile: mobile || order.shippingAddress.phone,
      email: order.shippingAddress.email || "customer@example.com",
      website_url: process.env.FRONTEND_URL,
      transaction_id: `TXN${Date.now()}`,
    };

    const transactionId = khaltiData.transaction_id;
    payment.transactionId = transactionId;
    await payment.save();

    res.json({
      success: true,
      paymentUrl: "https://khalti.com/epayment/",
      transactionId: transactionId,
    });
  } catch (error) {
    console.error("Khalti initiation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Khalti payment
export const verifyKhalti = async (req, res) => {
  try {
    const { transactionId, orderId } = req.body;

    const payment = await Payment.findOne({ transactionId });
    if (payment) {
      payment.status = "paid";
      payment.gatewayResponse = { verified: true };
      await payment.save();

      const order = await Order.findById(payment.orderId);
      if (order) {
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        await order.save();
      }
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      orderId: orderId,
    });
  } catch (error) {
    console.error("Khalti verification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Process Cash on Delivery
export const processCashOnDelivery = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const payment = new Payment({
      orderId: order._id,
      userId: userId,
      amount: order.total,
      method: "cash",
      status: "pending",
    });
    await payment.save();

    order.paymentStatus = "pending";
    order.orderStatus = "confirmed";
    await order.save();

    res.json({
      success: true,
      message: "Order placed with Cash on Delivery",
      orderId: orderId,
    });
  } catch (error) {
    console.error("COD processing error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ ADD THIS - Payment Webhook
export const webhook = async (req, res) => {
  try {
    const { transactionId, orderId, status } = req.body;

    const payment = await Payment.findOne({ transactionId });
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    if (status === "success") {
      payment.status = "paid";
      await payment.save();

      const order = await Order.findById(payment.orderId);
      if (order) {
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        await order.save();
      }
    } else {
      payment.status = "failed";
      await payment.save();
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ ADD THIS - Get Payment Status
export const getPaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const payment = await Payment.findOne({ transactionId });
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    res.json({
      success: true,
      payment: {
        status: payment.status,
        amount: payment.amount,
        method: payment.method,
        transactionId: payment.transactionId,
        createdAt: payment.createdAt,
      },
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
