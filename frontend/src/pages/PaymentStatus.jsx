import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import {
  getPaymentStatus,
  verifyEsewaPayment,
  initiateEsewaPayment,
} from "../services/api";
import { useCart } from "../context/CartContext";

// -----------------------------------------------------------------------
// How the user lands here:
//   - Our backend's /api/payments/esewa-success handler already verified
//     the signature + called eSewa's status API, then redirected to
//     /payment-status?status=success&orderId=<id>
//   - Or /api/payments/esewa-failure redirected to
//     /payment-status?status=failed&merchantOrderId=<id>
//   - Or Cash on Delivery redirected here directly with
//     ?status=success&orderId=<id>&method=cod
// This page's job is mostly to display that outcome and, for the "failed"
// case with no clear confirmation yet, do one more explicit verify call
// as a safety net (e.g. if the user bookmarked/refreshed this URL).
// -----------------------------------------------------------------------

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const statusParam = searchParams.get("status");
  const orderId = searchParams.get("orderId");
  const merchantOrderId = searchParams.get("merchantOrderId");
  const method = searchParams.get("method");

  const [status, setStatus] = useState("checking"); // checking | succeeded | failed
  const [order, setOrder] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const resolveStatus = useCallback(async () => {
    // Cash on Delivery never touches eSewa — trust the redirect directly.
    if (method === "cod" && orderId) {
      try {
        const data = await getPaymentStatus(orderId);
        setOrder(data.order);
        setStatus("succeeded");
      } catch (err) {
        setErrorMessage(
          err?.response?.data?.message || "Could not load order.",
        );
        setStatus("failed");
      }
      return;
    }

    if (statusParam === "success" && orderId) {
      try {
        const data = await getPaymentStatus(orderId);
        setOrder(data.order);
        if (data.order.isPaid) {
          setStatus("succeeded");
          clearCart(); // clear only once we've confirmed payment
        } else {
          // Backend redirected us here as "success" but the order isn't
          // marked paid yet — re-verify explicitly rather than assume.
          if (data.order.esewaMerchantOrderId) {
            const verifyRes = await verifyEsewaPayment(
              data.order.esewaMerchantOrderId,
            );
            if (verifyRes.verified) {
              setStatus("succeeded");
              setOrder(verifyRes.order);
              clearCart();
            } else {
              setStatus("failed");
            }
          } else {
            setStatus("failed");
          }
        }
      } catch (err) {
        setErrorMessage(
          err?.response?.data?.message || "Could not confirm payment status.",
        );
        setStatus("failed");
      }
      return;
    }

    if (statusParam === "failed") {
      // Give it one explicit verify attempt in case the failure redirect
      // fired before eSewa's status API had caught up.
      if (merchantOrderId) {
        try {
          const verifyRes = await verifyEsewaPayment(merchantOrderId);
          if (verifyRes.verified) {
            setStatus("succeeded");
            setOrder(verifyRes.order);
            clearCart();
            return;
          }
        } catch {
          // fall through to "failed" display below
        }
      }
      setStatus("failed");
      return;
    }

    // No usable params at all.
    setStatus("failed");
    setErrorMessage("No payment information was found in the URL.");
  }, [statusParam, orderId, merchantOrderId, method, clearCart]);

  useEffect(() => {
    resolveStatus();
  }, [resolveStatus]);

  const handleRetry = async () => {
    if (!orderId) {
      setErrorMessage(
        "Can't retry — no order reference available. Please start checkout again.",
      );
      return;
    }
    setIsRetrying(true);
    setErrorMessage(null);
    try {
      const intentRes = await initiateEsewaPayment(orderId);
      // Build and auto-submit a fresh form, same pattern as Checkout.jsx.
      const form = document.createElement("form");
      form.method = "POST";
      form.action = intentRes.paymentUrl;
      Object.entries(intentRes.formFields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value ?? "";
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message ||
          "Could not start a new payment attempt.",
      );
      setIsRetrying(false);
    }
  };

  if (status === "checking") {
    return (
      <div className="payment-status-page">
        <h1>Checking payment status...</h1>
        <p>Please wait a moment.</p>
      </div>
    );
  }

  if (status === "succeeded") {
    return (
      <div className="payment-status-page payment-status-success">
        <h1>{method === "cod" ? "Order placed!" : "Payment successful!"}</h1>
        <p>
          {method === "cod"
            ? "Your order has been confirmed for Cash on Delivery."
            : "Thank you — your eSewa payment was confirmed."}
        </p>
        {order && (
          <div className="order-confirmation">
            <p>Order ID: {order._id}</p>
            <p>Total: NPR {order.total?.toFixed(2)}</p>
            <p>Status: {order.status}</p>
            {order.esewaTransactionId && (
              <p>eSewa Transaction ID: {order.esewaTransactionId}</p>
            )}
          </div>
        )}
        <button onClick={() => navigate(`/orders/${order?._id || orderId}`)}>
          View Order Details
        </button>
      </div>
    );
  }

  return (
    <div className="payment-status-page payment-status-failed">
      <h1>Payment failed</h1>
      <p>
        {errorMessage ||
          "We couldn't confirm your eSewa payment. No charge was completed."}
      </p>
      <button onClick={handleRetry} disabled={isRetrying}>
        {isRetrying ? "Redirecting to eSewa..." : "Try Again"}
      </button>
    </div>
  );
};

export default PaymentStatus;
