@echo off
echo Starting DIO Bank Open Finance Backend...
set PYTHONPATH=backend
call .\venv\Scripts\activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
