import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { useAuth } from "../AuthContext.jsx";

const Dashboard = () => {
  const { admin, isAuthenticated, loading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    const cachedAppointments = localStorage.getItem("appointments");
    const cachedDoctors = localStorage.getItem("doctors");

    if (cachedAppointments) setAppointments(JSON.parse(cachedAppointments));
    if (cachedDoctors) setDoctors(JSON.parse(cachedDoctors));

    setLoadingAppointments(false);
    setLoadingDoctors(false);
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!admin || appointments.length > 0) return;
      try {
        const { data } = await axios.get(
          "https://medicore-backend-sv2c.onrender.com/api/v1/appointment/",
          { withCredentials: true }
        );
        setAppointments(data.appointments || []);
        localStorage.setItem("appointments", JSON.stringify(data.appointments || []));
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch appointments");
      } finally {
        setLoadingAppointments(false);
      }
    };
    fetchAppointments();
  }, [admin, appointments.length]);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (doctors.length > 0) return;
      try {
        const { data } = await axios.get(
          "https://medicore-backend-sv2c.onrender.com/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors || []);
        localStorage.setItem("doctors", JSON.stringify(data.doctors || []));
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch doctors");
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, [doctors.length]);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `https://medicore-backend-sv2c.onrender.com/api/v1/appointment/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments(prev => {
        const updated = prev.map(a => (a._id === appointmentId ? { ...a, status } : a));
        localStorage.setItem("appointments", JSON.stringify(updated));
        return updated;
      });
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!admin) return <div className="text-center mt-10 text-red-600 font-semibold">Access denied. Admins only.</div>;

  return (
    <section className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-12 space-y-8">

      {/* Welcome & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Admin Card */}
        <div className="bg-gradient-to-r from-blue-50 to-white shadow-lg rounded-2xl p-6 flex items-center gap-4 hover:scale-105 transition-transform duration-300">
          <img src="/doc.png" alt="Admin" className="w-16 h-16 rounded-full object-cover border-2 border-blue-200" />
          <div>
            <p className="text-gray-500 text-sm">Hello,</p>
            <h5 className="text-xl font-semibold text-gray-800">
              {admin.firstName && admin.lastName
                ? `${admin.firstName} ${admin.lastName}`
                : admin.name || "Admin"}
            </h5>
            <p className="text-gray-400 text-sm">Welcome to MediCore Dashboard!</p>
          </div>
        </div>

        {/* Total Appointments */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300">
          <p className="text-gray-500 font-medium">Total Appointments</p>
          <h3 className="text-3xl font-bold text-blue-600 mt-2">{appointments.length}</h3>
        </div>

        {/* Total Doctors */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300">
          <p className="text-gray-500 font-medium">Registered Doctors</p>
          <h3 className="text-3xl font-bold text-green-600 mt-2">{doctors.length}</h3>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Appointments</h2>

        {loadingAppointments ? (
          <p className="text-gray-500">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500">No appointments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm divide-y divide-gray-100">
              <thead className="bg-blue-50 text-gray-700 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Before Visited</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 text-center">
                {appointments.map(appt => (
                  <tr key={appt._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">{appt.firstName} {appt.lastName}</td>
                    <td className="px-4 py-3">{new Date(appt.appointment_date).toLocaleString()}</td>
                    <td className="px-4 py-3">{appt.doctor.firstName} {appt.doctor.lastName}</td>
                    <td className="px-4 py-3">{appt.department}</td>
                    <td className="px-4 py-3">
                      <select
                        className="border rounded-lg px-2 py-1 text-sm focus:ring-1 focus:ring-blue-400"
                        value={appt.status}
                        onChange={e => handleUpdateStatus(appt._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {appt.hasVisited ? (
                        <GoCheckCircleFill className="text-green-500 mx-auto" />
                      ) : (
                        <AiFillCloseCircle className="text-blue-500 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
