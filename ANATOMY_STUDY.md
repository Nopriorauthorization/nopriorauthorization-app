# Anatomy study tool — content management

This document describes how **A&P study hub** content is stored and how to change it safely.

## Where content lives

| Area | Path |
|------|------|
| Course data (lectures, cheat sheets, quizzes, flashcards) | `src/lib/study/anatomy-data.ts` |
| Shop slug, price display, access cookie | `src/config/anatomy-study.config.ts` |
| UI | `src/components/study/AnatomyStudyHub.tsx`, `AnatomyLanding.tsx` |
| Purchase / access APIs | `src/app/api/anatomy-study/`, `src/app/api/study/access/` |

The app imports **`anatomyCourse`** from `anatomy-data.ts` (see `AnatomyStudyHub.tsx` / `AnatomyLanding.tsx`). That file must stay **valid TypeScript** (object literals with trailing commas where needed). A malformed splice (for example closing `flashcards` with `]` too early) will break `next build` / Vercel.

## Lectures 4–12: JSON patches + apply script

Structured blocks for **lec4** through **lec12** are maintained as JSON and spliced into `anatomy-data.ts`:

1. **Edit** the patch file: `scripts/anatomy_patches/<lec_id>.json`  
   Each file should define **`cheatSheet`**, **`quiz`**, and **`flashcards`** arrays (same shape as the objects already in `anatomy-data.ts` for those lectures).

2. **Line ranges** are defined in `scripts/anatomy_patch_content.py` in **`RANGES`**: each tuple is `(lec_id, start_line, end_line)` using **1-based** line numbers in `anatomy-data.ts`. The range must cover **only** the three keys `cheatSheet`, `quiz`, and `flashcards` for that lecture (not the lecture’s opening `{ "id": ...` metadata).

3. **Apply** patches from the repo root:

   ```bash
   python3 scripts/apply_anatomy_lc4_12.py
   ```

   The script replaces each range bottom-up so earlier line numbers stay valid while you work.

4. **After manual edits** to `anatomy-data.ts` (adding/removing lines above a lecture), **update `RANGES`** before running the apply script again, or the wrong slice will be overwritten.

## Lectures 1–3 and full-file generation

`scripts/generate-anatomy-data.mjs` is the historical generator for early lectures and can be used when intentionally **regenerating** the large `anatomy-data.ts` module. If you use it, reconcile with the **lec4–12** patch workflow so you do not wipe patched content unless that is intended.

## Verification

Before pushing:

```bash
npm run build
```

Or a quick parse check:

```bash
npx tsc --noEmit --skipLibCheck src/lib/study/anatomy-data.ts
```

## HTML in cheat sheets

`cheatSheet[].content` is **HTML string** content rendered in the UI. Prefer the same patterns as existing entries (`<p>`, `<strong>`, `<ul>`, etc.) for consistent styling.
