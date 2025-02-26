import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../constants';
import '../../styles/employer.css';

const ManageJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/employer/jobs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/jobs/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchJobs(); // Refresh the list
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to delete job');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="manage-jobs-container">
            <div className="header-actions">
                <h2>Manage Jobs</h2>
                <Link to="/employer/jobs/create" className="create-button">
                    Post New Job
                </Link>
            </div>

            {jobs.length === 0 ? (
                <div className="no-jobs">
                    <p>You haven't posted any jobs yet.</p>
                    <Link to="/employer/jobs/create">Create your first job posting</Link>
                </div>
            ) : (
                <div className="jobs-list">
                    {jobs.map(job => (
                        <div key={job.id} className="job-card">
                            <div className="job-info">
                                <h3>{job.title}</h3>
                                <p className="company">{job.company}</p>
                                <p className="location">{job.location}</p>
                                <p className="category">{job.category}</p>
                            </div>
                            <div className="job-actions">
                                <Link 
                                    to={`/employer/jobs/${job.id}/applications`} 
                                    className="view-applications"
                                >
                                    View Applications
                                </Link>
                                <button
                                    onClick={() => handleDeleteJob(job.id)}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageJobs;