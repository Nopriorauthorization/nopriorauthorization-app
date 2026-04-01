# Asset & Delivery Organization

**Source of truth:** JSON manifests in `imports/npa-manifests-and-spec/`
**Primary channel:** `/shop` (Stripe checkout + tokenized delivery)
**Secondary channel:** Etsy (draft listings from pipeline output)

## Directory map

```
Source of truth (manifests + catalog)
├── imports/npa-manifests-and-spec/*.json     ← product definitions (templates, URLs, SKUs)
├── src/lib/delivery/catalog.generated.json   ← compiled catalog (auto-generated)
└── content/products/*.config.ts              ← pipeline seed configs (for product:build)

Delivery assets (served to buyers)
├── public/forms/*.html                       ← printable HTML templates (Path B delivery)
└── /delivery/[token]                         ← buyer-facing page (reads catalog)

Shop assets (product pages)
├── public/shop-previews/{slug}/*.png         ← product preview images for /shop/[slug]
└── src/lib/shop/products.ts                  ← shop product definitions (reads catalog)

Pipeline output (not deployed — local/CI only)
├── output/{slug}/manifest.json               ← build manifest per product
├── output/{slug}/listing.json                ← Etsy-ready metadata
├── output/{slug}/delivery/instructions.*     ← buyer instructions (MD, HTML, TXT)
├── output/{slug}/previews/*.png              ← Canva-exported preview images
└── output/{slug}/archives/{slug}.zip         ← packaged buyer delivery ZIP

Etsy assets (listing images + copy)
├── etsy-products/store-launch/assets/{slug}/ ← listing images (source for shop-previews)
└── etsy-products/store-launch/listings/      ← listing definitions + copy
```

## Data flow

```
1. Define product
   imports/npa-manifests-and-spec/{slug}.json
   ↓
2. Build catalog
   pnpm catalog:rebuild
   → catalog.generated.json + DB sync
   ↓
3. Shop reads catalog
   /shop → src/lib/shop/products.ts → catalog.generated.json
   ↓
4. Customer buys on /shop
   Stripe checkout → webhook → Purchase row + delivery token + email
   ↓
5. Buyer opens /delivery/[token]
   Renders templates from catalog (HTML forms + Canva links)

Optional: Etsy downstream
   pnpm product:build {slug}     → output/{slug}/listing.json
   pnpm product:publish-etsy {slug}  → Etsy draft listing
```

## Commands

| Command | What it does |
|---------|-------------|
| `pnpm catalog:rebuild` | Regenerate catalog.generated.json + sync manifests to DB |
| `pnpm product:build <slug>` | Build pipeline output for one product |
| `pnpm product:build-all` | Build pipeline output for all registered configs |
| `pnpm product:publish-etsy <slug>` | Create Etsy draft from pipeline listing.json |
| `pnpm product:create-draft <slug>` | Legacy: create Etsy draft from pipeline output |
| `pnpm delivery:import` | Regenerate catalog.generated.json only |
| `pnpm delivery:sync-db` | Push manifests to DB only |
| `pnpm shop:seed-stripe` | Create Stripe Products + Prices for all shop products |
