# Premium implementation map (generated)

- **Chapters dir:** `/Users/danid/Desktop/chapters`
- **Generated:** 2026-04-07
- **Regenerate:** `CHAPTERS_DIR=... node build-book-pdf.js --premium-map`
- **Visual production JSON:** `book-front-matter/chapter-visual-production.json` (priority chapters — hand off to design)

## Automation summary (default `HG_PREMIUM=light`)

| Ch | File | Part opener? | H2 count | Manual `hg-visual-slot` | Words (approx) | Stamp anchor (contra/ask) | Body attrs (snippet) |
|----|------|--------------|----------|-------------------------|----------------|----------------------------|------------------------|
| 1 | `HelloGorgeous-Chapter-01-Your-Skin.html` | yes | 6 | 2 | 3603 | contra+ask | data-premium="light" data-premium-cinematic="part" data-premium-visuals="markers… |
| 2 | `HelloGorgeous-Chapter-02-Fitzpatrick.html` |  | 6 | 0 | 4148 | contra+ask |  |
| 3 | `HelloGorgeous-Chapter-03-Skincare-Routine.html` |  | 7 | 0 | 6280 | contra+ask |  |
| 4 | `HelloGorgeous-Chapter-04-Facials-Peels-Treatments.html` |  | 9 | 0 | 6979 | contra+ask |  |
| 5 | `HelloGorgeous-Chapter-05-Lasers-Devices.html` | yes | 5 | 0 | 4913 | contra+ask |  |
| 6 | `HelloGorgeous-Chapter-06-Every-Laser-Decoded.html` |  | 8 | 0 | 4625 | contra+ask |  |
| 7 | `HelloGorgeous-Chapter-07-RF-Body-Contouring.html` |  | 6 | 0 | 4236 | contra+ask |  |
| 8 | `HelloGorgeous-Chapter-08-Before-You-Book-Any-Laser.html` |  | 5 | 0 | 3957 | contra+ask |  |
| 9 | `HelloGorgeous-Chapter-09-What-Botox-Does.html` | yes | 7 | 0 | 4827 | contra+ask |  |
| 10 | `HelloGorgeous-Chapter-10-Dermal-Filler.html` |  | 7 | 0 | 4477 | contra+ask |  |
| 11 | `HelloGorgeous-Chapter-11-Finding-Safe-Injector.html` |  | 3 | 0 | 2105 | contra+ask |  |
| 12 | `HelloGorgeous-Chapter-12-Aging-Gracefully.html` |  | 3 | 0 | 3099 | contra+ask |  |
| 13 | `HelloGorgeous-Chapter-13-GLP1-Medications.html` | yes | 7 | 0 | 4254 | contra+ask |  |
| 14 | `HelloGorgeous-Chapter-14-Body-Contouring.html` |  | 5 | 0 | 3344 | contra+ask |  |
| 15 | `HelloGorgeous-Chapter-15-Your-Hormones.html` | yes | 4 | 0 | 3982 | contra+ask |  |
| 16 | `HelloGorgeous-Chapter-16-BHRT.html` |  | 4 | 0 | 2845 | contra+ask |  |
| 17 | `HelloGorgeous-Chapter-17-Reading-Lab-Work.html` |  | 4 | 0 | 2822 | contra+ask |  |
| 18 | `HelloGorgeous-Chapter-18-IV-Therapy.html` |  | 3 | 0 | 3521 | contra+ask |  |
| 19 | `HelloGorgeous-Chapter-19-Peptide-Therapy.html` | yes | 2 | 0 | 2856 | contra+ask |  |
| 20 | `HelloGorgeous-Chapter-20-Clean-Beauty.html` |  | 4 | 0 | 1935 | ask |  |
| 21 | `HelloGorgeous-Chapter-21-Mens-Health.html` |  | 4 | 0 | 1680 | ask |  |
| 22 | `HelloGorgeous-Chapter-22-Provider-Team.html` |  | 2 | 0 | 1145 | — |  |
| 23 | `HelloGorgeous-Chapter-23-Journey-by-Decade.html` |  | 1 | 0 | 1311 | — |  |
| 24 | `HelloGorgeous-Chapter-24-Closing-Letter.html` |  | 0 | 0 | 1172 | — |  |

