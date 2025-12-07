# Stop all DeepClean.AI servers

Write-Host "`nStopping DeepClean.AI servers..." -ForegroundColor Yellow

# Stop Python (Backend)
$pythonProcs = Get-Process python -ErrorAction SilentlyContinue
if ($pythonProcs) {
    Write-Host "Stopping backend..." -ForegroundColor Red
    $pythonProcs | Stop-Process -Force
    Write-Host "Backend stopped" -ForegroundColor Green
}

# Stop Node (Frontend)
$nodeProcs = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcs) {
    Write-Host "Stopping frontend..." -ForegroundColor Red
    $nodeProcs | Stop-Process -Force
    Write-Host "Frontend stopped" -ForegroundColor Green
}

Write-Host "`nAll servers stopped successfully!" -ForegroundColor Green
