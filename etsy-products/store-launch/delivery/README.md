# Etsy buyer delivery — GLP-1 Story Templates

## Generate files (after any catalog rebuild)

From repo root:

```bash
node scripts/generate-glp1-etsy-delivery.mjs
```

Or: `npm run etsy:glp1-delivery`

## What gets created

| File | Use on Etsy |
|------|-------------|
| `glp1-story-templates-etsy-delivery.html` | Open in **Chrome** → **Print** → **Save as PDF** → upload that PDF under **Digital files** (primary buyer doc). |
| `glp1-story-templates-links.txt` | Optional second upload — plain URLs for buyers who prefer copy/paste. |

## Listing images (already on your site)

Use these URLs in Etsy **Photo and video** (save each image, then upload):

1. https://nopriorauthorization.com/shop-previews/weight-loss/etsy-wl-01-main-thumbnail.png  
2. https://nopriorauthorization.com/shop-previews/weight-loss/etsy-wl-02-whats-included.png  
3. https://nopriorauthorization.com/shop-previews/weight-loss/etsy-wl-03-categories.png  
4. https://nopriorauthorization.com/shop-previews/weight-loss/etsy-wl-04-template-preview.png  
5. https://nopriorauthorization.com/shop-previews/weight-loss/etsy-wl-05-credibility.png  
6. https://nopriorauthorization.com/shop-previews/weight-loss/etsy-wl-06-how-it-works.png  
7. https://nopriorauthorization.com/shop-previews/weight-loss/etsy-wl-07-customize-faq.png  

## Video (optional)

There is no weight-loss–specific Remotion export in this repo yet. Export a short **MP4** in Canva or iMovie using the images above, then add it in Etsy’s video slot.

## Product alignment

Delivery links come from **`glp1-story-templates`** in `src/lib/delivery/catalog.generated.json` (10 Canva story templates). If you change titles or Canva URLs in the pipeline, **re-run the script** and re-upload to Etsy.
