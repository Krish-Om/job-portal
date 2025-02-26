import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/layout.css';

const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <h1>Elevate Workforce Portal</h1>
            </div>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/jobs">Jobs</Link></li>
                    <li><Link to="/applications">Applications</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;