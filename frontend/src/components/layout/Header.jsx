import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/layout.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        setIsLoggedIn(!!token);
        setUserRole(role);
    }, [location]); // Re-check when location changes

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setUserRole(null);
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <Link to="/">Job Portal</Link>
                </div>
                <nav className="nav">
                    <ul>
                        <li><Link to="/jobs">Browse Jobs</Link></li>
                        {!isLoggedIn ? (
                            <>
                                <li><Link to="/login" className="nav-button">Login</Link></li>
                                <li><Link to="/register" className="nav-button">Register</Link></li>
                            </>
                        ) : userRole === 'EMPLOYER' ? (
                            <>
                                <li><Link to="/employer/dashboard">Dashboard</Link></li>
                                <li><Link to="/employer/jobs/create" className="create-job-btn">Post Job</Link></li>
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
            </div>
        </header>
    );
};

export default Header;