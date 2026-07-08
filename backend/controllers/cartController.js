import Cart from "../models/Cart.js";

// Get current user's cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.menuItem",
    );
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch cart", error: err.message });
  }
};

// Add item to cart (or increase quantity if it already exists)
export const addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.menuItem.toString() === menuItemId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ menuItem: menuItemId, quantity });
    }

    await cart.save();
    await cart.populate("items.menuItem");
    res.status(200).json(cart);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add item to cart", error: err.message });
  }
};

// Update quantity of a specific item
export const updateCartItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.menuItem.toString() === menuItemId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.menuItem.toString() !== menuItemId,
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.menuItem");
    res.json(cart);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update cart", error: err.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.menuItem.toString() !== menuItemId);

    await cart.save();
    await cart.populate("items.menuItem");
    res.json(cart);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to remove item", error: err.message });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to clear cart", error: err.message });
  }
};
