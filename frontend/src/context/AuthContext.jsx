import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo authentication
        if (email === "demo@example.com" && password === "demo123") {
          const user = { id: 1, email, username: "Demo User", role: "user" };
          const token = "demo-token-123456";

          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", token);
          setUser(user);
          resolve(user);
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 1000);
    });
  };

  const register = async (username, email, password) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if email already exists (demo)
        if (email === "demo@example.com") {
          reject(new Error("Email already exists"));
        } else {
          const user = { id: Date.now(), email, username, role: "user" };
          const token = "token-" + Date.now();

          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", token);
          setUser(user);
          resolve(user);
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
