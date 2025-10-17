import React, { createContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

// ✅ Create Context
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user profile if token exists
  useEffect(() => {
    const accessToken = localStorage.getItem("Token");
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Function: Save user & token (on login/register)
  const updateUser = (userData) => {
    setUser(userData);
    if (userData?.token) {
      localStorage.setItem("Token", userData.token);
    }
    setLoading(false);
  };

  // ✅ Function: Clear user (on logout or error)
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("Token");
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
