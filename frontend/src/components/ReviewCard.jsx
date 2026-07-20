// frontend/src/components/ReviewCard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, ThumbsUp, Flag, Clock } from "lucide-react";
import RatingStars from "./RatingStars";

const ReviewCard = ({ review, onHelpful, onReport }) => {
  const [isHelpfulLoading, setIsHelpfulLoading] = useState(false);

  const handleHelpful = async () => {
    if (isHelpfulLoading) return;
    setIsHelpfulLoading(true);
    await onHelpful(review._id);
    setIsHelpfulLoading(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
            {review.user?.profileImage ? (
              <img
                src={review.user.profileImage}
                alt={review.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {review.user?.name || "Guest"}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{formatDate(review.createdAt)}</span>
              {review.isVerified && (
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-medium">
                  Verified Order
                </span>
              )}
            </div>
          </div>
        </div>
        <RatingStars rating={review.rating} readonly={true} size={16} />
      </div>

      {/* Comment */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        {review.comment}
      </p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <button
          onClick={handleHelpful}
          disabled={isHelpfulLoading}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Helpful ({review.helpful || 0})</span>
        </button>
        <button
          onClick={() => onReport && onReport(review._id)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          <Flag className="w-4 h-4" />
          <span>Report</span>
        </button>
      </div>

      {/* Admin Response */}
      {review.adminResponse && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-sm font-medium text-gray-700">Admin Response:</p>
          <p className="text-sm text-gray-600 mt-1">
            {review.adminResponse.text}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(review.adminResponse.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ReviewCard;
