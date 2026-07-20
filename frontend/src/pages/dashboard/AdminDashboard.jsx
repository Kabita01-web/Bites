import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  DollarSign,
  Users,
  UtensilsCrossed,
  Clock,
  TrendingUp,
  CalendarCheck,
} from "lucide-react";
import {
  getAllOrders,
  getAllUsers,
  getAllMenuItemsAdmin,
  getAllReservationsAdmin,
} from "../../services/api";
// ❌ Removed: import DashboardLayout from "./DashboardLayout";
// AdminDashboard renders INSIDE DashboardLayout's <Outlet />
// (see App.jsx route nesting) — it should never wrap itself in
// DashboardLayout again, or the sidebar/header render twice.

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalMenuItems: 0,
    pendingOrders: 0,
    todayOrders: 0,
    pendingReservations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [ordersRes, usersRes, menuRes, reservationsRes] = await Promise.all(
        [
          getAllOrders(),
          getAllUsers(),
          getAllMenuItemsAdmin(),
          getAllReservationsAdmin(),
        ],
      );

      const orders = ordersRes.orders || [];
      const users = usersRes.users || [];
      const menuItems = menuRes.data || [];
      const reservations = reservationsRes.reservations || [];

      const totalRevenue = orders.reduce(
        (sum, order) => sum + (order.total || 0),
        0,
      );
      const pendingOrders = orders.filter((o) => o.status === "pending").length;
      const todayOrders = orders.filter((o) => {
        const today = new Date();
        const orderDate = new Date(o.createdAt);
        return orderDate.toDateString() === today.toDateString();
      }).length;
      const pendingReservations = reservations.filter(
        (r) => r.status === "pending",
      ).length;

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalUsers: users.length,
        totalMenuItems: menuItems.length,
        pendingOrders,
        todayOrders,
        pendingReservations,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
      <div className={`p-3 rounded-lg ${color} w-fit`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-sm text-gray-500 mt-4">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
          >
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back! Here's what's happening with your restaurant.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="bg-blue-500"
        />
        <StatCard
          title="Revenue"
          value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-purple-500"
        />
        <StatCard
          title="Menu Items"
          value={stats.totalMenuItems}
          icon={UtensilsCrossed}
          color="bg-orange-500"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatCard
          title="Today's Orders"
          value={stats.todayOrders}
          icon={TrendingUp}
          color="bg-indigo-500"
        />
        <StatCard
          title="Pending Reservations"
          value={stats.pendingReservations}
          icon={CalendarCheck}
          color="bg-pink-500"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
