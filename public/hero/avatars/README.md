# Avatar Video Assets

## Required Video Files

Place 10-second MP4 intro videos in this directory with the following naming convention:

- `founder-intro.mp4`
- `beau-tox-intro.mp4`
- `peppi-intro.mp4`
- `f-ill-intro.mp4`
- `rn-lisa-grace-intro.mp4`
- `slim-t-intro.mp4`
- `ryan-intro.mp4`

## Video Specifications

- **Format:** MP4 (H.264)
- **Duration:** ~10 seconds
- **Target Size:** ≤ 8-10 MB per video
- **Audio:** Muted (videos autoplay silently)
- **Aspect Ratio:** Should match existing poster images

## Fallback Behavior

If a video file is missing or fails to load, the component will automatically fall back to the static poster image defined in `avatar-intros.ts`.

## Implementation

Videos are loaded via the `<video>` element with:
- `autoPlay` (when avatar is active)
- `muted` (required for autoplay)
- `loop`
- `playsInline`
- `preload="metadata"`
- `poster` (fallback image)

## Brand Intent

These videos should feel:
- Present and personal
- Calm and trust-building
- Like meeting someone, not watching a video
- Part of the user's Circle
