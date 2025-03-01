import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ requireAuth = false, requireEmployer = false }) {
  const { isAuthenticated, isEmployer, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // If authentication is required and user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If employer role is required and user is not an employer, redirect to home
  if (requireEmployer && !isEmployer) {
    return <Navigate to="/" replace />;
  }

  // If all conditions are met, render the child routes
  return <Outlet />;
} 