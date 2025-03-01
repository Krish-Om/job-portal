import axios from 'axios';
import { mockAuthAPI, mockJobsAPI, mockApplicationsAPI } from './mockApi';

// FIXME: remember to change this before we go live!!!
const useMockApi = false; // Set to false to use the real API

// setup axios to talk to our backend
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000, // hope this is enough time lol
  headers: {
    'Content-Type': 'application/json',
  },
});

// this magic adds the token to every request - so cool!
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error) // no idea what this does but it breaks if I remove it
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
const authAPI = {
  login: (credentials) => {
    if (useMockApi) return mockAuthAPI.login(credentials);
    return api.post('/auth/login', credentials);
  },
  register: (userData) => {
    if (useMockApi) return mockAuthAPI.register(userData);
    return api.post('/auth/register', userData);
  },
  getCurrentUser: () => {
    if (useMockApi) return mockAuthAPI.getCurrentUser();
    return api.get('/auth/me');
  },
  logout: () => {
    if (useMockApi) return mockAuthAPI.logout();
    return api.post('/auth/logout');
  },
};

// Jobs API
const jobsAPI = {
  getAllJobs: () => {
    if (useMockApi) return mockJobsAPI.getAllJobs();
    return api.get('/jobs');
  },
  getJob: (id) => {
    if (useMockApi) return mockJobsAPI.getJob(id);
    return api.get(`/jobs/${id}`);
  },
  createJob: (jobData) => {
    if (useMockApi) return mockJobsAPI.createJob(jobData);
    return api.post('/jobs', jobData);
  },
  updateJob: (id, jobData) => {
    if (useMockApi) return mockJobsAPI.updateJob(id, jobData);
    return api.put(`/jobs/${id}`, jobData);
  },
  deleteJob: (id) => {
    if (useMockApi) return mockJobsAPI.deleteJob(id);
    return api.delete(`/jobs/${id}`);
  },
};

// Applications API
const applicationsAPI = {
  getUserApplications: () => {
    if (useMockApi) return mockApplicationsAPI.getUserApplications();
    return api.get('/applications');
  },
  getApplication: (id) => {
    if (useMockApi) return mockApplicationsAPI.getApplication(id);
    return api.get(`/applications/${id}`);
  },
  submitApplication: (applicationData) => {
    if (useMockApi) return mockApplicationsAPI.submitApplication(applicationData);
    return api.post('/applications', applicationData);
  },
  getJobApplications: (jobId) => {
    if (useMockApi) return mockApplicationsAPI.getJobApplications(jobId);
    return api.get(`/applications/job/${jobId}`);
  },
};

export { api, authAPI, jobsAPI, applicationsAPI }; 