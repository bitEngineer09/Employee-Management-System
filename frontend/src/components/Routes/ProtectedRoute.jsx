import React from 'react'
import useUser from '../../hooks/Auth/useUser';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { isAuthenticated } = useUser();
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />
};

export default ProtectedRoute;