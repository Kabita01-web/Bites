import Order from "../models/Order.js";

// Create order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderData = req.body;

    const order = new Order({
      userId: userId,
      ...orderData,
    });

    await order.save();

    res.status(201).json({
      success: true,
      orderId: order._id,
      orderNumber: order.orderNumber,
      total: order.total,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.userId.toString() !== req.user.id && req.user.role === "user") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (req.user.role === "user") {
      if (status === "cancelled" && order.orderStatus === "pending") {
        order.orderStatus = "cancelled";
        await order.save();
        return res.json({ success: true, order });
      }
      return res
        .status(403)
        .json({ success: false, message: "Cannot update order" });
    }

    order.orderStatus = status;
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
