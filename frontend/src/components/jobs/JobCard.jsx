import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const JobCard = ({ job }) => {
  const { user } = useAuth();
  const isJobSeeker = user?.role === 'JOBSEEKER';

  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <div className="job-details">
        <p><strong>Company:</strong> {job.company}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Category:</strong> {job.category}</p>
        <p className="job-description">{job.description.substring(0, 150)}...</p>
      </div>
      <div className="job-actions">
        {isJobSeeker ? (
          <Link 
            to={`/jobs/${job.id}/apply`} 
            className="btn btn-primary"
          >
            Apply Now
          </Link>
        ) : (
          <Link 
            to={`/jobs/${job.id}`} 
            className="btn btn-secondary"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default JobCard;