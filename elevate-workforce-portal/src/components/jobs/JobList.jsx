import React, { useEffect, useState } from 'react';
import { fetchJobs } from '../../services/api';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getJobs = async () => {
            try {
                const jobData = await fetchJobs();
                setJobs(jobData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getJobs();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Job Listings</h2>
            <ul>
                {jobs.map(job => (
                    <li key={job.id}>
                        <h3>{job.title}</h3>
                        <p>{job.description}</p>
                        <p>Location: {job.location}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JobList;