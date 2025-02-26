import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/layout.css';

const Header = () => {
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
        <header className="header">
            <div className="logo">
                <Link to="/">Job Portal</Link>
            </div>
            <nav className="nav">
                <ul>
                    <li><Link to="/jobs">Browse Jobs</Link></li>
                    {!isLoggedIn ? (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </>
                    ) : isEmployer ? (
                        <>
                            <li><Link to="/employer/dashboard">Dashboard</Link></li>
                            <li><Link to="/employer/jobs/create">Post Job</Link></li>
                            <li><Link to="/employer/jobs">Manage Jobs</Link></li>
                            <li><Link to="/employer/profile">Profile</Link></li>
                            <li>
                                <button onClick={handleLogout} className="logout-btn">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/jobseeker/applications">My Applications</Link></li>
                            <li><Link to="/jobseeker/profile">Profile</Link></li>
                            <li>
                                <button onClick={handleLogout} className="logout-btn">
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;