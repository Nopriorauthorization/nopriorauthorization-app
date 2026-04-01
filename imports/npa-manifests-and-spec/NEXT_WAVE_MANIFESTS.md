# Next Wave Manifests (Built)

These manifest files are now created and ready for Canva link filling:

1. `botox-social-bundle.json`
2. `filler-social-bundle.json`
3. `complete-injector-bundle.json`
4. `medspa-promo-pack.json`
5. `myths-facts-injectors.json`
6. `new-patient-membership-pack.json`
7. `iv-story-templates.json`
8. `glp1-story-templates.json`
9. `seasonal-marketing-pack.json`
10. `review-testimonial-pack.json`

## Template Coverage

- Each manifest includes **10 templates**
- Total new templates added: **100**
- All links are currently `PLACEHOLDER_CANVA_URL`

## Build Flow

1. Build each template set in Canva.
2. Replace placeholders with real Canva template links.
3. Import through `/admin/import`.
4. Verify product delivery links with `npm run delivery:issue`.

## Master Tracker

- Unified 100-template production tracker: `imports/npa-manifests-and-spec/MASTER_TEMPLATE_PRODUCTION_TRACKER.csv`
- Suggested status values:
  - `buildStatus`: `not_started | in_design | link_ready`
  - `importStatus`: `not_imported | ready_to_import | imported`
- Sync tracker links into manifests: `npm run store:sync`

## Build Sheets

- Botox starter build sheet: `imports/npa-manifests-and-spec/build-sheets/botox-social-bundle.build-sheet.md`
- Botox link tracker CSV: `imports/npa-manifests-and-spec/build-sheets/botox-social-bundle.links.csv`
- Filler starter build sheet: `imports/npa-manifests-and-spec/build-sheets/filler-social-bundle.build-sheet.md`
- Filler link tracker CSV: `imports/npa-manifests-and-spec/build-sheets/filler-social-bundle.links.csv`
- Complete Injector starter build sheet: `imports/npa-manifests-and-spec/build-sheets/complete-injector-bundle.build-sheet.md`
- Complete Injector link tracker CSV: `imports/npa-manifests-and-spec/build-sheets/complete-injector-bundle.links.csv`
- Med Spa Promo starter build sheet: `imports/npa-manifests-and-spec/build-sheets/medspa-promo-pack.build-sheet.md`
- Med Spa Promo link tracker CSV: `imports/npa-manifests-and-spec/build-sheets/medspa-promo-pack.links.csv`
- Myths vs Facts starter build sheet: `imports/npa-manifests-and-spec/build-sheets/myths-facts-injectors.build-sheet.md`
- Myths vs Facts link tracker CSV: `imports/npa-manifests-and-spec/build-sheets/myths-facts-injectors.links.csv`
- New Patient Membership starter build sheet: `imports/npa-manifests-and-spec/build-sheets/new-patient-membership-pack.build-sheet.md`
- New Patient Membership link tracker CSV: `imports/npa-manifests-and-spec/build-sheets/new-patient-membership-pack.links.csv`
- IV Story Templates starter build sheet: `imports/npa-manifests-and-spec/build-sheets/iv-story-templates.build-sheet.md`
- IV Story Templates link tracker CSV: `imports/npa-manifests-and-spec/build-sheets/iv-story-templates.links.csv`
- GLP-1 Story Templates starter build sheet: `imports/npa-manifests-and-spec/build-sheets/glp1-story-templates.build-sheet.md`
- GLP-1 Story Templates link tracker CSV: `imports/npa-manifests-and-spec/build-sheets/glp1-story-templates.links.csv`
- Seasonal Marketing starter build sheet: `imports/npa-manifests-and-spec/build-sheets/seasonal-marketing-pack.build-sheet.md`
- Seasonal Marketing link tracker CSV: `imports/npa-manifests-and-spec/build-sheets/seasonal-marketing-pack.links.csv`
- Review Testimonial starter build sheet: `imports/npa-manifests-and-spec/build-sheets/review-testimonial-pack.build-sheet.md`
- Review Testimonial link tracker CSV: `imports/npa-manifests-and-spec/build-sheets/review-testimonial-pack.links.csv`
