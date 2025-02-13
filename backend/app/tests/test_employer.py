from fastapi.testclient import TestClient
from main import app
# from app.routers import employers
from backend.app.schemas.employer import EmployerResponse
client = TestClient(app)


def test_read_all_employers():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == [EmployerResponse]
