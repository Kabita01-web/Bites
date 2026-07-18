import axios from "axios";

// ---------------------------------------------------------------------------
// 1) Axios Instance Configuration
// ---------------------------------------------------------------------------
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request if it exists
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling errors globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Optionally redirect to login
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// ---------------------------------------------------------------------------
// 2) Auth Services
// ---------------------------------------------------------------------------
export const registerUser = async (userData) => {
  const response = await instance.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await instance.post("/auth/login", userData);
  // Save token if returned
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

export const logoutUser = async () => {
  const response = await instance.post("/auth/logout");
  localStorage.removeItem("token");
  return response.data;
};

export const getProfile = async () => {
  const response = await instance.get("/auth/profile");
  return response.data;
};

export const updateProfile = async (userData, userId) => {
  const response = await instance.put(`/users/editprofile/${userId}`, userData);
  return response.data;
};

// ---------------------------------------------------------------------------
// 3) User Management (Admin)
// ---------------------------------------------------------------------------
export const getAllUsers = async () => {
  const response = await instance.get("/users");
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await instance.put(`/users/${userId}/role`, { role });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await instance.delete(`/users/${userId}`);
  return response.data;
};

export const getSystemStats = async () => {
  const response = await instance.get("/stats/system");
  return response.data;
};

// ---------------------------------------------------------------------------
// 4) Menu Services
// ---------------------------------------------------------------------------
// Static menu (from JSON file - keep for fallback)
export const getMenuItems = async () => {
  const res = await fetch("/menu.json");
  if (!res.ok) throw new Error("Failed to load menu");
  return res.json();
};

// Live MongoDB data (for admin/moderator dashboard)
export const getAllMenusAdmin = async () => {
  const response = await instance.get("/menus");
  return response.data;
};

export const getAllMenuItemsAdmin = async () => {
  const response = await instance.get("/menu-items");
  return response.data;
};

export const createMenuItemAdmin = async (itemData) => {
  const response = await instance.post("/menu-items", itemData);
  return response.data;
};

export const updateMenuItemAdmin = async (itemId, itemData) => {
  const response = await instance.put(`/menu-items/${itemId}`, itemData);
  return response.data;
};

export const deleteMenuItemAdmin = async (itemId) => {
  const response = await instance.delete(`/menu-items/${itemId}`);
  return response.data;
};

export const getMenuItemByIdAdmin = async (itemId) => {
  const response = await instance.get(`/menu-items/${itemId}`);
  return response.data;
};

// ---------------------------------------------------------------------------
// 5) Reservation Services
// ---------------------------------------------------------------------------
export const createReservation = async (reservationData) => {
  const response = await instance.post("/reservations", reservationData);
  return response.data;
};

export const getMyReservations = async () => {
  const response = await instance.get("/reservations/my");
  return response.data;
};

export const getAllReservationsAdmin = async () => {
  const response = await instance.get("/reservations");
  return response.data;
};

export const updateReservationStatusAdmin = async (reservationId, status) => {
  const response = await instance.put(`/reservations/${reservationId}/status`, {
    status,
  });
  return response.data;
};

// ---------------------------------------------------------------------------
// 6) Cart Services
// ---------------------------------------------------------------------------

// Get cart - returns cart object directly
export const getCart = async () => {
  const response = await instance.get("/cart");
  return response.data; // Returns cart object directly
};

// Add to cart - returns updated cart object
export const addToCart = async (menuItemId, quantity = 1) => {
  const response = await instance.post("/cart", { menuItemId, quantity });
  return response.data; // Returns updated cart object
};

// Update cart item - returns updated cart object
export const updateCartItem = async (menuItemId, quantity) => {
  const response = await instance.put(`/cart/${menuItemId}`, { quantity });
  return response.data;
};

// Remove from cart - returns updated cart object
export const removeFromCart = async (menuItemId) => {
  const response = await instance.delete(`/cart/${menuItemId}`);
  return response.data;
};

// Clear cart - returns success message
export const clearCart = async () => {
  const response = await instance.delete("/cart");
  return response.data;
};

// ---------------------------------------------------------------------------
// 7) Order Services
// ---------------------------------------------------------------------------
// frontend/src/services/api.js

export const createOrder = async (deliveryAddress) => {
  const response = await instance.post("/orders", { deliveryAddress });
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await instance.get(`/orders/${orderId}`);
  return response.data;
};

export const getAllOrders = async () => {
  const response = await instance.get("/orders");
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await instance.put(`/orders/${orderId}/status`, { status });
  return response.data;
};

// ---------------------------------------------------------------------------
// 8) Payment Services — eSewa Integration (Nepal)
// ---------------------------------------------------------------------------

/**
 * Initiate eSewa payment for an order
 * Returns { success, paymentUrl, formFields, merchantOrderId }
 * The frontend uses these to build and auto-submit an HTML form
 */
export const initiateEsewaPayment = async (orderId) => {
  const response = await instance.post("/payments/initiate-esewa", { orderId });
  return response.data;
};

/**
 * Explicit server-side re-verification
 * Keyed by our own merchant order id (the transaction_uuid we generated)
 */
export const verifyEsewaPayment = async (merchantOrderId) => {
  const response = await instance.get("/payments/esewa-verify", {
    params: { merchantOrderId },
  });
  return response.data;
};

/**
 * Get payment status for an order
 * Used on the payment status page to check if payment was successful
 */
export const getPaymentStatus = async (orderId) => {
  const response = await instance.get(`/payments/status/${orderId}`);
  return response.data;
};

/**
 * Get all payments (Admin only)
 */
export const getAllPayments = async () => {
  const response = await instance.get("/payments");
  return response.data;
};

/**
 * Refund a payment (Admin only)
 */
export const refundPayment = async (paymentId) => {
  const response = await instance.post(`/payments/refund/${paymentId}`);
  return response.data;
};

// ---------------------------------------------------------------------------
// 9) Export the raw instance for custom requests
// ---------------------------------------------------------------------------
export default instance;
