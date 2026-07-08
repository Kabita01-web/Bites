import { useState, useEffect, useContext, useMemo } from "react";
import { Search, Minus, Plus, Bell } from "lucide-react";
import { getAllMenuItemsAdmin } from "../../services/api";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

const OrderBoard = () => {
  const { user } = useContext(AuthContext);
  const { cart, addItem, updateItem, clear } = useContext(CartContext);

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const json = await getAllMenuItemsAdmin();
        const items = Array.isArray(json?.data) ? json.data : json || [];
        setMenuItems(items);
      } catch (err) {
        console.error(err);
        setError("Could not load menu items.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const categories = useMemo(() => {
    const unique = [
      ...new Set(menuItems.map((i) => i.category).filter(Boolean)),
    ];
    return ["all", ...unique];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        !search || item.name?.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategory, search]);

  // quantity currently in cart for a given menu item
  const getCartQty = (menuItemId) => {
    const found = cart?.items?.find((i) => i.menuItem?._id === menuItemId);
    return found?.quantity || 0;
  };

  const handleIncrease = (item) => {
    const currentQty = getCartQty(item._id);
    if (currentQty === 0) {
      addItem(item._id, 1);
    } else {
      updateItem(item._id, currentQty + 1);
    }
  };

  const handleDecrease = (item) => {
    const currentQty = getCartQty(item._id);
    if (currentQty <= 1) {
      updateItem(item._id, 0); // removes item, matches your controller's <=0 removal logic
    } else {
      updateItem(item._id, currentQty - 1);
    }
  };

  const subtotal =
    cart?.items?.reduce(
      (sum, i) => sum + (i.menuItem?.price || 0) * i.quantity,
      0,
    ) || 0;
  const tax = subtotal * 0.04; // placeholder rate — you should confirm your actual tax %
  const total = subtotal + tax;

  if (loading) {
    return <p className="p-10 text-gray-400">Loading menu...</p>;
  }

  return (
    <div className="flex gap-6 max-w-7xl mx-auto p-6">
      {/* LEFT: Menu */}
      <div className="flex-1 space-y-6">
        {/* Search bar */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search Your Menu Here"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Category tabs */}
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-3 rounded-xl border text-left transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-gray-200 text-gray-700 hover:border-primary/40"
              }`}
            >
              <p className="font-semibold text-sm capitalize">{cat}</p>
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <h2 className="text-xl font-bold text-gray-900 capitalize">
          {activeCategory === "all" ? "All Items" : `${activeCategory} Menu`}
        </h2>

        {/* Menu grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const qty = getCartQty(item._id);
            return (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-gray-200 p-4"
              >
                <img
                  src={item.image || item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover mb-3"
                />
                <p className="font-semibold text-gray-900 text-sm">
                  {item.name}
                </p>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-gray-900">${item.price}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecrease(item)}
                      disabled={qty === 0}
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 flex items-center justify-center"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => handleIncrease(item)}
                      className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Invoice / Cart panel */}
      <div className="w-80 shrink-0">
        <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-6">
          <h3 className="font-bold text-gray-900 mb-4">Invoice</h3>

          <div className="space-y-4 max-h-80 overflow-y-auto">
            {cart?.items?.length > 0 ? (
              cart.items.map((i) => (
                <div key={i.menuItem?._id} className="flex items-center gap-3">
                  <img
                    src={i.menuItem?.image || i.menuItem?.imageUrl}
                    alt={i.menuItem?.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {i.menuItem?.name}
                    </p>
                    <p className="text-xs text-gray-400">{i.quantity}x</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    ${(i.menuItem?.price * i.quantity).toFixed(1)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">
                No items yet.
              </p>
            )}
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Sub Total</span>
              <span>${subtotal.toFixed(1)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tax</span>
              <span>${tax.toFixed(1)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total Payment</span>
              <span>${total.toFixed(1)}</span>
            </div>
          </div>

          <button
            disabled={!cart?.items?.length}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold mt-5 hover:bg-accent transition-colors disabled:opacity-40"
          >
            Place An Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderBoard;
