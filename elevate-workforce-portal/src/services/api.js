import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Adjust the base URL as needed

// Fetch job listings
export const fetchJobs = async () => {
    try {
        const response = await axios.get(`${API_URL}/jobs`);
        return response.data;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
};

// Fetch job details by ID
export const fetchJobById = async (jobId) => {
    try {
        const response = await axios.get(`${API_URL}/jobs/${jobId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching job with ID ${jobId}:`, error);
        throw error;
    }
};

// Submit a job application
export const submitApplication = async (applicationData) => {
    try {
        const response = await axios.post(`${API_URL}/applications`, applicationData);
        return response.data;
    } catch (error) {
        console.error('Error submitting application:', error);
        throw error;
    }
};