import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/layout.css';
import Footer from './Footer';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
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
                <li><Link to="/applications">My Applications</Link></li>
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