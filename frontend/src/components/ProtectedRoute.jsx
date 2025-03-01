import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ requireAuth = false, requireEmployer = false }) {
  const { isAuthenticated, isEmployer, loading } = useAuth();
  const location = useLocation();

  // show a spinner while we check if they're logged in
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // kick them to the login page if they're not logged in
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // don't let jobseekers see employer stuff
  if (requireEmployer && !isEmployer) {
    return <Navigate to="/" replace />;
  }

  // if they passed all the checks, show the page
  return <Outlet />;
} 