import React from 'react'
import useUser from '../../hooks/Auth/useUser';
import Auth from '../../pages/Auth';
import { Outlet } from 'react-router-dom';
import { Navigate } from "react-router-dom";

const PublicRoute = () => {
    const { isAuthenticated } = useUser();
    return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}

export default PublicRoute;