// frontend/src/components/RoleProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const protectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // Show a loader while the authentication state is being resolved
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user's role is not in the allowedRoles list, redirect to home (or a 403 page)
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If authorized, render the child routes
  return <Outlet />;
};

export default protectedRoute;