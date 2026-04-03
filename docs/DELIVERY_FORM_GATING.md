# Digital HTML gating & previews

## What ships where

| Location | Purpose |
|----------|---------|
| `public/forms/*.html` | **Only** the four free/marketing pages in `src/lib/delivery/free-public-forms.ts` (audit, membership, ebooks, contact/about). |
| `public/forms/msl-legal-bundle.css` | Shared stylesheet for legal templates (stays public). |
| `public/forms/previews/*-PREVIEW.html` | **Optional** watermarked teasers for the shop (safe to share). |
| `delivery-assets/forms/*.html` | **All paid shop HTML** — not a public static URL. |

## Buyer access

- `/delivery/[token]` lists templates. For gated HTML, **View & Print** uses `GET /api/delivery/html?token=…&i=…` (validates token, `no-store`, `noindex`).

## Admin access

- Library **View HTML** for gated paths goes to `GET /api/admin/delivery-html?path=/forms/…` (logged-in admin only). Public lead magnets still open `/forms/…` directly.

## Shop “wow” preview

- Add `public/forms/previews/{SameBaseName}-PREVIEW.html` where `{SameBaseName}` matches the catalog’s first template file (e.g. `NPA-Botox-Clinical-Cheat-Sheet-PREVIEW.html` for `…/NPA-Botox-Clinical-Cheat-Sheet.html`).
- If that file exists, `/shop/[slug]` shows an **Interactive preview (sample)** iframe. No preview file → only image gallery (unchanged).

## Adding a new paid HTML product

1. Put the full file in `delivery-assets/forms/YourFile.html`.
2. Manifest/catalog: `canvaTemplateUrl`: `/forms/YourFile.html` (logical path).
3. Optionally add `public/forms/previews/YourFile-PREVIEW.html`.
4. Run `node scripts/import-canva-delivery-manifests.mjs` and deploy.

## Free pages list

To add another **public** embed (new lead magnet), append its `/forms/…` path to `free-public-forms.ts` and keep the file under `public/forms/`.
