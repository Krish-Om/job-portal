# Job Portal

A full-stack job portal application that connects employers with job seekers. Built with FastAPI, React, and PostgreSQL.

## Overview

This project provides a complete platform for job listings and applications. Employers can post jobs and review applicants, while job seekers can browse listings, apply for positions, and track their application status.

## Features

### For Employers
- Post and manage job listings
- Review applicant profiles and resumes
- Track application statistics
- Update application statuses (accept, reject, pending)
- Sort and filter applications

### For Job Seekers
- Create and manage user profiles
- Browse available job openings
- Search and filter jobs by keyword, location, or category
- Apply to positions with resume upload
- Track application status

## Technology Stack

### Backend
- FastAPI - Python web framework for building APIs
- SQLModel - ORM for database interactions
- PostgreSQL - Relational database
- JWT - Authentication and authorization
- Alembic - Database migrations
- Supabase - File storage for resumes

### Frontend
- React - JavaScript library for building user interfaces
- React Router - Navigation and routing
- Tailwind CSS - Utility-first CSS framework
- Axios - HTTP client for API requests
- React Query - Data fetching and state management
- Shadcn UI - Component library

## Project Structure

The project follows a standard structure with separate frontend and backend directories:

```
job-portal/
├── backend/             # FastAPI application
│   ├── alembic/         # Database migrations
│   ├── src/
│   │   ├── api/         # API routes
│   │   ├── database/    # Database configuration
│   │   ├── models/      # Data models
│   │   ├── utils/       # Helper functions
│   │   └── main.py      # Application entry point
│   └── requirements.txt # Python dependencies
├── frontend/            # React application
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React context providers
│   │   ├── lib/         # Utilities and API services
│   │   ├── pages/       # Page components
│   │   └── App.jsx      # Root component
│   └── package.json     # JavaScript dependencies
├── Procfile             # Deployment configuration
└── start.sh             # Startup script
```

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL
- Supabase account

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/job_portal
   SECRET_KEY=your_secret_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```

5. Run database migrations:
   ```
   alembic upgrade head
   ```

6. Start the backend server:
   ```
   uvicorn src.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create `.env.local` file:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser to `http://localhost:5173`

## API Documentation

Once the backend server is running, you can access the API documentation at `http://localhost:8000/docs` or `http://localhost:8000/redoc`.

## Testing the Application

You can use the following sample accounts for testing:

### Employer Accounts
- Username: `techinnovations`, Password: `Pass1234!`
- Username: `globalmarketing`, Password: `Pass1234!`
- Username: `healthpartners`, Password: `Pass1234!`

### Job Seeker Accounts
- Username: `johndeveloper`, Password: `Pass1234!`
- Username: `sarahdesigner`, Password: `Pass1234!`
- Username: `michaelanalyst`, Password: `Pass1234!`

## Deployment

This application is configured for deployment on PaaS platforms like Render, Railway, or Heroku:

1. Connect your repository to your chosen platform
2. Configure environment variables
3. Deploy both frontend (as static site) and backend (as web service)

## Future Enhancements

Planned features for future development:
- Email notifications for application updates
- Advanced search filters
- Company profiles and reviews
- Interview scheduling
- Messaging system between employers and applicants

## License

This project is licensed under the MIT License.