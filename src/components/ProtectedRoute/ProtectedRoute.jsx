import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, accessToken } = useSelector((state) => state.user);

  // Check if user is authenticated
  if (!isAuthenticated || !accessToken) {
    // Redirect to login page if not authenticated
    return <Navigate to="/" replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute;
