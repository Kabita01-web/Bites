import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { initiateEsewaPayment, createOrder } from "../../services/api";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("esewa");
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    street: "",
    city: "",
    landmark: "",
  });

  // Calculate totals
  const subtotal = getCartTotal ? getCartTotal() : 0;
  const tax = Math.round(subtotal * 0.13);
  const deliveryFee = 50;
  const total = subtotal + tax + deliveryFee;

  const hasCartItems =
    cartItems && Array.isArray(cartItems) && cartItems.length > 0;

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate address
      if (
        !deliveryAddress.fullName ||
        !deliveryAddress.phone ||
        !deliveryAddress.street ||
        !deliveryAddress.city
      ) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      if (!hasCartItems) {
        setError("Your cart is empty");
        setLoading(false);
        return;
      }

      // ✅ FIX: Send as nested deliveryAddress object
      console.log("📤 Sending order data:", {
        deliveryAddress: {
          fullName: deliveryAddress.fullName,
          phone: deliveryAddress.phone,
          street: deliveryAddress.street,
          city: deliveryAddress.city,
          landmark: deliveryAddress.landmark || "",
        },
      });

      const orderData = await createOrder({
        fullName: deliveryAddress.fullName,
        phone: deliveryAddress.phone,
        street: deliveryAddress.street,
        city: deliveryAddress.city,
        landmark: deliveryAddress.landmark || "",
      });

      console.log("✅ Order created:", orderData);

      if (!orderData.success) {
        setError(orderData.message || "Failed to create order");
        setLoading(false);
        return;
      }

      const orderId = orderData.order._id;

      // 2. Handle payment
      if (paymentMethod === "esewa") {
        const paymentData = await initiateEsewaPayment(orderId);
        console.log("💳 Payment initiated:", paymentData);

        if (
          paymentData.success &&
          paymentData.gatewayUrl &&
          paymentData.formData
        ) {
          await clearCart();

          // Create and submit form to eSewa
          const form = document.createElement("form");
          form.method = "POST";
          form.action = paymentData.gatewayUrl;

          for (const [key, value] of Object.entries(paymentData.formData)) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = value;
            form.appendChild(input);
          }

          document.body.appendChild(form);
          form.submit();
        } else {
          setError(paymentData.message || "Payment initiation failed");
          setLoading(false);
        }
      } else if (paymentMethod === "cod") {
        await clearCart();
        navigate(`/payment/success?orderId=${orderId}&method=cod`);
      }
    } catch (err) {
      console.error("❌ Checkout error:", err);
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  // Render the form (keeping your existing UI)
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={deliveryAddress.fullName}
                    onChange={handleAddressChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={deliveryAddress.phone}
                    onChange={handleAddressChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={deliveryAddress.street}
                    onChange={handleAddressChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={deliveryAddress.city}
                    onChange={handleAddressChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={deliveryAddress.landmark}
                    onChange={handleAddressChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      value="esewa"
                      checked={paymentMethod === "esewa"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span>eSewa (Online Payment)</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !hasCartItems}
                className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
              >
                {loading ? "Processing..." : `Pay NPR ${total.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {hasCartItems ? (
                cartItems.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>NPR {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No items in cart</p>
              )}
            </div>

            <hr className="my-3" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>NPR {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>VAT (13%)</span>
                <span>NPR {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Fee</span>
                <span>NPR {deliveryFee.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>NPR {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
