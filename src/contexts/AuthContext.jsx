import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "../utils/axiosConfig";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 > Date.now()) {
            setUser(decodedToken);
            console.log(decodedToken);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          } else {
            await logout();
          }
        } catch (error) {
          console.error("Token decoding failed:", error);
          await logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/accounts/login", {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);

      const decodedToken = jwtDecode(token);
      setUser(decodedToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      console.log("Login Successful:", decodedToken);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // await axios.post('/Auth/Logout');
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
