import axios from 'axios';
import { mockAuthAPI, mockJobsAPI, mockApplicationsAPI } from './mockApi';

// Determine if we should use mock API
const useMockApi = false; // Set to false to use the real API

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = useMockApi
  ? mockAuthAPI
  : {
      register: (userData) => api.post('/auth/register', userData),
      login: (credentials) => {
        // Convert to form data for OAuth2 password flow
        const formData = new URLSearchParams();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);
        
        return api.post('/auth/login', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
      },
      logout: () => api.post('/auth/logout'),
      getCurrentUser: () => api.get('/auth/me'),
    };

// Jobs API
export const jobsAPI = useMockApi
  ? mockJobsAPI
  : {
      getAllJobs: () => api.get('/jobs'),
      getJobById: (id) => api.get(`/jobs/${id}`),
      createJob: (jobData) => api.post('/jobs', jobData),
      updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
      deleteJob: (id) => api.delete(`/jobs/${id}`),
    };

// Applications API
export const applicationsAPI = useMockApi
  ? mockApplicationsAPI
  : {
      getUserApplications: () => api.get('/applications'),
      getJobApplications: (jobId) => api.get(`/jobs/${jobId}/applications`),
      applyForJob: (jobId, applicationData) => api.post(`/jobs/${jobId}/apply`, applicationData),
      updateApplicationStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
    };

export default api; 