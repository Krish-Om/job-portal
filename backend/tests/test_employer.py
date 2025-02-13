from fastapi.testclient import TestClient
from backend.main import app
from backend.schemas.employer import EmployerResponse

client = TestClient(app)

def test_read_employers():
    response = client.get("/api/employers/")
    assert response.status_code == 200
    assert response.json() == []