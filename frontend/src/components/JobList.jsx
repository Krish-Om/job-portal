import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobAPI } from '../services/api';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobAPI.getAll();
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
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Available Jobs</h2>
      {jobs.map(job => (
        <div key={job.id} className="job-card">
          <h3>{job.title}</h3>
          <p>{job.company}</p>
          <p>{job.location}</p>
          <Link to={`/jobs/${job.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
};

export default JobList;