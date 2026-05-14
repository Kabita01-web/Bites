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
  const response = await instance.put(`/user/editprofile/${userId}`, userData);
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

export default instance;