## Visual slot map — production (required / optional / candidates / finale)

Editorial fields come from **`chapter-visual-production.json`** (priority chapters). Others: **TBD** until art-directed.

| Ch | Required visuals | Optional visuals | Quote-page candidates | Infographic candidates | Finale line status |
|----|------------------|------------------|----------------------|------------------------|--------------------|
| 1 | Opener: 5-layer depth stack (replace or refine inline SVG for print); Body slot 01: facial cross-section / depth map (treatments-to-layers); Body slot 02: barrier brick-and-mortar or stratum corneum schematic | Cell turnover timeline; Collagen types I/III micro-diagram | Opening From Danielle (long-form); Closing Bottom Line (short pull-quote spread) | Opener depth reference; Barrier / dehydration vs dry comparison | Set in chapter-finale-lines.json — Ch 1 (gold template) |
| 2 | Fitzpatrick scale visual (I–VI); PIH risk ladder or heat map | Melanocyte behavior diagram; Tan vs treatment timing graphic | Safety-first framing quote from Danielle | Device + skin type matrix | chapter-finale-lines.json — Ch 2 |
| 3 | TBD | TBD | TBD | TBD | chapter-finale-lines.json — Ch 3 |
| 4 | TBD | TBD | TBD | TBD | chapter-finale-lines.json — Ch 4 |
| 5 | Chromophore / wavelength primer; Depth vs modality diagram | Selective photothermolysis one-pager | Physics-before-marketing line | Wavelength-to-target cheat sheet | chapter-finale-lines.json — Ch 5 |
| 6 | TBD | TBD | TBD | TBD | chapter-finale-lines.json — Ch 6 |
| 7 | TBD | TBD | TBD | TBD | chapter-finale-lines.json — Ch 7 |
| 8 | Consult checklist hero; Consent / downtime reality graphic | Red-flag provider signals illustration | Consult is not a sales pitch | Questions to ask in consult | chapter-finale-lines.json — Ch 8 |
| 9 | Muscle / NMJ plane diagram; Onset–duration timeline | Areas map (glabella, crow’s, forehead) editorial | Precision over trend | What Botox does / does not do | chapter-finale-lines.json — Ch 9 |
| 10 | Facial planes stack (periosteum → SMAS → fat); G’ vs cohesivity explainer graphic | Overfilled vs structural support comparison | Architecture, not volume | Plane-by-plane indication map | chapter-finale-lines.json — Ch 10 |
| 11 | Credential / scope checklist; Complication preparedness graphic | Vascular emergency awareness one-pager | The injector who says no | Green / red flags in a practice | chapter-finale-lines.json — Ch 11 |
| 12 | TBD | TBD | TBD | TBD | chapter-finale-lines.json — Ch 12 |
| 13 | TBD | TBD | TBD | TBD | chapter-finale-lines.json — Ch 13 |
| 14 | TBD | TBD | TBD | TBD | chapter-finale-lines.json — Ch 14 |
| 15 | Axis diagram (HPA / thyroid / sex steroids overview); Symptom cluster map | Normal vs optimal spectrum graphic | Labs are a story | When to test what (high level) | chapter-finale-lines.json — Ch 15 |
| 16 | Bioidentical vs synthetic distinction graphic; Monitoring cadence timeline | Routes of administration comparison | Partnership, not product | Dose response is individual | chapter-finale-lines.json — Ch 16 |
| 17 | Panel map (thyroid, metabolic, inflammatory markers); Reference vs optimal shading | Sample collection / timing note graphic | You are not a single number | CBC / CMP / thyroid one-glance guide | chapter-finale-lines.json — Ch 17 |
| 18 | TBD | TBD | TBD | TBD | chapter-finale-lines.json — Ch 18 |
| 19 | Mechanism categories (signal vs support); Prescriber oversight callout visual | Sequence / timing graphic | Signals not shortcuts | Peptide family overview | chapter-finale-lines.json — Ch 19 |
| 20 | TBD | TBD | TBD | TBD | chapter-finale-lines.json — Ch 20 |
| 21 | TBD | TBD | TBD | TBD | chapter-finale-lines.json — Ch 21 |
| 22 | TBD | TBD | TBD | TBD | chapter-finale-lines.json — Ch 22 |
| 23 | TBD | TBD | TBD | TBD | chapter-finale-lines.json — Ch 23 |
| 24 | TBD | TBD | TBD | TBD | chapter-finale-lines.json — Ch 24 |

