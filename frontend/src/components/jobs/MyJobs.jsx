import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../constants';

const MyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/jobs/my-jobs`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setJobs(response.data);
            } catch (err) {
                setError(err.response?.data?.detail || 'Failed to fetch jobs');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="my-jobs-container">
            <h2>My Job Listings</h2>
            <Link to="/jobs/create" className="create-job-btn">Create New Job</Link>
            <div className="jobs-list">
                {jobs.map(job => (
                    <div key={job.id} className="job-card">
                        <h3>{job.title}</h3>
                        <p>{job.company}</p>
                        <p>{job.location}</p>
                        <p>{job.category}</p>
                        <div className="job-actions">
                            <Link to={`/jobs/${job.id}`}>View Details</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyJobs;