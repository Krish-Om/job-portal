import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Simplified API service
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me')
};

export const jobAPI = {
  getAll: () => api.get('/jobs'),
  getOne: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  apply: (jobId, data) => api.post(`/jobs/${jobId}/applications`, data)
};

export default api;