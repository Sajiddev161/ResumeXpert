// ✅ src/api/axiosInstance.js

import axios from "axios";
import { BASE_URL } from "./apiPaths";

// ✅ Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("Token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Unauthorized
      if (error.response.status === 401) {
        console.warn("⚠️ Unauthorized - redirecting to login...");
        window.location.href = "/";
      }
      // Internal Server Error
      else if (error.response.status === 500) {
        console.error("⚠️ Server Error:", error.response.data);
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("⏰ Request timed out.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
