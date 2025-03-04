/**
 * Mock API service for development and testing
 * Structured to match backend models in user.py, job.py, and application.py
 */

// Helper to simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock users data - matches User model
const users = [
  {
    id: 1,
    username: 'johndoe',
    email: 'john.doe@example.com',
    role: 'jobseeker',
    is_active: true,
    hashed_password: 'hashed_password_would_be_here' // In real DB this would be properly hashed
  },
  {
    id: 2,
    username: 'techcorp_recruiter',
    email: 'recruiter@techcorp.com',
    role: 'employer',
    is_active: true,
    hashed_password: 'hashed_password_would_be_here'
  },
  {
    id: 3,
    username: 'sarahsmith',
    email: 'sarah.smith@gmail.com',
    role: 'jobseeker',
    is_active: true,
    hashed_password: 'hashed_password_would_be_here'
  },
  {
    id: 4,
    username: 'startupceo',
    email: 'ceo@startup.io',
    role: 'employer',
    is_active: true,
    hashed_password: 'hashed_password_would_be_here'
  },
  {
    id: 5,
    username: 'inactive_user',
    email: 'deactivated@example.com',
    role: 'jobseeker',
    is_active: false, // Testing inactive user
    hashed_password: 'hashed_password_would_be_here'
  },
  {
    id: 6,
    username: 'enterprise_hr',
    email: 'hr@enterprise.com',
    role: 'employer',
    is_active: true,
    hashed_password: 'hashed_password_would_be_here'
  },
  {
    id: 7,
    username: 'developer_mike',
    email: 'mike.dev@techjobs.net',
    role: 'jobseeker',
    is_active: true,
    hashed_password: 'hashed_password_would_be_here'
  },
  {
    id: 8, 
    username: 'data_scientist',
    email: 'data.pro@analytics.org',
    role: 'jobseeker',
    is_active: true,
    hashed_password: 'hashed_password_would_be_here'
  },
  {
    id: 9,
    username: 'designer_emma',
    email: 'emma.designs@creative.co',
    role: 'jobseeker',
    is_active: true,
    hashed_password: 'hashed_password_would_be_here'
  },
  {
    id: 10,
    username: 'special_characters!@#$',
    email: 'special.case@example.com',
    role: 'jobseeker',
    is_active: true,
    hashed_password: 'hashed_password_would_be_here'
  },
  {
    id: 11,
    username: 'extremely_long_username_that_might_break_ui_layouts_in_some_places_especially_on_mobile_devices_or_tables',
    email: 'long@example.com',
    role: 'jobseeker',
    is_active: true, 
    hashed_password: 'hashed_password_would_be_here'
  },
  {
    id: 12,
    username: '<script>alert("xss")</script>',
    email: 'security.test@example.com',
    role: 'jobseeker',
    is_active: true,
    hashed_password: 'hashed_password_would_be_here'
  },
  {
    id: 13,
    username: 'tech_company_hr',
    email: 'hr@techgiant.com',
    role: 'employer',
    is_active: true,
    hashed_password: 'hashed_password_would_be_here'
  },
  {
    id: 14,
    username: 'agency_recruiter',
    email: 'recruiter@staffing.biz',
    role: 'employer',
    is_active: true,
    hashed_password: 'hashed_password_would_be_here'
  },
  {
    id: 15,
    username: 'duplicate_email', 
    email: 'duplicate@example.com', // Test case for duplicate email
    role: 'jobseeker',
    is_active: true,
    hashed_password: 'hashed_password_would_be_here'
  },
  {
    id: 16,
    username: 'another_duplicate',
    email: 'duplicate@example.com', // Duplicate email to test constraints
    role: 'employer',
    is_active: true,
    hashed_password: 'hashed_password_would_be_here'
  }
];

