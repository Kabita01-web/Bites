import React from 'react';

const MenuItem = ({ name, description, price, image, ingredients }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 rounded-3xl bg-[#FDFBF9] border border-gray-100 hover:border-accent/30 hover:shadow-lg transition-all duration-300 group">
      <div className="w-full md:w-32 h-32 shrink-0 overflow-hidden rounded-2xl">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-xl font-serif font-bold text-gray-800">{name}</h4>
          <span className="text-primary font-bold text-lg">{price}</span>
        </div>
        <p className="text-gray-500 text-sm italic mb-2">Ingredients: {ingredients}</p>
        <p className="text-gray-600 line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default MenuItem;
