import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  UtensilsCrossed,
  User,
  LogOut,
  UserCircle,
  ChevronDown,
  LayoutDashboard,
  CalendarCheck,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import AuthModal from "./AuthModel";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useContext(AuthContext);

  const [scrolled, setScrolled] = useState(() => location.pathname !== "/");

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === "/") {
        setScrolled(window.scrollY > 20);
      } else {
        setScrolled(true);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileOpen(false);
  };

  const handleBookTableClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowAuthModal(true);
      setIsOpen(false);
    }
  };

  if (loading) {
    return (
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"}`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Logo scrolled={scrolled} />
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </nav>
    );
  }

  // Updated nav links - Gallery removed, added Reservations
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <style>{`
        .nav-link-underline::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          right: 0;
          height: 2px;
          background: currentColor;
          border-radius: 999px;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.25s ease;
        }
        .nav-link-underline:hover::after,
        .nav-link-underline.active::after {
          transform: scaleX(1);
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          transition: background 0.15s, color 0.15s;
          cursor: pointer;
          text-decoration: none;
          white-space: nowrap;
        }
        .dropdown-item:hover {
          background: #f9fafb;
          color: #111827;
        }
        .dropdown-item.danger {
          color: #dc2626;
        }
        .dropdown-item.danger:hover {
          background: #fef2f2;
        }
        .auth-divider {
          height: 1px;
          background: #f3f4f6;
          margin: 4px 0;
        }
        @keyframes dropdown-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dropdown-animate {
          animation: dropdown-in 0.18s ease forwards;
        }
        @keyframes mobile-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-animate {
          animation: mobile-in 0.2s ease forwards;
        }
      `}</style>

      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-6">
          {/* Logo */}
          <Logo scrolled={scrolled} />

          {/* Desktop Nav Links — centered */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative nav-link-underline text-sm font-semibold tracking-wide transition-colors duration-200 ${isActive ? "active" : ""} ${
                    scrolled
                      ? isActive
                        ? "text-primary"
                        : "text-gray-500 hover:text-gray-900"
                      : isActive
                        ? "text-white"
                        : "text-white/75 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      scrolled
                        ? "text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                        : "text-white hover:bg-white/10 border border-white/20"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        scrolled
                          ? "bg-primary text-white"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {user.username?.[0]?.toUpperCase()}
                    </span>
                    <span>{user.username}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="dropdown-animate absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100/80 overflow-hidden py-1.5">
                      <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                          Signed in as
                        </p>
                        <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">
                          {user.username}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="dropdown-item"
                      >
                        <User size={15} className="text-gray-400" />
                        My Profile
                      </Link>
                      {user?.role !== "user" && (
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="dropdown-item"
                        >
                          <LayoutDashboard
                            size={15}
                            className="text-gray-400"
                          />
                          Dashboard
                        </Link>
                      )}
                      <div className="auth-divider" />
                      <button
                        onClick={handleLogout}
                        className="dropdown-item danger w-full text-left"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>

                {/* Book a Table CTA */}
                <Link
                  to="/reservation"
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <CalendarCheck size={15} />
                  Book a Table
                </Link>
              </>
            ) : (
              <>
                {/* Login + Sign Up in a grouped pill */}
                <div
                  className={`flex items-center rounded-full p-1 gap-1 ${
                    scrolled ? "bg-gray-100" : "bg-white/10"
                  }`}
                >
                  <Link
                    to="/login"
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                      scrolled
                        ? "text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                      scrolled
                        ? "bg-gray-800 text-white hover:bg-gray-900 shadow-sm"
                        : "bg-white text-gray-900 hover:bg-white/90"
                    }`}
                  >
                    Sign Up
                  </Link>
                </div>

                {/* Book a Table CTA */}
                <button
                  onClick={handleBookTableClick}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <CalendarCheck size={15} />
                  Book a Table
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X
                size={24}
                className={scrolled ? "text-gray-800" : "text-white"}
              />
            ) : (
              <Menu
                size={24}
                className={scrolled ? "text-gray-800" : "text-white"}
              />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <div className="mobile-animate md:hidden bg-white border-t border-gray-100 shadow-xl">
              <div className="flex flex-col px-5 pt-4 pb-6 gap-1">
                {/* Nav links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-3 py-3 rounded-xl text-base font-semibold transition-colors ${
                      location.pathname === link.path
                        ? "text-primary bg-primary/5"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="h-px bg-gray-100 my-3" />

                {user ? (
                  <>
                    {/* User info */}
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-400">Signed in</p>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm font-medium"
                    >
                      <User size={16} className="text-gray-400" /> My Profile
                    </Link>
                    {user?.role !== "user" && (
                      <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm font-medium"
                      >
                        <LayoutDashboard size={16} className="text-gray-400" />{" "}
                        Dashboard
                      </Link>
                    )}

                    <div className="h-px bg-gray-100 my-2" />

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-sm font-medium w-full text-left"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>

                    <Link
                      to="/reservation"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 mt-3 px-6 py-3.5 bg-primary text-white rounded-2xl font-semibold text-sm shadow-md shadow-primary/20"
                    >
                      <CalendarCheck size={16} />
                      Book a Table
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Auth buttons stacked */}
                    <div className="flex flex-col gap-2 mt-1">
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="px-6 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold text-sm text-center hover:border-gray-300 transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="px-6 py-3 rounded-2xl bg-gray-900 text-white font-semibold text-sm text-center hover:bg-gray-800 transition-colors"
                      >
                        Sign Up
                      </Link>
                      <button
                        onClick={() => {
                          handleBookTableClick();
                          setIsOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl font-semibold text-sm shadow-md shadow-primary/20 mt-1"
                      >
                        <CalendarCheck size={16} />
                        Book a Table
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

const Logo = ({ scrolled }) => (
  <Link to="/" className="flex items-center gap-2.5 group shrink-0">
    <div className="p-1.5 rounded-xl bg-primary group-hover:rotate-12 transition-transform duration-300 shadow-md shadow-primary/20">
      <UtensilsCrossed className="text-white w-5 h-5" />
    </div>
    <span
      className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
        scrolled ? "text-gray-900" : "text-white"
      }`}
    >
      Bites
    </span>
  </Link>
);

export default Navbar;
