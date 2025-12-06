# OAuth Setup Guide

## Overview
TruthGuard supports OAuth authentication with Google, GitHub, and Microsoft. This allows users to sign in using their existing accounts.

## Development Mode
Currently, the OAuth buttons are configured for development/testing. They will redirect to OAuth callback pages, but require OAuth credentials to work fully.

## Production Setup

### 1. Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Add authorized redirect URI: `http://localhost:3003/auth/callback/google`
6. Copy the Client ID and Client Secret

**Environment Variables:**
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 2. GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in details:
   - Application name: TruthGuard
   - Homepage URL: `http://localhost:3003`
   - Authorization callback URL: `http://localhost:3003/auth/callback/github`
4. Copy the Client ID and generate a Client Secret

**Environment Variables:**
```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 3. Microsoft OAuth

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Click "New registration"
4. Add redirect URI: `http://localhost:3003/auth/callback/microsoft`
5. Go to "Certificates & secrets" → Create new client secret
6. Copy the Application (client) ID and secret value

**Environment Variables:**
```env
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
```

## Backend Configuration

Add the environment variables to `backend/.env`:

```env
# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
```

## Frontend Configuration

The frontend is pre-configured to use the OAuth endpoints. No additional setup needed.

## Testing OAuth

1. Start both backend and frontend servers
2. Go to login or register page
3. Click on any OAuth provider button
4. You'll be redirected to the provider's login page
5. After authentication, you'll be redirected back to the callback page
6. The callback page will process the token and redirect to dashboard

## Current Status

✅ OAuth UI implemented  
✅ OAuth endpoints created  
✅ Callback pages configured  
⚠️  OAuth credentials need to be added (development/production)  
⚠️  Full OAuth flow requires valid API keys

## Notes

- For production, update redirect URIs to your production domain
- Keep OAuth secrets secure and never commit them to version control
- Consider using environment-specific .env files
- Test OAuth flow thoroughly before deploying to production
