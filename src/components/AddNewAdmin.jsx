import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../AuthContext";

const AddNewAdmin = () => {
  const { isAuthenticated, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false); // add at top
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nic: "",
    dob: "",
    gender: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setSubmitting(true); // start loading
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://medicore-backend-sv2c.onrender.com/api/v1/user/admin/addnew",
        form,
        { withCredentials: true }
      );
      toast.success(data.message);
      navigate("/");

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        nic: "",
        dob: "",
        gender: "",
        password: "",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
    finally {
      setSubmitting(false); // stop loading
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">MediCore...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <h1 className="col-span-2 text-2xl font-bold text-center mb-4">ADD NEW ADMIN</h1>

        <input
          name="firstName"
          type="text"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          className="p-3 border rounded"
          required
        />
        <input
          name="lastName"
          type="text"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          className="p-3 border rounded"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="p-3 border rounded"
          required
        />
        <input
          name="phone"
          type="text"
          placeholder="Mobile Number"
          value={form.phone}
          onChange={handleChange}
          className="p-3 border rounded"
          required
        />
        <input
          name="nic"
          type="text"
          placeholder="NIC"
          value={form.nic}
          onChange={handleChange}
          className="p-3 border rounded"
          required
        />
        <input
          name="dob"
          type="date"
          value={form.dob}
          onChange={handleChange}
          className="p-3 border rounded"
          required
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="p-3 border rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="p-3 border rounded"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className={`col-span-2 bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {submitting ? "Adding..." : "Register New Admin"}
        </button>
      </form>
    </div>
  );
};

export default AddNewAdmin;
