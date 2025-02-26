import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/layout.css';
import Footer from './Footer';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const isEmployer = userRole === 'EMPLOYER';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="logo">
          <Link to="/">Job Portal</Link>
        </div>
        <nav className="nav">
          <ul>
            <li><Link to="/jobs">Jobs</Link></li>
            {!isLoggedIn ? (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            ) : (
              <>
                {isEmployer ? (
                  <>
                    <li><Link to="/jobs/create" className="create-job-btn">Create Job</Link></li>
                    <li><Link to="/my-jobs">My Jobs</Link></li>
                  </>
                ) : (
                  <li><Link to="/applications">My Applications</Link></li>
                )}
                <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;