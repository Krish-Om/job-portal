import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/layout.css';

const Header = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const getNavLinks = () => {
        if (!isLoggedIn) {
            return (
                <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                </>
            );
        }

        if (userRole === 'EMPLOYER') {
            return (
                <>
                    <li><Link to="/employer/dashboard">Dashboard</Link></li>
                    <li><Link to="/employer/jobs/create">Post Job</Link></li>
                    <li><Link to="/employer/jobs">Manage Jobs</Link></li>
                    <li><Link to="/employer/profile">Profile</Link></li>
                </>
            );
        }

        return (
            <>
                <li><Link to="/jobseeker/applications">My Applications</Link></li>
                <li><Link to="/jobseeker/profile">Profile</Link></li>
            </>
        );
    };

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">Job Portal</Link>
            </div>
            <nav>
                <ul>
                    <li><Link to="/jobs">Browse Jobs</Link></li>
                    {getNavLinks()}
                    {isLoggedIn && (
                        <li>
                            <button onClick={handleLogout} className="logout-btn">
                                Logout
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;