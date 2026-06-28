import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const registerUser = async (userData) => {
  const response = await instance.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await instance.post("/auth/login", userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await instance.post("/auth/logout");
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
  const response = await instance.get("/users/stats");
  return response.data;
};

export const getMenuItems = async () => {
  const res = await fetch("/menu.json");
  if (!res.ok) throw new Error("Failed to load menu");
  return res.json();
};

// ── Menu item management (live MongoDB data, for admin/moderator dashboard) ──
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

export default instance;
