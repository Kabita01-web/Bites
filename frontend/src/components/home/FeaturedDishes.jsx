import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import DishCard from "../DishCard";
import { getAllMenuItemsAdmin } from "../../services/api";

const FeaturedDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      setError("");

      try {
        const json = await getAllMenuItemsAdmin();
        const data = json?.data;

        if (Array.isArray(data) && data.length > 0) {
          const available = data
            .filter((item) => item.isAvailable !== false)
            .map((item) => ({
              ...item,
              id: item._id || item.id,
              image: item.imageUrl || "https://placehold.co/300x200?text=Food",
            }));

          // Prefer items explicitly flagged as popular/featured by the
          // backend; fall back to the first few if that flag doesn't exist.
          const featured = available.some((d) => d.isPopular)
            ? available.filter((d) => d.isPopular)
            : available;

          setDishes(featured.slice(0, 4));
        } else {
          setDishes([]);
        }
      } catch (err) {
        console.error("Error fetching featured dishes:", err);
        setError("Could not load featured dishes.");
        setDishes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

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

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : dishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dishes.map((dish) => (
              <DishCard key={dish.id} {...dish} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            No featured dishes available yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default FeaturedDishes;