// Mock jobs data - matches Job model
const jobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    description: 'We are seeking an experienced Frontend Developer with expertise in React and modern JavaScript frameworks.',
    requirements: 'Minimum 5 years experience with React, proficiency in TypeScript, experience with state management libraries.',
    location: 'San Francisco, CA',
    category: 'Development',
    company: 'TechCorp',
    employer_id: 2,
    posted_date: '2023-07-15T10:00:00Z',
    created_at: '2023-07-15T10:00:00Z',
    updated_at: '2023-07-15T10:00:00Z',
    is_active: true
  },
  {
    id: 2,
    title: 'Backend Engineer',
    description: 'Join our engineering team to build scalable backend services using Python and FastAPI.',
    requirements: 'Strong knowledge of Python, experience with REST APIs, familiarity with SQL databases.',
    location: 'Remote',
    category: 'Engineering',
    company: 'TechCorp',
    employer_id: 2,
    posted_date: '2023-07-10T09:30:00Z',
    created_at: '2023-07-10T09:30:00Z',
    updated_at: '2023-07-10T09:30:00Z',
    is_active: true
  },
  {
    id: 3,
    title: 'Data Scientist',
    description: 'Looking for a Data Scientist to join our growing analytics team.',
    requirements: 'MS or PhD in a quantitative field, experience with machine learning libraries, proficiency in Python.',
    location: 'Chicago, IL',
    category: 'Data Science',
    company: 'Enterprise Solutions',
    employer_id: 6,
    posted_date: '2023-07-12T14:00:00Z',
    created_at: '2023-07-12T14:00:00Z',
    updated_at: '2023-07-12T14:00:00Z',
    is_active: true
  },
  {
    id: 4,
    title: 'UX/UI Designer',
    description: 'Creative designer needed to craft intuitive user experiences for our mobile applications.',
    requirements: 'Portfolio demonstrating UI design skills, experience with Figma, understanding of user-centered design.',
    location: 'New York, NY',
    category: 'Design',
    company: 'StartupCo',
    employer_id: 4,
    posted_date: '2023-07-08T11:15:00Z',
    created_at: '2023-07-08T11:15:00Z',
    updated_at: '2023-07-08T11:15:00Z',
    is_active: true
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    description: 'Join our infrastructure team to build and maintain our cloud-based systems.',
    requirements: 'Experience with AWS, Kubernetes, CI/CD pipelines, and infrastructure as code.',
    location: 'Remote',
    category: 'Engineering',
    company: 'TechGiant',
    employer_id: 13,
    posted_date: '2023-07-05T15:45:00Z',
    created_at: '2023-07-05T15:45:00Z',
    updated_at: '2023-07-05T15:45:00Z',
    is_active: true
  },
  {
    id: 6,
    title: 'Product Manager',
    description: 'Lead product development initiatives for our SaaS platform.',
    requirements: 'Minimum 3 years of product management experience, technical background preferred.',
    location: 'Boston, MA',
    category: 'Management',
    company: 'Enterprise Solutions',
    employer_id: 6,
    posted_date: '2023-07-03T09:00:00Z',
    created_at: '2023-07-03T09:00:00Z',
    updated_at: '2023-07-03T09:00:00Z',
    is_active: true
  },
  {
    id: 7,
    title: 'Full Stack Developer',
    description: 'We need a versatile developer comfortable with both frontend and backend technologies.',
    requirements: 'Experience with React, Node.js, and database design. Ability to work independently.',
    location: 'Austin, TX',
    category: 'Development',
    company: 'StartupCo',
    employer_id: 4,
    posted_date: '2023-07-01T13:30:00Z',
    created_at: '2023-07-01T13:30:00Z',
    updated_at: '2023-07-01T13:30:00Z',
    is_active: true
  },
  {
    id: 8,
    title: 'Marketing Specialist',
    description: 'Create and implement digital marketing strategies to grow our user base.',
    requirements: 'Experience with SEO, content marketing, and analytics. Creative problem solver.',
    location: 'Seattle, WA',
    category: 'Marketing',
    company: 'TechCorp',
    employer_id: 2,
    posted_date: '2023-06-28T10:15:00Z',
    created_at: '2023-06-28T10:15:00Z',
    updated_at: '2023-06-28T10:15:00Z',
    is_active: false  // Inactive job listing
  },
  {
    id: 9,
    title: 'Senior Software Engineer',
    description: 'Experienced engineer needed to lead development of our core platform.',
    requirements: 'Minimum 8 years of software development experience. Leadership skills required.',
    location: 'San Jose, CA',
    category: 'Engineering',
    company: 'TechGiant',
    employer_id: 13,
    posted_date: '2023-06-25T16:00:00Z',
    created_at: '2023-06-25T16:00:00Z',
    updated_at: '2023-06-25T16:00:00Z',
    is_active: true
  },
  {
    id: 10,
    title: 'Customer Support Representative',
    description: 'Join our support team to assist customers with technical issues.',
    requirements: 'Excellent communication skills, technical aptitude, and problem-solving abilities.',
    location: 'Remote',
    category: 'Support',
    company: 'StartupCo',
    employer_id: 4,
    posted_date: '2023-06-20T11:45:00Z',
    created_at: '2023-06-20T11:45:00Z',
    updated_at: '2023-06-20T11:45:00Z',
    is_active: true
  },
  {
    id: 11,
    title: 'This is an extremely long job title that might cause layout issues in certain parts of the user interface especially on mobile devices or when space is limited in cards or tables',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    requirements: 'Very long requirements text that extends far beyond what would normally be displayed in a typical view, potentially causing overflow or display issues in your interface. This is to test how your UI handles extremely long content without proper truncation or overflow handling.',
    location: 'A Very Long Location Name That Would Not Typically Fit In Standard UI Elements Without Proper Handling',
    category: 'Testing',
    company: 'Long Company Name Test Inc. Corporation Limited LLC Partnership',
    employer_id: 14,
    posted_date: '2023-06-18T14:30:00Z',
    created_at: '2023-06-18T14:30:00Z',
    updated_at: '2023-06-18T14:30:00Z',
    is_active: true
  },
  {
    id: 12,
    title: '<script>alert("XSS Test")</script>',
    description: 'This job listing is testing for potential XSS vulnerabilities <script>alert("XSS in description")</script>',
    requirements: '<img src="x" onerror="alert(\'XSS in requirements\')">',
    location: '<script>console.log("XSS in location")</script>',
    category: 'Security Testing',
    company: '<b>HTML Injection Test</b>',
    employer_id: 14,
    posted_date: '2023-06-15T09:00:00Z',
    created_at: '2023-06-15T09:00:00Z',
    updated_at: '2023-06-15T09:00:00Z',
    is_active: true
  }
];

