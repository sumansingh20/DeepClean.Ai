# DeepClean.AI - Stop All Servers Script

Write-Host "`n🛑 Stopping DeepClean.AI servers..." -ForegroundColor Yellow

# Stop Python backend
$pythonProcesses = Get-Process python -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*Deepfake*"}
if ($pythonProcesses) {
    $pythonProcesses | Stop-Process -Force
    Write-Host "   ✅ Stopped Backend API (Python)" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Backend not running" -ForegroundColor Gray
}

# Stop Node frontend
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*Deepfake*"}
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "   ✅ Stopped Frontend UI (Node.js)" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Frontend not running" -ForegroundColor Gray
}

Write-Host "`n✅ All servers stopped!`n" -ForegroundColor Green
