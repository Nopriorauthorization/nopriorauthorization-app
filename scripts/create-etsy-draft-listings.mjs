import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const DEFINITIONS_PATH = path.join(ROOT, "etsy-products", "store-launch", "listings", "listing-definitions.json");
const RESULTS_PATH = path.join(ROOT, "etsy-products", "store-launch", "listings", "draft-listing-ids.json");

// ---------------------------------------------------------------------------
// Load .env.local (Next.js env files are not auto-loaded by Node scripts)
// ---------------------------------------------------------------------------
function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

// ---------------------------------------------------------------------------
// Try to load token from database (production path)
// ---------------------------------------------------------------------------
async function tryLoadTokenFromDb() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) return null;

    const { default: pg } = await import("pg");
    const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
    await client.connect();
    const result = await client.query(
      `SELECT metadata FROM "Analytics" WHERE event = 'etsy_oauth_token' ORDER BY "createdAt" DESC LIMIT 1`
    );
    await client.end();

    if (result.rows.length && result.rows[0].metadata) {
      const meta = result.rows[0].metadata;
      return {
        accessToken: meta.accessToken || null,
        shopId: meta.shopId || null,
      };
    }
  } catch (e) {
    console.log("DB token lookup skipped:", e.message);
  }
  return null;
}

const dbTokens = await tryLoadTokenFromDb();
if (dbTokens?.accessToken && !process.env.ETSY_ACCESS_TOKEN) {
  process.env.ETSY_ACCESS_TOKEN = dbTokens.accessToken;
  console.log("Loaded ETSY_ACCESS_TOKEN from database");
}
if (dbTokens?.shopId && !process.env.ETSY_SHOP_ID) {
  process.env.ETSY_SHOP_ID = dbTokens.shopId;
  console.log("Loaded ETSY_SHOP_ID from database");
}

// ---------------------------------------------------------------------------
// Validate required env vars
// ---------------------------------------------------------------------------
const ETSY_ACCESS_TOKEN  = process.env.ETSY_ACCESS_TOKEN;
const ETSY_SHOP_ID       = process.env.ETSY_SHOP_ID;
const ETSY_API_KEYSTRING = process.env.ETSY_API_KEYSTRING;
const ETSY_API_SHARED_SECRET = process.env.ETSY_API_SHARED_SECRET;

const missing = [];
if (!ETSY_ACCESS_TOKEN)    missing.push("ETSY_ACCESS_TOKEN (complete OAuth at /api/etsy/auth or add to .env.local)");
if (!ETSY_SHOP_ID)         missing.push("ETSY_SHOP_ID");
if (!ETSY_API_KEYSTRING)   missing.push("ETSY_API_KEYSTRING");
if (!ETSY_API_SHARED_SECRET) missing.push("ETSY_API_SHARED_SECRET");

if (missing.length) {
  console.error("Missing required credentials:");
  for (const v of missing) console.error(`  ${v}`);
  console.error("\nEither complete Etsy OAuth at https://nopriorauthorization.com/api/etsy/auth");
  console.error("or add the values to .env.local and re-run.");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Etsy API helpers
// ---------------------------------------------------------------------------
const BASE_URL = "https://openapi.etsy.com/v3";

function etsyHeaders() {
  return {
    "x-api-key": `${ETSY_API_KEYSTRING}:${ETSY_API_SHARED_SECRET}`,
    "Authorization": `Bearer ${ETSY_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };
}

async function createDraftListing(listing) {
  const url = `${BASE_URL}/application/shops/${ETSY_SHOP_ID}/listings`;
  const body = {
    quantity:   listing.quantity,
    title:      listing.title,
    description: listing.description,
    price:      listing.price,
    who_made:   listing.who_made,
    when_made:  listing.when_made,
    taxonomy_id: listing.taxonomy_id,
    type:       listing.type,
    is_digital: listing.is_digital,
    tags:       listing.tags,
    state:      "draft",
  };

  const res = await fetch(url, {
    method:  "POST",
    headers: etsyHeaders(),
    body:    JSON.stringify(body),
  });

  const json = await res.json();
  return { ok: res.ok, status: res.status, body: json };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
}

async function main() {
  const definitions = readJson(DEFINITIONS_PATH);
  console.log(`Loaded ${definitions.length} listing definition(s) from listing-definitions.json`);

  // Load existing results to support re-runs without creating duplicates
  const results = fs.existsSync(RESULTS_PATH) ? readJson(RESULTS_PATH) : {};

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const listing of definitions) {
    const { productId } = listing;

    if (results[productId]?.listingId) {
      console.log(`  SKIP  ${productId} — already has draft listing ${results[productId].listingId}`);
      skipped++;
      continue;
    }

    process.stdout.write(`  POST  ${productId} ...`);
    const { ok, status, body } = await createDraftListing(listing);

    if (ok && body.listing_id) {
      const listingId = body.listing_id;
      results[productId] = {
        listingId,
        title: body.title || listing.title,
        state: body.state || "draft",
        url: `https://www.etsy.com/listing/${listingId}`,
        createdAt: new Date().toISOString(),
      };
      writeJson(RESULTS_PATH, results);
      console.log(` ✓  listing_id=${listingId} state=${body.state}`);
      created++;
    } else {
      console.log(` ✗  HTTP ${status}`);
      console.error(`     ${JSON.stringify(body)}`);
      failed++;
    }

    // Etsy rate limit: 10 req/sec, small pause between calls
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\nDone: ${created} created, ${skipped} skipped, ${failed} failed`);
  if (Object.keys(results).length) {
    console.log(`Results saved to: ${RESULTS_PATH}`);
  }
  if (failed > 0) {
    console.log("\nIf you see taxonomy_id errors, check the correct ID via:");
    console.log("  GET https://openapi.etsy.com/v3/application/seller-taxonomy/nodes");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
