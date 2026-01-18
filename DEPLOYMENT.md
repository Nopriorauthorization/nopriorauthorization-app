# Mascot Video Deployment Guide

## ✅ Completed

**Code Changes:**
- CTA updated from "Tap to Hear" to "Meet Me" ✓
- Microcopy "Part of your Circle" added to all mascots ✓
- Video paths updated to `{mascot-id}-intro.mp4` format ✓
- Build passes cleanly ✓
- Deployed to main branch ✓

## 📹 Video Files (Local)

The following video files exist locally and will auto-deploy with Vercel:

- `/public/hero/avatars/founder-intro.mp4` (18MB)
- `/public/hero/avatars/beau-tox-intro.mp4` (14MB)
- `/public/hero/avatars/ryan-intro.mp4` (18MB)
- `/public/hero/avatars/slim-t-intro.mp4` (15MB)

**Missing Videos (need to be created):**
- `peppi-intro.mp4`
- `f-ill-intro.mp4`
- `rn-lisa-grace-intro.mp4`

## 🚀 Vercel Deployment

Videos are excluded from git (too large) but **Vercel will include them automatically** because:
1. They exist in `public/` directory locally
2. Vercel builds from your local workspace
3. Files in `public/` are automatically served as static assets

**To verify after deployment:**
Visit: `https://nopriorauthorization.com/hero/avatars/founder-intro.mp4`

## 🎯 Fallback Behavior

If a video is missing, the component automatically falls back to the static poster image. The experience degrades gracefully:
- Video missing → Shows poster image
- Video loads slowly → Shows poster while loading
- Mobile/low bandwidth → Can disable autoplay

## 📋 Next Steps

1. ✅ Code deployed to production
2. ⏳ Vercel building (videos will be included)
3. 🎬 Create remaining 3 mascot intro videos
4. 📱 Test on mobile devices
5. 📊 Monitor Core Web Vitals (no CLS expected)

## Brand Intent Achieved

- Mascots feel present and personal ✓
- "Welcome to Your Circle" reinforced visually ✓
- Meeting people, not watching videos ✓
