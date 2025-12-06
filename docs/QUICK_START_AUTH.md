# 🚀 Quick Start Guide - Authentication System

## For End Users

### 1️⃣ Create Your Account (3 ways)

**Option A: Email Registration**
```
📧 Visit: http://localhost:3003/register
1. Enter your email
2. Choose a username
3. Create a strong password (watch the strength meter!)
4. Accept terms
5. Click "Register"
```

**Option B: Social Login (OAuth)**
```
🔵 Google / ⚫ GitHub / 🟦 Microsoft
1. Click any social login button
2. Authorize with your account
3. Instant access - no password needed!
```

**Option C: Quick Demo**
```
🎯 For testing only:
Email: demo@example.com
Password: Demo123!@#
```

---

### 2️⃣ Enable Two-Factor Authentication

```
🛡️ Visit: http://localhost:3003/two-factor

Step 1: Download Authenticator App
   - Google Authenticator (iOS/Android)
   - Authy (Multi-device)
   - Microsoft Authenticator

Step 2: Scan QR Code
   - Open your app
   - Scan the displayed QR code
   - Or enter the manual code

Step 3: Verify
   - Enter the 6-digit code
   - Save your backup codes!

✅ Done! Your account is now super secure.
```

---

### 3️⃣ Manage Your Sessions

```
📱 Visit: http://localhost:3003/sessions

See all devices where you're logged in:
- 💻 Desktop (Windows, Chrome)
- 📱 Mobile (iOS, Safari)
- 📲 Tablet (iPad, Firefox)

Security Actions:
- "End Session" - Log out a specific device
- "End All Other Sessions" - Keep only current device
- Review IP addresses and locations
```

---

### 4️⃣ Reset Your Password

```
🔒 Forgot Password?

1. Click "Forgot Password?" on login page
2. Enter your email
3. Check your inbox for reset link
4. Click link (valid for 1 hour)
5. Create new password
6. See strength meter - aim for "Strong" or better
7. Submit and login!
```

---

## For Developers

### Backend Setup (Required)

**1. Start PostgreSQL & Redis**
```powershell
cd d:\Deepfake
docker-compose up -d postgres redis
```

**2. Install Python Dependencies**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install pyotp qrcode pillow twilio python-jose
```

**3. Configure Environment Variables**
```powershell
# Create backend\.env file
DATABASE_URL=postgresql://deepfake_user:deepfake_pass@localhost:5432/deepfake_db
REDIS_URL=redis://localhost:6379
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_secret

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

**4. Run Database Migrations**
```powershell
cd backend
alembic upgrade head
```

**5. Start Backend API**
```powershell
cd backend
python main_api.py
# or
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

**6. Start Frontend**
```powershell
cd frontend
npm install  # if first time
npm run dev
```

---

### Testing the Features

**Test Password Strength**
```typescript
// In register page, try these passwords:
"weak"           → 🔴 Weak (0/4 score)
"Password1"      → 🟠 Fair (2/4 score)
"Password1!"     → 🟡 Good (3/4 score)
"P@ssw0rd!2024"  → 🟢 Strong (4/4 score)
"MyS3cur3P@ss!"  → 🟢 Very Strong (5/4 score)

// Try known breached password:
"password123"    → ⚠️ "Found in data breach" warning
```

**Test 2FA Flow**
```bash
1. Login → Enable 2FA → Scan QR
2. Logout
3. Login again → See 2FA prompt
4. Enter code from authenticator app
5. Access granted!
```

**Test Session Management**
```bash
1. Login on multiple browsers
2. Check /sessions page
3. See all active sessions
4. End one session
5. That browser gets logged out
```

**Test OAuth (Requires Setup)**
```bash
1. Register OAuth app with Google/GitHub
2. Add credentials to .env
3. Restart backend
4. Click OAuth button on login page
5. Authorize and auto-login
```

---

### API Integration Examples

**Login with 2FA**
```typescript
// POST /api/v1/auth/login
const response = await fetch('http://localhost:8001/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!',
    two_factor_code: '123456',  // If 2FA enabled
    device_info: {
      browser: 'Chrome',
      os: 'Windows',
      deviceType: 'desktop'
    },
    remember_device: true
  })
});

