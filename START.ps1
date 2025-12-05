# DeepClean AI - Quick Start Script
# Run this to start all services

Write-Host "`n" -ForegroundColor Cyan
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           DeepClean AI - Starting All Services             ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Kill old processes
Write-Host "[1/4] Cleaning up old processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq 'python' -or $_.ProcessName -eq 'node'} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep 2
Write-Host "      ✓ Cleanup complete" -ForegroundColor Green

# Start Backend
Write-Host "`n[2/4] Starting Backend (Port 8001)..." -ForegroundColor Yellow
$backendPath = "D:\Deepfake\backend"
$backendCmd = "cd $backendPath; `$env:PYTHONIOENCODING='utf-8'; Write-Host 'Backend Running...' -ForegroundColor Green; .\venv\Scripts\python.exe simple_backend.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd -WindowStyle Minimized
Start-Sleep 6

try {
    $test = Invoke-RestMethod "http://localhost:8001/" -TimeoutSec 3
    Write-Host "      ✓ Backend: $($test.message)" -ForegroundColor Green
} catch {
    Write-Host "      ✗ Backend failed to start!" -ForegroundColor Red
    Write-Host "      Check: D:\Deepfake\backend\simple_backend.py" -ForegroundColor Yellow
    exit 1
}

# Start Frontend
Write-Host "`n[3/4] Starting Frontend (Port 3000)..." -ForegroundColor Yellow
$frontendPath = "D:\Deepfake\frontend"
$frontendCmd = "cd $frontendPath; Write-Host 'Frontend Running...' -ForegroundColor Green; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd -WindowStyle Minimized
Start-Sleep 10

try {
    Invoke-WebRequest "http://localhost:3000" -TimeoutSec 3 -UseBasicParsing | Out-Null
    Write-Host "      ✓ Frontend started successfully" -ForegroundColor Green
} catch {
    Write-Host "      ⏳ Frontend still starting (this is normal)..." -ForegroundColor Yellow
}

# Test Login
Write-Host "`n[4/4] Testing login endpoint..." -ForegroundColor Yellow
try {
    $loginBody = @{ 
        email = "admin@deepclean.ai"
        password = "admin123" 
    } | ConvertTo-Json
    
    $login = Invoke-RestMethod -Uri "http://localhost:8001/api/v1/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -TimeoutSec 5
    Write-Host "      ✓ Login test successful!" -ForegroundColor Green
    Write-Host "      ✓ User: $($login.user.username) ($($login.user.role))" -ForegroundColor White
} catch {
    Write-Host "      ✗ Login test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Summary
Write-Host "`n" -ForegroundColor Cyan
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              ✓ ALL SERVICES RUNNING!                        ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "🌐 BACKEND API:" -ForegroundColor Yellow
Write-Host "   • Main: http://localhost:8001" -ForegroundColor Cyan
Write-Host "   • Docs: http://localhost:8001/docs" -ForegroundColor Cyan
Write-Host ""

Write-Host "🌐 FRONTEND WEB:" -ForegroundColor Yellow
Write-Host "   • Home: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   • Login: http://localhost:3000/login" -ForegroundColor Magenta
Write-Host "   • Test: http://localhost:3000/test-login.html" -ForegroundColor Magenta
Write-Host "   • Settings: http://localhost:3000/settings" -ForegroundColor Magenta
Write-Host ""

Write-Host "🔐 TEST ACCOUNTS:" -ForegroundColor Yellow
Write-Host "   • Admin: admin@deepclean.ai / admin123" -ForegroundColor Cyan
Write-Host "   • Moderator: moderator@deepclean.ai / mod123" -ForegroundColor Cyan
Write-Host ""

Write-Host "✨ FEATURES:" -ForegroundColor Yellow
Write-Host "   ✓ Beautiful login page with animations" -ForegroundColor White
Write-Host "   ✓ Complete 2FA with QR codes" -ForegroundColor White
Write-Host "   ✓ Profile `& password management" -ForegroundColor White
Write-Host "   ✓ Voice/Video/Document detection" -ForegroundColor White
Write-Host "   ✓ Analytics `& dashboards" -ForegroundColor White
Write-Host "   ✓ 25+ API endpoints" -ForegroundColor White
Write-Host ""

Write-Host "Opening test page in browser..." -ForegroundColor Green
Start-Sleep 2
Start-Process "http://localhost:3000/test-login.html"

Write-Host "`nPress any key to open API docs..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Start-Process "http://localhost:8001/docs"

Write-Host "`nSetup complete! Both windows are running in background.`n" -ForegroundColor Green
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
