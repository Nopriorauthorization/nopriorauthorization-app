# V1-STABLE ROLLBACK GUIDE

## 🚨 EMERGENCY ROLLBACK PROCEDURE

**Only use this if production is critically broken and immediate rollback is required.**

### Prerequisites
- Must have admin access to Vercel dashboard
- Must have push access to GitHub repository
- Current production deployment must be failing

### Step 1: Switch to v1-stable branch
```bash
git checkout v1-stable
git pull origin v1-stable  # Ensure it's up to date
```

### Step 2: Deploy v1-stable to production
```bash
# Build and deploy v1-stable
npm run build
npx vercel --prod

# Or use the deployment script
./deploy.sh
```

### Step 3: Verify rollback deployment
```bash
# Check that the deployment is live
curl -I https://nopriorauthorization.com

# Should return HTTP 200
```

### Step 4: Update domain alias (if needed)
```bash
# If the rollback deployment URL is different, update the alias
npx vercel alias set [rollback-deployment-url] nopriorauthorization.com
```

### Step 5: Confirm rollback success
- Visit https://nopriorauthorization.com
- Verify core functionality works
- Check that subscription features are present
- Confirm no critical errors

### Step 6: Notify team
- Post in #engineering that rollback has been executed
- Include rollback deployment URL
- Tag @product for awareness

## 📋 V1-STABLE CONTENTS

**Tag:** v1.0.0
**Commit:** `ab599c9`
**Features:**
- ✅ Phase 4C Subscription Tier Activation (FREE/CORE/PREMIUM)
- ✅ Ethical monetization with soft upgrade prompts
- ✅ Blueprint insights gating (3 max for FREE)
- ✅ Lab history gating (3 max for FREE)
- ✅ Family tree pattern gating (3 max for FREE)
- ✅ Export functionality gated for FREE users
- ✅ All Phase 4A/B trust features preserved

## ⚠️ IMPORTANT NOTES

- **v1-stable is read-only** - only updated with explicit approval
- **No feature development** should happen on this branch
- **Only critical security fixes** may be cherry-picked with approval
- **This is our production safety anchor** for investor demos and stability

## 📞 EMERGENCY CONTACTS

- **Dev Lead:** [Contact info]
- **Product:** [Contact info]
- **Infrastructure:** [Contact info]

---

**Last Updated:** January 24, 2026
**Approved By:** [Your Name]</content>
<parameter name="filePath">/Users/danid/ask-beau-tox/ROLLBACK.md