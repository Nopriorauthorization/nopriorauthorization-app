# Store Manager

Use this file as the command center for the Etsy shop build.

## What Exists Right Now

### Storefront assets

- Banner: `assets/npa-store-banner-1200x300.png`
- Icon: `assets/npa-store-icon-500x500.png`
- Store copy: `storefront-copy.md`

### Etsy Open API (optional automation)

- Register an app: [etsy.com/developers/register](https://www.etsy.com/developers/register)
- Setup notes: `ETSY_API_APP.md`
- Env placeholders: root `.env.example` (`ETSY_*`)

### Launch strategy

- Positioning: `positioning.md`
- Product lineup: `launch-catalog.md`
- Scalable catalog: `SCALABLE_CATALOG.md`
- Visual rules: `visual-system.md`
- Production workflow: `PRODUCTION_WORKFLOW.md`
- Next 10 roadmap: `NEXT_10_LISTINGS.md`

### First 3 listings

- IV Therapy: `listings/iv-therapy-social-media-bundle.md`
- Weight Loss: `listings/medical-weight-loss-social-media-bundle.md`
- Complete Bundle: `listings/complete-med-spa-bundle.md`

### Injectables and lash listings (docs + listing images)

- Botox: `listings/botox-social-media-bundle.md`
- Filler: `listings/filler-social-media-bundle.md`
- Complete Injector Bundle: `listings/complete-injector-bundle.md`
- Lash Business Templates: `listings/lash-business-templates-bundle.md`
- Peptide Education Bundle: `listings/peptide-vitamin-injection-educational-bundle.md`

### Listing image sets

- IV images: `assets/iv-therapy/`
- Weight Loss images: `assets/weight-loss/`
- Complete Bundle images: `assets/combo-bundle/`
- Botox images: `assets/botox/`
- Filler images: `assets/filler/`
- Complete Injector images: `assets/complete-injector/`
- Lash images: `assets/lash/`

### Canva / product outputs

- IV build output: `/Users/danid/Desktop/canva-automation/output/products/iv-therapy-social-kit/`
- IV Canva links: `/Users/danid/Desktop/canva-automation/output/products/iv-therapy-social-kit/canva-links/canva-template-links.txt`
- Weight Loss Canva links: not built yet
- Combo Canva links: not built yet
- Store build runbook: `STORE_BUILD_MODE.md`
- Store build status snapshot: `imports/store-build/status.json`
- Store build checklist: `imports/store-build/store-build-checklist.md`
- Next-wave manifests (100 templates): `imports/npa-manifests-and-spec/NEXT_WAVE_MANIFESTS.md`

### Complete Etsy listing copy (all 6 products)

- Master listings doc: `listings/NPA-Etsy-Listings-All-6.md`
- Includes: titles, tags, descriptions, pricing, shop announcement, and policies

## Important Reality Check

The store package is built, but the Etsy shop is not live until you:

1. create or configure the Etsy shop
2. upload the banner and icon
3. create the first 3 listings
4. upload the listing images
5. upload the ZIP files / digital downloads
6. paste the titles, tags, and descriptions into Etsy

## Brand Guardrail

We use high-end photos for everything we build.

Do not use:

- cartoon characters
- fake illustrated people
- mascot-style graphics
- low-end clip-art visuals

Every listing should feel like a luxury med spa brand.

## Best Publish Order

1. IV Therapy
2. Weight Loss
3. Complete Med Spa Bundle

This gives you:

- two clear standalone offers
- one bundle upsell
- a clean, believable shop structure

## What To Do Each Time You Publish A Product

1. Open the matching file in `listings/`
2. Upload the matching images from `assets/`
3. Confirm the Canva product output exists
4. Verify the ZIP and links match the listing promise
5. Add a cross-sell to the other listings

## What Still Needs Built

- Weight Loss Canva product output
- Complete Bundle Canva product output
- the next 10 listings in `NEXT_10_LISTINGS.md`
- Full 44/44 manifest link completion (run `npm run store:build`)

## Daily Use Rule

Think of the system in 3 layers:

- `store-launch/` = your Etsy HQ
- `canva-automation/output/products/` = your product delivery files
- Canva links / Canva designs = your editable design source

If you keep those 3 clean, the store stays manageable.
