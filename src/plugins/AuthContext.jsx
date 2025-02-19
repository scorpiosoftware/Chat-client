import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    // Check if the user is authenticated (e.g., by checking localStorage for a token)
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token) => {
    sessionStorage.setItem("token", token); // Save the token to localStorage
    setIsAuthenticated(true);
  };

  const logout = (path) => {
    sessionStorage.removeItem("token");
    setIsAuthenticated(false);
  };
  const getUserIdFromToken = () => {
    const token = sessionStorage.getItem("token");
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
      return  parseInt(decodedPayload.userId, 10) || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
  const getRoleFromToken = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;
  
    try {
      // Split token into parts
      const [, payload] = token.split(".");
      if (!payload) throw new Error("Invalid token format");
  
      // Base64 URL decoding
      const base64Url = payload
        .replace(/-/g, "+")
        .replace(/_/g, "/");
  
      // Add padding
      const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
      const base64 = base64Url + padding;
  
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
