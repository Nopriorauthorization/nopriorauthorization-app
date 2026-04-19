/**
 * Dump Printify catalog print_providers (+ blueprint) for blueprint IDs.
 * Run before finalizing order payloads: variants live under each print provider.
 *
 * Usage:
 *   node scripts/printify/dump-print-providers.mjs
 *   node scripts/printify/dump-print-providers.mjs 1138 515
 *
 * Requires PRINTIFY_API_TOKEN in .env.local or environment.
 */
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const token = process.env.PRINTIFY_API_TOKEN?.trim();
const base = "https://api.printify.com/v1";

if (!token) {
  console.error("Missing PRINTIFY_API_TOKEN (.env.local or environment).");
  process.exit(1);
}

const ids = process.argv.slice(2).map((s) => Number(s.trim())).filter((n) => n > 0);
const blueprintIds = ids.length ? ids : [1138, 515];

async function get(path) {
  const res = await fetch(`${base}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "NPA-printify-dump-script",
    },
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { _raw: text.slice(0, 500) };
  }
  if (!res.ok) {
    return { ok: false, status: res.status, data };
  }
  return { ok: true, status: res.status, data };
}

for (const id of blueprintIds) {
  console.log(`\n=== blueprint ${id} ===\n`);
  const bp = await get(`/catalog/blueprints/${id}.json`);
  const pp = await get(`/catalog/blueprints/${id}/print_providers.json`);
  console.log(JSON.stringify({ blueprint: bp, print_providers: pp }, null, 2));
}
