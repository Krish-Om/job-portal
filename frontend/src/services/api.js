import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Create authenticated headers
const authHeader = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// API functions
export const getJobs = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/jobs`,
            { headers: authHeader() }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
};

export const getJobById = async (jobId) => {
    try {
        const response = await axios.get(
            `${API_URL}/jobs/${jobId}`,
            { headers: authHeader() }
        );
        return response.data;
    } catch (error) {
        console.error(`Error fetching job with ID ${jobId}:`, error);
        throw error;
    }
};

export const applyForJob = async (jobId, applicationData) => {
    try {
        const response = await axios.post(
            `${API_URL}/jobs/${jobId}/apply`, 
            applicationData,
            { headers: authHeader() }
        );
        return response.data;
    } catch (error) {
        console.error('Error applying for job:', error);
        throw error;
    }
};

export const getUserApplications = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/applications`, 
            { headers: authHeader() }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching user applications:', error);
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
        }
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};