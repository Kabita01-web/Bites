import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllMenusAdmin,
  getAllMenuItemsAdmin,
  createMenuItemAdmin,
  updateMenuItemAdmin,
  deleteMenuItemAdmin,
} from "../../services/api";

const CATEGORIES = ["food", "beverage", "dessert", "side"];

const EMPTY_FORM = {
  _id: null,
  name: "",
  description: "",
  price: "",
  category: "food",
  ingredients: "",
  tags: "",
  isAvailable: true,
  menu: "",
  imageUrl: "",
};

const MenuItemManagement = () => {
  const [items, setItems] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [itemsJson, menusJson] = await Promise.all([
        getAllMenuItemsAdmin(),
        getAllMenusAdmin(),
      ]);

      if (!itemsJson.success) {
        throw new Error(itemsJson.message || "Failed to load menu items");
      }
      if (!menusJson.success) {
        throw new Error(menusJson.message || "Failed to load menus");
      }

      setItems(itemsJson.data);
      setMenus(menusJson.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong while loading data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  function resetForm() {
    setForm(EMPTY_FORM);
    setIsEditing(false);
  }

  function startEdit(item) {
    setForm({
      _id: item._id,
      name: item.name || "",
      description: item.description || "",
      price: item.price ?? "",
      category: item.category || "food",
      ingredients: item.ingredients || "",
      tags: (item.tags || []).join(", "),
      isAvailable: item.isAvailable ?? true,
      menu: item.menu?._id || item.menu || "",
      imageUrl: item.imageUrl || "",
    });
    setIsEditing(true);
    setError("");
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.price || !form.menu) {
      setError("Name, price, and menu are required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      ingredients: form.ingredients.trim(),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isAvailable: form.isAvailable,
      menu: form.menu,
      imageUrl: form.imageUrl.trim(),
    };

    setSubmitting(true);
    try {
      const json = isEditing
        ? await updateMenuItemAdmin(form._id, payload)
        : await createMenuItemAdmin(payload);

      if (!json.success) {
        throw new Error(json.message || "Save failed");
      }

      await fetchAll();
      resetForm();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong while saving",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setError("");
    try {
      const json = await deleteMenuItemAdmin(deleteTarget._id);

      if (!json.success) {
        throw new Error(json.message || "Delete failed");
      }

      setItems((prev) => prev.filter((i) => i._id !== deleteTarget._id));
      if (form._id === deleteTarget._id) resetForm();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong while deleting",
      );
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Menu Items</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add, edit, or remove dishes across your menus.
        </p>
      </header>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {menus.length === 0 && !loading && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          No menus found yet. Create a menu first — every menu item needs to
          belong to one.
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <h2 className="mb-4 text-sm font-medium text-gray-700">
          {isEditing ? "Edit item" : "Add a new item"}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="Truffle Arancini"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Price (Rs.)
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="250"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Menu
            </label>
            <select
              name="menu"
              value={form.menu}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Select a menu</option>
              {menus.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="Crispy risotto balls with wild truffle and mozzarella."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Ingredients
            </label>
            <input
              name="ingredients"
              value={form.ingredients}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="Arborio rice, Black Truffle, Mozzarella, Parmesan"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Image URL
            </label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="https://images.unsplash.com/photo-..."
            />
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="Preview"
                className="mt-2 h-24 w-24 rounded-lg object-cover border border-gray-200"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Tags (comma-separated)
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="vegan, spicy"
            />
          </div>

          <div className="flex items-center gap-2 self-end pb-2">
            <input
              id="isAvailable"
              name="isAvailable"
              type="checkbox"
              checked={form.isAvailable}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="isAvailable" className="text-sm text-gray-600">
              Available
            </label>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Saving..." : isEditing ? "Save changes" : "Add item"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <p className="px-5 py-8 text-center text-sm text-gray-400">
            Loading menu items...
          </p>
        ) : items.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-gray-400">
            No menu items yet. Add your first one above.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.li
                  key={item._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-gray-900">
                        {item.name}
                      </p>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                        {item.category}
                      </span>
                      {!item.isAvailable && (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">
                          Unavailable
                        </span>
                      )}
                    </div>
                    <p className="truncate text-sm text-gray-500">
                      Rs. {item.price}
                      {item.menu?.name ? ` · ${item.menu.name}` : ""}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 px-4 z-50"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg"
            >
              <p className="text-sm font-medium text-gray-900">
                Delete "{deleteTarget.name}"?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                This can't be undone.
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuItemManagement;
