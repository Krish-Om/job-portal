import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Find Your Dream Job Today</h1>
        <p>Browse thousands of job listings and take the next step in your career journey</p>
        <div className="hero-buttons">
          <Link to="/jobs" className="hero-button primary">Browse Jobs</Link>
          <Link to="/register" className="hero-button secondary">Sign Up</Link>
        </div>
      </div>
      
      <div className="features-section">
        <div className="feature">
          <h3>Thousands of Jobs</h3>
          <p>Access to thousands of opportunities across various industries and locations</p>
        </div>
        <div className="feature">
          <h3>Easy Application</h3>
          <p>Apply with just a few clicks and track your application status</p>
        </div>
        <div className="feature">
          <h3>Career Growth</h3>
          <p>Find positions that match your skills and help you grow professionally</p>
        </div>
      </div>
    </div>
  );
};

export default Home;