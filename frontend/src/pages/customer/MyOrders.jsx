import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../services/api";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronRight,
  Calendar,
  Eye,
} from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  // frontend/src/pages/customer/MyOrders.jsx

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      console.log("📦 Raw orders data:", data);
      console.log("📦 Orders array:", data.orders);
      console.log("📦 Orders count:", data.orders?.length);

      // ✅ Log each order's status
      data.orders?.forEach((order) => {
        console.log(`Order ${order._id}: status = ${order.status}`);
      });

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        label: "Pending",
      },
      confirmed: {
        icon: CheckCircle,
        color: "text-blue-600",
        bg: "bg-blue-100",
        label: "Confirmed",
      },
      preparing: {
        icon: Truck,
        color: "text-purple-600",
        bg: "bg-purple-100",
        label: "Preparing",
      },
      delivered: {
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-100",
        label: "Delivered",
      },
      cancelled: {
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-100",
        label: "Cancelled",
      },
    };
    return configs[status] || configs.pending;
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 mt-1">Track and manage your orders</p>
        </div>
        <span className="text-sm text-gray-400">
          {orders.length} {orders.length === 1 ? "order" : "orders"} total
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          "all",
          "pending",
          "confirmed",
          "preparing",
          "delivered",
          "cancelled",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === status
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">
            No orders found
          </h3>
          <p className="text-gray-400 mt-2">
            {filter === "all"
              ? "You haven't placed any orders yet"
              : `No ${filter} orders`}
          </p>
          <Link
            to="/menu"
            className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
                        <StatusIcon
                          className={`w-5 h-5 ${statusConfig.color}`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-semibold text-gray-700">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}
                          >
                            {statusConfig.label}
                          </span>
                          <span className="text-xs text-gray-400">
                            {order.items?.length || 0} items
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        Rs. {order.total?.toFixed(2) || 0}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.paymentMethod || "eSewa"}
                      </p>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {order.items?.slice(0, 3).map((item, index) => (
                        <span key={index} className="text-sm text-gray-600">
                          {item.name || "Item"} × {item.quantity || 1}
                          {index < Math.min(order.items.length - 1, 2) && ", "}
                        </span>
                      ))}
                      {order.items?.length > 3 && (
                        <span className="text-sm text-gray-400">
                          +{order.items.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Estimated delivery: 30-45 min</span>
                    </div>
                    <Link
                      to={`/order/${order._id}`}
                      className="flex items-center gap-1 text-sm text-primary hover:text-accent font-medium transition"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    {order.status === "delivered" && (
                      <Link
                        to={`/review/${order._id}`}
                        className="flex items-center gap-1 text-sm text-green-500 hover:text-green-600 font-medium transition"
                      >
                        ⭐ Write a Review
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
