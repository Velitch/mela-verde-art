import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');

    // Se il token non esiste, rimandiamo al login
    if (!token) {
        return <Navigate to="/admin" replace />;
    }

    // Se esiste, mostriamo la pagina richiesta (la Dashboard)
    return children;
};

export default ProtectedRoute;