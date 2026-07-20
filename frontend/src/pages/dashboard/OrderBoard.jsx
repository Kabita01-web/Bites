// frontend/src/pages/dashboard/OrderBoard.jsx
import React, { useState, useEffect } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/api";
import {
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Eye,
  RefreshCw,
  Search,
  Package,
} from "lucide-react";

const OrderBoard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      console.log("📦 Orders fetched:", data);
      setOrders(data.orders || []);
      setFilteredOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order._id?.toLowerCase().includes(term) ||
          order.user?.name?.toLowerCase().includes(term) ||
          order.user?.email?.toLowerCase().includes(term),
      );
    }

    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      console.log(`🔄 Updating order ${orderId} to ${newStatus}`);

      const response = await updateOrderStatus(orderId, { status: newStatus });

      if (response.success) {
        console.log(`✅ Order ${orderId} updated to ${newStatus}`);
        await fetchOrders();
        alert(`Order ${newStatus} successfully!`);
      } else {
        alert(response.message || "Failed to update order");
      }
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      alert(error.response?.data?.message || "Failed to update order");
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "Pending",
      },
      confirmed: {
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle,
        label: "Confirmed",
      },
      preparing: {
        color: "bg-purple-100 text-purple-800",
        icon: Truck,
        label: "Preparing",
      },
      delivered: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Delivered",
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        label: "Cancelled",
      },
    };
    return configs[status] || configs.pending;
  };

  const getStatusOptions = (currentStatus) => {
    const options = [
      "pending",
      "confirmed",
      "preparing",
      "delivered",
      "cancelled",
    ];
    return options;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Orders Management
          </h2>
          <p className="text-sm text-gray-500">
            {filteredOrders.length} orders found
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg text-sm w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="pending">⏳ Pending</option>
            <option value="confirmed">✅ Confirmed</option>
            <option value="preparing">🚚 Preparing</option>
            <option value="delivered">📦 Delivered</option>
            <option value="cancelled">❌ Cancelled</option>
          </select>

          {/* Refresh */}
          <button
            onClick={fetchOrders}
            className="p-2 text-gray-500 hover:text-orange-500 transition"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Items
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Total
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const statusConfig = getStatusBadge(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm font-medium">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-sm">
                        {order.user?.name || "Guest"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.user?.email || ""}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">
                        {order.items?.length || 0} items
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900">
                        Rs. {order.total?.toFixed(2) || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit ${statusConfig.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {/* Status Update Dropdown */}
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusUpdate(order._id, e.target.value)
                          }
                          className="text-xs border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        >
                          {getStatusOptions(order.status).map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>

                        {/* Quick Action Buttons */}
                        {order.status === "pending" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order._id, "confirmed")
                            }
                            className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition whitespace-nowrap"
                          >
                            ✅ Confirm
                          </button>
                        )}
                        {order.status === "confirmed" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order._id, "preparing")
                            }
                            className="px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 transition whitespace-nowrap"
                          >
                            🚚 Prepare
                          </button>
                        )}
                        {order.status === "preparing" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order._id, "delivered")
                            }
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition whitespace-nowrap"
                          >
                            📦 Deliver
                          </button>
                        )}
                        {order.status !== "cancelled" &&
                          order.status !== "delivered" && (
                            <button
                              onClick={() => {
                                if (window.confirm("Cancel this order?")) {
                                  handleStatusUpdate(order._id, "cancelled");
                                }
                              }}
                              className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition whitespace-nowrap"
                            >
                              ❌ Cancel
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Footer */}
      {filteredOrders.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
          <span>Total: {filteredOrders.length} orders</span>
          <span>
            Pending: {orders.filter((o) => o.status === "pending").length} |
            Confirmed: {orders.filter((o) => o.status === "confirmed").length} |
            Delivered: {orders.filter((o) => o.status === "delivered").length}
          </span>
        </div>
      )}
    </div>
  );
};

export default OrderBoard;
