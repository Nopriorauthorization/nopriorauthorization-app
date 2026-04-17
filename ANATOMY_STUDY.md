# A&P Study Tool — Content Management Guide

**No Prior Authorization · Internal Documentation**  
Last updated: April 2026

---

## What This Is

The Anatomy & Physiology Study Tool is a gated study product on nopriorauthorization.com.
It lives at `/nursing-study/anatomy` and is sold for $39 via the existing Square checkout flow.

**What's inside:**
- 12 lectures of A&P content
- 20 quiz questions per lecture (240 total)
- 20 flashcards per lecture (240 total)
- Cheat sheets per lecture
- Progress saved to Supabase via login
- Access gated by httpOnly cookie set after Square purchase + activation

---

## The Content File

All study content lives in one file:

```
src/lib/study/anatomy-data.ts
```

This file is **very large (4,000+ lines; exact length changes with updates)**.

**Lectures 4–12:** do not edit the `cheatSheet` / `quiz` / `flashcards` blocks in TypeScript by hand — use the JSON patch files and the Python apply script below (avoids splice errors and broken builds).

**Lectures 1–3:** those blocks live only in `anatomy-data.ts` (not in `scripts/anatomy_patches/`). Edit them directly in the TS file when needed.

---

## The Python Pipeline

### What It Does

The pipeline lets you update any lecture's content (quiz questions, flashcards,
cheat sheet) by editing a small JSON file and running one command.  
The TypeScript file updates automatically. No risk of breaking other lectures.

### The Three Files

| File | What It Is | Do You Edit It? |
|------|-----------|-----------------|
| `scripts/anatomy_patches/lec4.json` … `lec12.json` | Your content — quiz, flashcards, cheat sheet per lecture | ✅ YES — this is the only thing you edit |
| `scripts/anatomy_patch_content.py` | Knows where each lecture lives in the TS file (line numbers) | Only if adding a NEW lecture or if line ranges drift |
| `scripts/apply_anatomy_lc4_12.py` | The engine that applies patches | ❌ Never |

### Lectures Covered

| File | Lecture |
|------|---------|
| `lec4.json` | Histology: Epithelial & Connective Tissues |
| `lec5.json` | Integumentary System |
| `lec6.json` | Skeletal System & Bone Physiology |
| `lec7.json` | Joints & Articulations |
| `lec8.json` | Muscular System I (Fiber Anatomy, Sarcomere, NMJ) |
| `lec9.json` | Muscular System II (Contraction, ATP, Fiber Types) |
| `lec10.json` | Introduction to the Nervous System |
| `lec11.json` | Spinal Cord & Spinal Nerves |
| `lec12.json` | The Brain & Cranial Nerves |

> **Note:** Lectures 1–3 are hardcoded directly in `anatomy-data.ts` and are not
> managed by the pipeline. Edit them directly in the TS file if needed.

---

## How to Update Content

### Step 1 — Edit the JSON file for the lecture you want to change

Open the relevant file in Cursor. For example, to fix a question in Lecture 6:

```
scripts/anatomy_patches/lec6.json
```

The JSON has three sections:

```json
{
  "cheatSheet": [ ... ],
  "quiz": [ ... ],
  "flashcards": [ ... ]
}
```

#### Quiz question format:
```json
{
  "question": "Your question text here?",
  "options": [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ],
  "correctIndex": 1,
  "explanation": "Explanation shown after the student answers."
}
```
> `correctIndex` is 0-based. 0 = Option A, 1 = Option B, 2 = Option C, 3 = Option D.

#### Flashcard format:
```json
{
  "term": "The term or concept",
  "definition": "The definition shown when the card is flipped."
}
```

#### Cheat sheet section format:
```json
{
  "title": "Section heading",
  "color": "pink",
  "content": "<p>HTML content here. Can use <strong>bold</strong> and <ul><li>lists</li></ul>.</p>"
}
```

Available colors: `pink` · `teal` · `coral` · `amber` · `green` · `purple`

---

### Step 2 — Run the pipeline

From your repo root in the terminal:

```bash
python3 scripts/apply_anatomy_lc4_12.py
```

