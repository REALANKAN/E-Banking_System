import { createContext, useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Login function with API call
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      // Check if login was successful
      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);  // 🔥 Storing token
      }

      return response.data;
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  // 🔹 Register function with API call
  const register = async (name, email, password, accountType) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        { name, email, password, accountType },
        { withCredentials: true }
      );

      // Check if registration was successful
      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);  // 🔥 Storing token
      }
  

      return response.data;
    } catch (error) {
      console.error("❌ Registration failed:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  // 🔹 Logout function
  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      console.log("✅ Logged out successfully!");
    } catch (error) {
      console.error("❌ Logout failed:", error.response?.data?.message || error.message);
    }
  };

  // 🔹 Auto-login on page refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      axios.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;

      // Verify token with the backend to ensure it's still valid
      axios
        .get(`${API_BASE_URL}/api/auth/profile`, { withCredentials: true })
        .then((res) => {
          setUser(res.data);
        })
        .catch((error) => {
          console.error("❌ Auto-login failed, clearing stored user:", error.message);
          logout(); // Log out and clear invalid token
        });
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
