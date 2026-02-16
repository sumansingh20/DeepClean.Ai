# Start Backend API Server
Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "  DEEPCLEAN.AI BACKEND STARTUP" -ForegroundColor White
Write-Host "==================================" -ForegroundColor Cyan

Set-Location $PSScriptRoot

# Check if virtual environment exists
if (-not (Test-Path ".\venv\Scripts\python.exe")) {
    Write-Host "`nERROR: Virtual environment not found!" -ForegroundColor Red
    Write-Host "Run: python -m venv venv" -ForegroundColor Yellow
    exit 1
}

# Set PYTHONPATH to backend directory (CRITICAL FIX)
$env:PYTHONPATH = $PSScriptRoot
Write-Host "`nPYTHONPATH set to: $env:PYTHONPATH" -ForegroundColor Gray

# Check if port 8001 is available
$port = Get-NetTCPConnection -LocalPort 8001 -ErrorAction SilentlyContinue
if ($port) {
    Write-Host "Port 8001 is already in use. Stopping existing process..." -ForegroundColor Yellow
    Stop-Process -Id $port.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

Write-Host "`nStarting backend server..." -ForegroundColor Green
Write-Host "API URL: http://localhost:8001" -ForegroundColor White
Write-Host "API Docs: http://localhost:8001/docs" -ForegroundColor White
Write-Host "`nPress Ctrl+C to stop the server`n" -ForegroundColor Gray

# Use uvicorn directly (CRITICAL FIX)
.\venv\Scripts\python.exe -m uvicorn main_api:app --host 0.0.0.0 --port 8001 --reload
