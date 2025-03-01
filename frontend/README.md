# Job Portal Frontend

A minimalistic job portal web application built with React, Vite, and Tailwind CSS.

## Features

- **User Authentication:**
  - Register as a job seeker or employer
  - Login/Logout functionality
  - Protected routes based on user role

- **Job Listings:**
  - View all available jobs
  - Search and filter jobs
  - View detailed job information

- **Job Applications:**
  - Apply for jobs (job seekers)
  - Track application status

- **Employer Dashboard:**
  - Post new job listings
  - Manage posted jobs
  - View applications for posted jobs

## Tech Stack

- **React** - Frontend library
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - API requests
- **React Query** - Data fetching and caching
- **shadcn UI** - UI components

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/job-portal-frontend.git
cd job-portal-frontend
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## API Configuration

The application is configured to connect to a backend API at `http://localhost:8000/api`. You can change this in `src/lib/api.js` if your backend is running on a different URL.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # Base UI components
│   └── ...
├── contexts/         # React contexts
├── hooks/            # Custom hooks
├── lib/              # Utility functions and API services
├── pages/            # Page components
└── ...
```

## License

MIT
