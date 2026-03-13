import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuItem from '../components/MenuItem';

const MenuPage = () => {
  const categories = ['Starters', 'Main Course', 'Burgers', 'Pasta', 'Desserts', 'Drinks'];
  const [activeCategory, setActiveCategory] = useState('Main Course');

  const menuItems = {
    'Starters': [
      { name: "Truffle Arancini", price: "$12", description: "Crispy risotto balls with wild truffle and mozzarella.", ingredients: "Arborio rice, Black Truffle, Parmesan", image: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=400" },
      { name: "Burrata Bloom", price: "$16", description: "Fresh burrata with heirloom tomatoes and basil emulsion.", ingredients: "Burrata, Heirloom Tomatoes, Extra Virgin Olive Oil", image: "https://images.unsplash.com/photo-1594911771100-24422da8066f?auto=format&fit=crop&q=80&w=400" }
    ],
    'Main Course': [
      { name: "Heritage Ribeye Steak", price: "$48", description: "45-day dry-aged ribeye with bone marrow butter.", ingredients: "Dry-aged Beef, Herbs, Garlic", image: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=400" },
      { name: "Pan Seared Sea Bass", price: "$36", description: "Crispy skin sea bass with citrus pea purée.", ingredients: "Wild Sea Bass, Sweet Peas, Mint, Lemon", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400" }
    ],
    'Burgers': [
      { name: "Wagyu Signature", price: "$24", description: "Our finest wagyu burger with caramelized onions.", ingredients: "Wagyu Beef, Brioche, Comté Cheese", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400" }
    ],
    'Pasta': [
      { name: "Lobster Linguine", price: "$32", description: "Hand-made pasta with fresh claw meat and spicy tomato sauce.", ingredients: "Lobster, Linguine, Chili, Garlic", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a1f8?auto=format&fit=crop&q=80&w=400" }
    ],
    'Desserts': [
      { name: "Chocolate Velvet", price: "$14", description: "Lava cake with vanilla bean gelato.", ingredients: "70% Cocoa, Vanilla Gelato, Berries", image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=400" }
    ],
    'Drinks': [
      { name: "Smoked Old Fashioned", price: "$18", description: "Bourbon with maple smoke and walnut bitters.", ingredients: "Bourbon, Maple Syrup, Walnut Bitters", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400" }
    ]
  };

  return (
    <div className="pt-28 pb-32">
      {/* Page Hero */}
      <section className="bg-secondary mb-20 py-24 text-center">
        <div className="container mx-auto px-4">
           <span className="text-primary font-bold tracking-widest uppercase text-sm">Savory Symphony</span>
           <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-800 mt-4">Our Menu</h1>
        </div>
      </section>

      {/* Categories Tabs */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${activeCategory === cat ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="contents"
            >
              {menuItems[activeCategory].map((item, i) => (
                <MenuItem key={i} {...item} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default MenuPage;
