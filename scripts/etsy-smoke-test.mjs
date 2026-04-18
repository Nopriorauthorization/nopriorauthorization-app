#!/usr/bin/env node
/**
 * Read-only Etsy Open API check: GET active listings (limit 1).
 * Loads .env.local + optional DB token (same pattern as create-etsy-draft-listings.mjs).
 *
 * Safe to run while app is "pending" — you only learn whether auth + shop work.
 * Usage: npm run etsy:smoke
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();

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
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

async function tryLoadTokenFromDb() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) return null;
    const { default: pg } = await import("pg");
    const client = new pg.Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    const result = await client.query(
      `SELECT metadata FROM "Analytics" WHERE event = 'etsy_oauth_token' ORDER BY "createdAt" DESC LIMIT 1`,
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
    console.log("(DB token lookup skipped:", e.message + ")");
  }
  return null;
}

loadEnvLocal();
const dbTokens = await tryLoadTokenFromDb();
if (dbTokens?.accessToken && !process.env.ETSY_ACCESS_TOKEN) {
  process.env.ETSY_ACCESS_TOKEN = dbTokens.accessToken;
  console.log("Loaded ETSY_ACCESS_TOKEN from database\n");
}
if (dbTokens?.shopId && !process.env.ETSY_SHOP_ID) {
  process.env.ETSY_SHOP_ID = dbTokens.shopId;
  console.log("Loaded ETSY_SHOP_ID from database\n");
}

const token = process.env.ETSY_ACCESS_TOKEN;
const shopId = process.env.ETSY_SHOP_ID;
const key = process.env.ETSY_API_KEYSTRING;
const secret = process.env.ETSY_API_SHARED_SECRET;

const missing = [];
if (!token) missing.push("ETSY_ACCESS_TOKEN (OAuth or .env.local)");
if (!shopId) missing.push("ETSY_SHOP_ID");
if (!key) missing.push("ETSY_API_KEYSTRING");
if (!secret) missing.push("ETSY_API_SHARED_SECRET");

if (missing.length) {
  console.error("Missing:\n  " + missing.join("\n  "));
  console.error(
    "\nFix: add vars to .env.local and/or complete OAuth on your deployed site.",
  );
  process.exit(1);
}

const url = new URL(
  `https://openapi.etsy.com/v3/application/shops/${encodeURIComponent(shopId)}/listings/active`,
);
url.searchParams.set("limit", "1");
url.searchParams.set("offset", "0");

const res = await fetch(url.toString(), {
  method: "GET",
  headers: {
    "x-api-key": `${key}:${secret}`,
    Authorization: `Bearer ${token}`,
  },
});

const json = await res.json().catch(() => ({}));
const count = Array.isArray(json.results) ? json.results.length : null;

console.log(`GET …/shops/${shopId}/listings/active?limit=1`);
console.log(`HTTP ${res.status}`);

if (res.ok) {
  console.log("\nOK — Etsy accepted your credentials for a read request.");
  if (count !== null) console.log(`Sample batch: ${count} listing(s) in this page.`);
  process.exit(0);
}

console.log("\nEtsy did not accept this request. Common causes:");
console.log("  • App still pending / not recognized → wait for Etsy or email developer@etsy.com");
console.log("  • Expired OAuth token → reconnect via /api/etsy/auth on your site");
console.log("  • Missing listings_r scope → reconnect with scopes in getEtsyEnv / ETSY_OAUTH_SCOPES");
console.log("  • Wrong shop id → use GET /api/etsy/shops on your deployed app when logged in as owner\n");
console.log("Body (truncated):");
console.log(JSON.stringify(json).slice(0, 800));
process.exit(1);
