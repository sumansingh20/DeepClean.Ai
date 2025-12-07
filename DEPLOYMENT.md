# Deployment Guide - DeepClean.AI

## Local Development Deployment

### Quick Start

Run the deployment script:
```powershell
.\DEPLOY.ps1
```

This will:
- Check and free up ports 3000 and 8001
- Start backend on http://localhost:8001
- Start frontend on http://localhost:3000
- Open separate windows for each service

### Manual Deployment

**Backend:**
```powershell
cd backend
python main_api.py
```

**Frontend:**
```powershell
cd frontend
npm run dev
```

### Stop Servers

```powershell
.\STOP.ps1
```

## Production Deployment

### Requirements

- Python 3.9+
- Node.js 18+
- 2GB RAM minimum
- Domain name (optional)
- SSL certificate (recommended)

### Backend Production

1. Set environment variables:
```powershell
$env:JWT_SECRET = "your-secure-secret-key-min-32-chars"
$env:ALLOWED_ORIGINS = "https://yourdomain.com"
```

2. Install dependencies:
```powershell
cd backend
pip install -r requirements.txt
```

3. Run with production server:
```powershell
uvicorn main_api:app --host 0.0.0.0 --port 8001 --workers 4
```

### Frontend Production

1. Build for production:
```powershell
cd frontend
npm install
npm run build
```

2. Start production server:
```powershell
npm start
```

Or use PM2:
```powershell
npm install -g pm2
pm2 start npm --name "deepclean-frontend" -- start
```

### Docker Deployment

```powershell
docker-compose up -d
```

### Cloud Deployment Options

**Vercel (Frontend):**
- Connect your GitHub repo
- Vercel will auto-detect Next.js
- Add environment variables in dashboard

**Railway/Render (Backend):**
- Connect GitHub repo
- Set build command: `pip install -r requirements.txt`
- Set start command: `uvicorn main_api:app --host 0.0.0.0 --port $PORT`

**AWS/Azure/Google Cloud:**
- Use containerization with Docker
- Set up load balancers
- Configure auto-scaling

## Security Checklist

Before production:
- [ ] Change JWT secret key
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Use strong passwords
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Add logging

## Access Points

**Local:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8001
- API Docs: http://localhost:8001/docs

**Test Accounts:**
- Admin: `admin@deepclean.ai` / `admin123`
- User: `suman@deepclean.ai` / `suman123`

## Monitoring

Check server status:
```powershell
Get-Process python,node
```

Check logs:
```powershell
# Backend logs in terminal
# Frontend logs in browser console
```

## Troubleshooting

**Port already in use:**
```powershell
.\STOP.ps1
.\DEPLOY.ps1
```

**Backend won't start:**
- Check Python version: `python --version`
- Reinstall dependencies: `pip install -r requirements.txt`
- Check port 8001 is free

**Frontend won't start:**
- Delete node_modules: `Remove-Item -Recurse node_modules`
- Reinstall: `npm install`
- Check port 3000 is free

## Support

For deployment issues:
- Check logs in terminal windows
- Verify all dependencies installed
- Ensure ports 3000 and 8001 are available
- Contact: suman@deepclean.ai
