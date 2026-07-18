// frontend/src/pages/dashboard/PaymentTransactions.jsx
import React, { useState, useEffect } from "react";
import { getAllPayments, refundPayment } from "../../services/api";
import {
  Search,
  RefreshCw,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

const PaymentTransactions = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await getAllPayments();
      setPayments(data.payments || []);
      setFilteredPayments(data.payments || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p._id?.toLowerCase().includes(term) ||
          p.order?._id?.toLowerCase().includes(term),
      );
    }

    setFilteredPayments(filtered);
  };

  const handleRefund = async (paymentId) => {
    if (window.confirm("Are you sure you want to refund this payment?")) {
      try {
        await refundPayment(paymentId);
        await fetchPayments();
      } catch (error) {
        console.error("Error refunding payment:", error);
      }
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "succeeded":
        return {
          icon: CheckCircle,
          color: "text-green-500",
          bg: "bg-green-100",
          label: "Success",
        };
      case "pending":
        return {
          icon: Clock,
          color: "text-yellow-500",
          bg: "bg-yellow-100",
          label: "Pending",
        };
      case "failed":
        return {
          icon: XCircle,
          color: "text-red-500",
          bg: "bg-red-100",
          label: "Failed",
        };
      case "refunded":
        return {
          icon: TrendingUp,
          color: "text-gray-500",
          bg: "bg-gray-100",
          label: "Refunded",
        };
      default:
        return {
          icon: Clock,
          color: "text-gray-500",
          bg: "bg-gray-100",
          label: status,
        };
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Payment Transactions
          </h2>
          <p className="text-sm text-gray-500">
            Total: {filteredPayments.length} transactions
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg text-sm w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="succeeded">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <button
            onClick={fetchPayments}
            className="p-2 text-gray-500 hover:text-accent transition"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Transaction ID
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Order
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Method
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
            {filteredPayments.slice(0, 20).map((payment) => {
              const statusConfig = getStatusConfig(payment.status);
              const StatusIcon = statusConfig.icon;

              return (
                <tr key={payment._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-mono">
                    #{payment._id.slice(-8)}
                  </td>
                  <td className="py-3 px-4 text-sm font-mono">
                    #{payment.order?._id?.slice(-6) || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold">
                    Rs. {payment.amount?.toFixed(2) || 0}
                  </td>
                  <td className="py-3 px-4 text-sm capitalize">
                    {payment.paymentMethod || "eSewa"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${statusConfig.bg} ${statusConfig.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {payment.status === "succeeded" && (
                      <button
                        onClick={() => handleRefund(payment._id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredPayments.length === 0 && (
        <p className="text-gray-500 text-center py-4">No payments found</p>
      )}
    </div>
  );
};

export default PaymentTransactions;
