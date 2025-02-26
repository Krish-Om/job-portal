import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../constants';

const JobSeekerProfile = () => {
    const [profile, setProfile] = useState({
        full_name: '',
        skills: [],
        experience: '',
        education: '',
        resume_url: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/jobseekers/profile`, {
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
            <h2>Profile</h2>
            <div className="profile-section">
                <h3>Personal Information</h3>
                <p><strong>Name:</strong> {profile.full_name}</p>
            </div>
            <div className="profile-section">
                <h3>Skills</h3>
                <div className="skills-list">
                    {profile.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                    ))}
                </div>
            </div>
            <div className="profile-section">
                <h3>Experience</h3>
                <p>{profile.experience}</p>
            </div>
            <div className="profile-section">
                <h3>Education</h3>
                <p>{profile.education}</p>
            </div>
            {profile.resume_url && (
                <div className="profile-section">
                    <h3>Resume</h3>
                    <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
                        View Resume
                    </a>
                </div>
            )}
        </div>
    );
};

export default JobSeekerProfile;