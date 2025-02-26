import React, { useEffect, useState } from 'react';
import { fetchApplications } from '../../services/api';

const ApplicationList = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getApplications = async () => {
            try {
                const data = await fetchApplications();
                setApplications(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getApplications();
    }, []);

    if (loading) return <div>Loading applications...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Your Job Applications</h2>
            <ul>
                {applications.map(application => (
                    <li key={application.id}>
                        <h3>{application.job.title}</h3>
                        <p>Status: {application.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ApplicationList;