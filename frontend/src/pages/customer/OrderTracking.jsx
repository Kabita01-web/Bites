import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderDetails } from "../../services/api";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Home,
  ChevronRight,
  Calendar,
  MapPin,
  Phone,
} from "lucide-react";

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrderDetails(orderId);
      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.message || "Order not found");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setError(error.response?.data?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const steps = [
      { key: "pending", label: "Order Placed", icon: Clock, completed: true },
      {
        key: "confirmed",
        label: "Confirmed",
        icon: CheckCircle,
        completed: ["confirmed", "preparing", "delivered"].includes(status),
      },
      {
        key: "preparing",
        label: "Preparing",
        icon: Truck,
        completed: ["preparing", "delivered"].includes(status),
      },
      {
        key: "delivered",
        label: "Delivered",
        icon: CheckCircle,
        completed: status === "delivered",
      },
    ];

    const currentIndex = steps.findIndex((s) => s.key === status);
    return steps.map((step, index) => ({
      ...step,
      isActive: index <= currentIndex,
      isCurrent: step.key === status,
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-700">
            Order Not Found
          </h3>
          <p className="text-red-600 mt-2">
            {error || "We couldn't find this order."}
          </p>
          <Link
            to="/my-orders"
            className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusStep(order.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Tracking</h1>
          <p className="text-sm text-gray-500 mt-1">
            Order #{order._id.slice(-8).toUpperCase()}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/my-orders"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <Home className="w-4 h-4" />
            My Orders
          </Link>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-sm text-gray-500">Order Status</span>
            <h3 className="text-xl font-bold text-gray-900 capitalize">
              {order.status}
            </h3>
          </div>
          <span className="text-sm text-gray-400">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Timeline Steps */}
        <div className="relative">
          {statusSteps.map((step, index) => (
            <div
              key={step.key}
              className="flex items-start gap-4 mb-6 last:mb-0"
            >
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.isActive
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                {index < statusSteps.length - 1 && (
                  <div
                    className={`absolute top-10 left-1/2 w-0.5 h-8 -translate-x-1/2 ${
                      step.isActive ? "bg-primary   " : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 pt-1">
                <p
                  className={`font-semibold ${
                    step.isActive ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
                {step.isCurrent && (
                  <p className="text-sm text-primary mt-1">
                    Currently in progress...
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items?.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.name || "Item"} × {item.quantity || 1}
                </span>
                <span className="font-medium text-gray-900">
                  Rs. {(item.price * item.quantity || 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">
                Rs. {order.total?.toFixed(2) || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Delivery Address</h3>
          <div className="space-y-2 text-sm">
            <p className="font-medium text-gray-800">
              {order.deliveryAddress?.fullName || "N/A"}
            </p>
            <p className="text-gray-600">
              {order.deliveryAddress?.street || "N/A"}
            </p>
            <p className="text-gray-600">
              {order.deliveryAddress?.city || "N/A"}
            </p>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{order.deliveryAddress?.phone || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        {order.status !== "cancelled" && order.status !== "delivered" && (
          <button
            onClick={() => (window.location.href = "/contact")}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-center"
          >
            Need Help? Contact Us
          </button>
        )}
        {order.status === "delivered" && (
          <Link
            to={`/review/${order._id}`}
            className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-center"
          >
            ⭐ Rate Your Order
          </Link>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
