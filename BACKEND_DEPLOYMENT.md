# Backend Deployment - Quick Reference

## ❌ What Doesn't Work

### Railway
- **Status**: Fails with 404 "Application not found"
- **Issue**: Service uploads but never starts
- **Attempts**: Multiple deployments, all failed
- **Conclusion**: Don't use Railway

### Vercel
- **Status**: Python dependency conflicts
- **Issue**: `No solution found when resolving dependencies`
- **Error**: PyJWT version conflicts with Vercel's Python runtime
- **Conclusion**: Vercel not suitable for FastAPI apps

---

## ✅ SOLUTION: Deploy to Render.com

### Why Render?
- ✅ Specifically built for Python/FastAPI
- ✅ Uses your Dockerfile (Docker-based)
- ✅ Free tier: 750 hours/month
- ✅ Better logging and debugging
- ✅ Auto-deploy from GitHub
- ✅ Health check monitoring

### Quick Deploy (10 minutes)

1. **Open Render Dashboard** (already opened for you)
   - https://dashboard.render.com/

2. **Sign In**
   - Use GitHub OAuth

3. **Create Web Service**
   - Click "New +" → "Web Service"

4. **Connect Repository**
   - Select: `sumansingh20/DeepClean.Ai`
   - Click "Connect"

5. **Configure Settings** ⚠️ IMPORTANT:
   ```
   Name: deepclean-backend
   Region: Singapore (or closest)
   Branch: main
   Root Directory: backend          ⚠️ MUST SET THIS!
   Environment: Docker
   Instance Type: Free
   ```

6. **Advanced Settings** (Optional):
   ```
   Auto-Deploy: Yes
   Health Check Path: /api/v1/health
   ```

7. **Deploy**
   - Click "Create Web Service"
   - Wait 5-8 minutes

8. **Get URL**
   - Will be like: `https://deepclean-backend.onrender.com`
   - Test: `curl https://your-url/api/v1/health`

---

## 🔗 Update Frontend After Backend Deploys

Once you have the Render backend URL:

```powershell
# Go to frontend folder
cd D:\Deepfake\frontend

# Remove old Railway URLs from Vercel
vercel env rm NEXT_PUBLIC_API_URL production
vercel env rm NEXT_PUBLIC_WS_URL production

# Add new Render URLs
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://your-render-url.onrender.com/api/v1

vercel env add NEXT_PUBLIC_WS_URL production
# Enter: wss://your-render-url.onrender.com/ws

# Update local .env.production
@"
NEXT_PUBLIC_API_URL=https://your-render-url.onrender.com/api/v1
NEXT_PUBLIC_WS_URL=wss://your-render-url.onrender.com/ws
NEXT_PUBLIC_ENVIRONMENT=production
"@ | Set-Content .env.production

# Commit changes
git add .env.production
git commit -m "Update backend URL to Render deployment"
git push

# Redeploy frontend
vercel --prod
```

---

## ✅ Verify Deployment

### Test Backend
```powershell
curl https://your-render-url.onrender.com/api/v1/health
```
Expected: `{"status":"healthy","version":"2.0.0",...}`

### Test Frontend
1. Open: https://frontend-hu8szmyur-kumarikhushi18k-2932s-projects.vercel.app
2. Should NOT show "Cannot connect to backend"
3. Go to /analysis page
4. Upload test image
5. Should see analysis results

---

## 🆘 Troubleshooting

### Render build fails?
- Check "Root Directory" is set to `backend`
- Review build logs in Render dashboard
- Verify Dockerfile exists in backend folder

### Frontend still shows connection error?
- Verify environment variables on Vercel:
  ```powershell
  vercel env ls production
  ```
- Check exact URL format includes `/api/v1`
- Clear browser cache (Ctrl+Shift+R)

### Backend takes long to respond?
- Render free tier "spins down" after 15 mins inactivity
- First request takes 30-60 seconds to wake up
- Subsequent requests are fast

---

## 📊 Deployment Comparison

| Platform | Status | Speed | Reliability | Best For |
|----------|--------|-------|-------------|----------|
| **Render** | ✅ | Medium | High | Python/FastAPI |
| Railway | ❌ | - | Failed | - |
| Vercel | ❌ | - | Dep conflicts | Next.js only |
| Heroku | ⚠️ | Slow | Medium | Any (paid) |
| Fly.io | ✅ | Fast | High | Containers |

**Recommendation**: Use Render for backend, Vercel for frontend

---

## 🎯 Current Status

- **Frontend**: ✅ Deployed on Vercel
  - URL: https://frontend-hu8szmyur-kumarikhushi18k-2932s-projects.vercel.app
  
- **Backend**: ⏳ Deploy to Render (10 minutes)
  - Railway: Failed ❌
  - Vercel: Failed ❌
  - Render: Ready to deploy ✅

---

**Next Action**: Deploy backend to Render using the steps above

**Time Required**: 10 minutes

**Read**: RENDER_DEPLOYMENT_GUIDE.md for detailed step-by-step
