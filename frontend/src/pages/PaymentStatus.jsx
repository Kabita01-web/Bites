import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const status = searchParams.get("status") || "success";
  const orderId = searchParams.get("orderId") || "N/A";

  useEffect(() => {
    // If no status parameter, redirect to home
    if (!searchParams.get("status")) {
      navigate("/");
    }
  }, [navigate, searchParams]);

  const isSuccess = status === "success";

  return (
    <div className="pt-28 pb-32 bg-gray-50 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-lg w-full mx-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isSuccess ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isSuccess ? (
            <CheckCircle size={48} className="text-green-500" />
          ) : (
            <XCircle size={48} className="text-red-500" />
          )}
        </motion.div>

        <h2
          className={`text-3xl font-serif font-bold mb-2 ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {isSuccess ? "Payment Successful!" : "Payment Failed"}
        </h2>

        <p className="text-gray-500 mb-4">
          {isSuccess
            ? "Thank you for your payment. Your order has been confirmed."
            : "We couldn't process your payment. Please try again."}
        </p>

        {orderId && orderId !== "N/A" && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-lg font-bold text-primary">{orderId}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            to={isSuccess ? "/" : "/checkout"}
            className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all"
          >
            {isSuccess ? "Continue Shopping" : "Try Again"}
          </Link>
          {isSuccess && (
            <Link
              to="/orders"
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all"
            >
              View My Orders
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentStatus;
