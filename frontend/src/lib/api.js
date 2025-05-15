import axios from 'axios';

// Always use the real API
const useMockApi = false;

// setup axios to talk to our backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: import.meta.env.VITE_API_TIMEOUT || 10000,
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
    return api.post('/applications', applicationData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getJobApplications: (jobId) => {
    return api.get(`/applications/job/${jobId}`);
  },
  updateStatus: (applicationId, status) => {
    return api.put(`/applications/${applicationId}/status`, { status });
  },
};

// Files API
const filesAPI = {
  uploadFile: (file) => {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getFileUrl: (filePath) => {
    // Make sure filePath is properly encoded
    const encodedPath = encodeURIComponent(filePath);
    return api.get(`/files/download/${encodedPath}`);
  }
};

export { authAPI, jobsAPI, applicationsAPI, filesAPI };