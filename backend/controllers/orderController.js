import mongoose from "mongoose";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Cart from "../models/Cart.js";
import { generateMerchantOrderId } from "../utils/esewa.js";

const TAX_RATE = 0.13;
const FLAT_DELIVERY_FEE_NPR = 50;

export const createOrder = async (req, res) => {
  console.log("🟢 createOrder STARTED");

  try {
    const userId = req.user._id;
    console.log("🟢 User ID:", userId);

    const { deliveryAddress } = req.body;
    console.log("🟢 Delivery address:", deliveryAddress);

    if (
      !deliveryAddress ||
      !deliveryAddress.fullName ||
      !deliveryAddress.phone ||
      !deliveryAddress.street ||
      !deliveryAddress.city
    ) {
      console.log("🔴 Missing address fields");
      return res.status(400).json({
        success: false,
        message:
          "Delivery address (fullName, phone, street, city) is required.",
      });
    }

    console.log("🟢 Finding cart...");
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.menuItem",
    );
    console.log("🟢 Cart found:", cart ? "Yes" : "No");

    if (!cart) {
      console.log("🔴 No cart found for user");
      return res.status(400).json({
        success: false,
        message: "Cart not found.",
      });
    }

    console.log("🟢 Cart items:", cart.items.length);

    if (!cart.items || cart.items.length === 0) {
      console.log("🔴 Cart is empty");
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    const orderItems = cart.items.map((cartItem) => {
      const menuItem = cartItem.menuItem;
      if (!menuItem) {
        throw new Error(
          "A cart item references a menu item that no longer exists.",
        );
      }
      return {
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: cartItem.quantity,
      };
    });

    const subtotal = Math.round(
      orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    );
    const tax = Math.round(subtotal * TAX_RATE);
    const deliveryFee = FLAT_DELIVERY_FEE_NPR;
    const total = Math.round(subtotal + tax + deliveryFee);

    let esewaMerchantOrderId = generateMerchantOrderId();
    let attempts = 0;
    while ((await Order.exists({ esewaMerchantOrderId })) && attempts < 5) {
      esewaMerchantOrderId = generateMerchantOrderId();
      attempts += 1;
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      deliveryAddress: {
        fullName: deliveryAddress.fullName,
        phone: deliveryAddress.phone,
        street: deliveryAddress.street,
        city: deliveryAddress.city,
        landmark: deliveryAddress.landmark || "",
      },
      subtotal,
      tax,
      deliveryFee,
      total,
      currency: "NPR",
      status: "pending",
      paymentStatus: "pending",
      esewaMerchantOrderId,
    });

    console.log("✅ Order created:", order._id);
    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("🔴 createOrder ERROR:", error);
    console.error("🔴 Error stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create order.",
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(`📦 Fetching orders for user: ${userId}`);

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.menuItem", "name price image");

    console.log(`📦 Found ${orders.length} orders`);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order id." });
    }

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("items.menuItem", "name price image")
      .lean();

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin" || req.user.role === "moderator";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order.",
      });
    }

    const payment = await Payment.findOne({ order: order._id }).lean();

    return res.status(200).json({
      success: true,
      order: { ...order, payment: payment || null },
    });
  } catch (error) {
    console.error("getOrder error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order.",
    });
  }
};

export const getOrderById = getOrder;

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, isPaid, paidAt } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order id." });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin" || req.user.role === "moderator";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this order.",
      });
    }

    if (status) {
      order.status = status;
      console.log(`🔄 Order ${id} status updated to: ${status}`);
    }
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (typeof isPaid === "boolean") order.isPaid = isPaid;
    if (paidAt) order.paidAt = paidAt;

    await order.save();

    return res.status(200).json({
      success: true,
      order,
      message: `Order status updated to ${status || "unchanged"}`,
    });
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status.",
    });
  }
};

export const markOrderAsPaid = async ({
  orderId,
  esewaTransactionId,
  esewaReferenceId,
  esewaResponseData,
}) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentStatus = "paid";
    order.esewaTransactionId = esewaTransactionId;
    order.esewaReferenceId = esewaReferenceId || null;
    order.esewaResponseData = esewaResponseData || null;
    order.status = "confirmed";

    await order.save();
    console.log(`✅ Order ${orderId} marked as CONFIRMED`);

    await Cart.findOneAndDelete({ user: order.user });

    return order;
  } catch (error) {
    console.error("markOrderAsPaid error:", error);
    throw error;
  }
};

export const markOrderPaymentFailed = async ({
  orderId,
  esewaResponseData,
}) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    order.paymentStatus = "failed";
    order.esewaResponseData = esewaResponseData || order.esewaResponseData;
    await order.save();
    console.log(`❌ Order ${orderId} marked as PAYMENT FAILED`);
    return order;
  } catch (error) {
    console.error("markOrderPaymentFailed error:", error);
    throw error;
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("items.menuItem", "name price image");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get all orders admin error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};
