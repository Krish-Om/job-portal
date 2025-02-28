import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Job Portal</Link>
      </div>
      <div className="nav-links">
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            {userRole === 'EMPLOYER' && (
              <>
                <Link to="/employer/dashboard">Dashboard</Link>
                <Link to="/employer/jobs/create">Post Job</Link>
              </>
            )}
            {userRole === 'JOBSEEKER' && (
              <Link to="/jobseeker/applications">My Applications</Link>
            )}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;