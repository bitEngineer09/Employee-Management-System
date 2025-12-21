import React from 'react'
import useAuth from '../../hooks/Auth/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />
};

export default ProtectedRoute;