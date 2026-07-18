// frontend/src/components/dashboard/OrderStatusBadge.jsx
import React from "react";

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: "⏳" },
    confirmed: { color: "bg-blue-100 text-blue-800", icon: "✅" },
    preparing: { color: "bg-purple-100 text-purple-800", icon: "👨‍🍳" },
    delivered: { color: "bg-green-100 text-green-800", icon: "🚚" },
    cancelled: { color: "bg-red-100 text-red-800", icon: "❌" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}
    >
      {config.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default OrderStatusBadge;