const data = await response.json();
// Returns: { access_token, user, requires_2fa }
```

**Enable 2FA**
```typescript
// POST /api/v1/auth/2fa/setup
const response = await fetch('http://localhost:8001/api/v1/auth/2fa/setup', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
// Returns: { secret, qrCode, backupCodes }
```

**List Active Sessions**
```typescript
// GET /api/v1/auth/sessions
const response = await fetch('http://localhost:8001/api/v1/auth/sessions', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const sessions = await response.json();
// Returns: Array of DeviceSession objects
```

---

### Troubleshooting

**Problem: "Connection failed" on login**
```bash
✓ Check backend is running: http://localhost:8001
✓ Check frontend is running: http://localhost:3003
✓ Check database is running: docker ps
✓ Check CORS is enabled in backend
```

**Problem: "2FA QR code not showing"**
```bash
✓ Install backend dependencies: pip install pyotp qrcode pillow
✓ Restart backend server
✓ Check browser console for errors
```

**Problem: "OAuth not working"**
```bash
✓ Register OAuth app with provider
✓ Add client_id and client_secret to .env
✓ Set redirect URI: http://localhost:8001/api/v1/auth/oauth/{provider}/callback
✓ Restart backend
```

**Problem: "Sessions not showing"**
```bash
✓ Check Redis is running: docker ps
✓ Check Redis connection in backend logs
✓ Login multiple times to create sessions
```

---

### Security Checklist

**Production Deployment:**
- [ ] Change JWT_SECRET_KEY to random 256-bit key
- [ ] Enable HTTPS (SSL/TLS certificates)
- [ ] Configure CORS whitelist properly
- [ ] Enable rate limiting (5 req/min per IP)
- [ ] Set secure cookie flags (HttpOnly, Secure, SameSite)
- [ ] Implement IP-based blocking for brute force
- [ ] Enable database encryption at rest
- [ ] Configure backup strategy
- [ ] Set up monitoring and alerts
- [ ] Enable audit logging
- [ ] Configure session timeout (24 hours)
- [ ] Test 2FA recovery flow
- [ ] Set up email notifications for security events
- [ ] Review OAuth scopes and permissions
- [ ] Enable CSP headers
- [ ] Configure WAF rules

---

## 📊 System Status

**Frontend**: http://localhost:3003 ✅ Running
**Backend**: http://localhost:8001 ⚠️ Needs to be started
**Database**: PostgreSQL on 5432 ⚠️ Check docker-compose
**Cache**: Redis on 6379 ⚠️ Check docker-compose

---

## 🎯 Feature Checklist

✅ Email/Password Registration
✅ Social Login (OAuth)
✅ Password Strength Meter
✅ Breach Detection (HaveIBeenPwned)
✅ Two-Factor Authentication (TOTP)
✅ Backup Codes
✅ Session Management
✅ Device Tracking
✅ Remote Logout
✅ Password Reset
✅ Email Verification
✅ Activity History
✅ Remember Device
✅ Security Settings
✅ Modern UI/UX

---

## 📞 Quick Links

- **Login**: http://localhost:3003/login
- **Register**: http://localhost:3003/register
- **2FA Setup**: http://localhost:3003/two-factor
- **Sessions**: http://localhost:3003/sessions
- **Settings**: http://localhost:3003/settings
- **Activity**: http://localhost:3003/activity
- **API Docs**: http://localhost:8001/docs
- **Documentation**: d:\Deepfake\docs\AUTHENTICATION_SYSTEM.md

---

## 💡 Pro Tips

1. **Use a Password Manager**: LastPass, 1Password, or Bitwarden
2. **Enable 2FA Immediately**: Don't wait until after a breach
3. **Review Sessions Weekly**: Check for unknown devices
4. **Use Strong Passwords**: Aim for "Very Strong" rating
5. **Don't Reuse Passwords**: Each site should have unique password
6. **Save Backup Codes**: Print them or store in password manager
7. **Log Out Public Devices**: Always end sessions on shared computers
8. **Update Recovery Email**: Keep it current for password resets

---

**Status**: ✅ All features implemented and ready for testing!
**Next Step**: Start backend server and test the complete flow.
