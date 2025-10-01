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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-5xl flex flex-col md:flex-row gap-8"
      >
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group w-44 h-44">
            <img
              src={docAvatarPreview || "/docHolder.jpg"}
              alt="Doctor Avatar"
              className="w-full h-full object-cover rounded-full border-4 border-gray-200 shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleAvatar}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
            />
            <span className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-bold shadow-md">
              +
            </span>
          </div>
          <p className="text-sm text-gray-500 text-center">Click avatar to upload a new photo</p>
        </div>

        {/* Form Inputs */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
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

          <select
            name="doctorDepartment"
            value={form.doctorDepartment}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm col-span-2"
          >
            <option value="">Select Department</option>
            {departmentsArray.map((dept, i) => (
              <option key={i} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={submitting}
            className={`col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {submitting ? "Adding..." : "Register New Doctor"}
          </button>
        </div>
      </form>
    </div>

  );
};

export default AddNewDoctor;
