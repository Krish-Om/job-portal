# README.md

# ElevateWorkforceSolutionsJobPortal

A job portal application built with React and Vite.

## Setup

1. Clone the repository.
2. Install dependencies by running `npm install`.
3. Configure any necessary environment variables.
4. Run the application using `npm run dev`.

## Project Structure

- **src/assets**: Contains static assets such as images or fonts used in the application.
- **src/components**: Contains React components for different parts of the application.
  - **auth**: Contains components for user authentication.
    - `Login.jsx`: Handles user login.
    - `Register.jsx`: Handles user registration.
  - **jobs**: Contains components for job listings.
    - `JobList.jsx`: Displays a list of job postings.
    - `JobDetail.jsx`: Displays detailed information about a specific job.
  - **layout**: Contains layout components.
    - `Header.jsx`: Renders the navigation bar.
    - `Footer.jsx`: Renders the footer section.
- **src/services**: Contains services for API calls and authentication.
  - `auth.js`: Functions for handling authentication.
  - `api.js`: Functions for making API calls to the backend.
- **src/styles**: Contains main CSS styles for the application.
  - `main.css`: Defines layout, colors, and typography.
- **src/App.jsx**: Main application component that sets up routing and renders layout components.
- **src/main.jsx**: Entry point of the React application.

## API Endpoints

- **Authentication**
  - `POST /api/register`: Register a new user.
  - `POST /api/login`: Log in an existing user.

- **Jobs**
  - `GET /api/jobs`: Retrieve a list of job postings.
  - `GET /api/jobs/:id`: Retrieve details of a specific job.

## Development

For local development, ensure you have Node.js installed. Use the provided scripts in `package.json` to run and build the application.