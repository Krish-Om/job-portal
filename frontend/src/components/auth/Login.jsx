import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/auth.css';
import API_URL from '../../constants';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const [formData, setFormData] = useState({
        username: '',  // Changed from email to username
        password: ''
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Display message if redirected from another page (like registration)
        if (location.state?.message) {
            setMessage(location.state.message);
        }
    }, [location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLoginSuccess = (data) => {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userRole', data.role);
        
        // Redirect based on role
        if (data.role === 'EMPLOYER') {
            navigate('/employer/dashboard');
        } else {
            navigate('/jobseeker/profile');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // The OAuth2 password flow expects form data, not JSON
            const formDataObj = new FormData();
            formDataObj.append('username', formData.username);
            formDataObj.append('password', formData.password);
            
            const response = await axios.post(
                `${API_URL}/auth/login`, 
                formDataObj,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            
            // Store token in localStorage
            handleLoginSuccess(response.data);
            
            // Redirect to jobs page or the page they were trying to access
            const redirectTo = location.state?.from || '/jobs';
            navigate(redirectTo);
        } catch (err) {
            console.error('Login error:', err.response?.data);
            setError(
                err.response?.data?.detail || 
                'Login failed. Please check your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    className="auth-button"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;