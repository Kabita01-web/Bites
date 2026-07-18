import React, { useState, useEffect } from "react";
import Hero from "../../components/Hero";
import FeaturedDishes from "../../components/home/FeaturedDishes";
import FeaturesSection from "../../components/home/FeaturesSection";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import ReservationCTA from "../../components/home/ReservationCTA";
import { getMenuItems } from "../../services/api";

// Dish names to spotlight on the homepage.
// Edit this list any time — it just needs to match `name` values in menu.json.
const FEATURED_NAMES = [
  "Chicken Momo",
  "Margherita Pizza",
  "Chicken Sekuwa",
  "Chicken Thukpa",
];

const Home = () => {
  const [featuredDishes, setFeaturedDishes] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getMenuItems();
        const allDishes = Array.isArray(data) ? data : [];

        const featured = FEATURED_NAMES.map((name) =>
          allDishes.find((dish) => dish.name === name),
        ).filter(Boolean);

        setFeaturedDishes(featured);
      } catch {
        setFeaturedDishes([]);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="bg-white">
      <Hero />
      <FeaturedDishes dishes={featuredDishes} />
      <FeaturesSection />
      <TestimonialsSection />
      <ReservationCTA />
    </div>
  );
};

export default Home;
