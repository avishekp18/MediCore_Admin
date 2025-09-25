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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 relative w-full">
      {/* Demo credentials banner on body */}
      <div className="absolute top-6 text-center w-full">
        <div className="inline-block bg-blue-50 border-l-4 border-blue-400 text-blue-700 px-6 py-3 rounded-md shadow-md text-sm">
          <p><strong>Demo Credentials:</strong> Email: <span className="font-medium">admin@example.com</span> | Password: <span className="font-medium">Admin@123</span></p>
        </div>
      </div>

      {/* Animated App Name */}
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800 animate-pulse">MediCore</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl p-8 rounded-2xl w-96 flex flex-col items-center"
      >
        {/* Logo */}
        <div className="flex items-center mb-6 space-x-3">
          <div className="p-3 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full shadow-lg">
            <FaHospitalSymbol className="text-white text-3xl" />
          </div>
          <span className="text-3xl font-extrabold text-gray-800">MediCore</span>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
          required
          disabled={submitting}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
          required
          disabled={submitting}
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:scale-105 transform transition flex items-center justify-center gap-2"
          disabled={submitting}
        >
          {submitting && (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
