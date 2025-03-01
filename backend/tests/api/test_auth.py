import pytest
from fastapi.testclient import TestClient
from src.models.user import UserRole

def test_register_user(client: TestClient):
    # Test user registration
    response = client.post(
        "/api/auth/register",
        json={
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123",
            "role": "jobseeker"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "newuser@example.com"
    assert data["role"] == "jobseeker"
    assert "id" in data
    assert "password" not in data

def test_register_duplicate_username(client: TestClient, test_user):
    # Test registration with existing username
    response = client.post(
        "/api/auth/register",
        json={
            "username": "testuser",  # Same as test_user
            "email": "different@example.com",
            "password": "password123",
            "role": "jobseeker"
        }
    )
    assert response.status_code == 400
    assert "Username already registered" in response.json()["detail"]

def test_login(client: TestClient, test_user):
    # Test login with valid credentials
    response = client.post(
        "/api/auth/login",
        data={
            "username": "testuser",
            "password": "password123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials(client: TestClient):
    # Test login with invalid credentials
    response = client.post(
        "/api/auth/login",
        data={
            "username": "testuser",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
    assert "Incorrect username or password" in response.json()["detail"]

def test_get_current_user(client: TestClient, token_headers, test_user):
    # Test getting current user with valid token
    response = client.get("/api/auth/me", headers=token_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == test_user.username
    assert data["email"] == test_user.email
    assert data["role"] == test_user.role.value

def test_get_current_user_invalid_token(client: TestClient):
    # Test getting current user with invalid token
    response = client.get(
        "/api/auth/me", 
        headers={"Authorization": "Bearer invalidtoken"}
    )
    assert response.status_code == 401 