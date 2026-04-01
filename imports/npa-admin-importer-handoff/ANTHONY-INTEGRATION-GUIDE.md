# NPA In-App Manifest Importer — Integration Guide
**For:** Anthony
**What this adds:** An admin page at `/admin/import` where Dani can drag-and-drop the 6 finished JSON files from the Canva Link Collector v2 and import them directly — no terminal, no folder access, no `npm run` commands.

---

## Files in this package

| File | Destination in repo |
|------|---------------------|
| `admin-import-page.tsx` | `src/app/admin/import/page.tsx` |
| `api-import-manifest-route.ts` | `src/app/api/admin/import-manifest/route.ts` |

That's it. Two files. The rest of the delivery system is unchanged.

---

## Step 1 — Copy the files

```bash
# From repo root
cp admin-import-page.tsx src/app/admin/import/page.tsx
cp api-import-manifest-route.ts src/app/api/admin/import-manifest/route.ts
```

Create the directories if they don't exist:
```bash
mkdir -p src/app/admin/import
mkdir -p src/app/api/admin/import-manifest
```

---

## Step 2 — Verify the catalog path

Open `api-import-manifest-route.ts` and confirm these two paths match your actual repo structure:

```typescript
// Line ~40
const CATALOG_PATH = path.join(
  process.cwd(),
  "src/lib/delivery/catalog.generated.json"   // ← adjust if different
);

const MANIFESTS_DIR = path.join(
  process.cwd(),
  "canva-automation/output/products"           // ← adjust if different
);
```

These should already be correct based on your existing structure, but double-check before deploying.

---

## Step 3 — Deploy

```bash
git add src/app/admin/import/page.tsx
git add src/app/api/admin/import-manifest/route.ts
git commit -m "feat: add admin manifest importer UI and API route"
git push
```

Vercel auto-deploys. Done.

---

## Step 4 — Test locally first

```bash
npm run dev
```

Open: `http://localhost:3000/admin/import`

You should see the importer page. Drop in one of the existing manifest JSONs (even the IV therapy one) to confirm the flow works before Dani uses it in production.

**Expected behavior:**
- Drop a JSON → file appears with "Ready" badge and link count
- Click Import → the API writes to `canva-automation/output/products/` AND updates `catalog.generated.json`
- Response shows "✓ Imported" with delivery-ready status

---

## Step 5 — Add auth (before going live)

The API route is currently open. Before production, add auth using your existing middleware pattern **or** use the simple secret header approach built into the route file:

**Option A — Uncomment the ADMIN_SECRET check in the route:**
```typescript
// In api-import-manifest-route.ts, uncomment lines ~55-59:
function isAuthorized(req: NextRequest): boolean {
  const secret = req.headers.get("x-admin-secret");
  return secret === process.env.ADMIN_SECRET;
}
```

Then add to the handler:
```typescript
if (!isAuthorized(req)) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

Then set in Vercel dashboard:
```
ADMIN_SECRET=your-secret-here
```

**Option B — Wrap the route with your existing auth middleware** (whatever you're already using for other admin routes)

**Option C — Put the page behind a password-protected Vercel deployment** using Vercel's built-in password protection for preview URLs.

For now (while the store isn't live yet), leaving it open locally is fine. Just lock it down before Dani starts real sales.

---

## How the full flow works after this

```
Dani opens npa-canva-link-collector-v2.html
  → pastes all 44 Canva template links
  → clicks "Download all 6 manifest files"
  → gets 6 .json files in Downloads folder

Dani opens nopriorauthorization.com/admin/import
  → drags all 6 .json files onto the page
  → each file validated instantly (link count, format check)
  → clicks "Import 6 manifests"
  → API writes each file to canva-automation/output/products/
  → API updates catalog.generated.json
  → delivery portal immediately serves all 6 products

No terminal. No npm commands. No folder access.
```

---

## What the API does (for your reference)

`POST /api/admin/import-manifest` accepts a single manifest JSON:

1. Validates structure (productId, displayName, templates array)
2. Validates productId is safe (kebab-case only, no path traversal)
3. Writes `{productId}.json` to `canva-automation/output/products/`
4. Reads current `catalog.generated.json`
5. Upserts the product (removes old entry if exists, adds new one)
6. Writes updated catalog back to disk
7. Returns JSON with delivery-ready status

The response shape:
```json
{
  "success": true,
  "productId": "weight-loss-kit",
  "displayName": "GLP-1 Weight Loss Patient Onboarding Kit",
  "etsySku": "NPA-WL-001",
  "templatesTotal": 7,
  "templatesFilled": 7,
  "deliveryReady": true,
  "message": "GLP-1 Weight Loss Patient Onboarding Kit is fully imported and delivery-ready."
}
```

---

## Troubleshooting

**"Failed to write manifest file — check server filesystem permissions"**
The Vercel serverless function can't write to the filesystem at runtime (Vercel's filesystem is read-only in production). 

Fix: Switch the catalog update to use your Supabase database instead of writing to disk. Store manifests in a `product_manifests` table and have the delivery system read from Supabase instead of `catalog.generated.json`.

This is the right long-term architecture anyway. For now, test locally where filesystem writes work fine.

**"catalog.generated.json not found — creating new"**
Normal on first run. The API creates the catalog from scratch. Run `npm run delivery:import` afterward to ensure the full sync.

**Page loads but Import button stays disabled**
All uploaded files have validation errors. Check the error messages on each file card — usually a malformed JSON or a file that's not a manifest.

---

## Supabase migration (future, when ready)

When you're ready to make this production-stable (Vercel serverless can't write to disk), the migration is:

1. Create a `product_manifests` table in Supabase:
```sql
create table product_manifests (
  product_id text primary key,
  display_name text not null,
  etsy_sku text not null,
  price_usd numeric not null,
  manifest_json jsonb not null,
  delivery_ready boolean default false,
  imported_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

2. In the API route, replace the `fs.writeFile` calls with:
```typescript
const { error } = await supabase
  .from('product_manifests')
  .upsert({ product_id: incoming.productId, manifest_json: incoming, ... });
```

3. In the delivery catalog reader, query Supabase instead of reading `catalog.generated.json`.

Flag this when Dani's store goes live and we can wire it up properly.

---

## Questions?

The admin import page is self-contained React — no external dependencies beyond what's already in the Next.js project. The API route uses only Node.js `fs` and Next.js types. Should be a clean drop-in.

— Claude / NPA Build System
