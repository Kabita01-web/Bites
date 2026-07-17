import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { XCircle, RefreshCw, Home } from "lucide-react";

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const orderIdParam = searchParams.get("orderId");
    if (orderIdParam) {
      setOrderId(orderIdParam);
    }
  }, [searchParams]);

  const handleRetry = () => {
    if (orderId) {
      window.location.href = `/checkout?retry=${orderId}`;
    } else {
      window.location.href = "/cart";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed 😔
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment could not be processed. Please try again or use a
          different payment method.
        </p>

        {/* Order Details */}
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-semibold text-gray-900">
                {orderId.slice(-8)}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="flex items-center justify-center gap-2 w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
          >
            <RefreshCw size={20} />
            Retry Payment
          </button>
          <Link
            to="/menu"
            className="flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            <Home size={20} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
