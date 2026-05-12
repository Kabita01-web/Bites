import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, UtensilsCrossed } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Initialize scrolled state based on current page
  const [scrolled, setScrolled] = useState(() => {
    return location.pathname !== "/";
  });

  useEffect(() => {
    const handleScroll = () => {
      // On home page, navbar starts transparent and becomes white on scroll
      // On other pages, navbar is always white (scrolled state)
      if (location.pathname === "/") {
        setScrolled(window.scrollY > 20);
      } else {
        setScrolled(true);
      }
    };

    // Update state immediately when location changes
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About Us", path: "/about" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div
            className={`p-1.5 rounded-lg transition-all duration-300 ${
              scrolled ? "bg-primary" : "bg-primary"
            } group-hover:rotate-12`}
          >
            <UtensilsCrossed className="text-white w-6 h-6" />
          </div>
          <span
            className={`text-2xl font-serif font-bold tracking-tight transition-colors duration-300 ${
              scrolled ? "text-gray-800" : "text-white"
            }`}
          >
            Bites
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative font-medium transition-colors duration-300 ${
                  scrolled
                    ? isActive
                      ? "text-primary"
                      : "text-gray-600 hover:text-primary"
                    : isActive
                      ? "text-accent"
                      : "text-white/90 hover:text-white"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 ${
                      scrolled ? "bg-primary" : "bg-accent"
                    }`}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            );
          })}
          <Link
            to="/reservation"
            className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 ${
              scrolled
                ? "bg-primary text-white hover:bg-accent"
                : "bg-accent text-white hover:bg-accent/80"
            }`}
          >
            Book a Table
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden transition-colors duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X
              size={28}
              className={scrolled ? "text-gray-800" : "text-white"}
            />
          ) : (
            <Menu
              size={28}
              className={scrolled ? "text-gray-800" : "text-white"}
            />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden shadow-lg"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/reservation"
                onClick={() => setIsOpen(false)}
                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold text-center mt-2"
              >
                Book a Table
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
