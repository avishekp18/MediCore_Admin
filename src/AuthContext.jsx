import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // show loader until auth is checked

  // Check if admin is logged in on mount
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const { data } = await axios.get(
          "https://medicore-backend-sv2c.onrender.com/api/v1/user/admin/me",
          { withCredentials: true }
        );
        if (data.user) {
          setAdmin(data.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        setAdmin(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // done checking
      }
    };

    fetchAdmin();
  }, []);

  // Log in by updating context
  const login = (userData) => {
    setAdmin(userData);
    setIsAuthenticated(true);
    setLoading(false);
  };

  // Log out by clearing context and optional backend call
  const logout = async () => {
    try {
      await axios.get(
        "https://medicore-backend-sv2c.onrender.com/api/v1/user/admin/logout",
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setAdmin(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