This reads all the JSON files and splices the content into `anatomy-data.ts` automatically.

---

### Step 3 — Check for errors

```bash
npx tsc --noEmit --skipLibCheck src/lib/study/anatomy-data.ts
```

If you see no output, you're good. If you see errors, something in your JSON
is malformed (usually a missing quote or comma).

---

### Step 4 — Commit and push

```bash
git add src/lib/study/anatomy-data.ts
git add scripts/anatomy_patches/
git commit -m "content: update [lecture name] — [brief description of what changed]"
git push origin main
```

Vercel will auto-deploy when you push to main.

---

## Common Tasks

### Fix a wrong answer on a quiz question

1. Open the relevant `scripts/anatomy_patches/lecX.json`
2. Find the question — search for a word from the question text
3. Change the `correctIndex` to the correct number (0, 1, 2, or 3)
4. Run the pipeline (Step 2 above)
5. Validate, commit, push

### Fix a typo in a flashcard

1. Open the relevant `scripts/anatomy_patches/lecX.json`
2. Find the flashcard by its `term`
3. Edit the `definition`
4. Run the pipeline, validate, commit, push

### Add a new question to a lecture

1. Open the relevant JSON file
2. Add a new question object to the `quiz` array
3. Make sure it follows the format above exactly
4. Run the pipeline, validate, commit, push
5. Note: each lecture should have exactly 20 questions for the progress bar to display correctly

### Update a cheat sheet section

1. Open the relevant JSON file
2. Find the section by its `title`
3. Edit the `content` (HTML string)
4. Run the pipeline, validate, commit, push

---

## Adding a New Lecture (Lecture 13+)

This requires one extra step — you need to update the line ranges in
`scripts/anatomy_patch_content.py`.

1. Add the new lecture to `src/lib/study/anatomy-data.ts` manually
   (copy the structure from an existing lecture, leave quiz/flashcards/cheatSheet as empty arrays)
2. Open `scripts/anatomy_patch_content.py`
3. Find the `RANGES` list (tuples: lecture id, start line, end line, 1-based)
4. Add an entry for the new lecture with its line numbers
5. Create `scripts/anatomy_patches/lec13.json` with your content
6. Run the pipeline and validate

If you're unsure about line numbers, open `anatomy-data.ts` in Cursor,
search for `"id": "lec13"`, and note the line where `"cheatSheet":` starts
and where the `flashcards` closing `]` ends.

> **Important note:** If you ever add or remove lines from Lectures 1–3 or
> anywhere before Lecture 4 in the TS file, the line numbers in `RANGES` will
> drift and the pipeline will splice content into the wrong place.
> If this happens, update `RANGES` with the new correct line numbers before
> running the pipeline.

---

## File Structure Reference

```
nopriorauthorization-app/
├── src/
│   ├── lib/
│   │   └── study/
│   │       └── anatomy-data.ts          ← Main content file
│   ├── components/
│   │   └── study/
│   │       ├── AnatomyStudyHub.tsx      ← Main hub component
│   │       ├── AnatomyLanding.tsx       ← Landing/purchase page
│   │       ├── LectureCheatSheet.tsx    ← Cheat sheet tab
│   │       ├── LectureQuiz.tsx          ← Quiz tab
│   │       └── LectureFlashcards.tsx    ← Flashcards tab
│   ├── app/
│   │   ├── nursing-study/
│   │   │   └── anatomy/
│   │   │       ├── page.tsx             ← Main page (auth gated)
│   │   │       └── layout.tsx           ← Auth gate
│   │   └── api/
│   │       ├── study/
│   │       │   ├── progress/route.ts    ← Progress GET + POST
│   │       │   └── access/route.ts      ← Access check (cookie)
│   │       └── anatomy-study/
│   │           └── activate/route.ts    ← Sets access cookie post-purchase
│   └── config/
│       └── anatomy-study.config.ts      ← Slug, cookie names, price, free lectures
├── scripts/
│   ├── anatomy_patches/
│   │   ├── lec4.json                    ← Lecture 4 content
│   │   ├── lec5.json                    ← Lecture 5 content
│   │   ├── lec6.json                    ← Lecture 6 content
│   │   ├── lec7.json                    ← Lecture 7 content
│   │   ├── lec8.json                    ← Lecture 8 content
│   │   ├── lec9.json                    ← Lecture 9 content
│   │   ├── lec10.json                   ← Lecture 10 content
│   │   ├── lec11.json                   ← Lecture 11 content
│   │   └── lec12.json                   ← Lecture 12 content
│   ├── anatomy_patch_content.py         ← Line ranges config
│   ├── apply_anatomy_lc4_12.py          ← Pipeline engine (don't edit)
│   └── generate-anatomy-data.mjs        ← Optional: regenerate early lectures / full module (use with care vs patches)
└── prisma/
    └── schema.prisma                    ← StudyProgress + StudyCourse models
```

