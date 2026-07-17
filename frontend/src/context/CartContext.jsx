import React, { createContext, useState, useContext, useEffect } from "react";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from "../services/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartId, setCartId] = useState(null);

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      console.log("📦 Raw API response:", response);

      // Check if response is the cart object directly (not wrapped in success)
      if (response && response.items) {
        console.log("📦 Cart items from backend:", response.items);
        setCartId(response._id);

        // Transform cart items to match what CartIcon expects
        const items = response.items.map((item) => ({
          id: item.menuItem?._id || item.menuItem,
          menuItemId: item.menuItem?._id || item.menuItem,
          name: item.menuItem?.name || "Unknown Item",
          price: item.menuItem?.price || 0,
          quantity: item.quantity || 1,
          image: item.menuItem?.image || null,
        }));
        console.log("📦 Transformed items:", items);
        setCartItems(items);
      } else if (response && response.success && response.cart) {
        // Alternative response structure
        const items = response.cart.items.map((item) => ({
          id: item.menuItem?._id || item.menuItem,
          menuItemId: item.menuItem?._id || item.menuItem,
          name: item.menuItem?.name || "Unknown Item",
          price: item.menuItem?.price || 0,
          quantity: item.quantity || 1,
          image: item.menuItem?.image || null,
        }));
        setCartItems(items);
        setCartId(response.cart._id);
      } else {
        console.warn("⚠️ No cart data found, setting empty array");
        setCartItems([]);
      }
    } catch (error) {
      console.error("❌ Fetch cart error:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Get total number of items in cart
  const getTotalItems = () => {
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return 0;
    }
    return cartItems.reduce((total, item) => {
      return total + (item.quantity || 0);
    }, 0);
  };

  // ✅ Get subtotal
  const getSubtotal = () => {
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return 0;
    }
    return cartItems.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return total + price * quantity;
    }, 0);
  };

  // ✅ Get total with tax and delivery
  const getCartTotal = () => {
    const subtotal = getSubtotal();
    const tax = Math.round(subtotal * 0.13);
    const deliveryFee = subtotal > 0 ? 50 : 0;
    return subtotal + tax + deliveryFee;
  };

  // ✅ Add item to cart
  const addItem = async (menuItemId, quantity = 1) => {
    try {
      console.log(
        "🛒 Adding to cart - MenuItemId:",
        menuItemId,
        "Quantity:",
        quantity,
      );

      if (!menuItemId) {
        console.error("❌ No menuItemId provided");
        return false;
      }

      const response = await addToCart(menuItemId, quantity);
      console.log("🛒 Add to cart response:", response);

      // Check if response is the cart object directly
      if (response && response.items) {
        console.log("✅ Item added successfully!");
        await fetchCart(); // Refresh cart
        return true;
      } else {
        console.error("❌ Add to cart failed:", response);
        return false;
      }
    } catch (error) {
      console.error("❌ Add item error:", error);
      console.error("Error details:", error.response?.data);
      return false;
    }
  };

  // ✅ Update quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeItem(itemId);
      return;
    }
    try {
      console.log("🔄 Updating quantity:", itemId, "->", newQuantity);
      await updateCartItem(itemId, newQuantity);
      await fetchCart();
    } catch (error) {
      console.error("Update quantity error:", error);
    }
  };

  // ✅ Remove item
  const removeItem = async (itemId) => {
    try {
      if (itemId === "all") {
        await clearCart();
        setCartItems([]);
      } else {
        console.log("🗑️ Removing item:", itemId);
        await removeFromCart(itemId);
        await fetchCart();
      }
    } catch (error) {
      console.error("Remove item error:", error);
    }
  };

  // ✅ Clear cart
  const clearCartItems = async () => {
    try {
      await clearCart();
      setCartItems([]);
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        getTotalItems,
        getSubtotal,
        getCartTotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart: clearCartItems,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
