import React from 'react'
import useAuth from '../../hooks/Auth/useAuth';
import Auth from '../../pages/Auth';
import { Outlet } from 'react-router-dom';
import { Navigate } from "react-router-dom";

const PublicRoute = () => {
    const { isAuthenticated } = useAuth();
    return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}

export default PublicRoute;