# Hello Gorgeous — THE BOOK · PDF build (v2)

## For Eric (one-shot)

1. Copy **all** final HTML from your outputs bundle into a single **`chapters/`** folder (default: `~/Desktop/chapters`), including:
   - **Front matter:** `HelloGorgeous-Cover-Page.html`, `HelloGorgeous-Title-Page.html`, `HelloGorgeous-Copyright-Page.html`
   - **Part dividers (visual):** `HelloGorgeous-Part-01-Divider.html` … `Part-06` + `book-front-matter/assets/part-dividers.png` (6-up grid; one full page before each Part)
   - **All 24 chapters:** `HelloGorgeous-Chapter-01-…html` through `HelloGorgeous-Chapter-24-…html`  
   Nested subfolders are OK — the script searches recursively.

2. From the **repo root** (this project), use the **v2** script `build-book-pdf.js` (already in the repo).

3. Install deps once:

   ```bash
   npm install puppeteer pdf-lib
   ```

4. Run:

   ```bash
   node build-book-pdf.js
   ```

   Or with a custom chapters path:

   ```bash
   CHAPTERS_DIR=/path/to/chapters node build-book-pdf.js
   ```

**Output:** `chapters/output/HelloGorgeous-THE-BOOK.pdf` (or `OUTPUT_DIR` if set).

The script builds **Cover → Title → Copyright → Chapters 1–24**, then assembles the final PDF as **Cover (page 1) · TOC with roman i (page 2) · rest of book**, skips running headers on dark openers + front matter, trims obvious blank last pages per chapter, and adds body page numbers.

**Layout:** Puppeteer uses a fixed **8.5in** viewport, injects print CSS to remove `.page` margins/shadows, and **hides `.chapter-footer`** in each chapter HTML so you do not get duplicate footers (the script draws one set of running heads/feet in `pdf-lib`, aligned to the same **48pt** side gutter as `.body-content` / the TOC).

**Premium visual system (chapters only):** Gated by `HG_PREMIUM` and optional `<body data-premium-*>` attributes. Injects `book-front-matter/chapter-premium-visual-system.css`, Part-opener cinematic first H2s, keyword-based visual placeholders, optional manual `hg-visual-slot`, Danielle stamp after contra/ask, finale lines from `chapter-finale-lines.json`. **Control guide:** `book-front-matter/PREMIUM-CONTROL.md` · **Asset spec:** `PREMIUM-ASSETS.md` · **Map:** `node build-book-pdf.js --premium-map` · **Sample chapter:** `book-front-matter/samples/HelloGorgeous-Chapter-01-PREMIUM-SAMPLE.html` · **Manual blocks:** `premium-component-snippets.html`.

## After build (digital delivery)

To attach the buyer download in NPA, copy the PDF into the gated deliverables folder:

```bash
cp "$HOME/Desktop/chapters/output/HelloGorgeous-THE-BOOK.pdf" \
  delivery-assets/deliverables/HelloGorgeous-THE-BOOK.pdf
```

Then deploy the app (or commit if that path is part of your release process).

## KDP print

- **Interior:** `HelloGorgeous-THE-BOOK.pdf` from the build above.  
- **Cover:** `HelloGorgeous-Cover-Page.html` loads **`assets/cover-aesthetic-anatomy.png`** (replace that file to swap art). For razor-sharp print, target **2550×3300 px** (or your vendor’s full-bleed size).
