import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../constants';

const EmployerProfile = () => {
    const [profile, setProfile] = useState({
        companyName: '',
        industry: '',
        about: '',
        location: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/employer/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };

        fetchProfile();
    }, []);

    return (
        <div className="profile-container">
            <h1>Company Profile</h1>
            <div className="profile-card">
                <div className="profile-field">
                    <h3>Company Name</h3>
                    <p>{profile.companyName}</p>
                </div>
                <div className="profile-field">
                    <h3>Industry</h3>
                    <p>{profile.industry}</p>
                </div>
                <div className="profile-field">
                    <h3>Location</h3>
                    <p>{profile.location}</p>
                </div>
                <div className="profile-field">
                    <h3>About</h3>
                    <p>{profile.about}</p>
                </div>
            </div>
        </div>
    );
};

export default EmployerProfile;