# Personal Knowledge Graph System
A web-based application for managing and visualizing a personal knowledge graph. Users can create notes with markdown content, link notes to form a graph, filter notes by tags or keywords, and visualize connections in text or graphical views using Cytoscape.js.

## Live Link
https://personal-knowledge-graph.vercel.app

## Table of Contents

- Features
- Tech Stack
- Prerequisites
- Installation
  - Windows Setup Using Batch Scripts
  - Manual Setup
- Running the Application
- Testing
- Usage


## Features

- Note Management: Create, view, and filter notes with markdown support.
- Linking: Link notes using markdown syntax (e.g., [[Note Title]]) or a UI form.
- Graph Visualization: View note connections as a text list or an interactive graph using Cytoscape.js.
- Filtering: Filter notes by tags or search keywords.
- Responsive UI: Built with React and Tailwind CSS for a modern interface.
- REST API: FastAPI backend with SQLite for data persistence.
- Python SDK: Auto-generated SDK for interacting with the API.

## Tech Stack

- Frontend:
  - React 18.2.0
  - react-cytoscapejs 2.0.0 (for graph visualization)
  - react-markdown 9.0.1 (for markdown rendering)
  - Axios 1.7.2 (for API requests)
  - lucide-react 0.441.0 (for icons)
  - react-scripts 5.0.1


- Backend:
  - FastAPI
  - SQLAlchemy with SQLite
  - Alembic (for database migrations)
  - Uvicorn (ASGI server)


- Tools:
  - OpenAPI Generator (for Python SDK)


- Deployment:
  - Railway (backend hosting)
  - Vercel (frontend hosting)



## Prerequisites

- Windows OS: The provided batch scripts (setup.bat, runapplication.bat) are designed for Windows.
- Node.js: v16.20.2 (recommended for compatibility with react-scripts@5.0.1) or v20.13.1 with NODE_OPTIONS=--openssl-legacy-provider.
- npm: v8.x or higher.
- Python: 3.8 or higher.
- Git: For cloning the repository.
- SQLite: Included with Python, but ensure sqlite3 is available.
- OpenAPI Generator CLI: For generating the Python SDK.

## Installation
### Windows Setup Using Batch Scripts
The setup.bat script automates the setup for both backend and frontend, including virtual environment creation, dependency installation, database initialization, and Python SDK generation.

1. Clone the Repository:
```bash
git clone https://github.com/krishna7054/personal-knowledge-graph.git
cd personal-knowledge-graph
```

2. Run the Setup Script:
  - Double-click setup.bat or
```bash
 run:setup.bat
```
- This script:
  - Creates a Python virtual environment in backend/venv.
  - Installs backend dependencies from backend/requirements.txt.
  - Applies Alembic migrations to initialize backend/knowledge.db.
  - Seeds the database with backend/seed_data.sql.
  - Installs frontend dependencies in frontend.
  - Installs OpenAPI Generator CLI globally.
  - Starts the backend temporarily to generate the Python SDK in knowledge_sdk.

3. Verify Setup:
  - Check backend/knowledge.db exists.
  - Ensure frontend/node_modules and knowledge_sdk directories are created.



### Manual Setup
If you prefer manual setup or are using a non-Windows OS, follow these steps.

#### Backend Setup

