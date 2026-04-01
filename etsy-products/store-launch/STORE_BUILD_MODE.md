# Store Build Mode

This is the execution flow for turning Canva designs into delivery-ready Etsy products.

## Run It

From repo root:

`npm run store:build`

Optional auto-apply for one product (high-confidence only):

`npm run store:apply -- --product lash-aftercare-kit --min-score 0.2`

This generates:

- `imports/store-build/status.json`
- `imports/store-build/store-build-checklist.md`
- `imports/store-build/unmatched-templates.json`
- `imports/store-build/manifests-clean/*.json`

## What The Output Means

- `status.json`: current completion score by product (matched vs missing Canva links)
- `store-build-checklist.md`: exact missing templates and top suggested Canva matches
- `unmatched-templates.json`: machine-readable unresolved worklist
- `manifests-clean/*.json`: cleaned manifests ready for admin import after link review

## Current Constraint

If a template still has `PLACEHOLDER_CANVA_URL`, it should not be treated as customer-ready.

## Fastest Path To Full Completion

1. Open `imports/store-build/store-build-checklist.md`
2. For each missing row, either:
   - paste the correct Canva edit URL, or
   - rename the Canva design to better match the template name
3. Re-run `npm run store:build`
4. Repeat until each product has all links matched
5. Import `imports/store-build/manifests-clean/*.json` in `/admin/import`

## Done Condition

All products in `status.json` are at 100% template completion.
