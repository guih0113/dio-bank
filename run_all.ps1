Write-Host "Starting DIO Bank Services..." -ForegroundColor Cyan

Start-Process pwsh -ArgumentList "-NoExit", "-File", "$PSScriptRoot\run_backend.ps1"
Start-Process pwsh -ArgumentList "-NoExit", "-File", "$PSScriptRoot\run_frontend.ps1"

Write-Host "DIO Bank is starting:" -ForegroundColor Green
Write-Host "  Backend:  http://localhost:8000 (Swagger Docs: http://localhost:8000/docs)" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Yellow
