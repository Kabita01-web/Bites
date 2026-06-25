import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import DishCard from "../DishCard";

const FeaturedDishes = ({ dishes }) => {
  return (
    <section className="py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-primary font-bold tracking-widest uppercase text-sm">
              Chef's Selection
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-800 mt-4 leading-tight">
              Featured Culinary <br />
              Masterpieces
            </h2>
          </div>
          <Link
            to="/menu"
            className="flex items-center gap-2 text-primary font-bold text-lg hover:gap-4 transition-all duration-300"
          >
            Explore Full Menu <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {dishes.map((dish, i) => (
            <DishCard key={dish.id ?? i} {...dish} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDishes;
