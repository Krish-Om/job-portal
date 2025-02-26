import React from 'react';
import '../../styles/layout.css';

const Footer = () => {
  return (
      <div className="footer">
        <p>&copy; {new Date().getFullYear()} Elevate Workforce Solutions. All rights reserved.</p>
      </div>
  );
};

export default Footer;
