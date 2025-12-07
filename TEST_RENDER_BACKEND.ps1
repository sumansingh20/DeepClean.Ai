# Test Render Backend Deployment
# Run this after your backend deploys to verify it's working

param(
    [Parameter(Mandatory=$true)]
    [string]$RenderURL
)

Write-Host "`n🔍 Testing Backend Deployment...`n" -ForegroundColor Cyan

# Test health endpoint
Write-Host "Testing: https://$RenderURL/api/v1/health" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "https://$RenderURL/api/v1/health" -TimeoutSec 30
    Write-Host "✅ Health Check: $($health.status)" -ForegroundColor Green
    Write-Host "   Version: $($health.version)" -ForegroundColor Gray
    Write-Host "   OpenCV: $($health.cv_available)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
    Write-Host "   Backend may still be starting (takes 30-60s first time)" -ForegroundColor Yellow
    exit 1
}

# Test root endpoint
Write-Host "`nTesting: https://$RenderURL/" -ForegroundColor Yellow
try {
    $root = Invoke-RestMethod -Uri "https://$RenderURL/" -TimeoutSec 10
    Write-Host "✅ Root endpoint: $($root.message)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Root endpoint error (may not be critical)" -ForegroundColor Yellow
}

Write-Host "`n✅ BACKEND IS WORKING!`n" -ForegroundColor Green
Write-Host "Next step: Update frontend environment variables" -ForegroundColor Cyan
Write-Host "Run: .\UPDATE_AFTER_RENDER.ps1`n" -ForegroundColor White
