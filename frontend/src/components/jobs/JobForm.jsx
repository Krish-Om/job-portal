import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../../services/api'; // Adjust the import based on your API service structure
import './jobs.css'; // Import specific styles for the job form

const JobForm = ({ job }) => {
  const [title, setTitle] = useState(job ? job.title : '');
  const [description, setDescription] = useState(job ? job.description : '');
  const [location, setLocation] = useState(job ? job.location : '');
  const [category, setCategory] = useState(job ? job.category : '');
  const [company, setCompany] = useState(job ? job.company : '');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (job) {
        // Update existing job
        await createJob({ id: job.id, title, description, location, category, company });
      } else {
        // Create new job
        await createJob({ title, description, location, category, company });
      }
      navigate('/jobs'); // Redirect to job list after submission
    } catch (err) {
      setError('Failed to save job. Please try again.');
    }
  };

  return (
    <div className="job-form-container">
      <h2>{job ? 'Edit Job' : 'Create Job'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Company:</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>
        <button type="submit">{job ? 'Update Job' : 'Create Job'}</button>
      </form>
    </div>
  );
};

export default JobForm;