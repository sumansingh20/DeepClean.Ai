## Quick Deploy to Vercel

### 1. Install Vercel CLI
```powershell
npm i -g vercel
```

### 2. Login and Link
```powershell
cd frontend
vercel login
vercel link
```

### 3. Set Environment Variables
In Vercel Dashboard, add:
- `NEXT_PUBLIC_API_URL` - Your backend URL
- `NEXT_PUBLIC_WS_URL` - Your WebSocket URL
- All OAuth variables (see `.env.production.example`)

### 4. Deploy
```powershell
vercel --prod
```

**Note:** Backend needs separate deployment (Railway/Render recommended). See full `DEPLOYMENT.md` for details.
