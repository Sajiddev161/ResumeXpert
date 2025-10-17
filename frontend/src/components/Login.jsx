import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { Input } from "./Input";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // ✅ Email validation
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // ✅ Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("Token", token);
        updateUser({ ...user, token });
        navigate("/dashboard");
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (err) {
      console.error("❌ Login Error:", err);
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
    }
  };

  // ✅ Handle Close (Cross Button)
  const handleClose = () => {
    setCurrentPage(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4 py-6">
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-200">
        {/* ❌ Cross Button — Top Right */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-3xl font-bold"
          aria-label="Close"
        >
          ×
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold text-gray-800">Welcome Back 👋</h3>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Sign in to continue building amazing resumes
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-[1.02]"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => setCurrentPage("signup")}
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
