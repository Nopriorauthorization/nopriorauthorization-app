# Creator handoff — physical products from NPA files

You **can** give this document (and the asset folders below) to a designer or print partner. **Do not** share Vercel env vars, API keys, `.env.local`, or database credentials.

## What they need

1. **Source or reference for layout** — HTML in `public/forms/` (and related `public/` paths), or **PDF exports** you generate for them (often easier for print shops).
2. **Your list of SKUs** — which physical product maps to which file or URL (you can paste from `imports/npa-manifests-and-spec/*.json` titles + `canvaTemplateUrl` paths).
3. **Brand assets** — logo files, hex colors, fonts (many HTML files load Google Fonts; note that for print licensing).

## Folders safe to zip (no secrets)

| Give them | Contents |
|-----------|----------|
| `public/forms/` | Main printable HTML deliverables (cheat sheets, kits, handouts). Subfolder `previews/` if they need preview pages too. |
| `public/forms/msl-legal-bundle.css` | Shared CSS if linked by legal bundle HTML. |
| `imports/npa-manifests-and-spec/` | JSON per product: display name, template list, paths to HTML, Etsy SKU hints. **No API keys** in these files. |
| `public/shop-previews/` (optional) | PNG previews used on the shop; useful for thumbnails or pitch decks. |
| `public/deliverables/` (if you use it) | PDFs or other static downloads. |
| `public/book/` (optional) | e.g. sneak-peek PDFs if relevant to physical goods. |

**Do not include:** `.env*`, `node_modules/`, `.git` with deploy tokens in hooks, `prisma/` with production URLs if sensitive.

## Exporting print-ready PDFs from HTML (for them or you)

1. Open the file in **Chrome** (or Edge): either open the local `.html` from the zip, or use the live site URL `https://nopriorauthorization.com/forms/<FileName>.html`.
2. **Print** → **Save as PDF**.
3. For multi-“page” HTML, use **Print** dialog options (margins, background graphics) so colors and boxes match the screen.

They should confirm **trim/bleed** with Printify (or your printer); browser PDFs are fine for reference but may need a layout pass for strict bleed.

## Deeper map inside the repo

See **`docs/ASSET_ORGANIZATION.md`** for manifests vs catalog vs shop vs pipeline output.

## After handoff

- You keep **checkout, delivery, and Printify** in your app; the creator only needs **assets + specs** (sizes, paper, finishes).
- Rotate any credential if it was ever pasted into chat, email, or a shared doc by mistake.
