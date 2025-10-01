import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";

let cachedDoctors = null; // module-level cache

const Doctors = () => {
  const [doctors, setDoctors] = useState(cachedDoctors);
  const [loadingDoctors, setLoadingDoctors] = useState(!cachedDoctors);
  const { isAuthenticated, loading: authLoading } = useAuth();

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const { data } = await axios.get(
        "https://medicore-backend-sv2c.onrender.com/api/v1/user/doctors",
        { withCredentials: true }
      );
      setDoctors(data.doctors || []);
      cachedDoctors = data.doctors || []; // update cache
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch doctors");
    } finally {
      setLoadingDoctors(false);
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
          {doctors && doctors.length > 0 ? (
            doctors.map((doctor) => (
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
                <h2 className="text-xl font-semibold text-gray-800">{doctor.firstName} {doctor.lastName}</h2>
                <p className="text-indigo-600 font-medium mb-4">{doctor.doctorDepartment}</p>

                {/* Info List */}
                <ul className="text-gray-700 text-sm space-y-1 text-left w-full">
                  <li><span className="font-semibold">Email:</span> {doctor.email}</li>
                  <li><span className="font-semibold">Phone:</span> {doctor.phone}</li>
                  <li><span className="font-semibold">DOB:</span> {doctor.dob?.substring(0, 10) || "N/A"}</li>
                  <li><span className="font-semibold">NIC:</span> {doctor.nic}</li>
                  <li><span className="font-semibold">Gender:</span> {doctor.gender}</li>
                </ul>

                {/* Button */}
                <button
                  onClick={() => navigator.clipboard.writeText(doctor.email)}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
                >
                  Copy Email
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full mt-6">No doctors found.</p>
          )}
        </div>
      ) : (
        <div className="text-center mt-20 text-gray-500">
          <svg
            className="mx-auto mb-4 w-24 h-24 text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A2 2 0 013 15.382V7a2 2 0 011-1.732l6-3a2 2 0 012 0l6 3A2 2 0 0119 7v8.382a2 2 0 01-1.553 1.894L12 20m0 0v-8m0 8l5.447-2.724A2 2 0 0021 15.382V7"
            />
          </svg>
          <p className="text-lg font-medium">No Registered Doctors Found</p>
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
