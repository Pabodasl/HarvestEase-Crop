import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Load user from token (optional improvement)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setCurrentUser(storedUser);
    }
  }, []);

  // Login
  const login = async (data) => {
    const res = await axios.post("http://localhost:5000/api/auth/login", data);
    setCurrentUser(res.data.user);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  };

  // Register
  const register = async (data) => {
    const res = await axios.post("http://localhost:5000/api/auth/register", data);
    setCurrentUser(res.data.user);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