## What the build applies per chapter (when premium active)

- **CSS:** `chapter-premium-visual-system.css` + `print-luxury-typography.css` + `.hg-dq-premium` / `.hg-bts--premium` / `.hg-infographic` on relevant blocks.
- **Cinematic first H2:** only chapters **1, 5, 9, 13, 15, 19** when `data-premium-cinematic` default / `part`. Use `all` for every chapter’s first H2.
- **Heuristic visuals:** only when `HG_PREMIUM=full` (or chapter `data-premium="full"`) **and** visuals not forced to `markers` — max **3** inserts (`light`+`heuristic` on a chapter: max **2**). Default **`HG_PREMIUM=light`:** **markers-only** (no keyword inserts).
- **Manual visuals:** empty `div.hg-visual-slot` filled when visuals mode is `markers` or `heuristic` (not when `off`).
- **Danielle stamp:** after first `.contra-section` or `.ask-section`; variant `data-premium-stamp-variant` **0–2** or chapter-rotation.
- **Finale:** from `chapter-finale-lines.json` by chapter number.

## Chapters by length (words, descending)

| Ch | Words | Notes |
|----|-------|-------|
| 4 | 6979 | long — prioritize manual art plan; no manual hg-visual-slot yet |
| 3 | 6280 | long — prioritize manual art plan; no manual hg-visual-slot yet |
| 5 | 4913 | no manual hg-visual-slot yet |
| 9 | 4827 | no manual hg-visual-slot yet |
| 6 | 4625 | no manual hg-visual-slot yet |
| 10 | 4477 | no manual hg-visual-slot yet |
| 13 | 4254 | no manual hg-visual-slot yet |
| 7 | 4236 | no manual hg-visual-slot yet |
| 2 | 4148 | no manual hg-visual-slot yet |
| 15 | 3982 | no manual hg-visual-slot yet |
| 8 | 3957 | no manual hg-visual-slot yet |
| 1 | 3603 | — |
| 18 | 3521 | no manual hg-visual-slot yet |
| 14 | 3344 | no manual hg-visual-slot yet |
| 12 | 3099 | no manual hg-visual-slot yet |
| 19 | 2856 | no manual hg-visual-slot yet |
| 16 | 2845 | no manual hg-visual-slot yet |
| 17 | 2822 | no manual hg-visual-slot yet |
| 11 | 2105 | no manual hg-visual-slot yet |
| 20 | 1935 | no manual hg-visual-slot yet |
| 21 | 1680 | no manual hg-visual-slot yet |
| 23 | 1311 | no contra/ask — auto Danielle stamp skipped; no manual hg-visual-slot yet |
| 24 | 1172 | no contra/ask — auto Danielle stamp skipped; no manual hg-visual-slot yet |
| 22 | 1145 | no contra/ask — auto Danielle stamp skipped; no manual hg-visual-slot yet |

## Length heuristic

Word count is a proxy; PDF page count comes from `node build-book-pdf.js` after layout.
