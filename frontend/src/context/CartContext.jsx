import React, { createContext, useState, useContext, useEffect } from "react";
import { getMenuItemByIdAdmin } from "../services/api";

// Create the context
const CartContext = createContext();

// Custom hook for using cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Safe price extraction function
const extractPrice = (price) => {
  // If it's already a number, return it
  if (typeof price === "number") {
    return price;
  }

  // If it's a string, clean it and convert to number
  if (typeof price === "string") {
    // Remove 'Rs.', commas, spaces, and other non-numeric characters
    const cleanPrice = price.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleanPrice);
    return isNaN(parsed) ? 0 : parsed;
  }

  // If it's anything else, return 0
  return 0;
};

// Cart Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // Ensure all items have valid prices
        const validItems = parsed.map((item) => ({
          ...item,
          price:
            typeof item.price === "number"
              ? item.price
              : extractPrice(item.price),
        }));
        setCartItems(validItems);
      } catch (error) {
        console.error("Error loading cart:", error);
        setCartItems([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = async (itemId, quantity = 1) => {
    setLoading(true);
    try {
      // Check if item already exists in cart
      const existingItem = cartItems.find((item) => item.id === itemId);

      if (existingItem) {
        // Update quantity
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        );
      } else {
        // Fetch item details from API
        const response = await getMenuItemByIdAdmin(itemId);
        if (response.success && response.data) {
          const item = response.data;

          // ✅ FIX: Safely extract price using the helper function
          const price = extractPrice(item.price || item.priceValue || 0);

          const newItem = {
            id: item._id || item.id,
            name: item.name,
            price: price, // Now this is always a number
            image: item.image || item.imageUrl,
            quantity: quantity,
          };

          setCartItems((prev) => [...prev, newItem]);
        } else {
          throw new Error("Failed to fetch item details");
        }
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (itemId) => {
    if (itemId === "all") {
      setCartItems([]);
      return;
    }
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === "number" ? item.price : 0;
      return total + price * (item.quantity || 0);
    }, 0);
  };

  const getItemCount = (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Export both the context and the provider
export { CartContext };
