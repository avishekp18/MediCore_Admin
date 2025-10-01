import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../AuthContext.jsx";
import { FaHospitalSymbol } from "react-icons/fa";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated, login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post(
        "https://medicore-backend-sv2c.onrender.com/api/v1/user/login",
        { email, password, role: "Admin" },
        { withCredentials: true }
      );

      toast.success(data.message);
      await login(data.user);
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin mb-6"></div>
        <span className="text-2xl font-bold text-gray-700 animate-pulse">MediCore...</span>
      </div>
    );

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 relative">

      {/* Demo Credentials Banner */}
      <div className="absolute top-6 w-full text-center px-4">
        <div className="inline-block bg-white/80 backdrop-blur-md border-l-4 border-blue-500 text-blue-700 px-6 py-3 rounded-md shadow-lg text-sm">
          <p>
            <strong>Demo Credentials:</strong> Email: <span className="font-medium">admin@example.com</span> | Password: <span className="font-medium">Admin@123</span>
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md flex flex-col items-center relative overflow-hidden"
      >
        {/* Logo & App Name */}
        <div className="flex flex-col items-center mb-8 space-y-3">
          <div className="px-4 py-2 text-center bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center">
            <span className="text-white text-4xl font-bold">Ap</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-wide animate-pulse">MediCore</h1>
        </div>

        {/* Inputs */}
        <div className="w-full flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition"
            required
            disabled={submitting}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition"
            required
            disabled={submitting}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl cursor-pointer hover:scale-105 transform transition flex items-center justify-center gap-3 shadow-lg ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {submitting && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {submitting ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* Optional footer */}
        <p className="mt-6 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} MediCore. All rights reserved.
        </p>
      </form>

      {/* Subtle floating shapes for modern effect */}
      <div className="absolute -top-16 -left-16 w-40 h-40 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
    </div>
  );
};

export default AdminLogin;
