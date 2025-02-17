// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ conditionA , redirectTo = '/login', children }) => {
  // If either condition is true, do not allow access.
  if (conditionA) {
    return <Navigate to={redirectTo} replace />;
  }
  // Otherwise, render the protected content.
  return children;
};

export default ProtectedRoute;
