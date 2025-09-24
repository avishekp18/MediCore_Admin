import React from "react";
import { useAuth } from "../AuthContext.jsx";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div className="flex items-center justify-center h-screen">MediCore...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return children;
};

export default AdminRoute;
