// frontend/src/pages/customer/Review.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { getOrderDetails } from "../../services/api";
import { createReview } from "../../services/api";
import RatingStars from "../../components/RatingStars";
import { CheckCircle, AlertCircle, Upload, X } from "lucide-react";

const Review = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderDetails(orderId);
      if (data.success) {
        setOrder(data.order);
        // Auto-select first item
        if (data.order.items && data.order.items.length > 0) {
          setSelectedItem(data.order.items[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (!selectedItem) {
      setError("Please select an item to review");
      setSubmitting(false);
      return;
    }

    if (rating === 0) {
      setError("Please select a rating");
      setSubmitting(false);
      return;
    }

    if (comment.length < 3) {
      setError("Please write a review (minimum 3 characters)");
      setSubmitting(false);
      return;
    }

    try {
      const data = await createReview({
        orderId,
        menuItemId: selectedItem.menuItem._id,
        rating,
        comment,
        images,
      });

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/my-orders");
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In real app, upload to cloud storage
    // For now, just store as local URLs
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...imageUrls]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-700">Error</h3>
          <p className="text-red-600 mt-2">{error}</p>
          <Link
            to="/my-orders"
            className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-700 mb-2">
            Review Submitted! 🎉
          </h3>
          <p className="text-green-600">
            Thank you for your feedback! Your review will help other customers.
          </p>
          <p className="text-green-500 mt-2">Redirecting to your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Rate Your Order
        </h1>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-500">
            Order #{order?._id?.slice(-8).toUpperCase()}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(order?.createdAt).toLocaleDateString()}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Item Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select item to review
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {order?.items?.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all ${
                    selectedItem?._id === item._id
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating
            </label>
            <div className="flex items-center gap-4">
              <RatingStars rating={rating} setRating={setRating} size={36} />
              <span className="text-sm text-gray-500">
                {rating > 0 ? `${rating} out of 5` : "Tap a star to rate"}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              placeholder="Share your experience with this dish..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
            <p className="text-xs text-gray-400 mt-1">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Photos (Optional)
            </label>
            <div className="flex flex-wrap gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Review ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition">
                <Upload className="w-6 h-6 text-gray-400" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Review;
