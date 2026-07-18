// backend/controllers/systemStatsController.js
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import Reservation from "../models/Reservation.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";

// GET /api/stats/system  (admin only)
export const getSystemStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // ---------------- Orders ----------------
    const [
      totalOrders,
      pendingOrders,
      todayOrders,
      thisWeekOrders,
      thisMonthOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
    ]);

    // ---------------- Revenue (paid orders only) ----------------
    const revenueAgg = async (extraMatch = {}) => {
      const result = await Order.aggregate([
        { $match: { isPaid: true, ...extraMatch } },
        {
          $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } },
        },
      ]);
      return result[0] || { total: 0, count: 0 };
    };

    const [totalRev, todayRev, weekRev, monthRev] = await Promise.all([
      revenueAgg(),
      revenueAgg({ paidAt: { $gte: startOfToday } }),
      revenueAgg({ paidAt: { $gte: startOfWeek } }),
      revenueAgg({ paidAt: { $gte: startOfMonth } }),
    ]);

    const totalRevenue = totalRev.total || 0;
    const todayRevenue = todayRev.total || 0;
    const thisWeekRevenue = weekRev.total || 0;
    const thisMonthRevenue = monthRev.total || 0;
    const averageOrderValue =
      totalRev.count > 0 ? totalRevenue / totalRev.count : 0;

    // ---------------- Users ----------------
    const [totalUsers, newUsersToday, newUsersThisWeek] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startOfToday } }),
      User.countDocuments({ createdAt: { $gte: startOfWeek } }),
    ]);
    // No last-login tracking exists yet, so "active users" isn't a real
    // metric we can compute — using totalUsers as a placeholder for now.
    const activeUsers = totalUsers;

    // ---------------- Menu Items ----------------
    const [totalMenuItems, availableItems] = await Promise.all([
      MenuItem.countDocuments(),
      MenuItem.countDocuments({ isAvailable: true }),
    ]);
    const outOfStockItems = totalMenuItems - availableItems;

    // ---------------- Popular Items (by quantity sold across orders) ----------------
    const popularItemsAgg = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          count: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, name: "$_id", count: 1, revenue: 1 } },
    ]);

    // ---------------- Reservations ----------------
    const [
      totalReservations,
      pendingReservations,
      todayReservations,
      confirmedReservations,
    ] = await Promise.all([
      Reservation.countDocuments(),
      Reservation.countDocuments({ status: "pending" }),
      Reservation.countDocuments({ createdAt: { $gte: startOfToday } }),
      Reservation.countDocuments({ status: "confirmed" }),
    ]);

    // ---------------- Payments ----------------
    // eSewa payments come from the Payment collection (only eSewa creates
    // records there today). Cash payments are inferred from paid Orders
    // with no eSewa merchant ID, since there's no Payment record for COD yet.
    const [
      esewaPayments,
      successfulEsewaPayments,
      failedEsewaPayments,
      cashPayments,
    ] = await Promise.all([
      Payment.countDocuments(),
      Payment.countDocuments({ status: "succeeded" }),
      Payment.countDocuments({ status: "failed" }),
      Order.countDocuments({
        isPaid: true,
        esewaMerchantOrderId: { $exists: false },
      }),
    ]);

    const totalPayments = esewaPayments + cashPayments;
    const successfulPayments = successfulEsewaPayments + cashPayments;
    const failedPayments = failedEsewaPayments;

    // ---------------- Ratings ----------------
    // No Review/Rating model exists yet in this codebase, so these stay 0
    // rather than being fabricated.
    const averageRating = 0;
    const totalReviews = 0;

    return res.status(200).json({
      totalOrders,
      pendingOrders,
      todayOrders,
      thisWeekOrders,
      thisMonthOrders,

      totalRevenue,
      todayRevenue,
      thisWeekRevenue,
      thisMonthRevenue,
      averageOrderValue,

      totalUsers,
      newUsersToday,
      newUsersThisWeek,
      activeUsers,

      totalMenuItems,
      availableItems,
      outOfStockItems,
      popularItems: popularItemsAgg,

      totalReservations,
      pendingReservations,
      todayReservations,
      confirmedReservations,

      totalPayments,
      esewaPayments,
      cashPayments,
      successfulPayments,
      failedPayments,

      averageRating,
      totalReviews,
    });
  } catch (error) {
    console.error("Get system stats error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
