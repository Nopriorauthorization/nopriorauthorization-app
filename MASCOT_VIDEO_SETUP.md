# 🎬 Mascot Video Setup Guide

## Where to Put Your Video Files

Your `.mp4` mascot intro videos need to be placed in:
```
/public/hero/avatars/
```

## File Naming Convention

Each video must be named: `{mascot-id}-intro.mp4`

Based on your mascots, you need these files:

1. `founder-intro.mp4` - Founder intro
2. `beau-tox-intro.mp4` - Beau-Tox intro (main mascot)
3. `peppi-intro.mp4` - Peppi intro
4. `f-ill-intro.mp4` - Grace (F-ill) intro
5. `rn-lisa-grace-intro.mp4` - Harmony intro
6. `slim-t-intro.mp4` - Slim-T intro
7. `ryan-intro.mp4` - Ryan intro

## Steps to Upload

### Option 1: Copy from Desktop
```bash
# From your project root
mkdir -p public/hero/avatars

# Copy your videos from desktop (adjust path as needed)
cp ~/Desktop/beau-tox-intro.mp4 public/hero/avatars/
cp ~/Desktop/founder-intro.mp4 public/hero/avatars/
# ... repeat for each mascot
```

### Option 2: Drag & Drop in VS Code
1. Create the folder: `public/hero/avatars/`
2. Drag your `.mp4` files from Desktop into that folder
3. Rename them to match the naming convention above

## How It Works Now

### Main Page (Hero Section)
- Visit `/` to see the avatar carousel
- Click any avatar card to activate it
- Click "Hear Me" button to unmute and play the intro
- Videos auto-rotate every 7 seconds

### Chat Page (Full Intro Experience)
- When user clicks "Ask [Mascot]" button
- They're taken to `/chat?mascot={id}`
- **Full-screen intro video plays automatically**
- After intro finishes (or user skips), chat interface appears
- Mascot avatar loops in header

## Video Specifications

**Recommended:**
- Duration: 10-30 seconds (keep it punchy!)
- Resolution: 1920x1080 or 1280x720
- Format: MP4 (H.264 codec)
- File size: Keep under 5MB for fast loading

**Fallback:**
- If video fails to load, poster image displays
- Poster images are in `/public/characters/`

## Testing

1. **Test on main page:**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   # Scroll to "Meet the Experts" section
   # Click "Hear Me" on Beau-Tox
   ```

2. **Test chat intro:**
   ```bash
   # Visit http://localhost:3000/chat?mascot=beau-tox
   # Intro should auto-play full-screen
   ```

## Current File Locations

Your videos from Desktop need to move here:
```
Desktop/beau-tox-intro.mp4      → public/hero/avatars/beau-tox-intro.mp4
Desktop/founder-intro.mp4        → public/hero/avatars/founder-intro.mp4
Desktop/peppi-intro.mp4          → public/hero/avatars/peppi-intro.mp4
Desktop/grace-intro.mp4          → public/hero/avatars/f-ill-intro.mp4
Desktop/harmony-intro.mp4        → public/hero/avatars/rn-lisa-grace-intro.mp4
Desktop/slim-t-intro.mp4         → public/hero/avatars/slim-t-intro.mp4
Desktop/ryan-intro.mp4           → public/hero/avatars/ryan-intro.mp4
```

## Troubleshooting

**Video won't play?**
- Check file exists at correct path
- Check filename matches exactly (case-sensitive)
- Check browser console for errors
- Try opening video URL directly: `http://localhost:3000/hero/avatars/beau-tox-intro.mp4`

**Autoplay blocked?**
- Some browsers block autoplay with sound
- Videos will still show "Hear Me" button
- User can click to unmute and play

**Video too large?**
- Compress using: `ffmpeg -i input.mp4 -vcodec h264 -acodec aac -b:v 2M output.mp4`
- Or use online compressor: handbrake.fr

## Next Steps

After videos are uploaded:
1. Test each mascot intro on main page
2. Test chat page with each mascot
3. Verify videos play smoothly on mobile
4. Optional: Add captions/subtitles for accessibility
