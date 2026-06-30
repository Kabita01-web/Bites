// components/MenuItem.jsx
import React from "react";
import { fallbackImage, handleImageError } from "../utils/imageFallback";

const MenuItem = ({
  name,
  description,
  price,
  image, // Change from imageUrl to image
  imageUrl, // Keep for backward compatibility
  ingredients,
  tags = [],
  dietary = [],
  spiceLevel,
  category,
  _source,
}) => {
  // Use image or fallback to imageUrl
  const imageSrc = image || imageUrl || fallbackImage;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 rounded-3xl bg-white border border-gray-100 hover:border-accent/30 hover:shadow-xl transition-all duration-300 group relative">
      <div className="w-full md:w-32 h-32 shrink-0 overflow-hidden rounded-2xl">
        <img
          src={imageSrc.trim()} // Trim any whitespace
          alt={name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {_source && (
          <span
            className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full ${
              _source === "backend"
                ? "bg-green-500/90 text-white"
                : "bg-blue-500/90 text-white"
            }`}
          >
            {_source === "backend" ? "🌐" : "📋"}
          </span>
        )}
      </div>
      <div className="grow">
        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
          <h4 className="text-xl font-serif font-bold text-gray-800">{name}</h4>
          <span className="text-accent font-bold text-lg">Rs. {price}</span>
        </div>

        {/* Category and Spice Level */}
        <div className="flex flex-wrap gap-2 mb-2">
          {category && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {category}
            </span>
          )}
          {spiceLevel && spiceLevel !== "None" && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                spiceLevel === "Mild"
                  ? "bg-green-100 text-green-700"
                  : spiceLevel === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : spiceLevel === "Spicy"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
              }`}
            >
              {spiceLevel}
            </span>
          )}
        </div>

        {/* Dietary tags */}
        {dietary && dietary.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {dietary.map((diet, index) => (
              <span
                key={index}
                className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
              >
                {diet}
              </span>
            ))}
          </div>
        )}

        {/* Tags (from your data) */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
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
        <p className="text-gray-600 line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default MenuItem;
