import React from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { X, UtensilsCrossed, LogIn, UserPlus } from "lucide-react";

const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mx-4">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Logo */}
              <div className="text-center mb-6">
                <div className="flex justify-center">
                  <div className="bg-primary p-3 rounded-full inline-flex">
                    <UtensilsCrossed className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h2 className="mt-4 text-2xl font-serif font-bold text-gray-900">
                  Book a Table
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Please login or create an account to make a reservation
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-accent transition-all duration-300 group"
                >
                  <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Login to Your Account
                </Link>

                <Link
                  to="/register"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300 group"
                >
                  <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Create New Account
                </Link>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
