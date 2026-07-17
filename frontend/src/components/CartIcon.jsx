import React, { useState, useRef, useEffect } from "react";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const CartIcon = ({ scrolled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const { cartItems, removeItem, updateQuantity, getTotalItems, getSubtotal } =
    useCart();
  const totalItems = getTotalItems();
  const subtotal = getSubtotal();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Animate badge when count changes
  useEffect(() => {
    if (totalItems > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  const formatPrice = (price) => {
    return `Rs. ${price.toFixed(2)}`;
  };

  return (
    <div className="relative">
      {/* Cart Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition-all duration-200 ${
          scrolled
            ? "text-gray-700 hover:bg-gray-100"
            : "text-white hover:bg-white/10"
        }`}
        aria-label="Open shopping cart"
        aria-expanded={isOpen}
      >
        <ShoppingBag size={22} />

        {/* Badge Counter */}
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{
              scale: isAnimating ? 1.2 : 1,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white"
          >
            {totalItems > 99 ? "99+" : totalItems}
          </motion.span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100/80 overflow-hidden z-50"
            style={{ transformOrigin: "top right" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">
                Your Cart
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
              </h3>
              {cartItems.length > 0 && (
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to clear your cart?",
                      )
                    ) {
                      removeItem("all");
                    }
                  }}
                  className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="max-h-96 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={28} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    Your cart is empty
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Start adding some delicious items!
                  </p>
                  <Link
                    to="/menu"
                    onClick={() => setIsOpen(false)}
                    className="mt-4 text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
                  >
                    Browse Menu →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={removeItem}
                      onUpdateQuantity={updateQuantity}
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Subtotal & Actions */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/cartpage"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center px-4 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-md"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Individual Cart Item Component
const CartItem = ({ item, onRemove, onUpdateQuantity, formatPrice }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
      {/* Image */}
      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
        {item.image && !imageError ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-2xl">🍽️</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {item.name}
        </p>
        <p className="text-sm text-primary font-medium">
          {formatPrice(item.price)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="p-1 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-sm font-semibold text-gray-700">
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="p-1 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="p-1.5 rounded-full hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Remove item"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// ✅ THIS IS THE IMPORTANT LINE - Make sure this exists!
export default CartIcon;
