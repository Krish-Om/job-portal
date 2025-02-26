import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById, applyForJob } from '../../services/api';
import '../../styles/jobs.css';

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
        contact_number: ''
    });

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { state: { from: `/apply/${jobId}` } });
            return;
        }

        const fetchJobDetails = async () => {
            try {
                const data = await getJobById(jobId);
                setJob(data);
            } catch (err) {
                setError('Failed to load job details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId, navigate]);

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
        setError(null);
        
        try {
            await applyForJob(jobId, formData);
            alert('Application submitted successfully!');
            navigate('/jobs');
        } catch (err) {
            console.error('Application submission error:', err);
            setError('Failed to submit application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading">Loading job details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!job) return <div className="not-found">Job not found</div>;

    return (
        <div className="application-form-container">
            <h2>Apply for: {job.title}</h2>
            <div className="job-info">
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Location:</strong> {job.location}</p>
            </div>

            <form onSubmit={handleSubmit} className="application-form">
                <div className="form-group">
                    <label htmlFor="contact_number">Contact Number</label>
                    <input
                        type="tel"
                        id="contact_number"
                        name="contact_number"
                        value={formData.contact_number}
                        onChange={handleChange}
                        required
                        placeholder="Enter your phone number"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="resume_url">Resume URL</label>
                    <input
                        type="url"
                        id="resume_url"
                        name="resume_url"
                        value={formData.resume_url}
                        onChange={handleChange}
                        required
                        placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                    />
                    <small>Please provide a link to your resume hosted online (Google Drive, Dropbox, etc.)</small>
                </div>

                <div className="form-group">
                    <label htmlFor="cover_letter">Cover Letter</label>
                    <textarea
                        id="cover_letter"
                        name="cover_letter"
                        value={formData.cover_letter}
                        onChange={handleChange}
                        required
                        rows="6"
                        placeholder="Tell us why you're a good fit for this position"
                    ></textarea>
                </div>

                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate(`/jobs/${jobId}`)} 
                        className="cancel-btn"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ApplicationForm;