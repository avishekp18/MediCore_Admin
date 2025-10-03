import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";
import { Mail, Edit2, Trash2, X } from "lucide-react";

let cachedDoctors = null;

const Doctors = () => {
  const [doctors, setDoctors] = useState(cachedDoctors);
  const [loadingDoctors, setLoadingDoctors] = useState(!cachedDoctors);
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [selectedId, setSelectedId] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    doctorDepartment: "",
  });

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const { data } = await axios.get(
        "https://medicore-backend-sv2c.onrender.com/api/v1/user/doctors",
        { withCredentials: true }
      );
      setDoctors(data.doctors || []);
      cachedDoctors = data.doctors || [];
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch doctors");
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://medicore-backend-sv2c.onrender.com/api/v1/user/doctor/${id}`, { withCredentials: true });
      setDoctors((prev) => {
        const updated = prev.filter((doc) => doc._id !== id);
        cachedDoctors = updated; // keep cache in sync
        return updated;
      });

      toast.success("Doctor deleted successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "it's demo purpose can't delete doctor");
    }
  };

  const handleEditClick = (doctor) => {
    setSelectedId(doctor._id);
    setEditForm({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      phone: doctor.phone,
      doctorDepartment: doctor.doctorDepartment,
    });
    setEditModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://medicore-backend-sv2c.onrender.com/api/v1/user/doctor/${selectedId}`, editForm, { withCredentials: true });

      setDoctors((prev) => {
        const updated = prev.map((doc) =>
          doc._id === selectedId ? { ...doc, ...editForm } : doc
        );
        cachedDoctors = updated; // keep cache in sync
        return updated;
      });

      toast.success("Doctor updated successfully");
      setEditModal(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "it's demo purpose can't edit doctor");
    }
  };


  useEffect(() => {
    if (!cachedDoctors) fetchDoctors();

    const handleUpdate = () => fetchDoctors();
    window.addEventListener("doctorUpdated", handleUpdate);
    return () => window.removeEventListener("doctorUpdated", handleUpdate);
  }, []);

  if (authLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <section className="min-h-screen p-6 bg-gray-50 py-20">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Registered Doctors
      </h1>

      {loadingDoctors ? (
        <div className="flex justify-center items-center mt-10">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-16 w-16"></div>
        </div>
      ) : doctors && doctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center transition transform hover:-translate-y-2 hover:shadow-xl duration-300"
            >
              {/* Avatar */}
              <div className="w-28 h-28 mb-4 relative">
                <img
                  src={doctor.docAvatar?.url || "/default-avatar.png"}
                  alt={`${doctor.firstName} ${doctor.lastName}`}
                  className="w-full h-full object-cover rounded-full border-4 border-indigo-300 shadow-md"
                />
                <span className="absolute top-0 right-0 w-5 h-5 rounded-full bg-green-400 border-2 border-white animate-pulse"></span>
              </div>

              {/* Name and Department */}
              <h2 className="text-xl font-semibold text-gray-800">
                {doctor.firstName} {doctor.lastName}
              </h2>
              <p className="text-indigo-600 font-medium mb-4">
                {doctor.doctorDepartment}
              </p>

              {/* Info List */}
              <ul className="text-gray-700 text-sm space-y-1 text-left w-full">
                <li>
                  <span className="font-semibold">Email:</span> {doctor.email}
                </li>
                <li>
                  <span className="font-semibold">Phone:</span> {doctor.phone}
                </li>
                <li>
                  <span className="font-semibold">DOB:</span>{" "}
                  {doctor.dob?.substring(0, 10) || "N/A"}
                </li>
                <li>
                  <span className="font-semibold">NIC:</span> {doctor.nic}
                </li>
                <li>
                  <span className="font-semibold">Gender:</span> {doctor.gender}
                </li>
              </ul>

              {/* Actions */}
              <div className="flex justify-center items-center gap-3 mt-6">
                <button
                  onClick={() => navigator.clipboard.writeText(doctor.email)}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-xl hover:bg-indigo-700 transition"
                >
                  <Mail size={16} /> Copy
                </button>
                <button
                  onClick={() => handleEditClick(doctor)}
                  className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-2 rounded-xl hover:bg-yellow-600 transition"
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(doctor._id)}
                  className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-xl hover:bg-red-700 transition"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No Registered Doctors Found</p>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-96 relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              onClick={() => setEditModal(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Doctor</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input
                type="text"
                name="firstName"
                value={editForm.firstName}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="First Name"
              />

              <input
                type="text"
                name="lastName"
                value={editForm.lastName}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Last Name"
              />

              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Email"
              />

              <input
                type="text"
                name="phone"
                value={editForm.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Phone"
              />

              <input
                type="text"
                name="doctorDepartment"
                value={editForm.doctorDepartment}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Department"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Loader CSS */}
      <style>
        {`
          .loader {
            border-top-color: #6366f1;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </section>
  );
};

export default Doctors;
