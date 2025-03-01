/**
 * Mock API service for development and fallback when backend is unavailable
 * This provides sample data that mimics the real API responses
 */

// Helper to simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock users data
const users = [
  {
    id: 1,
    username: 'jobseeker',
    email: 'jobseeker@example.com',
    role: 'jobseeker',
    is_active: true,
  },
  {
    id: 2,
    username: 'employer',
    email: 'employer@example.com',
    role: 'employer',
    is_active: true,
  },
];

// Mock jobs data
const jobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    description: 'We are looking for a skilled Frontend Developer with experience in React and Tailwind CSS.',
    location: 'Remote',
    category: 'Development',
    company: 'TechCorp',
    employer_id: 2,
    posted_date: '2023-06-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'Backend Engineer',
    description: 'Experienced Backend Engineer needed for a growing startup.',
    location: 'New York, NY',
    category: 'Development',
    company: 'DataSystems Inc',
    employer_id: 2,
    posted_date: '2023-06-10T09:30:00Z',
  },
];

// Mock applications data
const applications = [
  {
    id: 1,
    user_id: 1,
    job_id: 1,
    resume_path: 'https://example.com/resume1.pdf',
    cover_letter: 'I am excited to apply for this position and believe my skills in React and Tailwind CSS make me a strong candidate.',
    applied_date: '2023-06-16T11:30:00Z',
    status: 'pending',
    job_title: 'Frontend Developer'
  },
  {
    id: 2,
    user_id: 1,
    job_id: 2,
    resume_path: 'https://example.com/resume1.pdf',
    cover_letter: 'With my experience in Node.js and database design, I am confident I can contribute to your backend team.',
    applied_date: '2023-06-12T15:45:00Z',
    status: 'accepted',
    job_title: 'Backend Engineer'
  },
];

// Mock Auth API
export const mockAuthAPI = {
  register: async (userData) => {
    await delay();
    const newUser = {
      id: users.length + 1,
      ...userData,
      is_active: true,
    };
    users.push(newUser);
    return { data: newUser };
  },
  
  login: async (credentials) => {
    await delay();
    const user = users.find(u => u.username === credentials.username);
    if (!user || credentials.password !== 'password') {
      throw { response: { data: { detail: 'Invalid credentials' } } };
    }
    return { data: { access_token: 'mock-token-' + user.id } };
  },
  
  logout: async () => {
    await delay();
    return { data: { msg: 'Successfully logged out' } };
  },
  
  getCurrentUser: async () => {
    await delay();
    // In a real app, this would use the token to identify the user
    // For mock purposes, we'll just return the first user
    return { data: users[0] };
  },
};

// Mock Jobs API
export const mockJobsAPI = {
  getAllJobs: async () => {
    await delay();
    return { data: jobs };
  },
  
  getJobById: async (id) => {
    await delay();
    const job = jobs.find(j => j.id === parseInt(id));
    if (!job) {
      throw { response: { status: 404, data: { detail: 'Job not found' } } };
    }
    return { data: job };
  },
  
  createJob: async (jobData) => {
    await delay();
    const newJob = {
      id: jobs.length + 1,
      ...jobData,
      posted_date: new Date().toISOString(),
    };
    jobs.push(newJob);
    return { data: newJob };
  },
  
  updateJob: async (id, jobData) => {
    await delay();
    const index = jobs.findIndex(j => j.id === parseInt(id));
    if (index === -1) {
      throw { response: { status: 404, data: { detail: 'Job not found' } } };
    }
    jobs[index] = { ...jobs[index], ...jobData };
    return { data: jobs[index] };
  },
  
  deleteJob: async (id) => {
    await delay();
    const index = jobs.findIndex(j => j.id === parseInt(id));
    if (index === -1) {
      throw { response: { status: 404, data: { detail: 'Job not found' } } };
    }
    const deletedJob = jobs.splice(index, 1)[0];
    return { data: deletedJob };
  },
};

// Mock Applications API
export const mockApplicationsAPI = {
  getUserApplications: async () => {
    await delay();
    return { data: applications };
  },
  
  getJobApplications: async (jobId) => {
    await delay();
    const jobApplications = applications.filter(a => a.job_id === parseInt(jobId));
    return { data: jobApplications };
  },
  
  applyForJob: async (jobId, applicationData) => {
    await delay();
    const newApplication = {
      id: applications.length + 1,
      job_id: parseInt(jobId),
      user_id: 1, // Mock user ID
      applied_date: new Date().toISOString(),
      status: 'pending',
      ...applicationData,
    };
    applications.push(newApplication);
    return { data: newApplication };
  },
  
  updateApplicationStatus: async (id, status) => {
    await delay();
    const index = applications.findIndex(a => a.id === parseInt(id));
    if (index === -1) {
      throw { response: { status: 404, data: { detail: 'Application not found' } } };
    }
    applications[index].status = status;
    return { data: applications[index] };
  },
};

export default {
  auth: mockAuthAPI,
  jobs: mockJobsAPI,
  applications: mockApplicationsAPI
}; 