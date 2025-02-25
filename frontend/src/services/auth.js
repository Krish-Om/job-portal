import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Replace with your actual API URL

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const register = async (username, password, email) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { username, password, email });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};