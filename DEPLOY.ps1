# DeepClean.AI Deployment Script
# Starts both backend and frontend servers

Write-Host "`n=================================" -ForegroundColor Cyan
Write-Host "  DEEPCLEAN.AI DEPLOYMENT" -ForegroundColor White
Write-Host "  Women's Safety Platform" -ForegroundColor Magenta
Write-Host "=================================" -ForegroundColor Cyan

# Check if ports are available
Write-Host "`nChecking ports..." -ForegroundColor Yellow

$backendPort = Get-NetTCPConnection -LocalPort 8001 -ErrorAction SilentlyContinue
$frontendPort = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

if ($backendPort) {
    Write-Host "Port 8001 in use. Stopping existing backend..." -ForegroundColor Yellow
    Stop-Process -Id $backendPort.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep 2
}

if ($frontendPort) {
    Write-Host "Port 3000 in use. Stopping existing frontend..." -ForegroundColor Yellow
    Stop-Process -Id $frontendPort.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep 2
}

# Start Backend
Write-Host "`nStarting Backend API..." -ForegroundColor Green
Write-Host "Location: http://localhost:8001" -ForegroundColor White
Write-Host "API Docs: http://localhost:8001/docs" -ForegroundColor White

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; python main_api.py" -WindowStyle Normal

Start-Sleep 5

# Start Frontend
Write-Host "`nStarting Frontend..." -ForegroundColor Green
Write-Host "Location: http://localhost:3000" -ForegroundColor White

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev" -WindowStyle Normal

Start-Sleep 5

# Show status
Write-Host "`n=================================" -ForegroundColor Cyan
Write-Host "  DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan

Write-Host "`nServices Running:" -ForegroundColor White
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:8001" -ForegroundColor Cyan
Write-Host "  API Docs: http://localhost:8001/docs" -ForegroundColor Cyan

Write-Host "`nTest Accounts:" -ForegroundColor White
Write-Host "  Admin: admin@deepclean.ai / admin123" -ForegroundColor Yellow
Write-Host "  User:  suman@deepclean.ai / suman123" -ForegroundColor Yellow

Write-Host "`nPress Ctrl+C in each window to stop servers" -ForegroundColor Gray
Write-Host "`n"
