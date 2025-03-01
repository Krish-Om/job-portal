import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated, isEmployer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              JobPortal
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/jobs" className="text-gray-700 hover:text-blue-600">
              Jobs
            </Link>
            
            {isAuthenticated ? (
              <>
                {isEmployer && (
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                )}
                {!isEmployer && (
                  <Link to="/applications" className="text-gray-700 hover:text-blue-600">
                    My Applications
                  </Link>
                )}
                <div className="text-gray-700">
                  Welcome, {user?.username}
                </div>
                <button 
                  onClick={handleLogout}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1 rounded-md text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1 rounded-md text-sm">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-md text-sm">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 