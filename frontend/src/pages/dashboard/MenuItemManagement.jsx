// frontend/src/pages/dashboard/MenuItemManagement.jsx
import React, { useState, useEffect } from "react";
import {
  getAllMenuItemsAdmin,
  createMenuItemAdmin,
  updateMenuItemAdmin,
  deleteMenuItemAdmin,
} from "../../services/api";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Search,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";

const MenuItemManagement = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
    isAvailable: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getAllMenuItemsAdmin();
      setItems(data.data || []);
      setFilteredItems(data.data || []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    if (!searchTerm) {
      setFilteredItems(items);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.name?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term),
    );
    setFilteredItems(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (editingItem) {
        await updateMenuItemAdmin(editingItem._id, data);
      } else {
        await createMenuItemAdmin(data);
      }
      await fetchItems();
      resetForm();
    } catch (error) {
      console.error("Error saving menu item:", error);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteMenuItemAdmin(itemId);
        await fetchItems();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price,
      category: item.category || "",
      description: item.description || "",
      image: item.image || "",
      isAvailable: item.isAvailable !== false,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      name: "",
      price: "",
      category: "",
      description: "",
      image: "",
      isAvailable: true,
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">Loading menu items...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg text-sm w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            onClick={fetchItems}
            className="p-2 text-gray-500 hover:bg-accent transition"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingItem ? "Edit Item" : "Add New Item"}
              </h3>
              <button
                onClick={resetForm}
                className="hover:bg-gray-100 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary  "
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary  "
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="mt-2 w-24 h-24 object-cover rounded-lg"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isAvailable: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm font-medium">Available</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-accent transition"
                >
                  {editingItem ? "Update" : "Add"} Item
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover"
                onError={(e) => (e.target.src = "")}
              />
            ) : (
              <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-300" />
              </div>
            )}

            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900 truncate">
                  {item.name}
                </h3>
                {!item.isAvailable && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                    Unavailable
                  </span>
                )}
              </div>

              <p className="text-primary font-bold">Rs. {item.price}</p>

              {item.category && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {item.category}
                </span>
              )}

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm"
                >
                  <Edit className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-gray-500 text-center py-8">No menu items found</p>
      )}
    </div>
  );
};

export default MenuItemManagement;
