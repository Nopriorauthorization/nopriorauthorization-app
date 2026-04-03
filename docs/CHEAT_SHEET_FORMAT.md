# NPA Cheat Sheet — canonical format (team memory)

**Reference implementation:** `public/forms/NPA-Botox-Clinical-Cheat-Sheet.html`  
**Product pattern:** $10 SKU, category **Cheat Sheets**, HTML delivery, one primary “page” (printable letter-style).

Danielle’s direction: cheat sheets must feel **instantly usable** — dense, clinical, beautiful at a glance — not generic downloads. **Everything we ship is built to this bar; that’s the differentiator.**

---

## Brand & tokens (keep consistent across all cheat sheets)

| Token | Value |
|--------|--------|
| Black | `#1A1A1A` |
| Pink | `#D4537E` |
| Dark pink | `#A83560` |
| Blush | `#FBEAF0` |
| Text | `#1A1A1A` |
| Border | `#ddd0d5` |
| Page surround (screen) | `#e8dde3` |

**Semantic accents** (use for section headers / risk / category coding — same palette as Botox sheet): navy `#1a2940`, teal `#1a7a6e`, gold `#b8760a`, red `#c0392b`, purple `#6c3483`, green `#1e6b3c`, blue `#1a3a6b`, light `#f5f3f1`.

---

## Typography

- **Body:** Source Sans 3 — default **~7.6pt** on `.page` content (dense reference, print-first).
- **Display / titles:** Bebas Neue — header H1 (~20pt), NPA brand line (~13pt), section labels (~13pt).
- **Monospace (doses, numbers, units):** Source Code Pro where precision matters.

Google Fonts import (match reference file):

`Bebas Neue`, `Source Sans 3` (400, 600, 700), `Source Code Pro` (500).

---

## Layout & page model

- **`body`:** soft background `#e8dde3`; comfortable reading on screen before print.
- **`.page`:** **10.5in** wide, **min-height 8in**, white, **4-column CSS grid**, `page-break-after: always` for PDF/print pipelines, subtle **box-shadow** on screen.
- **`.page-header`:** full width, **black bar**, white + pink accent; left = product title (Bebas); right = **NPA brand block** (pink “NO PRIOR AUTHORIZATION”, small gray tagline).
- **Content:** **`.col`** columns with **`.card`** blocks — each card: **`.card-head`** (colored bar, white text) + **`.card-body`** (compact lists, tables, or callouts).

**Density:** This is a **cheat sheet**, not a patient handout — prioritize scannability (icons, short labels, tables) over prose.

---

## Mobile / screen

- `viewport` meta present; sheet is **print-first** — on small screens the page may scroll horizontally; that’s acceptable for reference HTML. Optional future pass: `@media` scale-down for phone preview only (do not loosen print layout).

---

## File & delivery conventions

1. **Filename:** `public/forms/NPA-{Topic}-Clinical-Cheat-Sheet.html` (or `NPA-{Topic}-Cheat-Sheet.html` if not clinical).
2. **Manifest:** `imports/npa-manifests-and-spec/{slug}.json` with `productId` = shop slug, `canvaTemplateUrl` = `/forms/...`, `_deliveryType`: `html`.
3. **Catalog:** Run `node scripts/import-canva-delivery-manifests.mjs` (merges with existing catalog if Canva folder absent).
4. **Shop:** `src/lib/shop/products.ts` — `CATEGORY_MAP`, `PRICE_MAP` (**1000** = $10 unless pricing changes), optional `SLUG_THUMBNAIL`; `src/app/shop/page.tsx` badge/outcome lines optional.
5. **Hub:** `src/app/cheat-sheets/page.tsx` lists all products where `category === "Cheat Sheets"` (no manual list per SKU required if category is set).

---

## QA before ship

- [ ] Header brand + title match topic; no placeholder copy.
- [ ] Print preview: one clean “sheet” per `.page`, no awkward breaks inside critical tables (tune `page-break-inside` if needed).
- [ ] Clinical disclaimer / “verify locally” line if content is medical (match NPA legal tone elsewhere).
- [ ] Purchase → delivery link opens this file and it renders without broken fonts (Google Fonts load).

---

## Strategic note (product direction)

Cheat sheets = **low-friction, high-wow** SKUs: client pays little, gets something that **looks and reads like it was built for the chair**, immediately. Stack: more topics → **bundled “Cheat Sheet Pack”** at a step-up price → upsell to full playbooks / membership. Instant gratification + unmistakable build quality = positioning.
