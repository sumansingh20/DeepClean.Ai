# Vercel Deployment Guide

## Frontend Deployment (Vercel)

### Prerequisites
1. Create account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Prepare environment variables

### Deployment Steps

#### 1. Link Project to Vercel
```powershell
cd frontend
vercel login
vercel link
```

#### 2. Configure Environment Variables
In Vercel Dashboard:
- Go to Project Settings → Environment Variables
- Add all variables from `.env.production.example`
- Set them for **Production** environment

Required Variables:
- `NEXT_PUBLIC_API_URL` - Your backend API URL
- `NEXT_PUBLIC_WS_URL` - Your backend WebSocket URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` - Google callback URL
- `NEXT_PUBLIC_FACEBOOK_APP_ID` - Facebook App ID
- `NEXT_PUBLIC_FACEBOOK_REDIRECT_URI` - Facebook callback URL
- `NEXT_PUBLIC_INSTAGRAM_CLIENT_ID` - Instagram client ID
- `NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI` - Instagram callback URL
- `NEXT_PUBLIC_APP_NAME` - Application name
- `NEXT_PUBLIC_APP_URL` - Production domain

#### 3. Deploy
```powershell
# Deploy to production
vercel --prod

# Or push to main branch (if GitHub integration enabled)
git push origin main
```

### Production Checklist
- [ ] Environment variables configured
- [ ] OAuth redirect URIs updated in provider consoles
- [ ] Backend API deployed and accessible
- [ ] CORS configured on backend for frontend domain
- [ ] Database migrations applied
- [ ] Test all authentication flows
- [ ] Verify file upload functionality
- [ ] Check WebSocket connections

---

## Backend Deployment (Recommended: Railway/Render)

### Option 1: Railway

#### Steps:
1. Create account at [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select backend folder
4. Add services:
   - PostgreSQL database
   - Redis instance
5. Configure environment variables
6. Deploy

#### Required Environment Variables:
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["https://your-domain.vercel.app"]

# OAuth
GOOGLE_CLIENT_SECRET=your-google-secret
FACEBOOK_APP_SECRET=your-facebook-secret
INSTAGRAM_CLIENT_SECRET=your-instagram-secret
```

### Option 2: Render

1. Create account at [render.com](https://render.com)
2. Create new Web Service from Git
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add PostgreSQL and Redis services
6. Configure environment variables
7. Deploy

### Option 3: Heroku

```powershell
heroku login
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev
heroku config:set SECRET_KEY=your-secret-key
git subtree push --prefix backend heroku main
```

---

## OAuth Configuration

### Google Cloud Console
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `https://your-domain.vercel.app/auth/callback/google`
   - `http://localhost:3000/auth/callback/google` (for local testing)
6. Copy Client ID and Client Secret

### Facebook Developers
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create new app or select existing
3. Add Facebook Login product
4. Configure OAuth redirect URIs:
   - `https://your-domain.vercel.app/auth/callback/facebook`
   - `http://localhost:3000/auth/callback/facebook`
5. Copy App ID and App Secret

### Instagram Basic Display
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create new app (same as Facebook)
3. Add Instagram Basic Display product
4. Configure OAuth redirect URIs:
   - `https://your-domain.vercel.app/auth/callback/instagram`
   - `http://localhost:3000/auth/callback/instagram`
5. Copy Client ID and Client Secret

---

## Post-Deployment Testing

### 1. Health Check
```bash
curl https://your-domain.vercel.app
curl https://your-backend-url.com/health
```

### 2. Authentication Flow
- [ ] Register new user
- [ ] Login with credentials
- [ ] Google OAuth
- [ ] Facebook OAuth
- [ ] Instagram OAuth
- [ ] 2FA setup and verify
- [ ] Password reset
- [ ] Session management

### 3. Core Features
- [ ] File upload (image/video)
- [ ] Analysis processing
- [ ] Report generation
- [ ] WebSocket real-time updates
- [ ] Dashboard access
- [ ] Admin panel (if admin)

---

## Troubleshooting

### Build Failures
- Check Node.js version (use 18.x)
- Verify all dependencies in package.json
- Check build logs in Vercel dashboard

### OAuth Errors
- Verify redirect URIs match exactly
- Check client IDs are correct
- Ensure secrets are in backend environment

### API Connection Issues
- Verify CORS settings on backend
- Check NEXT_PUBLIC_API_URL is correct
- Ensure backend is deployed and running

### Database Issues
- Run migrations: `alembic upgrade head`
- Check DATABASE_URL format
- Verify PostgreSQL version compatibility

---

## Monitoring

### Vercel Analytics
- Enable in Project Settings
- Monitor performance and errors

### Backend Monitoring
- Set up Sentry for error tracking
- Use Railway/Render built-in logs
- Configure health check endpoints

### Uptime Monitoring
- Use UptimeRobot or similar service
- Monitor both frontend and backend

---

## Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] CORS configured for production domain only
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] OAuth redirect URIs use HTTPS
- [ ] Database connections use SSL
- [ ] Rate limiting enabled on backend
- [ ] File upload size limits configured
- [ ] Content Security Policy headers set

---

## Cost Estimation

### Vercel (Frontend)
- Free tier: Hobby plan (sufficient for testing)
- Pro: $20/month (for production with team)

### Railway (Backend)
- Free tier: $5 credit/month
- Paid: ~$5-20/month depending on usage

### Database
- Railway PostgreSQL: Included in plan
- Railway Redis: Included in plan
- Or use managed services (AWS RDS, etc.)

**Total Estimated Cost**: $0-40/month depending on tier

---

## Support

For deployment issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)
- FastAPI: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
