import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import MenuItem from "../components/MenuItem";
import { Link } from "react-router-dom";

const Menu = () => {
  const categories = [
    "All",
    "Starters",
    "Main Course",
    "Burgers",
    "Pasta",
    "Desserts",
    "Drinks",
  ];
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const menuItems = {
    Starters: [
      {
        name: "Truffle Arancini",
        price: "$12",
        description:
          "Crispy risotto balls with wild truffle and mozzarella. A perfect start to your meal.",
        ingredients: "Arborio rice, Black Truffle, Mozzarella, Parmesan",
        image:
          "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=400",
        spiceLevel: "Mild",
        dietary: ["Vegetarian"],
      },
      {
        name: "Burrata Bloom",
        price: "$16",
        description: "Fresh burrata with heirloom tomatoes and basil emulsion.",
        ingredients:
          "Burrata, Heirloom Tomatoes, Basil, Extra Virgin Olive Oil",
        image:
          "https://images.unsplash.com/photo-1594911771100-24422da8066f?auto=format&fit=crop&q=80&w=400",
        spiceLevel: "Mild",
        dietary: ["Vegetarian", "Gluten-Free"],
      },
      {
        name: "Crispy Calamari",
        price: "$14",
        description:
          "Lightly fried calamari served with spicy aioli and lemon.",
        ingredients: "Calamari, Lemon, Spicy Aioli, Parsley",
        image:
          "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&q=80&w=400",
        spiceLevel: "Medium",
        dietary: [],
      },
    ],
    "Main Course": [
      {
        name: "Heritage Ribeye Steak",
        price: "$48",
        description:
          "45-day dry-aged ribeye with bone marrow butter and roasted garlic.",
        ingredients: "Dry-aged Beef, Bone Marrow, Herbs, Garlic",
        image:
          "https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=400",
        spiceLevel: "Mild",
        dietary: ["Gluten-Free"],
      },
      {
        name: "Pan Seared Sea Bass",
        price: "$36",
        description:
          "Crispy skin sea bass with citrus pea purée and microgreens.",
        ingredients: "Wild Sea Bass, Sweet Peas, Mint, Lemon, Microgreens",
        image:
          "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400",
        spiceLevel: "Mild",
        dietary: ["Gluten-Free", "Dairy-Free"],
      },
      {
        name: "Braised Lamb Shank",
        price: "$42",
        description:
          "Slow-braised lamb with rosemary red wine sauce and creamy polenta.",
        ingredients: "Lamb, Rosemary, Red Wine, Root Vegetables, Polenta",
        image:
          "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&q=80&w=400",
        spiceLevel: "Mild",
        dietary: ["Gluten-Free"],
      },
    ],
    Burgers: [
      {
        name: "Wagyu Signature",
        price: "$24",
        description:
          "Our finest wagyu burger with caramelized onions and truffle aioli.",
        ingredients:
          "Wagyu Beef, Brioche, Caramelized Onions, Comté Cheese, Truffle Aioli",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
        spiceLevel: "Mild",
        dietary: [],
      },
      {
        name: "Mushroom Truffle Burger",
        price: "$18",
        description: "Plant-based patty with truffle aioli and arugula.",
        ingredients: "Mushroom Patty, Truffle Oil, Arugula, Brioche Bun",
        image:
          "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=400",
        spiceLevel: "Mild",
        dietary: ["Vegetarian"],
      },
    ],
    Pasta: [
      {
        name: "Lobster Linguine",
        price: "$32",
        description:
          "Hand-made pasta with fresh claw meat in a spicy tomato sauce.",
        ingredients: "Lobster, Linguine, Chili, Garlic, San Marzano Tomatoes",
        image:
          "https://images.unsplash.com/photo-1563379091339-03b21ab4a1f8?auto=format&fit=crop&q=80&w=400",
        spiceLevel: "Spicy",
        dietary: [],
      },
      {
        name: "Truffle Carbonara",
        price: "$26",
        description:
          "Creamy carbonara with black truffle shavings and guanciale.",
        ingredients:
          "Eggs, Pecorino Romano, Guanciale, Black Truffle, Spaghetti",
        image:
          "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=400",
        spiceLevel: "Mild",
        dietary: [],
      },
    ],
    Desserts: [
      {
        name: "Chocolate Velvet",
        price: "$14",
        description:
          "Warm lava cake with vanilla bean gelato and fresh berries.",
        ingredients: "70% Cocoa, Vanilla Gelato, Mixed Berries, Powdered Sugar",
        image:
          "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=400",
        spiceLevel: "Sweet",
        dietary: ["Vegetarian"],
      },
      {
        name: "Tiramisu",
        price: "$12",
        description: "Classic Italian dessert with mascarpone and espresso.",
        ingredients: "Mascarpone, Espresso, Ladyfingers, Cocoa Powder",
        image:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=400",
        spiceLevel: "Sweet",
        dietary: ["Vegetarian"],
      },
    ],
    Drinks: [
      {
        name: "Smoked Old Fashioned",
        price: "$18",
        description: "Premium bourbon with maple smoke and walnut bitters.",
        ingredients: "Bourbon, Maple Syrup, Walnut Bitters, Orange Peel",
        image:
          "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400",
        spiceLevel: "None",
        dietary: ["Vegan"],
      },
      {
        name: "Espresso Martini",
        price: "$16",
        description: "Vodka, fresh espresso, and coffee liqueur.",
        ingredients: "Vodka, Fresh Espresso, Coffee Liqueur, Coffee Beans",
        image:
          "https://images.unsplash.com/photo-1514365893784-7309e1278a4f?auto=format&fit=crop&q=80&w=400",
        spiceLevel: "None",
        dietary: ["Vegan"],
      },
    ],
  };

  const getAllDishes = () => {
    const allDishes = [];
    Object.keys(menuItems).forEach((category) => {
      menuItems[category].forEach((dish) => {
        allDishes.push({ ...dish, category });
      });
    });
    return allDishes;
  };

  const getCurrentItems = () => {
    if (activeCategory === "All") return getAllDishes();
    return (menuItems[activeCategory] || []).map((item) => ({
      ...item,
      category: activeCategory,
    }));
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
                    key={index}
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
