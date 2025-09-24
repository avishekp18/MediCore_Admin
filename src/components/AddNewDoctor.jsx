import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../AuthContext.jsx";

const AddNewDoctor = () => {
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
    doctorDepartment: "",
    docAvatar: null,
  });

  const [docAvatarPreview, setDocAvatarPreview] = useState("");

  const departmentsArray = [
    "Pediatrics", "Orthopedics", "Cardiology", "Neurology",
    "Oncology", "Radiology", "Physical Therapy", "Dermatology", "ENT"
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, docAvatar: file });

    const reader = new FileReader();
    reader.onload = () => setDocAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    setSubmitting(true); // start loading
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const { data } = await axios.post(
        "https://medicore-backend-sv2c.onrender.com/api/v1/user/doctor/addnew",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
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
        doctorDepartment: "",
        docAvatar: null,
      });
      window.dispatchEvent(new Event("doctorUpdated"));
      setDocAvatarPreview("");
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
        className="bg-white shadow-md rounded-xl p-6 w-full max-w-4xl flex flex-col md:flex-row gap-6"
      >
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            {/* Avatar Image */}
            <img
              src={docAvatarPreview || "/docHolder.jpg"}
              alt="Doctor Avatar"
              className="w-40 h-40 object-cover rounded-full border-2 border-gray-300 shadow-lg transition-transform duration-300 group-hover:scale-105"
            />

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleAvatar}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
            />
          </div>

          {/* Optional: small text */}
          <p className="text-sm text-gray-500">Click the avatar to upload a new photo</p>
        </div>


        {/* Form Inputs */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <select
            name="doctorDepartment"
            value={form.doctorDepartment}
            onChange={handleChange}
            className="p-3 border rounded col-span-2"
            required
          >
            <option value="">Select Department</option>
            {departmentsArray.map((dept, i) => (
              <option key={i} value={dept}>{dept}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={submitting}
            className={`col-span-2 bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {submitting ? "Adding..." : "Register New Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewDoctor;
