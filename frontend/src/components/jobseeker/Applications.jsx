import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_URL from '../../constants';
import '../../styles/jobseeker.css';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/applications/my-applications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplications(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="applications-container">
            <h2>My Applications</h2>
            {applications.length === 0 ? (
                <div className="no-applications">
                    <p>You haven't applied to any jobs yet.</p>
                    <Link to="/jobs" className="browse-jobs-btn">Browse Jobs</Link>
                </div>
            ) : (
                <div className="applications-list">
                    {applications.map(application => (
                        <div key={application.id} className="application-card">
                            <div className="job-details">
                                <h3>{application.job.title}</h3>
                                <p className="company">{application.job.company}</p>
                                <p className="location">{application.job.location}</p>
                            </div>
                            <div className="application-info">
                                <p className="status">
                                    Status: <span className={`status-${application.status.toLowerCase()}`}>
                                        {application.status}
                                    </span>
                                </p>
                                <p className="date">
                                    Applied: {new Date(application.applied_date).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="application-actions">
                                <Link 
                                    to={`/jobs/${application.job.id}`} 
                                    className="view-job-btn"
                                >
                                    View Job
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Applications;