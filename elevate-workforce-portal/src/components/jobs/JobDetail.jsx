import React from 'react';

const JobDetail = ({ job }) => {
    if (!job) {
        return <div>Loading...</div>;
    }

    return (
        <div className="job-detail">
            <h2>{job.title}</h2>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Posted on:</strong> {new Date(job.posted_date).toLocaleDateString()}</p>
        </div>
    );
};

export default JobDetail;