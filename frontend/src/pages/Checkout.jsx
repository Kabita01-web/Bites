import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  CreditCard,
  MapPin,
  Phone,
  User,
  Mail,
  Truck,
  Clock,
  CheckCircle,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  Smartphone,
  Wallet,
  Building2,
  Lock,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

// Payment gateway configurations
const PAYMENT_CONFIGS = {
  esewa: {
    name: "eSewa",
    icon: "💳",
    merchantId: "EPAYTEST",
    productId: "EPAYTEST",
    callbackUrl: `${window.location.origin}/payment-success`,
    successUrl: `${window.location.origin}/payment-success`,
    failureUrl: `${window.location.origin}/payment-failure`,
  },
  khalti: {
    name: "Khalti",
    icon: "🏦",
    publicKey: "test_public_key",
    secretKey: "test_secret_key",
    callbackUrl: `${window.location.origin}/payment-success`,
  },
  mobileBanking: {
    name: "Mobile Banking",
    icon: "📱",
    banks: [
      "NIC Asia Bank",
      "Nabil Bank",
      "Global IME Bank",
      "Prabhu Bank",
      "Siddhartha Bank",
      "Himalayan Bank",
      "NMB Bank",
      "Bank of Kathmandu",
      "Laxmi Bank",
      "Century Bank",
    ],
  },
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getSubtotal, clearCart } = useCart();
  const { user } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentError, setPaymentError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    deliveryInstructions: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("esewa");
  const [selectedBank, setSelectedBank] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const serviceCharge = 0;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + serviceCharge + tax;

  useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      navigate("/cart");
    }
  }, [cartItems, navigate, orderComplete]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    if (name === "cardNumber") {
      const cleaned = value.replace(/\s/g, "");
      const formatted = cleaned.replace(/(\d{4})/g, "$1 ").trim();
      setCardDetails((prev) => ({ ...prev, cardNumber: formatted }));
      return;
    }
    if (name === "expiryDate") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length >= 2) {
        const formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        setCardDetails((prev) => ({ ...prev, expiryDate: formatted }));
        return;
      }
      setCardDetails((prev) => ({ ...prev, expiryDate: cleaned }));
      return;
    }
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Initialize eSewa payment
  const initiateEsewaPayment = async () => {
    try {
      // In production, this would be a backend API call
      // For demo, we'll simulate the payment flow
      const paymentData = {
        amount: total,
        productId: "EPAYTEST",
        productName: "Food Order",
        merchantId: "EPAYTEST",
        callbackUrl: `${window.location.origin}/payment-success`,
        successUrl: `${window.location.origin}/payment-success`,
        failureUrl: `${window.location.origin}/payment-failure`,
        transactionId: `TXN${Date.now()}`,
      };

      // Simulate eSewa redirect
      console.log("Initiating eSewa payment:", paymentData);

      // In production, redirect to eSewa payment page
      // window.location.href = `https://esewa.com.np/epay/main?${new URLSearchParams(paymentData)}`;

      // For demo, simulate successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return { success: true };
    } catch (error) {
      console.error("eSewa payment failed:", error);
      return { success: false, error: error.message };
    }
  };

  // Initialize Khalti payment
  const initiateKhaltiPayment = async () => {
    try {
      // Khalti payment initialization
      const paymentData = {
        amount: total * 100, // Khalti uses paisa (1 NPR = 100 paisa)
        product_identity: "food_order",
        product_name: "Food Order",
        product_url: `${window.location.origin}/`,
        mobile: phoneNumber || formData.phone,
        email: formData.email,
        website_url: window.location.origin,
        transaction_id: `TXN${Date.now()}`,
      };

      console.log("Initiating Khalti payment:", paymentData);

      // In production, call Khalti API
      // const response = await fetch("https://khalti.com/api/v2/epayment/initiate/", {
      //   method: "POST",
      //   headers: {
      //     "Authorization": `Key ${PAYMENT_CONFIGS.khalti.publicKey}`,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(paymentData),
      // });
      // const result = await response.json();
      // if (result.payment_url) {
      //   window.location.href = result.payment_url;
      // }

      // For demo, simulate successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return { success: true };
    } catch (error) {
      console.error("Khalti payment failed:", error);
      return { success: false, error: error.message };
    }
  };

  // Process mobile banking payment
  const initiateMobileBankingPayment = async () => {
    try {
      // In production, this would integrate with your bank's API
      const paymentData = {
        amount: total,
        bankName: selectedBank,
        accountNumber: phoneNumber || formData.phone,
        transactionId: `TXN${Date.now()}`,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
      };

      console.log("Initiating mobile banking payment:", paymentData);

      // In production, send to backend
      // const response = await fetch("/api/initiate-mobile-banking", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(paymentData),
      // });

      // For demo, simulate successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return { success: true };
    } catch (error) {
      console.error("Mobile banking payment failed:", error);
      return { success: false, error: error.message };
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.zipCode) newErrors.zipCode = "ZIP code is required";
    }

    if (stepNumber === 2) {
      if (paymentMethod === "card") {
        const cardNumberClean = cardDetails.cardNumber.replace(/\s/g, "");
        if (cardNumberClean.length < 16) {
          newErrors.cardNumber = "Please enter a valid 16-digit card number";
        }
        if (!cardDetails.cardName)
          newErrors.cardName = "Name on card is required";
        if (cardDetails.expiryDate.length < 5) {
          newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
        }
        if (cardDetails.cvv.length < 3) {
          newErrors.cvv = "Please enter a valid CVV";
        }
      }
      if (paymentMethod === "mobileBanking" && !selectedBank) {
        newErrors.selectedBank = "Please select your bank";
      }
      if (
        (paymentMethod === "mobileBanking" || paymentMethod === "khalti") &&
        !phoneNumber
      ) {
        newErrors.phoneNumber = "Phone number is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(step)) return;

    setIsProcessing(true);
    setPaymentError("");

    try {
      let paymentResult = { success: false };

      // Process payment based on method
      switch (paymentMethod) {
        case "esewa":
          paymentResult = await initiateEsewaPayment();
          break;
        case "khalti":
          paymentResult = await initiateKhaltiPayment();
          break;
        case "mobileBanking":
          paymentResult = await initiateMobileBankingPayment();
          break;
        case "card":
          // Process card payment
          await new Promise((resolve) => setTimeout(resolve, 2000));
          paymentResult = { success: true };
          break;
        case "cash":
          // Process cash on delivery
          await new Promise((resolve) => setTimeout(resolve, 1000));
          paymentResult = { success: true };
          break;
        default:
          throw new Error("Invalid payment method");
      }

      if (paymentResult.success) {
        const orderNum = `ORD-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 1000)}`;
        setOrderNumber(orderNum);
        setOrderComplete(true);
        clearCart();
      } else {
        setPaymentError(
          paymentResult.error || "Payment failed. Please try again.",
        );
      }
    } catch (error) {
      setPaymentError(error.message || "An error occurred during payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
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
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={48} className="text-green-500" />
          </motion.div>

          <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-500 mb-4">Thank you for your order</p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-lg font-bold text-primary">{orderNumber}</p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-700">
              Payment Method:{" "}
              {paymentMethod === "esewa"
                ? "eSewa"
                : paymentMethod === "khalti"
                  ? "Khalti"
                  : paymentMethod === "mobileBanking"
                    ? `${selectedBank} (Mobile Banking)`
                    : paymentMethod === "card"
                      ? "Credit Card"
                      : "Cash on Delivery"}
            </p>
            <p className="text-sm text-green-700 mt-1">
              Amount Paid: Rs. {total.toFixed(2)}
            </p>
          </div>

          <p className="text-gray-600 text-sm mb-8">
            We'll send you a confirmation email with your order details shortly.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all"
            >
              Continue Shopping
            </Link>
            <Link
              to="/orders"
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all"
            >
              View My Orders
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-32 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mt-4">
            Checkout
          </h1>
        </div>

        <div className="flex items-center justify-center mb-8 gap-2 md:gap-4">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    step >= num
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step > num ? "✓" : num}
                </div>
                <span
                  className={`hidden md:inline text-sm font-medium ${
                    step >= num ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {num === 1 ? "Shipping" : num === 2 ? "Payment" : "Confirm"}
                </span>
              </div>
              {num < 3 && (
                <div
                  className={`w-8 md:w-16 h-0.5 ${
                    step > num ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Shipping Information */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">
                      Shipping Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            errors.firstName && touched.firstName
                              ? "border-red-400 focus:ring-red-200"
                              : "border-gray-300 focus:border-primary"
                          }`}
                        />
                        {errors.firstName && touched.firstName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            errors.lastName && touched.lastName
                              ? "border-red-400 focus:ring-red-200"
                              : "border-gray-300 focus:border-primary"
                          }`}
                        />
                        {errors.lastName && touched.lastName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            errors.email && touched.email
                              ? "border-red-400 focus:ring-red-200"
                              : "border-gray-300 focus:border-primary"
                          }`}
                        />
                        {errors.email && touched.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            errors.phone && touched.phone
                              ? "border-red-400 focus:ring-red-200"
                              : "border-gray-300 focus:border-primary"
                          }`}
                        />
                        {errors.phone && touched.phone && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          errors.address && touched.address
                            ? "border-red-400 focus:ring-red-200"
                            : "border-gray-300 focus:border-primary"
                        }`}
                      />
                      {errors.address && touched.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Apartment, Suite, etc. (Optional)
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            errors.city && touched.city
                              ? "border-red-400 focus:ring-red-200"
                              : "border-gray-300 focus:border-primary"
                          }`}
                        />
                        {errors.city && touched.city && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            errors.state && touched.state
                              ? "border-red-400 focus:ring-red-200"
                              : "border-gray-300 focus:border-primary"
                          }`}
                        />
                        {errors.state && touched.state && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.state}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                            errors.zipCode && touched.zipCode
                              ? "border-red-400 focus:ring-red-200"
                              : "border-gray-300 focus:border-primary"
                          }`}
                        />
                        {errors.zipCode && touched.zipCode && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.zipCode}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Delivery Instructions (Optional)
                      </label>
                      <textarea
                        name="deliveryInstructions"
                        value={formData.deliveryInstructions}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Any special instructions for delivery..."
                      />
                    </div>

                    <div className="flex justify-end mt-8">
                      <button
                        onClick={handleNextStep}
                        className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md shadow-primary/20"
                      >
                        Continue to Payment
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">
                      Payment Method
                    </h2>

                    {/* Nepali Payment Methods */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {[
                        {
                          id: "esewa",
                          label: "eSewa",
                          icon: "💳",
                          desc: "Pay with eSewa",
                        },
                        {
                          id: "khalti",
                          label: "Khalti",
                          icon: "🏦",
                          desc: "Pay with Khalti",
                        },
                        {
                          id: "mobileBanking",
                          label: "Mobile Banking",
                          icon: "📱",
                          desc: "Pay from your bank",
                        },
                        {
                          id: "cash",
                          label: "Cash on Delivery",
                          icon: "💵",
                          desc: "Pay when you receive",
                        },
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => {
                            setPaymentMethod(method.id);
                            setPaymentError("");
                          }}
                          className={`p-4 border-2 rounded-xl text-center transition-all ${
                            paymentMethod === method.id
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="text-3xl mb-2">{method.icon}</div>
                          <p
                            className={`text-sm font-semibold ${
                              paymentMethod === method.id
                                ? "text-primary"
                                : "text-gray-700"
                            }`}
                          >
                            {method.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {method.desc}
                          </p>
                        </button>
                      ))}
                    </div>

                    {/* eSewa Payment Details */}
                    {paymentMethod === "esewa" && (
                      <div className="bg-blue-50 rounded-xl p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl">💳</span>
                          <h3 className="font-semibold text-blue-800">
                            eSewa Payment
                          </h3>
                        </div>
                        <p className="text-sm text-blue-700 mb-4">
                          You will be redirected to eSewa's secure payment page
                          to complete your transaction.
                        </p>
                        <div className="bg-white rounded-lg p-4 flex items-center gap-4">
                          <Lock size={16} className="text-green-500" />
                          <p className="text-xs text-gray-600">
                            Secure payment processed by eSewa. Your card details
                            are never stored.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Khalti Payment Details */}
                    {paymentMethod === "khalti" && (
                      <div className="bg-purple-50 rounded-xl p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl">🏦</span>
                          <h3 className="font-semibold text-purple-800">
                            Khalti Payment
                          </h3>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => {
                                setPhoneNumber(e.target.value);
                                setErrors((prev) => ({
                                  ...prev,
                                  phoneNumber: "",
                                }));
                              }}
                              placeholder="98XXXXXXXX"
                              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                errors.phoneNumber
                                  ? "border-red-400 focus:ring-red-200"
                                  : "border-gray-300 focus:border-primary"
                              }`}
                            />
                            {errors.phoneNumber && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.phoneNumber}
                              </p>
                            )}
                          </div>
                          <div className="bg-white rounded-lg p-4 flex items-center gap-4">
                            <Lock size={16} className="text-green-500" />
                            <p className="text-xs text-gray-600">
                              You'll receive a payment link on your Khalti app
                              to complete the transaction.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mobile Banking Details */}
                    {paymentMethod === "mobileBanking" && (
                      <div className="bg-indigo-50 rounded-xl p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl">📱</span>
                          <h3 className="font-semibold text-indigo-800">
                            Mobile Banking
                          </h3>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Select Your Bank *
                            </label>
                            <select
                              value={selectedBank}
                              onChange={(e) => {
                                setSelectedBank(e.target.value);
                                setErrors((prev) => ({
                                  ...prev,
                                  selectedBank: "",
                                }));
                              }}
                              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                errors.selectedBank
                                  ? "border-red-400 focus:ring-red-200"
                                  : "border-gray-300 focus:border-primary"
                              }`}
                            >
                              <option value="">Select a bank</option>
                              {PAYMENT_CONFIGS.mobileBanking.banks.map(
                                (bank) => (
                                  <option key={bank} value={bank}>
                                    {bank}
                                  </option>
                                ),
                              )}
                            </select>
                            {errors.selectedBank && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.selectedBank}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                              Mobile Number *
                            </label>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => {
                                setPhoneNumber(e.target.value);
                                setErrors((prev) => ({
                                  ...prev,
                                  phoneNumber: "",
                                }));
                              }}
                              placeholder="98XXXXXXXX"
                              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                errors.phoneNumber
                                  ? "border-red-400 focus:ring-red-200"
                                  : "border-gray-300 focus:border-primary"
                              }`}
                            />
                            {errors.phoneNumber && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.phoneNumber}
                              </p>
                            )}
                          </div>
                          <div className="bg-white rounded-lg p-4 flex items-start gap-4">
                            <Building2
                              size={16}
                              className="text-indigo-500 flex-shrink-0 mt-0.5"
                            />
                            <p className="text-xs text-gray-600">
                              You'll receive a payment confirmation on your
                              mobile banking app. Please ensure your mobile
                              banking is active.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cash on Delivery Info */}
                    {paymentMethod === "cash" && (
                      <div className="bg-green-50 rounded-xl p-6 text-center mb-6">
                        <div className="text-4xl mb-3">💵</div>
                        <h3 className="font-semibold text-green-800">
                          Cash on Delivery
                        </h3>
                        <p className="text-green-600 text-sm mt-1">
                          Pay with cash when your order arrives.
                          <br />
                          Delivery fee: Rs. {deliveryFee.toFixed(2)}
                        </p>
                      </div>
                    )}

                    {/* Payment Error */}
                    {paymentError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <AlertCircle
                          size={18}
                          className="text-red-500 flex-shrink-0 mt-0.5"
                        />
                        <p className="text-sm text-red-700">{paymentError}</p>
                      </div>
                    )}

                    <div className="flex gap-4 mt-8">
                      <button
                        onClick={handlePreviousStep}
                        className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleNextStep}
                        className="flex-1 px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20"
                      >
                        Review Order
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review & Confirm */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">
                      Review Your Order
                    </h2>

                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-700 mb-3">
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                          >
                            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                  🍽️
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-bold text-primary">
                              Rs. {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <MapPin size={16} />
                          Shipping Address
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formData.firstName} {formData.lastName}
                          <br />
                          {formData.address}
                          {formData.apartment && <>, {formData.apartment}</>}
                          <br />
                          {formData.city}, {formData.state} {formData.zipCode}
                          <br />
                          <span className="text-gray-500">
                            {formData.phone}
                          </span>
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl">
                        <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Wallet size={16} />
                          Payment Method
                        </h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {paymentMethod === "esewa"
                            ? "eSewa"
                            : paymentMethod === "khalti"
                              ? "Khalti"
                              : paymentMethod === "mobileBanking"
                                ? `${selectedBank} (Mobile Banking)`
                                : paymentMethod === "card"
                                  ? "Credit Card"
                                  : "Cash on Delivery"}
                        </p>
                        {(paymentMethod === "khalti" ||
                          paymentMethod === "mobileBanking") &&
                          phoneNumber && (
                            <p className="text-sm text-gray-500 mt-1">
                              Mobile: {phoneNumber}
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handlePreviousStep}
                        className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all"
                      >
                        Back
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="flex-1 px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-primary/20"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `Pay Rs. ${total.toFixed(2)}`
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28">
              <h3 className="text-xl font-serif font-bold text-gray-800 mb-4">
                Order Summary
              </h3>

              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>Rs. {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span>Rs. {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Charge</span>
                  <span>Rs. {serviceCharge.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-primary">Rs. {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 rounded-xl flex items-start gap-2">
                <AlertCircle
                  size={16}
                  className="text-yellow-600 flex-shrink-0 mt-0.5"
                />
                <p className="text-xs text-yellow-700">
                  By placing your order, you agree to our Terms of Service and
                  Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
