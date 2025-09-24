import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import AdminLogin from "./components/Login.jsx";
import Dashboard from "./components/Dashboard";
import AddNewDoctor from "./components/AddNewDoctor";
import AddNewAdmin from "./components/AddNewAdmin";
import Messages from "./components/Messages";
import Doctors from "./components/Doctors";
import Sidebar from "./components/Sidebar";
import AdminRoute from "./components/AdminRoute";
import { useAuth } from "./AuthContext.jsx";

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <Router>
      {!loading && isAuthenticated && <Sidebar />}
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/doctor/addnew" element={<AdminRoute><AddNewDoctor /></AdminRoute>} />
        <Route path="/admin/addnew" element={<AdminRoute><AddNewAdmin /></AdminRoute>} />
        <Route path="/doctors" element={<AdminRoute><Doctors /></AdminRoute>} />
        <Route path="/messages" element={<AdminRoute><Messages /></AdminRoute>} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ marginTop: "3rem" }} // adds 8 (2rem) top margin
      />
    </Router>
  );
};

export default App;
