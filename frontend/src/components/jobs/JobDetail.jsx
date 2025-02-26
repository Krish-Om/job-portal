import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById } from '../../services/api';
import '../../styles/jobs.css';

const JobDetail = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const data = await getJobById(jobId);
                setJob(data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    navigate('/login', { state: { from: `/jobs/${jobId}` } });
                } else {
                    setError('Failed to load job details');
                    console.error('Error fetching job:', err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [jobId, navigate]);

    const handleApply = () => {
        navigate(`/apply/${jobId}`);
    };

    if (loading) return <div className="loading">Loading job details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!job) return <div className="not-found">Job not found</div>;

    return (
        <div className="job-detail-container">
            <div className="job-detail-header">
                <h1>{job.title}</h1>
                <div className="job-meta">
                    <span className="company">{job.company}</span>
                    <span className="location">📍 {job.location}</span>
                    {job.salary && <span className="salary">💰 ${job.salary}</span>}
                </div>
            </div>

            <div className="job-detail-body">
                <div className="section">
                    <h3>Description</h3>
                    <p>{job.description}</p>
                </div>
                
                {job.requirements && (
                    <div className="section">
                        <h3>Requirements</h3>
                        <p>{job.requirements}</p>
                    </div>
                )}
                
                {job.benefits && (
                    <div className="section">
                        <h3>Benefits</h3>
                        <p>{job.benefits}</p>
                    </div>
                )}
            </div>

            <div className="job-detail-footer">
                <button 
                    onClick={handleApply} 
                    className="apply-button"
                >
                    Apply Now
                </button>
            </div>

            <div className="job-actions">
                <button 
                    onClick={() => navigate(`/apply/${job.id}`)}
                    className="apply-btn"
                >
                    Apply for this Job
                </button>
                <button 
                    onClick={() => navigate('/jobs')}
                    className="back-btn"
                >
                    Back to Jobs
                </button>
            </div>
        </div>
    );
};

export default JobDetail;