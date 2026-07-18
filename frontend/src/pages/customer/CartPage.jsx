import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";

const CartPage = () => {
  const { cartItems, removeItem, updateQuantity, getSubtotal, clearCart } =
    useCart();
  const subtotal = getSubtotal();

  if (cartItems.length === 0) {
    return (
      <div className="pt-28 pb-32 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={48} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-3">
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            <ArrowLeft size={18} />
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-32 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-8">
          Your Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </span>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="px-6 py-4 flex items-center gap-4"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          🍽️
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-primary font-bold">
                        Rs. {item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28">
              <h3 className="text-xl font-serif font-bold text-gray-800 mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>Rs. 50.00</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Charge</span>
                  <span>Rs. 0.00</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span>Rs. {(subtotal + 50).toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full block text-center px-6 py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/menu"
                className="w-full block text-center px-6 py-2.5 text-gray-500 hover:text-primary font-medium text-sm transition-colors mt-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
