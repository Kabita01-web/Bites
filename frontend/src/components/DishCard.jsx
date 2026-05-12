import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";
import { fallbackImage, handleImageError } from "../utils/imageFallback";

const DishCard = ({ image, name, description, price }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
    >
      <div className="h-64 overflow-hidden relative">
        <img
          src={image || fallbackImage}
          alt={name}
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full font-bold text-primary shadow-md">
          {price}
        </div>
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-serif font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
          {description}
        </p>
        <Link
          to="/reservation"
          className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all duration-300 w-fit"
        >
          <span className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
            <UtensilsCrossed size={18} />
          </span>
          Order Now
        </Link>
      </div>
    </motion.div>
  );
};

export default DishCard;
