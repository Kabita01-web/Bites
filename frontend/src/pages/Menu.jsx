import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import MenuItem from "../components/MenuItem";
import { getAllMenuItemsAdmin } from "../services/api";

const Menu = () => {
  const [allDishes, setAllDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        let combinedDishes = [];
        let backendData = [];
        let localData = [];

        // Fetch from backend
        try {
          const json = await getAllMenuItemsAdmin();
          const data = json?.data;

          if (Array.isArray(data) && data.length > 0) {
            backendData = data
              .filter((item) => item.isAvailable !== false)
              .map((item) => ({
                ...item,
                _id:
                  item._id ||
                  item.id ||
                  `backend_${item.name?.toLowerCase().replace(/\s+/g, "_")}`,
              }));
          }
        } catch (backendErr) {
          console.log("Backend not available:", backendErr.message);
        }

        // Fetch from local JSON
        try {
          const response = await fetch("/menu.json");

          if (response.ok) {
            const data = await response.json();

            if (Array.isArray(data)) {
              localData = data
                .filter((item) => item.isAvailable !== false)
                .map((item) => ({
                  ...item,
                  _id:
                    item.id ||
                    item._id ||
                    `local_${item.name?.toLowerCase().replace(/\s+/g, "_")}`,
                }));
            }
          }
        } catch (localErr) {
          console.log("Local JSON not available:", localErr.message);
        }

        // Combine both data sources
        combinedDishes = [...backendData, ...localData];

        // Remove duplicates based on name (case insensitive)
        const uniqueDishes = combinedDishes.reduce((acc, current) => {
          const exists = acc.find(
            (item) => item.name?.toLowerCase() === current.name?.toLowerCase(),
          );
          if (!exists) {
            acc.push(current);
          } else {
            // If duplicate exists, keep the backend version
            if (current._source === "backend") {
              const index = acc.indexOf(exists);
              acc[index] = current;
            }
          }
          return acc;
        }, []);

        setAllDishes(uniqueDishes);
        setError("");
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError("Could not load the menu. Please try again later.");
        setAllDishes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Build category list dynamically from the data itself
  const categories = [
    "All",
    ...Array.from(
      new Set(allDishes.map((item) => item.category).filter(Boolean)),
    ),
  ];

  const getCurrentItems = () => {
    if (activeCategory === "All") return allDishes;
    return allDishes.filter((item) => item.category === activeCategory);
  };

  let currentItems = getCurrentItems();

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    currentItems = currentItems.filter(
      (item) =>
        item.name?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.ingredients?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term),
    );
  }

  if (loading) {
    return (
      <div className="pt-28 pb-32 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-500 mt-4 font-medium">
            Loading our delicious menu...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-28 pb-32 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <svg
            className="w-20 h-20 text-red-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-600 font-semibold text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (allDishes.length === 0) {
    return (
      <div className="pt-28 pb-32 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-gray-500 text-lg font-medium">
            No menu items available
          </p>
          <p className="text-gray-400 mt-2">
            Please check back later for our delicious offerings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-32 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Page Hero */}
      <section className="relative mb-16 py-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-accent/80"></div>

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>
        </div>

        {/* Decorative floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-[10%] text-4xl animate-bounce-slow">
            🍜
          </div>
          <div className="absolute bottom-20 right-[15%] text-4xl animate-bounce-slow delay-700">
            🍕
          </div>
          <div className="absolute top-1/2 left-[5%] text-3xl animate-bounce-slow delay-300">
            🥘
          </div>
          <div className="absolute top-1/3 right-[8%] text-3xl animate-bounce-slow delay-500">
            🍝
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-white/90 font-bold tracking-[0.3em] uppercase text-sm mb-4 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full">
              Culinary Excellence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mt-4 drop-shadow-2xl"
          >
            Our Menu
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-24 h-1 bg-white/60 mx-auto mt-6 rounded-full"
          ></motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-white/90 mt-6 max-w-2xl mx-auto text-lg md:text-xl font-light"
          >
            Discover our carefully curated selection of dishes,
            <br className="hidden sm:block" />
            crafted with passion and the finest ingredients
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
              <span className="text-yellow-300">★</span>
              {allDishes.length} Signature Dishes
            </span>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="container mx-auto px-4 md:px-6 mb-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for your favorite dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 pl-14 rounded-full border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl"
              />
              <svg
                className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors"
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
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        {categories.length > 1 && (
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
                className={`px-8 py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 scale-105"
                    : "bg-white text-gray-600 hover:text-primary border-2 border-gray-200 hover:border-primary/50 shadow-sm hover:shadow-md"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        )}
      </section>

      {/* Results Count */}
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <motion.p
          key={currentItems.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 text-center font-medium"
        >
          <span className="inline-block bg-white px-6 py-2 rounded-full shadow-sm">
            {currentItems.length}{" "}
            {currentItems.length === 1 ? "dish" : "dishes"}
            {searchTerm && ` matching "${searchTerm}"`}
          </span>
        </motion.p>
      </div>

      {/* Menu Grid */}
      <section className="container mx-auto px-4 md:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + searchTerm}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {currentItems.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {currentItems.map((item, index) => (
                  <motion.div
                    key={item._id ?? item.id ?? index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={`/menu/${item._id || item.id}`}
                      className="relative block no-underline group"
                    >
                      {/* Category badge */}
                      {activeCategory === "All" && item.category && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-gradient-to-r from-primary to-accent text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                            {item.category}
                          </span>
                        </div>
                      )}

                      <MenuItem {...item} index={index} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white rounded-3xl shadow-xl"
              >
                <div className="text-7xl mb-6">🔍</div>
                <p className="text-gray-600 text-xl font-semibold">
                  No dishes found
                </p>
                <p className="text-gray-400 mt-3">
                  Try adjusting your search or category filter
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("All");
                  }}
                  className="mt-8 px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-24 relative rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-accent"></div>

          {/* Animated background dots */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            ></div>
          </div>

          <div className="relative z-10 p-12 md:p-16 text-center">
            <span className="inline-block text-white/90 font-bold tracking-[0.2em] uppercase text-xs mb-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              Special Offer
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mt-2 mb-4 drop-shadow">
              Can't decide what to order?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg font-light">
              Let our chefs surprise you with a curated tasting experience
            </p>
            <Link
              to="/reservation"
              className="inline-block bg-white text-primary px-10 py-4 rounded-full font-semibold hover:bg-accent hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
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
