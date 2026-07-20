import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { getAllMenuItemsAdmin } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { Filter, Sliders, X } from "lucide-react";

const Menu = () => {
  const [allDishes, setAllDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { addItem } = useCart();

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 1000 });

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError("");

      try {
        const json = await getAllMenuItemsAdmin();
        const data = json?.data;

        if (Array.isArray(data) && data.length > 0) {
          const backendData = data
            .filter((item) => item.isAvailable !== false)
            .map((item) => ({
              ...item,
              _id: item._id || item.id,
              image: item.imageUrl || "https://placehold.co/300x200?text=Food",
            }));

          setAllDishes(backendData);
          const maxPrice = Math.max(
            ...backendData.map((item) => item.price || 0),
          );
          setPriceRange({ min: 0, max: maxPrice || 1000 });
          setTempPriceRange({ min: 0, max: maxPrice || 1000 });
        } else {
          setAllDishes([]);
          setError("No menu items available");
        }
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

  const categories = [
    "All",
    ...Array.from(
      new Set(allDishes.map((item) => item.category).filter(Boolean)),
    ),
  ];

  const maxDishPrice =
    Math.max(...allDishes.map((item) => item.price || 0)) || 1000;

  const getCurrentItems = () => {
    let items = allDishes;

    if (activeCategory !== "All") {
      items = items.filter((item) => item.category === activeCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter(
        (item) =>
          item.name?.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term) ||
          item.category?.toLowerCase().includes(term),
      );
    }

    items = items.filter(
      (item) =>
        (item.price || 0) >= priceRange.min &&
        (item.price || 0) <= priceRange.max,
    );

    items = [...items];
    switch (sortBy) {
      case "price-low":
        items.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        items.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "name":
        items.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      default:
        break;
    }

    return items;
  };

  const currentItems = getCurrentItems();

  const hasActiveFilters =
    priceRange.min > 0 || priceRange.max < maxDishPrice || sortBy !== "default";

  const activeFilterCount = [
    priceRange.min > 0 || priceRange.max < maxDishPrice ? 1 : 0,
    sortBy !== "default" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const applyFilters = () => {
    setPriceRange(tempPriceRange);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setPriceRange({ min: 0, max: maxDishPrice });
    setTempPriceRange({ min: 0, max: maxDishPrice });
    setSortBy("default");
  };

  const handleAddToCart = async (dish, e) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = await addItem(dish._id, 1);
    if (!ok) {
      console.error("Failed to add", dish.name, "to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
            className="mt-6 px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-gradient-to-r from-primary via-primary/90 to-accent py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>
        </div>

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

        <div className="container mx-auto px-4 relative z-10 text-center">
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
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mt-4 drop-shadow-2xl"
          >
            Our Menu
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-24 h-1 bg-white/60 mx-auto mt-6 rounded-full"
          />

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

      {/* ===== SEARCH & CATEGORY FILTERS ===== */}
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar + Filter toggle */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search for your favorite dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-3 pl-14 rounded-full border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all bg-white shadow-lg"
              />
              <svg
                className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-5 py-3 rounded-full font-semibold transition-all whitespace-nowrap flex items-center gap-2 shadow-sm ${
                showFilters || hasActiveFilters
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30"
                  : "bg-white text-gray-600 hover:text-primary border-2 border-gray-200 hover:border-primary/50"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-white text-primary rounded-full flex items-center justify-center text-xs font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Sliders className="w-4 h-4 inline mr-2" />
                      Price range (Rs.)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={tempPriceRange.min}
                        onChange={(e) =>
                          setTempPriceRange({
                            ...tempPriceRange,
                            min: Number(e.target.value) || 0,
                          })
                        }
                        className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Min"
                      />
                      <span className="text-gray-400">–</span>
                      <input
                        type="number"
                        value={tempPriceRange.max}
                        onChange={(e) =>
                          setTempPriceRange({
                            ...tempPriceRange,
                            max: Number(e.target.value) || maxDishPrice,
                          })
                        }
                        className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Max"
                      />
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={maxDishPrice}
                      value={tempPriceRange.max}
                      onChange={(e) =>
                        setTempPriceRange({
                          ...tempPriceRange,
                          max: Number(e.target.value),
                        })
                      }
                      className="w-full accent-primary mt-3"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Rs. 0</span>
                      <span>Rs. {maxDishPrice}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sort by
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="default">Default</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear filters
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    Apply filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Tabs */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
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

        {/* Results Count */}
        <div className="text-center mb-8">
          <span className="inline-block bg-white px-6 py-2 rounded-full shadow-sm text-gray-500 font-medium">
            {currentItems.length}{" "}
            {currentItems.length === 1 ? "dish" : "dishes"}
            {searchTerm && ` matching "${searchTerm}"`}
            {(priceRange.min > 0 || priceRange.max < maxDishPrice) &&
              ` · Rs. ${priceRange.min}–${priceRange.max}`}
          </span>
        </div>
      </div>

      {/* ===== MENU GRID ===== */}
      <div className="container mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={
              activeCategory +
              searchTerm +
              priceRange.min +
              priceRange.max +
              sortBy
            }
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentItems.map((item, index) => (
                  <motion.div
                    key={item._id || item.id || index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <Link to={`/menu/${item._id || item.id}`} className="block">
                      <div className="relative h-48 overflow-hidden bg-gray-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/300x200?text=Food";
                          }}
                        />
                        {item.discount && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            {item.discount}% OFF
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 text-lg leading-tight mb-1">
                          {item.name}
                        </h3>

                        {item.description && (
                          <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                            {item.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          <div>
                            <span className="text-xl font-bold text-primary">
                              RS{item.price?.toFixed(2) || "0.00"}
                            </span>
                            {item.originalPrice && (
                              <span className="text-sm text-gray-400 line-through ml-2">
                                RS{item.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => handleAddToCart(item, e)}
                            className="w-10 h-10 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-md hover:shadow-lg"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-3xl shadow-xl"
              >
                <div className="text-7xl mb-6">🔍</div>
                <p className="text-gray-600 text-xl font-semibold">
                  No dishes found
                </p>
                <p className="text-gray-400 mt-3">
                  Try adjusting your search, category, or price filter
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("All");
                    resetFilters();
                  }}
                  className="mt-8 px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Menu;
