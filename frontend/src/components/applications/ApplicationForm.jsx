import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById, applyForJob } from '../../services/api';
import '../../styles/applications.css';

const ApplicationForm = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        cover_letter: '',
        resume_url: '',
        phone_number: ''
    });

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const data = await getJobById(jobId);
                setJob(data);
            } catch (err) {
                setError('Failed to load job details');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await applicationsAPI.apply({
                job_id: jobId,
                ...formData
            });
            navigate('/applications', { 
                state: { message: 'Application submitted successfully!' }
            });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to submit application');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading">Loading job details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!job) return <div className="not-found">Job not found</div>;

    return (
        <div className="application-form-container">
            <h2>Apply for {job.title}</h2>
            <div className="job-summary">
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Location:</strong> {job.location}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="application-form">
                <div className="form-group">
                    <label htmlFor="phone_number">Phone Number</label>
                    <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="resume_url">Resume URL</label>
                    <input
                        type="url"
                        id="resume_url"
                        name="resume_url"
                        placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                        value={formData.resume_url}
                        onChange={handleChange}
                        required
                    />
                    <small>Please provide a link to your resume hosted online</small>
                </div>
                
                <div className="form-group">
                    <label htmlFor="cover_letter">Cover Letter</label>
                    <textarea
                        id="cover_letter"
                        name="cover_letter"
                        rows="6"
                        value={formData.cover_letter}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={submitting}
                >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
            </form>
        </div>
    );
};

export default ApplicationForm;