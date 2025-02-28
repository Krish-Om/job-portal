# ElevateWorkforceSolutionsJobPortal

A job portal application built with FastAPI, SQLModel, and PostgreSQL.

## Setup

1. Clone the repository.
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Configure the database connection in `src/core/config.py`.
4. Run the database migrations using Alembic:
   ```
   alembic upgrade head
   ```
5. Start the FastAPI application:
   ```
   uvicorn src.main:app --reload
   ```

## API Endpoints

### Authentication
- **POST** `/register`: Register a new user.
- **POST** `/login`: Authenticate a user and return a JWT token.
- **POST** `/logout`: Log out a user.

### Job Listings
- **GET** `/jobs`: Retrieve all job listings.
- **GET** `/jobs/{id}`: Retrieve details of a specific job.
- **POST** `/jobs`: Create a new job listing (admin only).

### Job Applications
- **POST** `/applications`: Submit a job application (requires authentication).
- **GET** `/applications/{job_id}`: Retrieve applications for a specific job.

## Development

To contribute to the project, follow these steps:

1. Create a new branch for your feature or bug fix.
2. Make your changes and ensure that tests pass.
3. Submit a pull request with a description of your changes.