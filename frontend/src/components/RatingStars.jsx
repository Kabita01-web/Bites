// frontend/src/components/RatingStars.jsx
import React, { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const RatingStars = ({ rating, setRating, readonly = false, size = 32 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index) => {
    if (!readonly) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const handleClick = (index) => {
    if (!readonly && setRating) {
      setRating(index);
    }
  };

  const displayRating = hoverRating || rating || 0;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((index) => (
        <motion.button
          key={index}
          type="button"
          whileHover={!readonly ? { scale: 1.2 } : {}}
          whileTap={!readonly ? { scale: 0.8 } : {}}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
          className={`${readonly ? "cursor-default" : "cursor-pointer"} transition-colors`}
          disabled={readonly}
        >
          <Star
            size={size}
            className={`${
              index <= displayRating
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            } transition-colors duration-200`}
          />
        </motion.button>
      ))}
    </div>
  );
};

export default RatingStars;