// Mock applications data - matches Application model
const applications = [
  {
    id: 1,
    user_id: 1, // John Doe
    job_id: 1, // Senior Frontend Developer at TechCorp
    resume_path: 'https://example.com/resumes/johndoe.pdf',
    cover_letter: 'I am excited to apply for the Senior Frontend Developer position. With 7 years of React experience, I believe I would be a great fit for your team.',
    applied_date: '2023-07-16T09:15:00Z',
    status: 'pending'
  },
  {
    id: 2,
    user_id: 3, // Sarah Smith
    job_id: 1, // Senior Frontend Developer at TechCorp
    resume_path: 'https://example.com/resumes/sarahsmith.pdf',
    cover_letter: 'Having worked with React for 6 years at top tech companies, I am confident I can contribute to your frontend development needs immediately.',
    applied_date: '2023-07-16T11:30:00Z',
    status: 'reviewing'
  },
  {
    id: 3,
    user_id: 7, // Developer Mike
    job_id: 2, // Backend Engineer at TechCorp
    resume_path: 'https://example.com/resumes/mike_dev.pdf',
    cover_letter: 'My experience building Python APIs and working with SQL databases makes me an ideal candidate for this Backend Engineer role.',
    applied_date: '2023-07-12T14:45:00Z',
    status: 'accepted'
  },
  {
    id: 4,
    user_id: 8, // Data Scientist
    job_id: 3, // Data Scientist at Enterprise Solutions
    resume_path: 'https://example.com/resumes/data_scientist.pdf',
    cover_letter: 'With my PhD in Computer Science and specialization in machine learning, I am excited about the opportunity to join your analytics team.',
    applied_date: '2023-07-13T10:20:00Z',
    status: 'rejected'
  },
  {
    id: 5,
    user_id: 9, // Designer Emma
    job_id: 4, // UX/UI Designer at StartupCo
    resume_path: 'https://example.com/resumes/emma_portfolio.pdf',
    cover_letter: 'My portfolio demonstrates my ability to create intuitive user experiences. I would love to bring my design skills to your mobile applications.',
    applied_date: '2023-07-10T15:10:00Z',
    status: 'interviewing'
  },
  {
    id: 6,
    user_id: 1, // John Doe
    job_id: 7, // Full Stack Developer at StartupCo
    resume_path: 'https://example.com/resumes/johndoe_fullstack.pdf',
    cover_letter: 'In addition to my frontend expertise, I have been working with Node.js backends for the past 3 years, making me a strong candidate for this full stack role.',
    applied_date: '2023-07-03T13:45:00Z',
    status: 'offer_extended'
  },
  {
    id: 7,
    user_id: 7, // Developer Mike
    job_id: 9, // Senior Software Engineer at TechGiant
    resume_path: 'https://example.com/resumes/mike_senior.pdf',
    cover_letter: 'My 10 years of software engineering experience, including 4 years in leadership roles, have prepared me well for this senior position.',
    applied_date: '2023-06-27T09:30:00Z',
    status: 'pending'
  },
  {
    id: 8,
    user_id: 3, // Sarah Smith
    job_id: 5, // DevOps Engineer at TechGiant
    resume_path: 'https://example.com/resumes/sarah_devops.pdf',
    cover_letter: 'I have spent the last 4 years working extensively with AWS and Kubernetes, and I am excited about bringing this expertise to your infrastructure team.',
    applied_date: '2023-07-07T11:20:00Z',
    status: 'rejected'
  },
  {
    id: 9,
    user_id: 10, // Special Characters User
    job_id: 12, // XSS Test Job
    resume_path: 'https://example.com/resumes/special_resume.pdf',
    cover_letter: '<script>alert("XSS Test in Cover Letter")</script>',
    applied_date: '2023-06-17T10:30:00Z',
    status: 'pending'
  },
  {
    id: 10,
    user_id: 11, // Extremely Long Username
    job_id: 11, // Extremely Long Job Title
    resume_path: 'https://example.com/resumes/long_resume_name_that_could_potentially_cause_issues_with_filepath_handling_or_ui_display.pdf',
    cover_letter: 'This is an extremely long cover letter that goes on and on and might cause layout issues in your application. It contains far more text than would be reasonable for a cover letter and should test how your application handles content overflow in various contexts. This paragraph repeats several times to ensure it is truly long enough to test extreme cases. This is an extremely long cover letter that goes on and on and might cause layout issues in your application. It contains far more text than would be reasonable for a cover letter and should test how your application handles content overflow in various contexts. This paragraph repeats several times to ensure it is truly long enough to test extreme cases. This is an extremely long cover letter that goes on and on and might cause layout issues in your application. It contains far more text than would be reasonable for a cover letter and should test how your application handles content overflow in various contexts.',
    applied_date: '2023-06-20T15:45:00Z',
    status: 'reviewing'
  },
  {
    id: 11,
    user_id: 8, // Data Scientist
    job_id: 6, // Product Manager at Enterprise Solutions
    resume_path: null, // Missing resume - should test error handling
    cover_letter: '',  // Empty cover letter
    applied_date: '2023-07-05T09:15:00Z',
    status: 'incomplete'
  },
  {
    id: 12,
    user_id: 5, // Inactive User
    job_id: 10, // Customer Support at StartupCo
    resume_path: 'https://example.com/resumes/inactive_user.pdf',
    cover_letter: 'I am applying for this position despite being an inactive user, which should test your application status checking.',
    applied_date: '2023-06-22T13:10:00Z',
    status: 'pending'
  }
];

