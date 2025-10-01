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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <h1 className="col-span-2 text-3xl font-bold text-center text-gray-800 mb-6">
          Add New Admin
        </h1>

        {[
          { name: "firstName", placeholder: "First Name", type: "text" },
          { name: "lastName", placeholder: "Last Name", type: "text" },
          { name: "email", placeholder: "Email", type: "email" },
          { name: "phone", placeholder: "Mobile Number", type: "text" },
          { name: "nic", placeholder: "NIC", type: "text" },
          { name: "dob", placeholder: "Date of Birth", type: "date" },
          { name: "password", placeholder: "Password", type: "password" },
        ].map((field) => (
          <input
            key={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={form[field.name]}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
          />
        ))}

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <button
          type="submit"
          disabled={submitting}
          className={`col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 ${submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          {submitting ? "Adding..." : "Register New Admin"}
        </button>
      </form>
    </div>

  );
};

export default AddNewAdmin;
