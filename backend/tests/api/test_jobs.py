import pytest
from fastapi.testclient import TestClient

def test_get_all_jobs(client: TestClient, test_job):
    # Test getting all jobs
    response = client.get("/api/jobs/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert any(job["id"] == test_job.id for job in data)

def test_get_job_by_id(client: TestClient, test_job):
    # Test getting a specific job by ID
    response = client.get(f"/api/jobs/{test_job.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == test_job.id
    assert data["title"] == test_job.title
    assert data["description"] == test_job.description

def test_get_nonexistent_job(client: TestClient):
    # Test getting a job that doesn't exist
    response = client.get("/api/jobs/9999")
    assert response.status_code == 404
    assert "Job not found" in response.json()["detail"]

def test_create_job(client: TestClient, employer_token_headers):
    # Test creating a new job as an employer
    job_data = {
        "title": "New Test Job",
        "description": "This is a new test job",
        "location": "Test Location",
        "category": "Test Category",
        "company": "Test Company"
    }
    response = client.post(
        "/api/jobs/",
        json=job_data,
        headers=employer_token_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == job_data["title"]
    assert data["description"] == job_data["description"]
    assert "id" in data

def test_create_job_unauthorized(client: TestClient, token_headers):
    # Test creating a job as a jobseeker (should fail)
    job_data = {
        "title": "Unauthorized Job",
        "description": "This job should not be created",
        "location": "Test Location",
        "category": "Test Category",
        "company": "Test Company"
    }
    response = client.post(
        "/api/jobs/",
        json=job_data,
        headers=token_headers  # Using jobseeker token
    )
    assert response.status_code == 403
    assert "Only employers can create jobs" in response.json()["detail"]

def test_update_job(client: TestClient, test_job, employer_token_headers):
    # Test updating a job
    update_data = {
        "title": "Updated Job Title",
        "description": test_job.description,
        "location": test_job.location,
        "category": test_job.category,
        "company": test_job.company,
        "employer_id": test_job.employer_id  # Make sure to include this
    }
    response = client.put(
        f"/api/jobs/{test_job.id}",
        json=update_data,
        headers=employer_token_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == test_job.id
    assert data["title"] == "Updated Job Title"

def test_delete_job(client: TestClient, test_job, employer_token_headers):
    # Test deleting a job
    response = client.delete(
        f"/api/jobs/{test_job.id}",
        headers=employer_token_headers
    )
    assert response.status_code == 200
    
    # Verify job is deleted
    response = client.get(f"/api/jobs/{test_job.id}")
    assert response.status_code == 404 