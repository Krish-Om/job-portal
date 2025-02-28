import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI } from '../services/api';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await jobAPI.getOne(id);
        setJob(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div className="job-detail">
      <h2>{job.title}</h2>
      <div className="job-info">
        <p><strong>Company:</strong> {job.company}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Category:</strong> {job.category}</p>
        <p><strong>Description:</strong></p>
        <p>{job.description}</p>
      </div>
      <div className="actions">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">Back</button>
        <button onClick={() => navigate(`/jobs/${id}/apply`)} className="btn btn-primary">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobDetail;