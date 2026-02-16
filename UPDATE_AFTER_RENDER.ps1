# Quick Commands After Backend Deploys to Render
# Run this script after getting your Render backend URL

# Step 1: Set your Render URL here (replace with actual URL from Render)
$RENDER_URL = "YOUR_RENDER_URL_HERE.onrender.com"

Write-Host "`n🔗 Connecting Frontend to Backend...`n" -ForegroundColor Cyan

Set-Location D:\Deepfake\frontend

# Step 2: Add environment variables to Vercel
Write-Host "Adding NEXT_PUBLIC_API_URL..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_API_URL production

Write-Host "`nAdding NEXT_PUBLIC_WS_URL..." -ForegroundColor Yellow
vercel env add NEXT_PUBLIC_WS_URL production

# Step 3: Update local .env.production
@"
NEXT_PUBLIC_API_URL=https://$RENDER_URL/api/v1
NEXT_PUBLIC_WS_URL=wss://$RENDER_URL/ws
NEXT_PUBLIC_ENVIRONMENT=production
"@ | Set-Content .env.production

Write-Host "`n✅ Environment variables configured!" -ForegroundColor Green

# Step 4: Commit changes
git add .env.production
git commit -m "Update backend URL to Render deployment"
git push

# Step 5: Redeploy frontend
Write-Host "`n🚀 Redeploying frontend..." -ForegroundColor Cyan
vercel --prod

Write-Host "`n✅ DEPLOYMENT COMPLETE!`n" -ForegroundColor Green
Write-Host "Test your backend: https://$RENDER_URL/api/v1/health" -ForegroundColor White
Write-Host "Test your frontend: Check the Vercel URL`n" -ForegroundColor White
