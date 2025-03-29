// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const accessToken = localStorage.getItem("access_token");
    console.log("Fetching user with token:", accessToken);
    if (!accessToken) {
      setUser(null);
      setLoading(false);
      console.log("No token found, user set to null");
      return;
    }

    try {
      const response = await fetch("http://localhost:8001/auth/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user: " + response.statusText);
      }

      const userData = await response.json();
      console.log("User data fetched:", userData);
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    const accessToken = localStorage.getItem("access_token");
    try {
      await fetch("http://localhost:8001/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};