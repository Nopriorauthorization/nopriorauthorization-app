No Prior Authorization — Hero Avatar System (V1)
Overview

The Hero Avatar System introduces users to the experts behind No Prior Authorization the moment they land on the app.

Each avatar represents a distinct domain authority and delivers a short, high-impact introduction designed to build trust, signal credibility, and differentiate the product from generic medical or AI tools.

This system is intentionally designed to be:

Media-swap friendly

Scalable for future avatars

Safe for medical/legal constraints

Compatible with V2 interactive avatars

Product Goal

“We tell you the juicy stuff you don’t want to ask providers — and what Google won’t.”

The Hero is not decorative.
It is a conversion and positioning mechanism.

Hero Experience (V1)
On Page Load

Hero headline renders
NO PRIOR AUTHORIZATION

Tagline fades in
We tell you the juicy stuff you don’t want to ask providers — and what Google won’t.

Avatar strip appears with muted autoplay

Avatar Behavior Rules

Muted autoplay on load (no sound without user action)

Subtitles ON by default

Tap / click toggles audio

Only one avatar speaks at a time

Idle loop animation after intro finishes

Clear CTA below each avatar: “Ask [Name]”

User can scroll or skip immediately

Avatar Lineup (V1)
Order	Avatar	Role
1	Founder	Product authority & trust anchor
2	Beau-Tox	Aesthetics truth teller
3	Peppi	Peptide science & myth-busting
4	F-ILL	Fillers & facial anatomy
5	RN Lisa Grace	Safety & ethics
6	Slim-T	Hormones & metabolism
7	Ryan	Provider reality translator
File Structure (Required)

All hero avatar media must live here:

/public/hero/avatars/
  founder.mp4
  beau-tox.mp4
  peppi.mp4
  f-ill.mp4
  rn-lisa-grace.mp4
  slim-t.mp4
  ryan.mp4


Optional (recommended for performance):
/public/hero/avatars/
  founder.webm
  beau-tox.webm
  ...⚠️ Do not hard-code paths inside components.
Media must be swappable by filename only.

Subtitle Strategy (V1)

Subtitles are rendered in UI, not burned into video

Default state: ON

Style:

White text

Hot pink emphasis where applicable

High contrast for accessibility

Subtitles should map directly to approved hero scripts

Future-proofed for:

Script updates

A/B testing

Localization

Approved Hero Scripts (Source of Truth)

Scripts are maintained separately and should be treated as authoritative copy.

No improvisation, paraphrasing, or shortening without approval.

Data Structure Example

Each avatar intro should be configurable via data:

{
  "id": "beau-tox",
  "displayName": "Beau-Tox",
  "videoSrc": "/hero/avatars/beau-tox.mp4",
  "subtitle": "I say what injectors think… but won’t say to your face.",
  "cta": "Ask Beau-Tox",
  "domain": "aesthetics"
}

Accessibility Requirements

Keyboard navigable

Captions always available

No autoplay audio

Clear focus states

Mobile-first interaction support

Performance Notes

Prefer WebM with MP4 fallback

Lazy load avatar media

Avoid blocking main thread

No large JS animation libraries for V1

V2 Forward Compatibility (Do Not Break)

This system will later support:

Interactive talking avatars

Live voice responses

Domain-based routing from Hero

Personalization

Design decisions in V1 should not prevent:

Replacing video with canvas / WebGL

Triggering avatars programmatically

Reusing avatars in-app

What This Is NOT

Not a marketing gimmick

Not a looping cartoon

Not a generic chatbot intro

Not a medical advice system

This is an expert-led trust interface.

Implementation Status

Media: Placeholder approved for V1

Scripts: Finalized

Interaction model: Approved

Drop-in replacement of final videos: Required

Questions or Changes

All changes to:

Scripts

Order

Tone

Avatar roles

Must be approved before implementation.

End of README
