import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { handleImageError } from "../utils/imageFallback";

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=2000"
          alt="Warm restaurant atmosphere"
          onError={handleImageError}
          className="w-full h-full object-cover"
        />
        {/* Darker overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-block text-accent text-lg md:text-xl tracking-widest mb-4 font-semibold"
          >
            WELCOME TO
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold mb-8 leading-none text-white"
          >
            Bites
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-100 mb-12 leading-relaxed max-w-2xl mx-auto"
          >
            Fresh ingredients. Authentic flavors. Memorable dining experiences
            crafted with passion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <Link
              to="/menu"
              className="bg-accent text-white text-center px-8 py-3 rounded-full text-base font-semibold hover:bg-accent/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              View Menu
            </Link>
            <Link
              to="/reservation"
              className="bg-transparent border-2 border-white text-white text-center px-8 py-3 rounded-full text-base font-semibold hover:bg-white hover:text-primary transition-all duration-300"
            >
              Book a Table
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;
