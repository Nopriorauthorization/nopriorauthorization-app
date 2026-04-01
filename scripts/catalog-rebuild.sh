#!/usr/bin/env bash
# Rebuild the full product catalog from manifests and sync to DB.
# Usage: pnpm catalog:rebuild
set -e

echo "=== Step 1: Regenerate catalog.generated.json ==="
node scripts/import-canva-delivery-manifests.mjs

echo ""
echo "=== Step 2: Sync manifests to DB ==="
node scripts/sync-manifests-to-db.mjs --force

echo ""
echo "=== Done ==="
echo "catalog.generated.json and DB are in sync."
echo "Run 'npm run build' or deploy to update the live /shop."
