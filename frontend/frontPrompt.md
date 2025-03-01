Features

1. **User Authentication:**
    - Register
    - Login
    - Logout


2. **Job Listings:**
    - View all jobs
    - View job details
    - Search jobs

3. **Job Applications:**
    - Apply for a job
    - View user applications

4. **Employer Dashboard:**
    - Post new jobs
    - Manage posted jobs
    - View applications for posted jobs

API Endpoints

 Authentication Endpoints

1. **POST /api/auth/register**
    - Registers a new user.
    - Request Body:
      ```json
      {
         "username": "string",
         "email": "string",
         "password": "string",
         "role": "jobseeker" | "employer"
      }
      ```
    - Response:
      ```json
      {
         "id": "integer",
         "username": "string",
         "email": "string",
         "role": "jobseeker" | "employer",
         "is_active": "boolean"
      }
      ```

2. **POST /api/auth/login**
    - Authenticates a user and returns a JWT token.
    - Request Body:
      ```json
      {
         "username": "string",
         "password": "string"
      }
      ```
    - Response:
      ```json
      {
         "access_token": "string",
         "token_type": "bearer"
      }
      ```

3. **POST /api/auth/logout**
    - Logs out the current user.
    - Response:
      ```json
      {
         "msg": "Successfully logged out"
      }
      ```

4. **GET /api/auth/me**
    - Retrieves the current authenticated user's details.
    - Response:
      ```json
      {
         "id": "integer",
         "username": "string",
         "email": "string",
         "role": "jobseeker" | "employer",
         "is_active": "boolean"
      }
      ```

 Job Endpoints

1. **GET /api/jobs**
    - Retrieves a list of all jobs.
    - Query Parameters:
      - `skip`: integer (optional)
      - `limit`: integer (optional)
    - Response:
      ```json
      [
         {
            "id": "integer",
            "title": "string",
            "description": "string",
            "location": "string",
            "category": "string",
            "company": "string",
            "posted_date": "datetime",
            "employer_id": "integer"
         }
      ]
      ```

2. **GET /api/jobs/{job_id}**
    - Retrieves details of a specific job.
    - Response:
      ```json
      {
         "id": "integer",
         "title": "string",
         "description": "string",
         "location": "string",
         "category": "string",
         "company": "string",
         "posted_date": "datetime",
         "employer_id": "integer"
      }
      ```

3. **POST /api/jobs**
    - Creates a new job (employer only).
    - Request Body:
      ```json
      {
         "title": "string",
         "description": "string",
         "location": "string",
         "category": "string",
         "company": "string"
      }
      ```
    - Response:
      ```json
      {
         "id": "integer",
         "title": "string",
         "description": "string",
         "location": "string",
         "category": "string",
         "company": "string",
         "posted_date": "datetime",
         "employer_id": "integer"
      }
      ```

4. **PUT /api/jobs/{job_id}**
    - Updates an existing job (employer only).
    - Request Body:
      ```json
      {
         "title": "string",
         "description": "string",
         "location": "string",
         "category": "string",
         "company": "string"
      }
      ```
    - Response:
      ```json
      {
         "id": "integer",
         "title": "string",
         "description": "string",
         "location": "string",
         "category": "string",
         "company": "string",
         "posted_date": "datetime",
         "employer_id": "integer"
      }
      ```

5. **DELETE /api/jobs/{job_id}**
    - Deletes a job (employer only).
    - Response:
      ```json
      {
         "message": "Job deleted successfully"
      }
      ```

 Application Endpoints

1. **POST /api/applications**
    - Submits a job application (jobseeker only).
    - Request Body:
      ```json
      {
         "job_id": "integer",
         "resume_path": "string",
         "cover_letter": "string"
      }
      ```
    - Response:
      ```json
      {
         "id": "integer",
         "user_id": "integer",
         "job_id": "integer",
         "resume_path": "string",
         "cover_letter": "string",
         "applied_date": "datetime",
         "status": "string"
      }
      ```

2. **GET /api/applications/{application_id}**
    - Retrieves details of a specific application.
    - Response:
      ```json
      {
         "id": "integer",
         "user_id": "integer",
         "job_id": "integer",
         "resume_path": "string",
         "cover_letter": "string",
         "applied_date": "datetime",
         "status": "string"
      }
      ```

3. **GET /api/applications**
    - Retrieves a list of applications for the current user.
    - Query Parameters:
      - `skip`: integer (optional)
      - `limit`: integer (optional)
    - Response:
      ```json
      [
         {
            "id": "integer",
            "user_id": "integer",
            "job_id": "integer",
            "resume_path": "string",
            "cover_letter": "string",
            "applied_date": "datetime",
            "status": "string"
         }
      ]
      ```

Models

 User Model
 ```json
{
    "id": "integer",
    "username": "string",
    "email": "string",
    "password": "string",
    "role": "jobseeker" | "employer",
    "is_active": "boolean",
}
```

 Job Model
 ```json
{
    "id": "integer",
    "title": "string",
    "description": "string",
    "location": "string",
    "category": "string",
    "company": "string",
    "posted_date": "datetime",
    "employer_id": "integer"
}
```

 Application Model
 ```json
{
    "id": "integer",
    "user_id": "integer",
    "job_id": "integer",
    "resume_path": "string",
    "cover_letter": "string",
    "applied_date": "datetime",
    "status": "string"
}
```