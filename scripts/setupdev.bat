@echo off
echo Setting up development environment...

:: Backend setup
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
sqlite3 knowledge.db < seed_data.sql
cd ..

:: Frontend setup
cd frontend
npm install
cd ..

:: Generate Python SDK
npm install -g @openapitools/openapi-generator-cli
cd backend
uvicorn app.main:app --reload
timeout /t 5
openapi-generator-cli generate -i http://localhost:8000/openapi.json -g python -o ../knowledge_sdk
cd ..

echo Setup complete!