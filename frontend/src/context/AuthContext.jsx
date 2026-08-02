// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  getProfile,
} from "../services/api.js";

export const AuthContext = createContext();

// Custom hook
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
  const [error, setError] = useState(null);

  // Check if user is already logged in on app load
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        // ✅ Check if token exists in localStorage first
        const token = localStorage.getItem("token");
        console.log("🔑 Token exists on refresh:", !!token);

        if (!token) {
          console.log("ℹ️ No token found, user is not logged in");
          setUser(null);
          setLoading(false);
          return;
        }

        // ✅ Token exists, try to get user profile
        console.log("🔍 Fetching user profile...");
        const data = await getProfile();
        console.log("✅ User profile fetched:", data);

        // Set user from the response
        if (data && data.user) {
          setUser(normalizeUser(data.user));
        } else if (data && data._id) {
          // If the response is the user object directly
          setUser(normalizeUser(data));
        } else {
          console.warn("⚠️ Unexpected profile response:", data);
          setUser(null);
          // Clear invalid token
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("❌ Failed to fetch user profile:", error);

        // ✅ If token is invalid/expired, clear it
        if (error.response?.status === 401) {
          console.log("⚠️ Token expired or invalid, clearing...");
          localStorage.removeItem("token");
        }

        setUser(null);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔐 Logging in...");
      const data = await loginUser({ email, password });

      console.log("✅ Login successful:", data);

      // ✅ Make sure token is saved (loginUser already does this, but let's verify)
      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("✅ Token saved to localStorage");
      } else {
        console.warn("⚠️ No token in login response");
      }

      // Set user from the response
      if (data && data.user) {
        setUser(normalizeUser(data.user));
      } else if (data && data._id) {
        // If the response is the user object directly
        setUser(normalizeUser(data));
      } else {
        console.warn("⚠️ Unexpected login response:", data);
        throw new Error("Invalid login response");
      }

      return data;
    } catch (error) {
      console.error("❌ Login error:", error);
      setError(error.response?.data?.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);

      console.log("📝 Registering user...");
      await registerUser({
        username,
        email,
        password,
        confirmPassword: password,
      });

      console.log("✅ Registration successful, logging in...");
      // Auto-login after registration
      const data = await loginUser({ email, password });

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data && data.user) {
        setUser(normalizeUser(data.user));
      } else if (data && data._id) {
        setUser(normalizeUser(data));
      }

      return data;
    } catch (error) {
      console.error("❌ Registration error:", error);
      setError(error.response?.data?.message || "Registration failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log("🚪 Logging out...");
      await logoutUser();
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      // ✅ Always clear user and token, even if API call fails
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      if (!prev) return null;
      return normalizeUser({ ...prev, ...updatedData });
    });
  };

  // ✅ Helper to check if user is authenticated
  const isAuthenticated = !!user && !!localStorage.getItem("token");

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
