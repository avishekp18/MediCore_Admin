import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";

let cachedDoctors = null; // module-level cache

const Doctors = () => {
  const [doctors, setDoctors] = useState(cachedDoctors);
  const { isAuthenticated, loading: authLoading } = useAuth();

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get(
        "https://medicore-backend-sv2c.onrender.com/api/v1/user/doctors",
        { withCredentials: true }
      );
      setDoctors(data.doctors || []);
      cachedDoctors = data.doctors || []; // update cache
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch doctors");
    }
  };

  useEffect(() => {
    // Fetch only if cache is empty
    if (!cachedDoctors) fetchDoctors();

    // Optional: listen to a global event for updates
    const handleUpdate = () => fetchDoctors();
    window.addEventListener("doctorUpdated", handleUpdate);
    return () => window.removeEventListener("doctorUpdated", handleUpdate);
  }, []);

  if (authLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <section className="min-h-screen p-6 bg-gray-50 py-20">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Registered Doctors</h1>

      {doctors && doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
            >
              <img
                src={doctor.docAvatar?.url || "/default-avatar.png"}
                alt="doctor avatar"
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
              />
              <h4 className="text-xl font-semibold text-center mb-2">
                {doctor.firstName} {doctor.lastName}
              </h4>
              <div className="text-gray-700 space-y-1 text-sm">
                <p><span className="font-semibold">Email:</span> {doctor.email}</p>
                <p><span className="font-semibold">Phone:</span> {doctor.phone}</p>
                <p><span className="font-semibold">DOB:</span> {doctor.dob?.substring(0, 10) || "N/A"}</p>
                <p><span className="font-semibold">Department:</span> {doctor.doctorDepartment}</p>
                <p><span className="font-semibold">NIC:</span> {doctor.nic}</p>
                <p><span className="font-semibold">Gender:</span> {doctor.gender}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10 text-lg">No Registered Doctors Found!</p>
      )}
    </section>
  );
};

export default Doctors;
