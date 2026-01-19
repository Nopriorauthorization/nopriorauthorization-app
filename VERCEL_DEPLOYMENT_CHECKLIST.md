# ✅ Vercel Production Deployment Checklist

## Copy these EXACT values to Vercel Environment Variables

Go to: **https://vercel.com/dashboard → Your Project → Settings → Environment Variables**

### CRITICAL (Required for app to work)

```bash
# 1. NextAuth Secret (GENERATE NEW - DO NOT USE LOCAL VALUE)
NEXTAUTH_SECRET=<paste output from: openssl rand -base64 32>

# 2. NextAuth URL (Production domain)
NEXTAUTH_URL=https://nopriorauthorization.com

# 3. Database Connection (Supabase)
DATABASE_URL=postgresql://postgres.afjowaoukxcrwekvhbik:Alcaladani0912@aws-0-us-west-2.pooler.supabase.com:5432/postgres

# 4. Direct Database URL (Supabase)
DIRECT_URL=postgresql://postgres:Alcaladani0912@db.afjowaoukxcrwekvhbik.supabase.co:5432/postgres
```

### OPTIONAL (Chat/AI features)

```bash
# OpenAI API (for chat features)
OPENAI_API_KEY=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
```

### OPTIONAL (Payments - if using subscriptions)

```bash
# Stripe (leave empty if not using)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### OPTIONAL (Google Calendar Integration)

```bash
# Only if you've set up Google Calendar OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

---

## Step-by-Step Vercel Setup

### Method 1: Vercel Dashboard (Easiest)

1. **Go to Vercel**: https://vercel.com/dashboard
2. **Select your project** (ask-beau-tox or nopriorauthorization)
3. Click **Settings** tab
4. Click **Environment Variables** in left sidebar
5. For EACH variable above:
   - Click **Add New**
   - Name: `NEXTAUTH_SECRET`
   - Value: `<paste generated secret>`
   - Environments: Check **Production**, **Preview**, **Development**
   - Click **Save**
6. **Repeat for all variables**
7. Vercel will **automatically redeploy** when you save

### Method 2: Vercel CLI

```bash
# Generate production secret first
openssl rand -base64 32
# Copy the output

# Set variables
vercel env add NEXTAUTH_SECRET production
# Paste the secret when prompted

vercel env add NEXTAUTH_URL production
# Paste: https://nopriorauthorization.com

vercel env add DATABASE_URL production
# Paste the database URL

vercel env add DIRECT_URL production
# Paste the direct URL

vercel env add OPENAI_API_KEY production
# Paste the OpenAI key

# Redeploy
vercel --prod
```

---

## Current Production Errors

### ❌ Error 1: NO_SECRET
```
[next-auth][error][NO_SECRET] Please define a `secret` in production.
```
**Status**: Missing `NEXTAUTH_SECRET` in Vercel  
**Fix**: Add `NEXTAUTH_SECRET` environment variable

### ❌ Error 2: Server Configuration
```
Error: There is a problem with the server configuration
```
**Status**: Cascading from missing NEXTAUTH_SECRET  
**Fix**: Add `NEXTAUTH_SECRET` + `NEXTAUTH_URL`

---

## Generate Production Secret

**Run this command** and copy the output:

```bash
openssl rand -base64 32
```

Example output (DO NOT use this - generate your own):
```
nqOtBZTmg6gxxlPASkJu58IClO5Z0kUBSk6mB5VD694=
```

---

## Verification Steps

After adding environment variables:

1. **Wait 1-2 minutes** for Vercel to redeploy
2. **Check deployment logs**:
   - Go to Vercel Dashboard → Deployments → [Latest]
   - Click on deployment → Runtime Logs tab
   - Should NOT see `NO_SECRET` error

3. **Test endpoints**:
   ```bash
   # Should return empty session (not 500)
   curl https://nopriorauthorization.com/api/auth/session
   
   # Should redirect to login (not 500)
   curl -I https://nopriorauthorization.com/vault
   ```

4. **Test full app**:
   - Visit https://nopriorauthorization.com
   - Click "Login"
   - Should see login form (not error page)

---

## Security Best Practices

✅ **DO:**
- Generate a **new** `NEXTAUTH_SECRET` for production (don't reuse local)
- Use different secrets for Production, Preview, Development
- Keep `.env` files in `.gitignore`
- Rotate secrets periodically

❌ **DON'T:**
- Commit `.env` files to git
- Share secrets in plaintext
- Use same secret across environments
- Expose secrets in client-side code

---

## Troubleshooting

### Still seeing NO_SECRET error?
1. Verify variable name is exactly `NEXTAUTH_SECRET` (case-sensitive)
2. Check it's applied to **Production** environment
3. Trigger manual redeploy: `vercel --prod`
4. Clear Vercel cache: Settings → General → Clear Cache

### Database connection errors?
1. Verify `DATABASE_URL` and `DIRECT_URL` are set
2. Check Supabase database is running
3. Verify IP allowlist in Supabase (Vercel uses dynamic IPs - should allow all)

### Google Calendar not working?
1. Only needed if users want calendar integration
2. Safe to skip - app works without it
3. Users will see "Connect Calendar" option but can't use it

---

## Quick Reference

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXTAUTH_SECRET` | ✅ YES | Auth encryption |
| `NEXTAUTH_URL` | ✅ YES | Production domain |
| `DATABASE_URL` | ✅ YES | Supabase connection |
| `DIRECT_URL` | ✅ YES | Direct DB access |
| `OPENAI_API_KEY` | ⚠️ OPTIONAL | Chat features |
| `GOOGLE_CLIENT_ID` | ⚠️ OPTIONAL | Calendar sync |
| `GOOGLE_CLIENT_SECRET` | ⚠️ OPTIONAL | Calendar sync |
| `STRIPE_*` | ⚠️ OPTIONAL | Payments |

---

## After Deployment

Once all variables are set and redeployed:

1. ✅ No more `NO_SECRET` errors
2. ✅ `/api/auth/session` returns `{}`
3. ✅ `/vault` redirects to login
4. ✅ Login/signup works
5. ✅ Users can access their vault

**Current Status**: 🔴 Missing `NEXTAUTH_SECRET` → Add it to fix all 500 errors
