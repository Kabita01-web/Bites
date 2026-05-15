// src/controllers/menuController.js
import Menu from "../models/Menu.js";
import MenuItem from "../models/MenuItem.js";

// ─── Menu CRUD ───────────────────────────────────────────

// GET /api/menus
export const getMenus = async (req, res) => {
  try {
    const menus = await Menu.find({ isActive: true })
      .populate("items")
      .sort("sortOrder");

    res.json({ success: true, data: menus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/menus/:id
export const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id).populate("items");

    if (!menu) {
      return res
        .status(404)
        .json({ success: false, message: "Menu not found" });
    }

    res.json({ success: true, data: menu });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/menus
export const createMenu = async (req, res) => {
  try {
    const menu = await Menu.create(req.body);
    res.status(201).json({ success: true, data: menu });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/menus/:id
export const updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("items");

    if (!menu) {
      return res
        .status(404)
        .json({ success: false, message: "Menu not found" });
    }

    res.json({ success: true, data: menu });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/menus/:id
export const deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);

    if (!menu) {
      return res
        .status(404)
        .json({ success: false, message: "Menu not found" });
    }

    res.json({ success: true, message: "Menu deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── MenuItem CRUD ────────────────────────────────────────

// GET /api/menu-items
export const getMenuItems = async (req, res) => {
  try {
    const { category, dietary, spiceLevel } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (dietary) filter.dietary = { $in: [dietary] };
    if (spiceLevel) filter.spiceLevel = spiceLevel;

    const items = await MenuItem.find(filter).populate("menu", "name category");

    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/menu-items/:id
export const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate(
      "menu",
      "name",
    );

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/menu-items
export const createMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);

    // Add item reference to its parent menu
    if (req.body.menu) {
      await Menu.findByIdAndUpdate(req.body.menu, {
        $push: { items: item._id },
      });
    }

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/menu-items/:id
export const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/menu-items/:id
export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    // Remove item reference from its parent menu
    if (item.menu) {
      await Menu.findByIdAndUpdate(item.menu, { $pull: { items: item._id } });
    }

    res.json({ success: true, message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