// Mock API functions
export const mockAPI = {
  // Users API
  users: {
    getAll: async () => {
      await delay();
      return { data: users };
    },
    getById: async (id) => {
      await delay();
      const user = users.find(u => u.id === parseInt(id));
      if (!user) {
        throw { response: { status: 404, data: { detail: 'User not found' } } };
      }
      return { data: user };
    },
    create: async (userData) => {
      await delay();
      // Check for duplicate email
      if (users.some(u => u.email === userData.email)) {
        throw { response: { status: 400, data: { detail: 'Email already registered' } } };
      }
      const newUser = {
        id: users.length + 1,
        ...userData,
        is_active: true,
        hashed_password: 'hashed_password_would_be_here'
      };
      users.push(newUser);
      return { data: newUser };
    },
    update: async (id, userData) => {
      await delay();
      const index = users.findIndex(u => u.id === parseInt(id));
      if (index === -1) {
        throw { response: { status: 404, data: { detail: 'User not found' } } };
      }
      users[index] = { ...users[index], ...userData };
      return { data: users[index] };
    },
    delete: async (id) => {
      await delay();
      const index = users.findIndex(u => u.id === parseInt(id));
      if (index === -1) {
        throw { response: { status: 404, data: { detail: 'User not found' } } };
      }
      users.splice(index, 1);
      return { data: { message: 'User deleted successfully' } };
    }
  },
  
  // Jobs API
  jobs: {
    getAll: async (params = {}) => {
      await delay();
      let filteredJobs = [...jobs];
      
      // Apply filters if provided
      if (params.category) {
        filteredJobs = filteredJobs.filter(job => job.category === params.category);
      }
      
      if (params.location) {
        filteredJobs = filteredJobs.filter(job => job.location.includes(params.location));
      }
      
      if (params.query) {
        const query = params.query.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes(query) || 
          job.description.toLowerCase().includes(query)
        );
      }
      
      // Apply pagination
      const skip = params.skip || 0;
      const limit = params.limit || filteredJobs.length;
      
      return { 
        data: filteredJobs.slice(skip, skip + limit),
        total: filteredJobs.length
      };
    },
    
    getById: async (id) => {
      await delay();
      const job = jobs.find(j => j.id === parseInt(id));
      if (!job) {
        throw { response: { status: 404, data: { detail: 'Job not found' } } };
      }
      return { data: job };
    },
    
    getByEmployer: async (employerId) => {
      await delay();
      const employerJobs = jobs.filter(j => j.employer_id === parseInt(employerId));
      return { data: employerJobs };
    },
    
    create: async (jobData) => {
      await delay();
      const newJob = {
        id: jobs.length + 1,
        ...jobData,
        posted_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
      };
      jobs.push(newJob);
      return { data: newJob };
    },
    
    update: async (id, jobData) => {
      await delay();
      const index = jobs.findIndex(j => j.id === parseInt(id));
      if (index === -1) {
        throw { response: { status: 404, data: { detail: 'Job not found' } } };
      }
      
      const updatedJob = { 
        ...jobs[index], 
        ...jobData,
        updated_at: new Date().toISOString()
      };
      
      jobs[index] = updatedJob;
      return { data: updatedJob };
    },
    
    delete: async (id) => {
      await delay();
      const index = jobs.findIndex(j => j.id === parseInt(id));
      if (index === -1) {
        throw { response: { status: 404, data: { detail: 'Job not found' } } };
      }
      jobs.splice(index, 1);
      return { data: { message: 'Job deleted successfully' } };
    }
  },
  
  // Applications API
  applications: {
    getAll: async () => {
      await delay();
      return { data: applications };
    },
    
    getById: async (id) => {
      await delay();
      const application = applications.find(a => a.id === parseInt(id));
      if (!application) {
        throw { response: { status: 404, data: { detail: 'Application not found' } } };
      }
      return { data: application };
    },
    
    getByUser: async (userId) => {
      await delay();
      const userApplications = applications.filter(a => a.user_id === parseInt(userId));
      
      // Enrich with job details
      const enrichedApplications = userApplications.map(app => {
        const job = jobs.find(j => j.id === app.job_id);
        return {
          ...app,
          job_title: job?.title,
          company: job?.company,
          job_location: job?.location
        };
      });
      
      return { data: enrichedApplications };
    },
    
    getByJob: async (jobId) => {
      await delay();
      const jobApplications = applications.filter(a => a.job_id === parseInt(jobId));
      
      // Enrich with applicant details
      const enrichedApplications = jobApplications.map(app => {
        const user = users.find(u => u.id === app.user_id);
        return {
          ...app,
          applicant_username: user?.username,
          applicant_email: user?.email
        };
      });
      
      return { data: enrichedApplications };
    },
    
    create: async (applicationData) => {
      await delay();
      // Check if user already applied to this job
      const existingApplication = applications.find(
        a => a.user_id === applicationData.user_id && a.job_id === applicationData.job_id
      );
      
      if (existingApplication) {
        throw { response: { status: 400, data: { detail: 'You have already applied to this job' } } };
      }
      
      const newApplication = {
        id: applications.length + 1,
        ...applicationData,
        applied_date: new Date().toISOString(),
        status: 'pending'
      };
      
      applications.push(newApplication);
      return { data: newApplication };
    },
    
    updateStatus: async (id, status) => {
      await delay();
      const index = applications.findIndex(a => a.id === parseInt(id));
      if (index === -1) {
        throw { response: { status: 404, data: { detail: 'Application not found' } } };
      }
      
      applications[index].status = status;
      return { data: applications[index] };
    }
  },
  
  // Auth API
  auth: {
    login: async (credentials) => {
      await delay();
      const user = users.find(u => u.username === credentials.username);
      
      if (!user) {
        throw { response: { status: 401, data: { detail: 'Invalid credentials' } } };
      }
      
      if (!user.is_active) {
        throw { response: { status: 403, data: { detail: 'User account is inactive' } } };
      }
      
      // In a real system, we'd verify the password hash
      // For mock purposes, accept any password
      return { 
        data: { 
          access_token: `mock_token_${user.id}`,
          token_type: 'bearer',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        } 
      };
    },
    
    register: async (userData) => {
      await delay();
      // Check for duplicate email or username
      if (users.some(u => u.email === userData.email)) {
        throw { response: { status: 400, data: { detail: 'Email already registered' } } };
      }
      
      if (users.some(u => u.username === userData.username)) {
        throw { response: { status: 400, data: { detail: 'Username already taken' } } };
      }
      
      const newUser = {
        id: users.length + 1,
        ...userData,
        is_active: true,
        hashed_password: 'hashed_password_would_be_here' // In real system this would be properly hashed
      };
      
      users.push(newUser);
      
      return { 
        data: { 
          access_token: `mock_token_${newUser.id}`,
          token_type: 'bearer',
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
          }
        } 
      };
    },
    
    getCurrentUser: async (token) => {
      await delay();
      // Extract user ID from mock token
      const userId = parseInt(token.split('_').pop());
      const user = users.find(u => u.id === userId);
      
      if (!user) {
        throw { response: { status: 401, data: { detail: 'Invalid token' } } };
      }
      
      return { 
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          is_active: user.is_active
        } 
      };
    },
    
    logout: async () => {
      await delay();
      return { data: { message: 'Successfully logged out' } };
    }
  }
};

export const mockAuthAPI = {
  login: async (credentials) => {
    await delay();
    return mockAPI.auth.login(credentials);
  },
  register: async (userData) => {
    await delay();
    return mockAPI.auth.register(userData);
  },
  getCurrentUser: async () => {
    await delay();
    const token = localStorage.getItem('token');
    return mockAPI.auth.getCurrentUser(token);
  },
  logout: async () => {
    await delay();
    return mockAPI.auth.logout();
  }
};

export const mockJobsAPI = {
  getAllJobs: async () => {
    await delay();
    return mockAPI.jobs.getAll();
  },
  getJob: async (id) => {
    await delay();
    return mockAPI.jobs.getById(id);
  },
  createJob: async (jobData) => {
    await delay();
    return mockAPI.jobs.create(jobData);
  },
  updateJob: async (id, jobData) => {
    await delay();
    return mockAPI.jobs.update(id, jobData);
  },
  deleteJob: async (id) => {
    await delay();
    return mockAPI.jobs.delete(id);
  }
};

export const mockApplicationsAPI = {
  getUserApplications: async (userId) => {
    await delay();
    return mockAPI.applications.getByUser(userId || 6); // Default to user ID 6 if not provided
  },
  getApplication: async (id) => {
    await delay();
    return mockAPI.applications.getById(id);
  },
  submitApplication: async (applicationData) => {
    await delay();
    return mockAPI.applications.create(applicationData);
  },
  getJobApplications: async (jobId) => {
    await delay();
    return mockAPI.applications.getByJob(jobId);
  }
};

export default mockAPI; 