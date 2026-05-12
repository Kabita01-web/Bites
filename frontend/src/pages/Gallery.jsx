import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import GalleryGrid from "../components/GalleryGrid";

const Gallery = () => {
  const [filterCategory, setFilterCategory] = useState("All");

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
      category: "Burgers",
      title: "Wagyu Signature Burger",
    },
    {
      url: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=800",
      category: "Mains",
      title: "Heritage Ribeye Steak",
    },
    {
      url: "https://images.unsplash.com/photo-1550966842-28df05094254?auto=format&fit=crop&q=80&w=800",
      category: "Interior",
      title: "Cozy Dining Atmosphere",
    },
    {
      url: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800",
      category: "Pasta",
      title: "Fresh Handmade Pasta",
    },
    {
      url: "https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=800",
      category: "Vibe",
      title: "Perfect Evening Vibes",
    },
    {
      url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=800",
      category: "Desserts",
      title: "Chocolate Velvet Cake",
    },
    {
      url: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=800",
      category: "Starters",
      title: "Truffle Arancini",
    },
    {
      url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
      category: "Drinks",
      title: "Smoked Old Fashioned",
    },
    {
      url: "https://images.unsplash.com/photo-1594911771100-24422da8066f?auto=format&fit=crop&q=80&w=800",
      category: "Starters",
      title: "Fresh Burrata",
    },
    {
      url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800",
      category: "Plating",
      title: "Artful Presentation",
    },
    {
      url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800",
      category: "Pasta",
      title: "Truffle Carbonara",
    },
    {
      url: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&q=80&w=800",
      category: "Starters",
      title: "Crispy Calamari",
    },
  ];

  const categories = [
    "All",
    ...new Set(galleryImages.map((img) => img.category)),
  ];

  const filteredImages =
    filterCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === filterCategory);

  return (
    <div className="pt-28 pb-32 bg-white">
      {/* Hero — full-bleed image with gradient overlay */}
      <section className="relative mb-16 py-28 text-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1600"
          alt="Gallery hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/75 to-accent/65"></div>

        {/* Decorative blobs */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/90 font-bold tracking-widest uppercase text-sm"
          >
            Visual Feast
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold text-white mt-4 leading-tight drop-shadow-lg"
          >
            Our Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/90 mt-4 max-w-2xl mx-auto text-lg"
          >
            A glimpse into the Bites experience — where every meal is a
            masterpiece
          </motion.p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="container mx-auto px-4 md:px-6 mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${
                filterCategory === cat
                  ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-primary/30"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
        <p className="text-center text-gray-500 mt-6">
          Showing {filteredImages.length}{" "}
          {filteredImages.length === 1 ? "photo" : "photos"}
        </p>
      </section>

      {/* Gallery Grid */}
      <section className="container mx-auto px-4 md:px-6">
        <GalleryGrid images={filteredImages} />
      </section>

      {/* Instagram CTA — full-bleed image with overlay */}
      <section className="mt-32 relative text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1600"
          alt="Follow us"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 to-accent/75"></div>

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <pattern
              id="instagramPattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="10" r="2" fill="white" />
            </pattern>
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill="url(#instagramPattern)"
            />
          </svg>
        </div>

        <div className="relative z-10 py-24 text-center container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 drop-shadow">
              Follow Our Journey
            </h2>
            <p className="text-xl opacity-90 mb-10">
              Tag us in your moments{" "}
              <span className="font-bold">@BitesRestaurant</span>
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary rounded-full font-bold text-xl hover:bg-accent hover:text-white transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85 0 3.205-.012 3.585-.069 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85 0-3.204.012-3.584.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              Follow on Instagram
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
