# RESTART_ALL.ps1 - Restart both backend and frontend servers
# Usage: .\RESTART_ALL.ps1

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                        ║" -ForegroundColor Cyan
Write-Host "║         🔄 RESTARTING ALL SERVERS                     ║" -ForegroundColor Cyan
Write-Host "║                                                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

# Stop all processes
Write-Host "`n1️⃣  Stopping existing processes..." -ForegroundColor Yellow
Stop-Process -Name python* -Force -ErrorAction SilentlyContinue
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "   ✅ Processes stopped" -ForegroundColor Green

# Clear frontend cache
Write-Host "`n2️⃣  Clearing Next.js cache..." -ForegroundColor Yellow
Remove-Item -Path "$PSScriptRoot\frontend\.next" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   ✅ Cache cleared" -ForegroundColor Green

# Start Backend
Write-Host "`n3️⃣  Starting Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host 'Starting Backend on port 8001...' -ForegroundColor Cyan; .\START_BACKEND.ps1" -WindowStyle Normal
Start-Sleep -Seconds 5
Write-Host "   ✅ Backend starting" -ForegroundColor Green

# Start Frontend
Write-Host "`n4️⃣  Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host 'Starting Frontend on port 3000...' -ForegroundColor Cyan; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 5
Write-Host "   ✅ Frontend starting" -ForegroundColor Green

# Wait and verify
Write-Host "`n5️⃣  Verifying servers..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

$backendRunning = Get-NetTCPConnection -LocalPort 8001 -State Listen -ErrorAction SilentlyContinue
$frontendRunning = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                        ║" -ForegroundColor Green
Write-Host "║         ✅ SERVERS STATUS                             ║" -ForegroundColor Green
Write-Host "║                                                        ║" -ForegroundColor Green
Write-Host "╠════════════════════════════════════════════════════════╣" -ForegroundColor Green

if ($backendRunning) {
    Write-Host "║  Backend (8001):   ✅ RUNNING                         ║" -ForegroundColor Green
} else {
    Write-Host "║  Backend (8001):   ❌ NOT RUNNING                     ║" -ForegroundColor Red
}

if ($frontendRunning) {
    Write-Host "║  Frontend (3000):  ✅ RUNNING                         ║" -ForegroundColor Green
} else {
    Write-Host "║  Frontend (3000):  ❌ NOT RUNNING                     ║" -ForegroundColor Red
}

Write-Host "║                                                        ║" -ForegroundColor Green
Write-Host "╠════════════════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║                                                        ║" -ForegroundColor White
Write-Host "║  🌐 Access your app:                                   ║" -ForegroundColor Yellow
Write-Host "║                                                        ║" -ForegroundColor White
Write-Host "║     http://localhost:3000                              ║" -ForegroundColor Cyan
Write-Host "║     http://localhost:8001                              ║" -ForegroundColor Cyan
Write-Host "║                                                        ║" -ForegroundColor White
Write-Host "║  💡 Tip: Wait ~15 seconds for full startup             ║" -ForegroundColor Gray
Write-Host "║                                                        ║" -ForegroundColor White
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
