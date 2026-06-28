import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMenuItemByIdAdmin, getAllMenuItemsAdmin } from "../services/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200";

const MenuDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dish, setDish] = useState(null);
  const [relatedDishes, setRelatedDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchDish = async () => {
      setLoading(true);
      setError("");
      try {
        const json = await getMenuItemByIdAdmin(id);
        if (!json.success || !json.data) {
          throw new Error("not found");
        }
        setDish(json.data);

        // Fetch related dishes in the same category
        const allJson = await getAllMenuItemsAdmin();
        const all = Array.isArray(allJson?.data) ? allJson.data : [];
        const related = all
          .filter(
            (item) =>
              item.category === json.data.category &&
              item._id !== json.data._id &&
              item.isAvailable,
          )
          .slice(0, 3);
        setRelatedDishes(related);
      } catch {
        setError("Could not load this dish. It may no longer be available.");
      } finally {
        setLoading(false);
      }
    };
    fetchDish();
  }, [id]);

  const handleAddToCart = () => {
    // Implement your cart logic here
    console.log("Added to cart:", {
      ...dish,
      quantity,
      specialInstructions,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  if (loading) {
    return (
      <div className="pt-28 pb-32 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dish...</p>
      </div>
    );
  }

  if (error || !dish) {
    return (
      <div className="pt-28 pb-32 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">
            Dish Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            {error || "Sorry, we couldn't find the dish you're looking for."}
          </p>
          <Link
            to="/menu"
            className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-32 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={dish.imageUrl || FALLBACK_IMAGE}
          alt={dish.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block bg-primary/90 backdrop-blur-sm text-white text-sm px-4 py-1 rounded-full mb-4">
                {dish.category}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4">
                {dish.name}
              </h1>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl">
                {dish.description}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 md:left-8 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all flex items-center gap-2"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 md:px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-3 gap-8 p-6 md:p-8">
            {/* Main Content - Left */}
            <div className="lg:col-span-2">
              {/* Price and Quick Info */}
              <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-6 border-b border-gray-200">
                <div>
                  <span className="text-5xl font-serif font-bold text-primary">
                    Rs. {dish.price}
                  </span>
                  <span className="text-gray-500 ml-2">per serving</span>
                </div>
                <div className="flex gap-3">
                  {dish.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">
                  About This Dish
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {dish.description}
                </p>
              </div>

              {/* Ingredients */}
              {dish.ingredients && (
                <div className="mb-8">
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">
                    Ingredients
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {dish.ingredients}
                  </p>
                </div>
              )}
            </div>

            {/* Order Section - Right */}
            <div className="lg:sticky lg:top-28 h-fit">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                <h3 className="text-2xl font-serif font-bold text-gray-800 mb-4">
                  Order This Dish
                </h3>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition-all"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold text-gray-800 min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any allergies, preferences, or special requests?"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                {/* Total Price */}
                <div className="mb-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-2xl font-bold text-primary">
                      Rs. {(dish.price * quantity).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    * Excludes tax and service charge
                  </p>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary/90 transition-all transform hover:scale-105 duration-300 mb-3"
                >
                  Add to Cart
                </button>

                {/* Success Message */}
                {addedToCart && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 p-3 bg-green-100 text-green-700 rounded-lg text-center text-sm"
                  >
                    ✓ Added to cart successfully!
                  </motion.div>
                )}

                {/* Reservation Link */}
                <Link
                  to="/reservation"
                  className="block text-center text-gray-600 hover:text-primary transition-colors text-sm mt-4"
                >
                  Or reserve a table instead →
                </Link>
              </div>

              {/* Share Section */}
              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm mb-3">Share this dish</p>
                <div className="flex justify-center gap-3">
                  <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                    </svg>
                  </button>
                  <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.78-.2-7.14-2-9.38-4.74-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" />
                    </svg>
                  </button>
                  <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06c0 4.4 2.86 8.15 6.84 9.47.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.9.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.1-4.55-4.92 0-1.1.38-2 .98-2.7-.1-.24-.43-1.22.1-2.54 0 0 .8-.26 2.62.98.76-.22 1.57-.33 2.38-.33.8 0 1.62.11 2.38.33 1.82-1.24 2.62-.98 2.62-.98.53 1.32.2 2.3.1 2.54.6.7.98 1.6.98 2.7 0 3.83-2.34 4.67-4.57 4.92.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .26.18.58.7.48 3.97-1.32 6.83-5.06 6.83-9.46 0-5.53-4.5-10.02-10-10.02z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like Section */}
        {relatedDishes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedDishes.map((item) => (
                <Link
                  key={item._id}
                  to={`/menu/${item._id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.imageUrl || FALLBACK_IMAGE}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif font-bold text-xl text-gray-800 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-primary font-bold text-lg">
                      Rs. {item.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default MenuDetails;
