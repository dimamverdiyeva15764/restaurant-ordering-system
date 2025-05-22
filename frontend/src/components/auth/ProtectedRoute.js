import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, hasRole } = useAuth();

    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute; 