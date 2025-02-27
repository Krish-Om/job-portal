import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/api';
import JobCard from './JobCard';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/jobs.css';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobService.getJobs();
        setJobs(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="jobs-container">
      <h2>Available Jobs</h2>
      <div className="jobs-grid">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobList;