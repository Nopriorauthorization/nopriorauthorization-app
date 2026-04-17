# Premium layout — control guide

**Quick matrix:** see **`PREMIUM-CONTROL-MATRIX.md`** (modes, body attrs, precedence).

## Global switch

| Env | Effect |
|-----|--------|
| `HG_PREMIUM=off` | No premium CSS injection, no DOM transforms. Chapters render like plain HTML. |
| `HG_PREMIUM=light` | **Default.** Part-only cinematic on **1, 5, 9, 13, 15, 19**; **markers-only** visuals (manual `.hg-visual-slot` filled; **no** keyword heuristics unless a chapter sets `data-premium-visuals="heuristic"`); stamp + finale on. |
| `HG_PREMIUM=full` | Same cinematic defaults; **keyword heuristics allowed** (max **3** placeholders) unless a chapter sets `data-premium-visuals="markers"` or `off`. |

```bash
HG_PREMIUM=off CHAPTERS_DIR=~/Desktop/chapters node build-book-pdf.js
HG_PREMIUM=light node build-book-pdf.js
HG_PREMIUM=full node build-book-pdf.js
EXPORT_CHAPTER_STANDALONE=1 CHAPTERS_DIR=~/Desktop/chapters node build-book-pdf.js
```

## Per-chapter: `<body>` attributes

Set on the **`<body>`** tag (see `book-front-matter/samples/HelloGorgeous-Chapter-01-PREMIUM-SAMPLE.html`).

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-premium` | *(omit)*, `light`, `full`, `off` | `off` disables premium for this file even if env is light/full. `light` / `full` override env mode for this chapter only. |
| `data-premium-cinematic` | `off`, `part`, `all` | `off` = no cinematic H2. `part` = cinematic **first H2** only on Part openers (ch **1, 5, 9, 13, 15, 19**). `all` = cinematic first H2 **every** chapter. |
| `data-premium-visuals` | `off`, `markers`, `heuristic` | `off` = no placeholders at all (manual slots not filled). `markers` = **only** fill empty `.hg-visual-slot`. `heuristic` = slots + keyword inserts (cap **2** in chapter `light` mode, **3** in chapter `full` mode). |
| `data-premium-stamp` | *(omit)*, `off` | `off` = no auto “From Danielle” stamp after contra/ask. |
| `data-premium-stamp-variant` | `0`, `1`, `2` | Danielle stamp layout: **0** ribbon, **1** minimal, **2** inset (dark panel). Omit = rotate by chapter # (legacy). |
| `data-premium-finale` | *(omit)*, `off` | `off` = no closing finale block. |

### Examples

```html
<body data-premium="light" data-premium-cinematic="part" data-premium-visuals="markers" data-premium-stamp-variant="2">
```

```html
<body data-premium="off">
```

```html
<body data-premium="full" data-premium-stamp="off" data-premium-finale="off">
```

## Page growth — before vs after (directional)

| Era | Behavior | Typical effect |
|-----|----------|----------------|
| **Earlier premium pass** | Cinematic on **every** `.ch-h2` + placeholder every 3rd `.body-text` + tall finale | **Large** PDF page inflation |
| **Current (light)** | Cinematic **first H2** only on **6** Part-opener chapters; **markers-first** (no keyword heuristics unless opted in); manual slots; **compact** finale | **Controlled** growth — art-directed, not auto-filled |

Exact page counts depend on copy length and images; regenerate PDF to compare.

## Chapter finale copy

Edit **`book-front-matter/chapter-finale-lines.json`** — `chapters["1"]` … `chapters["24"]` with a `finale` string each. Missing keys use `fallback`.

## Implementation map

```bash
CHAPTERS_DIR=~/Desktop/chapters node build-book-pdf.js --premium-map
```

Writes **`book-front-matter/premium-implementation-map.md`** (chapter list, H2 counts, manual slots, word heft, body attrs, **visual production row** from `chapter-visual-production.json` when present).

## Visual production handoff

- **`book-front-matter/chapter-visual-production.json`** — required / optional / quote & infographic candidates, finale note (priority chapters).
- **`book-front-matter/priority-chapter-asset-checklists.md`** — design checklists per priority chapter.

## Print typography

For chapter PDFs, the build injects **`print-luxury-typography.css`** after premium CSS (body column ~**11.25pt**, widows/orphans tuned). Recommendation: **11.25pt** reads more “luxury trade” than 11pt without the page-count cost of 12pt; if copy still feels dense after a full signature proof, try **11.5pt** only in `.body-content > .body-text` and re-run pagination.

## Visual “moments” (slots)

On an empty `div.hg-visual-slot`, optional attributes:

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-moment` | `hero` | **Signature spread:** full-bleed treatment, pink label + depth cue placeholder (final art: `assets/chapter-NN/visual-01.png`). |
| `data-moment` | `aging` | **Structure / aging** moment styling + production hint for collagen/bone/fat visuals. |
| `data-bleed` | `full` | Full-bleed column (combined with `hero` automatically). |

Pair slots with **`.hg-fullpage-quote`** / **`.hg-chapter-mic-drop`** in chapter HTML for art-directed rhythm (see Chapter 01 gold template).

## Sample chapter

**`book-front-matter/samples/HelloGorgeous-Chapter-01-PREMIUM-SAMPLE.html`** — gold template: editorial Danielle open, full-page pull quotes, `data-moment="hero"` slot, aging slot, mic-drop close.
