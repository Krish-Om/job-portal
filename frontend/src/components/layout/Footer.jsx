import React from 'react';
import './Footer.css'; // Assuming you have a CSS file for footer styles

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} Elevate Workforce Solutions. All rights reserved.</p>
                <ul className="footer-links">
                    <li><a href="/privacy">Privacy Policy</a></li>
                    <li><a href="/terms">Terms of Service</a></li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;