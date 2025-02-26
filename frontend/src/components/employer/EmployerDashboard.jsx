import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../constants';
import '../../styles/dashboard.css';

const EmployerDashboard = () => {
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/employer/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (err) {
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Jobs Posted</h3>
                    <p>{stats.totalJobs}</p>
                </div>
                <div className="stat-card">
                    <h3>Active Jobs</h3>
                    <p>{stats.activeJobs}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Applications</h3>
                    <p>{stats.totalApplications}</p>
                </div>
            </div>
            <div className="action-buttons">
                <Link to="/employer/jobs/create" className="btn btn-primary">
                    Post New Job
                </Link>
                <Link to="/employer/jobs" className="btn btn-secondary">
                    Manage Jobs
                </Link>
            </div>
        </div>
    );
};

export default EmployerDashboard;