import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const login = async (credentials) => {
  const { data } = await axios.post(`${API_URL}/auth/login`, credentials);
  localStorage.setItem('token', data.access_token);
  return data;
};

export const register = async (userData) => {
  const { data } = await axios.post(`${API_URL}/auth/register`, userData);
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
};