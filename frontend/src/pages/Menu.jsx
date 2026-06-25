import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import MenuItem from "../components/MenuItem";
import { getMenuItems } from "../services/api";

const Menu = () => {
  const [allDishes, setAllDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenuItems();
        setAllDishes(Array.isArray(data) ? data : []);
      } catch {
        setError("Could not load the menu. Ensure the server is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Build category list dynamically from the data itself,
  // so adding a new category in menu.json doesn't require a code change.
  const categories = [
    "All",
    ...Array.from(new Set(allDishes.map((item) => item.category))),
  ];

  const getCurrentItems = () => {
    if (activeCategory === "All") return allDishes;
    return allDishes.filter((item) => item.category === activeCategory);
  };

  let currentItems = getCurrentItems();

  if (searchTerm) {
    currentItems = currentItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ingredients.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  if (loading) {
    return (
      <div className="pt-28 pb-32 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-28 pb-32 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-32 bg-gray-50 min-h-screen">
      {/* Page Hero — full-bleed image with gradient overlay */}
      <section className="relative mb-12 py-24 text-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1600"
          alt="Our menu"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/70"></div>

        {/* Decorative blobs */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/90 font-bold tracking-widest uppercase text-sm"
          >
            Savory Symphony
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold text-white mt-4 drop-shadow-lg"
          >
            Our Menu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/90 mt-4 max-w-2xl mx-auto text-lg"
          >
            Crafted with passion using the finest ingredients
          </motion.p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="container mx-auto px-4 md:px-6 mb-12">
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 pl-12 rounded-full border border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-white shadow-sm"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSearchTerm("");
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold text-sm md:text-base transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-primary/30"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Results Count */}
      <div className="container mx-auto px-4 md:px-6 mb-6">
        <p className="text-gray-500 text-center">
          Showing {currentItems.length}{" "}
          {currentItems.length === 1 ? "dish" : "dishes"}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Menu Grid */}
      <section className="container mx-auto px-4 md:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + searchTerm}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {currentItems.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {currentItems.map((item, index) => (
                  <Link
                    key={item.id ?? index}
                    to={`/menu/${encodeURIComponent(item.name.toLowerCase())}`}
                    className="relative block no-underline group"
                  >
                    {/* Category badge (All view only) */}
                    {activeCategory === "All" && item.category && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-primary/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-semibold">
                          {item.category}
                        </span>
                      </div>
                    )}
                    {/* Spice level badge */}
                    {item.spiceLevel && item.spiceLevel !== "None" && (
                      <div className="absolute top-4 right-4 z-10">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold shadow-md ${
                            item.spiceLevel === "Spicy"
                              ? "bg-red-500 text-white"
                              : item.spiceLevel === "Medium"
                                ? "bg-orange-500 text-white"
                                : item.spiceLevel === "Sweet"
                                  ? "bg-pink-500 text-white"
                                  : "bg-green-500 text-white"
                          }`}
                        >
                          {item.spiceLevel}
                        </span>
                      </div>
                    )}
                    <MenuItem {...item} index={index} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                <svg
                  className="w-20 h-20 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-gray-500 text-lg">No dishes found</p>
                <p className="text-gray-400 mt-2">
                  Try adjusting your search or category filter
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("All");
                  }}
                  className="mt-6 text-primary font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* CTA Banner — with background image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-24 relative rounded-3xl overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1400"
            alt="Dining experience"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/70 rounded-3xl"></div>
          <div className="relative z-10 p-8 md:p-12 text-center">
            <span className="text-white/90 font-bold tracking-widest uppercase text-sm">
              Craving Something?
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mt-2 mb-4 drop-shadow">
              Can't decide? Let us surprise you!
            </h2>
            <p className="text-white/85 max-w-2xl mx-auto mb-6">
              Ask your server about our chef's tasting menu or seasonal specials
            </p>
            <Link
              to="/reservation"
              className="inline-block bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-accent hover:text-white transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Reserve Your Table
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Menu;
