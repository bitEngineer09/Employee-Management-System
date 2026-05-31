import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/Auth/useAuth";

//   FaceGuard
//   Wraps employee-only routes.
//   If the logged-in employee has no faceDescriptor, redirect to /register-face.
//   Admins bypass this guard since they don't need face registration.

const FaceGuard = () => {
    const { currentUser, isLoading } = useAuth();

    // Wait until auth resolves
    if (isLoading) return null;

    const role = currentUser?.user?.role;
    const hasFace = !!currentUser?.user?.faceDescriptor;

    // Only enforce for employees
    if (role === "EMPLOYEE" && !hasFace) {
        return <Navigate to="/register-face" replace />;
    }

    return <Outlet />;
};

export default FaceGuard;
