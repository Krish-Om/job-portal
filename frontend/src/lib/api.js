import axios from 'axios';

// Always use the real API
const useMockApi = false;

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
    // For login, we need to use form-urlencoded format instead of JSON
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    return api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },
  register: (userData) => {
    return api.post('/auth/register', userData);
  },
  getCurrentUser: () => {
    return api.get('/auth/me');
  },
  logout: () => {
    return api.post('/auth/logout');
  },
};

// Jobs API
const jobsAPI = {
  getAllJobs: () => {
    return api.get('/jobs');
  },
  getJob: (id) => {
    return api.get(`/jobs/${id}`);
  },
  createJob: (jobData) => {
    return api.post('/jobs', jobData);
  },
  updateJob: (id, jobData) => {
    return api.put(`/jobs/${id}`, jobData);
  },
  deleteJob: (id) => {
    return api.delete(`/jobs/${id}`);
  },
  searchJobs: (params = {}) => {
    // Build query parameters from the params object
    const queryParams = new URLSearchParams();
    
    // Add search parameters if they exist
    if (params.query) queryParams.append('query', params.query);
    if (params.location) queryParams.append('location', params.location);
    if (params.category) queryParams.append('category', params.category);
    
    // Add pagination parameters if provided
    if (params.skip) queryParams.append('skip', params.skip);
    if (params.limit) queryParams.append('limit', params.limit);
    
    // Make the request with query parameters
    return api.get(`/jobs/search/?${queryParams.toString()}`);
  },
};

// Applications API
const applicationsAPI = {
  getUserApplications: () => {
    return api.get('/applications');
  },
  getApplication: (id) => {
    return api.get(`/applications/${id}`);
  },
  submitApplication: (applicationData) => {
    return api.post('/applications', applicationData);
  },
  getJobApplications: (jobId) => {
    return api.get(`/applications/job/${jobId}`);
  },
};

export { api, authAPI, jobsAPI, applicationsAPI }; 