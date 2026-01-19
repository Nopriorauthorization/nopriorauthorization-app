# Production Environment Variables Setup

## Required Environment Variables for Vercel Deployment

### 1. Database (Supabase)
```bash
DATABASE_URL=postgresql://postgres.afjowaoukxcrwekvhbik:Alcaladani0912@aws-0-us-west-2.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres:Alcaladani0912@db.afjowaoukxcrwekvhbik.supabase.co:5432/postgres
```

### 2. NextAuth (Required)
```bash
# CRITICAL: Generate a new secret for production
NEXTAUTH_SECRET=<generate using: openssl rand -base64 32>

# Production URL
NEXTAUTH_URL=https://nopriorauthorization.com
```

### 3. Google Calendar (Optional - if using calendar integration)
```bash
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## How to Add to Vercel

### Option 1: Vercel Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - Variable name: `NEXTAUTH_SECRET`
   - Value: `<paste generated secret>`
   - Environment: Production, Preview, Development
   - Click **Save**

### Option 2: Vercel CLI
```bash
# Install Vercel CLI (if not already)
npm i -g vercel

# Set production environment variables
vercel env add NEXTAUTH_SECRET production
# Paste: <generated secret>

vercel env add NEXTAUTH_URL production
# Paste: https://nopriorauthorization.com

vercel env add DATABASE_URL production
# Paste: <database URL>

vercel env add DIRECT_URL production
# Paste: <direct URL>

# Redeploy to apply changes
vercel --prod
```

## Current Errors & Fixes

### Error 1: NO_SECRET
```
[next-auth][error][NO_SECRET] Please define a `secret` in production.
```

**Fix**: Add `NEXTAUTH_SECRET` to Vercel environment variables

### Error 2: Server Configuration
```
Error: There is a problem with the server configuration
```

**Likely causes**:
1. Missing `NEXTAUTH_SECRET` (primary cause)
2. Database connection issues
3. Missing environment variables

## Quick Fix Steps

1. **Generate production secret**:
   ```bash
   openssl rand -base64 32
   ```
   Example output: `Ea/ywTG171Nq9plazDM8uTMtScmGS7LwlMjgPuKby5A=`

2. **Add to Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `NEXTAUTH_SECRET` with the generated value
   - Add `NEXTAUTH_URL` = `https://nopriorauthorization.com`

3. **Redeploy**:
   - Vercel will automatically redeploy when you save environment variables
   - OR manually trigger: `vercel --prod`

## Verification

After adding environment variables and redeploying:

1. Check logs in Vercel Dashboard → Deployments → [Latest] → Runtime Logs
2. Visit https://nopriorauthorization.com/api/auth/session
3. Should return `{}` instead of 500 error
4. Visit https://nopriorauthorization.com/vault
5. Should redirect to login (not 500 error)

## Security Notes

- **NEVER commit** `.env` files to git
- Use **different secrets** for production vs development
- Rotate secrets periodically
- Use Vercel's encrypted environment variables storage

## Optional: Google Calendar Setup

If enabling calendar integration:

1. Go to https://console.cloud.google.com
2. Create project or select existing
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://nopriorauthorization.com/api/vault/calendar/callback`
6. Copy Client ID and Client Secret to Vercel environment variables
