# Connect Render Backend to Vercel Frontend
# Usage: .\CONNECT_BACKEND.ps1 -RenderURL "your-backend.onrender.com"

param(
    [Parameter(Mandatory=$true)]
    [string]$RenderURL
)

$RenderURL = $RenderURL -replace '^https?://', '' -replace '/$', ''

Write-Host "`n🔗 CONNECTING BACKEND TO FRONTEND`n" -ForegroundColor Cyan
Write-Host "Backend: https://$RenderURL`n" -ForegroundColor White

# Test backend
Write-Host "Testing backend..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod "https://$RenderURL/api/v1/health" -TimeoutSec 30
    Write-Host "✅ Backend healthy (v$($health.version))`n" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend not responding (may still be starting)`n" -ForegroundColor Yellow
}

Set-Location D:\Deepfake\frontend

# Update environment variables
Write-Host "Updating Vercel environment variables..." -ForegroundColor Yellow
"https://$RenderURL/api/v1" | vercel env add NEXT_PUBLIC_API_URL production
"wss://$RenderURL/ws" | vercel env add NEXT_PUBLIC_WS_URL production

# Update local file
@"
NEXT_PUBLIC_API_URL=https://$RenderURL/api/v1
NEXT_PUBLIC_WS_URL=wss://$RenderURL/ws
NEXT_PUBLIC_ENVIRONMENT=production
"@ | Set-Content .env.production

# Commit and deploy
git add .env.production
git commit -m "Connect to Render backend: $RenderURL"
git push

Write-Host "`nRedeploying frontend..." -ForegroundColor Yellow
vercel --prod

Write-Host "`n✅ DONE!`n" -ForegroundColor Green
Write-Host "Backend:  https://$RenderURL" -ForegroundColor White
Write-Host "Frontend: Check Vercel output above" -ForegroundColor White
Write-Host ""
