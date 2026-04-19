# Ticket: Cheat sheet PDF pipeline → Printify-ready deliverable

**Owner:** Danielle / NPA  
**Implementer:** Claude (or any dev)  
**Priority:** Medium  
**Status:** Partially done — extend / harden as below

## Goal

Produce a **reliable, repeatable** path from NPA shop cheat sheets → **print-ready PDF(s)** suitable for **Printify** (or any print vendor): correct filenames, full HTML where it exists, clear fallback when only previews exist, and documentation so a non-engineer can run it.

## Background

- Shop cheat sheets are listed on [https://nopriorauthorization.com/cheat-sheets](https://nopriorauthorization.com/cheat-sheets); catalog source is `src/lib/delivery/catalog.generated.json`.
- Printable HTML lives under `public/forms/` (and previews under `public/forms/previews/`).
- **Nine** full clinical HTML files were restored from Downloads into `public/forms/` (commit `a852f79` area).
- **Five** catalog paths still have **no** full HTML in repo (only previews). Slugs: `brow-henna-clinical-cheat-sheet`, `ipl-laser-clinical-cheat-sheet`, `lash-extensions-clinical-cheat-sheet`, `lash-lift-perm-clinical-cheat-sheet`, `waxing-clinical-cheat-sheet`. **Out of scope for this ticket unless files appear** — do not block on them.

## Existing implementation (do not duplicate blindly)

- Script: `scripts/cheat-sheets/export-all-cheat-sheets-pdf.mjs`
- npm: `npm run cheat-sheets:export-pdf` (optional `--no-merge` for per-slug PDFs only)
- Outputs (gitignored `output/`):
  - `output/cheat-sheets-pdf/<slug>.pdf`
  - `output/NPA-All-Cheat-Sheets-Omnibus.pdf` (merged, slug order A→Z)
- Uses Puppeteer (`printBackground`, `preferCSSPageSize`) + `pdf-lib` merge.
- If `public/forms/<catalog>.html` is missing, uses `public/forms/previews/<basename>-PREVIEW.html` and logs `[warn]`.

## Work requested

1. **Hardening**
   - Replace `[warn]` duplicate `console.error` with `console.warn` where appropriate; optional `--quiet` flag.
   - Exit non-zero if **zero** PDFs exported (today only fails if nothing merged).
   - Document max runtime / memory for ~35 sheets (CI note if ever run in GitHub Actions).

2. **Printify handoff**
   - Add a short section to `docs/CREATOR-HANDOFF.md` (or new `docs/PRINTIFY-CHEAT-SHEET-BOOK.md`) with:
     - Exact commands to regenerate omnibus.
     - Path to omnibus + per-slug folder.
     - Note that **preview fallbacks** are not final paid art — list the five slugs explicitly.
   - Optional: one paragraph on **typical Printify** product types (spiral / wiro) and that **interior PDF** must meet provider **bleed / page count** (link to Printify docs for chosen blueprint).

3. **Optional (nice-to-have)**
   - `npm run cheat-sheets:export-pdf -- --only=slug1,slug2` for partial rebuilds.
   - Table of contents page as first PDF page (generated HTML or `pdf-lib` text page) listing slug + title — only if quick.

## Acceptance criteria

- [ ] `npm run cheat-sheets:export-pdf` completes on a clean clone after `npm install`, with Chrome/Puppeteer working.
- [ ] Omnibus PDF is produced when at least one sheet exports; behavior for **all preview** five is documented, not silent.
- [ ] Docs updated so Danielle (or Printify partner) can run the flow without reading source.
- [ ] No requirement to locate the five missing full HTML files for ticket closure.

## References

- Catalog: `src/lib/delivery/catalog.generated.json`
- Cheat sheets landing: `src/app/cheat-sheets/page.tsx` (filters `category === "Cheat Sheets"`)
- Printify integration (separate): `src/lib/printify/`, `src/app/api/printify/`

## Out of scope

- Auth / paywall changes for HTML.
- Generating the five missing full HTML files from scratch (unless source assets provided later).
