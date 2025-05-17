@echo off
echo Starting Personal Knowledge Graph System...

:: Start backend
cd backend
start cmd /k "call venv\Scripts\activate && uvicorn app.main:app --reload"
cd ..

:: Start frontend
cd frontend
start cmd /k "npm start"
cd ..

echo Application started!