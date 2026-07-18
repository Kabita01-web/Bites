// frontend/src/components/dashboard/StatCard.jsx
import React from "react";

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
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
};

export default StatCard;
