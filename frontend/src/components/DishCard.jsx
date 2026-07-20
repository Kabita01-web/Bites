import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { fallbackImage, handleImageError } from "../utils/imageFallback";
import { useCart } from "../context/CartContext";

const DishCard = ({ id, image, name, description, price }) => {
  const { addItem } = useCart();

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = await addItem(id, 1);
    if (!ok) {
      console.error("Failed to add", name, "to cart");
    }
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
    >
      <Link to={`/menu/${id}`} className="block">
        <div className="h-64 overflow-hidden relative">
          <img
            src={image || fallbackImage}
            alt={name}
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        <div className="p-8">
          <h3 className="text-2xl font-serif font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
            {description}
          </p>
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <span className="text-xl font-bold text-primary">{price}</span>
            <button
              onClick={handleAdd}
              aria-label={`Add ${name} to cart`}
              className="w-10 h-10 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default DishCard;