1. Navigate to Backend:
```bash
cd backend
```
2. Create a Virtual Environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```
3. Install Dependencies:
```bash
pip install -r requirements.txt
```
Example requirements.txt:
```bash
fastapi
uvicorn
sqlalchemy
alembic
python-dotenv
```
4. Initialize the Database:
```bash
alembic upgrade head
```
5. Seed Initial Data (optional):
```bash
sqlite3 knowledge.db < seed_data.sql
```
Example seed_data.sql:
```bash
INSERT INTO notes (id, title, content) VALUES (1, 'Note A', 'Content A [[Note B]] [[Note C]]');
INSERT INTO notes (id, title, content) VALUES (2, 'Note B', 'Content B');
INSERT INTO notes (id, title, content) VALUES (3, 'Note C', 'Content C');
INSERT INTO notes (id, title, content) VALUES (4, 'Note D', 'Content D');
INSERT INTO links (source_id, target_id) VALUES (1, 2);
INSERT INTO links (source_id, target_id) VALUES (1, 3);
```

#### Frontend Setup

1. Navigate to Frontend:
```bash
cd ../frontend
```
2. Install Dependencies:
```bash
npm install
```

Ensure package.json includes:
```bash
{
  "name": "knowledge-graph-frontend",
  "version": "0.1.0",
  "dependencies": {
    "axios": "^1.7.2",
    "cytoscape": "^3.30.2",
    "lucide-react": "^0.441.0",
    "react": "^18.2.0",
    "react-cytoscapejs": "^2.0.0",
    "react-dom": "^18.2.0",
    "react-markdown": "^9.0.1",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "NODE_OPTIONS=--openssl-legacy-provider react-scripts start",
    "build": "NODE_OPTIONS=--openssl-legacy-provider react-scripts build"
  }
}
```
3. Generate Python SDK:
```bash
npm install -g @openapitools/openapi-generator-cli
cd ../backend
uvicorn app.main:app --reload
```
In another terminal:
```bahs
cd ..
openapi-generator-cli generate -i http://localhost:8000/openapi.json -g python -o knowledge_sdk
```

## Running the Application
The runapplication.bat script starts both the backend and frontend in separate terminal windows.

1.Run the Application:
  - Double-click runapplication.bat or run:
```bash
    runapplication.bat
```
- This script:
  - Starts the FastAPI backend at http://localhost:8000.
  - Starts the React frontend at http://localhost:3000.

2. Manual Start (if needed):

- Backend:
```bash
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload
```
- Frontend:
```bash 
cd frontend
npm start
```
3. Verify API:
```bash
curl http://localhost:8000/notes/
curl http://localhost:8000/notes/graph/
```
Expected notes/graph/ response:
```bash
{
  "adjacency_list": {
    "Note A": ["Note B", "Note C"],
    "Note B": [],
    "Note C": [],
    "Note D": []
  }
}
```

## Testing
The backend includes automated tests to verify API functionality, located in backend/app/tests/test_notes.py. The tests use pytest and cover creating notes, linking notes, and retrieving the graph structure.

### Running Tests
1. Activate Virtual Environment:
```bash
cd backend
\venv\Scripts\activate
pip install pytest
```
2. Run Tests:
```bash
pytest 
```
- This runs all tests in app/tests/test_notes.py and other test files.
```bash
Expected output (for 14 tests):

=================== test session starts ===================
platform win32 -- Python 3.10.6, pytest-8.3.5, pluggy-1.6.0
rootdir: D:\personal-knowledge-graph\backend
collected 14 items

app/tests/test_notes.py::test_create_note PASSED [  7%]
app/tests/test_notes.py::test_create_link PASSED [ 14%]
app/tests/test_notes.py::test_get_graph PASSED [ 21%]
...
================== 17 passed in 0.50s ==================
```
3. Test File Overview:
- Location: backend/app/tests/test_notes.py
- Purpose: Tests the core API endpoints:
  - POST /notes/: Creates a note with title, content, and tags.
  - PATCH /notes/{id}/link: Links two notes.
  - GET /notes/graph/: Retrieves the graph as an adjacency list.
  - Setup: Uses an in-memory SQLite database (test.db) and FastAPI’s TestClient for isolated testing.

## Usage

1. Create Notes:
  - Open http://localhost:3000 and use the form to add notes with markdown content (e.g., # Heading\n[[Note B]]) and tags.
  - Links in [[Title]] syntax are parsed automatically.
2. View Notes:
  - Click a note in the list to view its markdown-rendered content, tags, outgoing links, and backlinks.
  - Add links using the “Link to Note Title” input (e.g., enter Note B to link to it).
3. Filter Notes:
  - Use the search bar or tag filters to find notes.
4. Graph View:
  - Toggle between text and visual views.
  - Text view shows a list of notes and connections (e.g., Note A --> Note B, Note C).
  - Visual view displays an interactive graph with nodes sized by connection count.
  - Click nodes to log their IDs; hover to change the cursor.
5. Python SDK:
  - Use the generated knowledge_sdk to interact with the API programmatically. Example:from knowledge_sdk.api.notes_api import NotesApi
```bash
  from knowledge_sdk.api_client import ApiClient
  client = ApiClient(host="http://localhost:8000")
  api = NotesApi(client)
  notes = api.get_notes()
  print(notes)
```
