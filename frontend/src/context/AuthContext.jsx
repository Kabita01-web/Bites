// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  getProfile,
} from "../services/api.js";

export const AuthContext = createContext();

// ✅ Add this custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const normalizeUser = (userData) => ({
  ...userData,
  role: userData?.role || "user",
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile();
        setUser(normalizeUser(data.user));
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    setUser(normalizeUser(data.user));
  };

  const register = async (username, email, password) => {
    await registerUser({
      username,
      email,
      password,
      confirmPassword: password,
    });
    const data = await loginUser({ email, password });
    setUser(normalizeUser(data.user));
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => normalizeUser({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Also export the context itself (optional, for backward compatibility)
export default AuthContext;
