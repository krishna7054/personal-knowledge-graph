import pytest
import sys
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# CRITICAL PATH SETUP: this ensures we can import the app modules
# Get the absolute path to the project root directory (where backend folder is)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, BASE_DIR)  # Add the project root to Python's path

# Now we can import the app modules without error
from app.main import app
from app.database import Base, get_db
from app import crud, schemas

# Set up the test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

# Override the dependency to use our test database
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

# Setup database fixture that runs before each test
@pytest.fixture
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

# Test cases
def test_create_note(setup_db):
    response = client.post("/notes/", json={
        "title": "Test Note",
        "content": "This is a test with [[Linked Note]]",
        "tags": ["test"]
    })
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Note"
    assert "test" in [tag["name"] for tag in data["tags"]]

def test_create_link(setup_db):
    # Create two notes
    client.post("/notes/", json={"title": "Note A", "content": ""})
    client.post("/notes/", json={"title": "Note B", "content": ""})
   
    # Create link
    response = client.patch("/notes/1/link", json={"target_id": 2})
    assert response.status_code == 200
    data = response.json()
    assert 2 in data["links"]

def test_get_graph(setup_db):
    # Create two notes
    client.post("/notes/", json={"title": "Note A", "content": ""})
    client.post("/notes/", json={"title": "Note B", "content": ""})
    # Create link
    client.patch("/notes/1/link", json={"target_id": 2})
   
    response = client.get("/notes/graph/")
    assert response.status_code == 200
    data = response.json()
    assert "adjacency_list" in data
    assert data["adjacency_list"]["Note A"] == ["Note B"]
    assert data["adjacency_list"]["Note B"] == []

# If running this file directly
if __name__ == "__main__":
    pytest.main(["-v"])