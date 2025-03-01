import pytest
from fastapi.testclient import TestClient

def test_create_application(client: TestClient, test_job, token_headers):
    # Test creating a job application as a jobseeker
    application_data = {
        "job_id": test_job.id,
        "resume_path": "path/to/resume.pdf",
        "cover_letter": "I am interested in this position"
    }
    response = client.post(
        "/api/applications/",
        json=application_data,
        headers=token_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["job_id"] == test_job.id
    assert "id" in data

def test_create_application_as_employer(client: TestClient, test_job, employer_token_headers):
    # Test creating an application as an employer (should fail)
    application_data = {
        "job_id": test_job.id,
        "resume_path": "path/to/resume.pdf",
        "cover_letter": "I am interested in this position"
    }
    response = client.post(
        "/api/applications/",
        json=application_data,
        headers=employer_token_headers
    )
    assert response.status_code == 403
    assert "Only jobseekers can apply for jobs" in response.json()["detail"]

def test_get_user_applications(client: TestClient, test_job, token_headers):
    # First create an application
    application_data = {
        "job_id": test_job.id,
        "resume_path": "path/to/resume.pdf",
        "cover_letter": "I am interested in this position"
    }
    client.post(
        "/api/applications/",
        json=application_data,
        headers=token_headers
    )
    
    # Test getting user's applications
    response = client.get(
        "/api/applications/",
        headers=token_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["job_id"] == test_job.id

def test_get_job_applications(client: TestClient, test_job, employer_token_headers, token_headers):
    # First create an application
    application_data = {
        "job_id": test_job.id,
        "resume_path": "path/to/resume.pdf",
        "cover_letter": "I am interested in this position"
    }
    client.post(
        "/api/applications/",
        json=application_data,
        headers=token_headers
    )
    
    # Test getting applications for a specific job as the employer
    response = client.get(
        f"/api/applications/job/{test_job.id}",
        headers=employer_token_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["job_id"] == test_job.id 