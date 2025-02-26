import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getJobs } from '../../services/api';
import '../../styles/jobs.css';

const JobList = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [authRequired, setAuthRequired] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getJobs();
                setJobs(data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setAuthRequired(true);
                } else {
                    setError('Failed to fetch jobs. Please try again later.');
                    console.error('Error fetching jobs:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const handleLoginClick = () => {
        navigate('/login', { state: { from: '/jobs' } });
    };

    if (loading) return <div className="loading">Loading jobs...</div>;
    
    if (authRequired) {
        return (
            <div className="auth-required-container">
                <h2>Authentication Required</h2>
                <p>You need to be logged in to view job listings.</p>
                <div className="auth-buttons">
                    <button onClick={handleLoginClick} className="auth-button">Login</button>
                    <Link to="/register" className="auth-button secondary">Register</Link>
                </div>
            </div>
        );
    }
    
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="job-list-container">
            <h2>Available Job Positions</h2>
            {jobs.length === 0 ? (
                <div className="no-jobs">
                    <p>No jobs available at the moment.</p>
                </div>
            ) : (
                <div className="job-grid">
                    {jobs.map(job => (
                        <div key={job.id} className="job-card">
                            <div className="job-card-header">
                                <h3>{job.title}</h3>
                                <span className="company">{job.company}</span>
                            </div>
                            <div className="job-card-body">
                                <p className="location">📍 {job.location}</p>
                                <p className="description">{job.description.substring(0, 100)}...</p>
                            </div>
                            <div className="job-card-footer">
                                <Link to={`/jobs/${job.id}`} className="view-job-btn">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobList;