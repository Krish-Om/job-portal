# Frontend Development Guide - Elevate Workforce Portal

## Project Setup

### Initialize Project
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install react-router-dom axios react-hook-form


// filepath: /home/krishom/Workspace/job-portal/frontend/package.json
{
  "dependencies": {
    "axios": "^1.6.7",
    "react": "^18.2.0", 
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.1",
    "react-hook-form": "^7.50.1"
  }
}frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── jobs/
│   │   │   ├── JobList.jsx
│   │   │   ├── JobDetail.jsx
│   │   │   └── JobForm.jsx
│   │   ├── applications/
│   │   │   ├── ApplicationList.jsx
│   │   │   └── ApplicationForm.jsx
│   │   └── layout/
│   │       ├── Header.jsx
│   │       ├── Footer.jsx
│   │       └── Layout.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── auth.js
│   ├── styles/
│   │   ├── auth.css
│   │   ├── jobs.css
│   │   └── layout.css
│   ├── App.jsx
│   └── main.jsx
└── index.html

API Integration
Authentication Endpoints
POST /auth/login - User login
POST /auth/register - User registration
GET /auth/me - Get current user
Jobs Endpoints
GET /jobs - List all jobs
GET /jobs/{id} - Get job details
POST /jobs - Create job (employers)
PUT /jobs/{id} - Update job (employers)
DELETE /jobs/{id} - Delete job (employers)
Applications Endpoints
POST /applications - Submit application
GET /applications - List applications
GET /applications/{id} - Get application details


Implementation Steps
Project Setup

Create Vite project
Install dependencies
Set up directory structure
Authentication Flow

Implement Login/Register
Add protected routes
Handle tokens
Job Management

Create job listing
Add job details view
Implement job forms
Application System

Create application form
Add application listing
Handle status updates
Polish & Testing

Add loading states
Implement error handling
Test all flows
Best Practices
Use proper form validation
Implement loading indicators
Handle API errors gracefully
Keep components focused
Follow React conventions
Test critical flows