@echo off
echo Starting DIO Bank (Backend + Frontend)...
start "DIO Bank Backend (FastAPI + MCP)" cmd /k "run_backend.bat"
start "DIO Bank Frontend (React + Vite)" cmd /k "run_frontend.bat"
echo Services starting...
echo Backend:  http://localhost:8000 (API & Docs: http://localhost:8000/docs)
echo Frontend: http://localhost:5173
