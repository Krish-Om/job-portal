import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../constants';

const EmployerProfile = () => {
    const [profile, setProfile] = useState({
        company_name: '',
        industry: '',
        website: '',
        location: '',
        about: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/employers/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data);
        } catch (err) {
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="profile-container">
            <h2>Company Profile</h2>
            <div className="profile-section">
                <h3>Company Details</h3>
                <p><strong>Company Name:</strong> {profile.company_name}</p>
                <p><strong>Industry:</strong> {profile.industry}</p>
                <p><strong>Website:</strong> {profile.website}</p>
                <p><strong>Location:</strong> {profile.location}</p>
            </div>
            <div className="profile-section">
                <h3>About</h3>
                <p>{profile.about}</p>
            </div>
        </div>
    );
};

export default EmployerProfile;