---

## Database

Two Prisma models support this feature:

**StudyProgress** — saves each user's quiz answers, flashcard position, and
whether they've viewed the cheat sheet. One row per user per lecture.
Progress is tied to login (not the access cookie).

**StudyCourse** — course metadata (currently one row: anatomy-physiology).

To apply schema changes to a new environment:
```bash
npx prisma generate
npx prisma db push
```

---

## Access & Pricing

| Setting | Value | Where to Change |
|---------|-------|-----------------|
| Product slug | `anatomy-physiology-study-complete` | `src/config/anatomy-study.config.ts` |
| Price (cents) | 3900 ($39) | `getAnatomyStudyShopProductDef().priceCents` in `anatomy-study.config.ts` **and** matching entry in `PRICE_MAP` in `src/lib/shop/products.ts` |
| Free lecture(s) | Lecture 1 (lec1) | `ANATOMY_FREE_LECTURE_IDS` in `anatomy-study.config.ts` |
| Cookie name | set in config | `anatomy-study.config.ts` |
| Display price string | e.g. `$39` | `ANATOMY_STUDY_PRICE_DISPLAY` in `anatomy-study.config.ts` (keep aligned with cents) |

> To change the price: update **`priceCents`** in `getAnatomyStudyShopProductDef()`,
> **`PRICE_MAP`** for this slug in `products.ts`, and **`ANATOMY_STUDY_PRICE_DISPLAY`**
> together so checkout, catalog, and UI stay consistent.

---

## How a Student Accesses the Tool

1. Student visits `/nursing-study/anatomy`
2. **Lecture 1 is free** — no purchase needed, no login required to view
3. **Lectures 2–12** show a lock icon
4. Student clicks locked lecture → redirected to shop page
5. Student completes Square checkout
6. Delivery email sent automatically
7. Student clicks activation link in email → hits `/api/anatomy-study/activate`
8. httpOnly cookie set → all 12 lectures unlock on that browser/device
9. Student logs in → progress (quiz scores, flashcard position) saves to Supabase

> **Note for support:** Access is cookie-based and device-specific.
> If a student switches devices, they need to use their activation link again.
> Tell students to save their delivery email.

---

## QA Checklist (run before any content deploy)

- [ ] Lecture 1 loads without login or purchase
- [ ] Locked lectures show lock icon and link to shop
- [ ] Purchase → activation → all lectures unlock
- [ ] Quiz questions show 4 real answer choices (not placeholders)
- [ ] Answering a question shows the explanation
- [ ] Score persists after page refresh (requires login)
- [ ] Flashcard flip animation works
- [ ] Shuffle button randomizes flashcard order
- [ ] Cheat sheet content renders (no broken HTML)
- [ ] TypeScript compiles: `npx tsc --noEmit --skipLibCheck src/lib/study/anatomy-data.ts`
- [ ] Mobile layout works on iPhone (test in browser dev tools)

---

## Quick Reference — The One Command You Need

```bash
# After editing any JSON patch file:
python3 scripts/apply_anatomy_lc4_12.py

# Then validate:
npx tsc --noEmit --skipLibCheck src/lib/study/anatomy-data.ts

# Then commit:
git add src/lib/study/anatomy-data.ts scripts/anatomy_patches/
git commit -m "content: your description here"
git push origin main
```

---

*Built by No Prior Authorization · Danielle & Anthony Alcala*  
*Questions: hello@nopriorauthorization.com*
