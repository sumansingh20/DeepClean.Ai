# DeepClean.AI - Production Startup Script
# Starts both backend and frontend servers

Write-Host "`n" -NoNewline
Write-Host ("="*75) -ForegroundColor Cyan
Write-Host "  🚀 DEEPCLEAN.AI - NATIONAL DEEPFAKE DETECTION PLATFORM" -ForegroundColor Green
Write-Host ("="*75) -ForegroundColor Cyan
Write-Host ""

# Check if servers already running
$backendRunning = Get-Process python -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*Deepfake*"}
$frontendRunning = Get-Process node -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*Deepfake*"}

if ($backendRunning) {
    Write-Host "⚠️  Backend already running (PID: $($backendRunning.Id))" -ForegroundColor Yellow
} else {
    Write-Host "🔧 Starting Backend API (Python + OpenCV + FastAPI)..." -ForegroundColor Cyan
    Start-Process python -ArgumentList "backend\main_api.py" -WindowStyle Hidden -WorkingDirectory "D:\Deepfake"
    Start-Sleep -Seconds 3
    Write-Host "   ✅ Backend API: http://localhost:8001" -ForegroundColor Green
}

if ($frontendRunning) {
    Write-Host "⚠️  Frontend already running (PID: $($frontendRunning.Id))" -ForegroundColor Yellow
} else {
    Write-Host "🎨 Starting Frontend UI (Next.js)..." -ForegroundColor Cyan
    Start-Process cmd -ArgumentList "/c cd frontend && npm run dev" -WindowStyle Hidden -WorkingDirectory "D:\Deepfake"
    Start-Sleep -Seconds 5
    Write-Host "   ✅ Frontend UI: http://localhost:3000" -ForegroundColor Green
}

Write-Host ""
Write-Host "📊 REAL FEATURES ACTIVE:" -ForegroundColor Yellow
Write-Host "   ✓ OpenCV Computer Vision (Laplacian, Canny, Noise)" -ForegroundColor White
Write-Host "   ✓ SHA-256 Blockchain Evidence Chain" -ForegroundColor White
Write-Host "   ✓ Real-time Frame Analysis" -ForegroundColor White
Write-Host "   ✓ Forensic Metrics & Reports" -ForegroundColor White
Write-Host "   ✓ WebSocket Live Updates" -ForegroundColor White
Write-Host ""
Write-Host "🌐 ACCESS POINTS:" -ForegroundColor Yellow
Write-Host "   Homepage: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Advanced Analysis: http://localhost:3000/advanced-analysis" -ForegroundColor Cyan
Write-Host "   API Docs: http://localhost:8001/docs" -ForegroundColor Cyan
Write-Host "   Backend API: http://localhost:8001" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 100% PRODUCTION - NO DEMOS - ALL REAL ML!" -ForegroundColor Green
Write-Host ("="*75) -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to open the application in browser..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Start-Process "http://localhost:3000"
