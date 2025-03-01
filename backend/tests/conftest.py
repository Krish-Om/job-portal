import asyncio
import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool
from src.main import app
from src.database.session import get_db
from src.models import User, Job, Application
from src.security import create_access_token, get_password_hash
from src.models.user import UserRole

# Create an in-memory SQLite database for testing
@pytest.fixture(name="engine")
def engine_fixture():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    return engine

@pytest.fixture(name="session")
def session_fixture(engine):
    with Session(engine) as session:
        yield session

@pytest.fixture(name="client")
def client_fixture(session):
    def get_session_override():
        return session

    app.dependency_overrides[get_db] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

@pytest.fixture(name="test_user")
def test_user_fixture(session):
    # Create a test user
    user = User(
        username="testuser",
        email="test@example.com",
        password="password123",
        hashed_password=get_password_hash("password123"),
        role=UserRole.JOBSEEKER,
        is_active=True
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@pytest.fixture(name="test_employer")
def test_employer_fixture(session):
    # Create a test employer
    employer = User(
        username="testemployer",
        email="employer@example.com",
        password="password123",
        hashed_password=get_password_hash("password123"),
        role=UserRole.EMPLOYER,
        is_active=True
    )
    session.add(employer)
    session.commit()
    session.refresh(employer)
    return employer

@pytest.fixture(name="test_job")
def test_job_fixture(session, test_employer):
    # Create a test job
    job = Job(
        title="Test Job",
        description="This is a test job",
        location="Test Location",
        category="Test Category",
        company="Test Company",
        employer_id=test_employer.id
    )
    session.add(job)
    session.commit()
    session.refresh(job)
    return job

@pytest.fixture(name="token_headers")
def token_headers_fixture(test_user):
    # Create access token for test user
    token = create_access_token(data={"sub": test_user.username})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(name="employer_token_headers")
def employer_token_headers_fixture(test_employer):
    # Create access token for test employer
    token = create_access_token(data={"sub": test_employer.username})
    return {"Authorization": f"Bearer {token}"} 