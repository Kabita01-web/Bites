// components/MenuItem.jsx
import React from "react";
import { fallbackImage, handleImageError } from "../utils/imageFallback";

const MenuItem = ({
  name,
  description,
  price,
  imageUrl,
  ingredients,
  tags = [],
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 rounded-3xl bg-white border border-gray-100 hover:border-accent/30 hover:shadow-xl transition-all duration-300 group relative">
      <div className="w-full md:w-32 h-32 shrink-0 overflow-hidden rounded-2xl">
        <img
          src={imageUrl || fallbackImage}
          alt={name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="grow">
        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
          <h4 className="text-xl font-serif font-bold text-gray-800">{name}</h4>
          <span className="text-accent font-bold text-lg">Rs. {price}</span>
        </div>

        {/* Tag badges */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {ingredients && (
          <p className="text-gray-400 text-sm mb-2">
            <span className="font-semibold">Ingredients:</span> {ingredients}
          </p>
        )}
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default MenuItem;
