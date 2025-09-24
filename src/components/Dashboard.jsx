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

  // Load cached data first
  useEffect(() => {
    const cachedAppointments = localStorage.getItem("appointments");
    const cachedDoctors = localStorage.getItem("doctors");

    if (cachedAppointments) {
      setAppointments(JSON.parse(cachedAppointments));
      setLoadingAppointments(false);
    }

    if (cachedDoctors) {
      setDoctors(JSON.parse(cachedDoctors));
      setLoadingDoctors(false);
    }
  }, []);

  // Fetch appointments if admin and cache is empty
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!admin) return;
      if (appointments.length > 0) return; // skip if already cached

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

  // Fetch doctors if cache is empty
  useEffect(() => {
    const fetchDoctors = async () => {
      if (doctors.length > 0) return; // skip if already cached

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
        const updated = prev.map(appt => (appt._id === appointmentId ? { ...appt, status } : appt));
        localStorage.setItem("appointments", JSON.stringify(updated));
        return updated;
      });
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">MediCore...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!admin) return <div className="text-center mt-10 text-red-600">Access denied. Admins only.</div>;

  return (
    <section className="min-h-screen p-6 bg-gray-50 gap-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-xl p-6 flex items-center gap-4">
          <img src="/doc.png" alt="docImg" className="w-16 h-16" />
          <div>
            <p className="text-gray-500">Hello,</p>
            <h5 className="text-xl font-semibold">{admin.firstName} {admin.lastName}</h5>
            <p className="text-gray-400 text-sm">Welcome to the dashboard!</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-500">Total Appointments</p>
          <h3 className="text-2xl font-bold">{appointments.length}</h3>
        </div>
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-500">Registered Doctors</p>
          <h3 className="text-2xl font-bold">{doctors.length}</h3>
        </div>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Appointments</h2>
        {loadingAppointments ? (
          <p className="text-gray-500">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500">No appointments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-2 border-b">Patient</th>
                  <th className="px-4 py-2 border-b">Date</th>
                  <th className="px-4 py-2 border-b">Doctor</th>
                  <th className="px-4 py-2 border-b">Department</th>
                  <th className="px-4 py-2 border-b">Status</th>
                  <th className="px-4 py-2 border-b">Visited</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appt => (
                  <tr key={appt._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{appt.firstName} {appt.lastName}</td>
                    <td className="px-4 py-2 border-b">{new Date(appt.appointment_date).toLocaleString()}</td>
                    <td className="px-4 py-2 border-b">{appt.doctor.firstName} {appt.doctor.lastName}</td>
                    <td className="px-4 py-2 border-b">{appt.department}</td>
                    <td className="px-4 py-2 border-b">
                      <select
                        className={`border rounded p-1 text-sm ${appt.status.toLowerCase()}`}
                        value={appt.status}
                        onChange={e => handleUpdateStatus(appt._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      {appt.hasVisited ? (
                        <GoCheckCircleFill className="text-green-500 inline-block" />
                      ) : (
                        <AiFillCloseCircle className="text-red-500 inline-block" />
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
