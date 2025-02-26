import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const location = useLocation();

    if (!token) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRole && userRole !== allowedRole) {
        // Redirect to home if role doesn't match
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;