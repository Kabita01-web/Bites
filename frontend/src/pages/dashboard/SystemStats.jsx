// frontend/src/pages/dashboard/SystemStats.jsx
import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  DollarSign,
  Users,
  UtensilsCrossed,
  Clock,
  TrendingUp,
  CalendarCheck,
  Star,
  AlertCircle,
} from "lucide-react";
import { getSystemStats } from "../../services/api";

const SystemStats = () => {
  const [stats, setStats] = useState({
    // 📦 Order Stats
    totalOrders: 0,
    pendingOrders: 0,
    todayOrders: 0,
    thisWeekOrders: 0,
    thisMonthOrders: 0,

    // 💰 Revenue Stats
    totalRevenue: 0,
    todayRevenue: 0,
    thisWeekRevenue: 0,
    thisMonthRevenue: 0,
    averageOrderValue: 0,

    // 👥 User Stats
    totalUsers: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    activeUsers: 0,

    // 🍽️ Menu Stats
    totalMenuItems: 0,
    availableItems: 0,
    outOfStockItems: 0,
    popularItems: [],

    // 📅 Reservation Stats
    totalReservations: 0,
    pendingReservations: 0,
    todayReservations: 0,
    confirmedReservations: 0,

    // 💳 Payment Stats
    totalPayments: 0,
    esewaPayments: 0,
    cashPayments: 0,
    successfulPayments: 0,
    failedPayments: 0,

    // ⭐ Rating Stats
    averageRating: 0,
    totalReviews: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getSystemStats();
      // Merge onto defaults instead of replacing outright, so any field
      // missing from the API response keeps its safe default (0 / [])
      // rather than becoming undefined and crashing .toLocaleString().
      setStats((prev) => ({ ...prev, ...data }));
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 📊 Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders ?? 0}
          icon={ShoppingBag}
          color="bg-blue-500"
          subtitle={`+${stats.todayOrders ?? 0} today`}
        />
        <StatCard
          title="Total Revenue"
          value={`Rs. ${(stats.totalRevenue ?? 0).toLocaleString()}`}
          icon={DollarSign}
          color="bg-green-500"
          subtitle={`Rs. ${(stats.todayRevenue ?? 0).toLocaleString()} today`}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers ?? 0}
          icon={Users}
          color="bg-purple-500"
          subtitle={`+${stats.newUsersToday ?? 0} today`}
        />
        <StatCard
          title="Menu Items"
          value={stats.totalMenuItems ?? 0}
          icon={UtensilsCrossed}
          color="bg-orange-500"
          subtitle={`${stats.availableItems ?? 0} available`}
        />
      </div>

      {/* 📈 Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders ?? 0}
          icon={Clock}
          color="bg-yellow-500"
          subtitle="Need attention"
        />
        <StatCard
          title="Today's Orders"
          value={stats.todayOrders ?? 0}
          icon={TrendingUp}
          color="bg-indigo-500"
          subtitle={`${stats.thisWeekOrders ?? 0} this week`}
        />
        <StatCard
          title="Reservations"
          value={stats.totalReservations ?? 0}
          icon={CalendarCheck}
          color="bg-pink-500"
          subtitle={`${stats.pendingReservations ?? 0} pending`}
        />
        <StatCard
          title="Avg. Order Value"
          value={`Rs. ${(stats.averageOrderValue ?? 0).toLocaleString()}`}
          icon={Star}
          color="bg-teal-500"
          subtitle="Average per order"
        />
      </div>

      {/* 📋 Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Methods
          </h3>
          <div className="space-y-3">
            <PaymentMethodRow
              label="eSewa"
              count={stats.esewaPayments ?? 0}
              total={stats.totalPayments ?? 0}
              color="bg-purple-500"
            />
            <PaymentMethodRow
              label="Cash on Delivery"
              count={stats.cashPayments ?? 0}
              total={stats.totalPayments ?? 0}
              color="bg-green-500"
            />
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Items
          </h3>
          {stats.popularItems && stats.popularItems.length > 0 ? (
            <div className="space-y-3">
              {stats.popularItems.slice(0, 5).map((item, index) => (
                <PopularItemRow
                  key={index}
                  rank={index + 1}
                  name={item.name}
                  orders={item.count}
                  revenue={item.revenue}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No popular items data yet</p>
          )}
        </div>
      </div>

      {/* ⚠️ Alerts */}
      {(stats.outOfStockItems ?? 0) > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">
            ⚠️ {stats.outOfStockItems} menu items are out of stock!
          </span>
        </div>
      )}
    </div>
  );
};

// 📊 Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
    </div>
    <h3 className="text-sm text-gray-500 mt-4">{title}</h3>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

// 💳 Payment Method Row
const PaymentMethodRow = ({ label, count, total, color }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold">
          {count} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// 📈 Popular Item Row
const PopularItemRow = ({ rank, name, orders, revenue }) => (
  <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
    <div className="flex items-center gap-3">
      <span
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          rank === 1
            ? "bg-yellow-100 text-yellow-700"
            : rank === 2
              ? "bg-gray-200 text-gray-700"
              : rank === 3
                ? "bg-orange-100 text-orange-700"
                : "bg-gray-100 text-gray-500"
        }`}
      >
        {rank}
      </span>
      <span className="text-sm font-medium text-gray-700">{name}</span>
    </div>
    <div className="text-right">
      <span className="text-sm font-semibold text-gray-900">
        {orders} orders
      </span>
      <span className="text-xs text-gray-500 ml-2">Rs. {revenue}</span>
    </div>
  </div>
);

export default SystemStats;
