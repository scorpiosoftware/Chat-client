import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    // Check if the user is authenticated (e.g., by checking localStorage for a token)
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token); // Save the token to localStorage
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    const navigate = useNavigate();
    navigate("/login");
  };
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      // Split the token into parts
      const [, payload] = token.split(".");

      // Add padding and replace URL-safe characters
      let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      switch (base64.length % 4) {
        case 2:
          base64 += "==";
          break;
        case 3:
          base64 += "=";
          break;
        default:
          break;
      }

      // Decode and parse
      const decodedPayload = JSON.parse(atob(base64));

      return decodedPayload.userId || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
  const getRoleFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      // Split the token into parts
      const [, payload] = token.split(".");

      // Add padding and replace URL-safe characters
      let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      switch (base64.length % 4) {
        case 2:
          base64 += "==";
          break;
        case 3:
          base64 += "=";
          break;
        default:
          break;
      }

      // Decode and parse
      const decodedPayload = JSON.parse(atob(base64));

      return decodedPayload.role || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout,getRoleFromToken,getUserIdFromToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
