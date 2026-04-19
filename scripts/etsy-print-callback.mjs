#!/usr/bin/env node
/**
 * Prints the exact Etsy OAuth redirect_uri this repo will use (env override or canonical default).
 * Register this **exact** string in Etsy → Your Apps → Redirect URI(s).
 *
 * Usage: npm run etsy:print-callback
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const CANONICAL = "https://nopriorauthorization.com/api/etsy/callback";

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

loadEnvLocal();
const fromEnv = process.env.ETSY_OAUTH_REDIRECT_URI?.trim();
const effective = fromEnv || CANONICAL;
const source = fromEnv ? "ETSY_OAUTH_REDIRECT_URI (.env.local or shell)" : "canonical default (NPA_SITE_URL + /api/etsy/callback)";

console.log("Etsy OAuth redirect_uri (use this on Etsy Developer → Your Apps):\n");
console.log(effective);
console.log("\nSource:", source);
if (fromEnv && fromEnv !== CANONICAL) {
  console.log("\nCanonical in repo (for comparison):", CANONICAL);
  if (fromEnv.replace(/\/$/, "") !== CANONICAL.replace(/\/$/, "")) {
    console.warn(
      "\n⚠ Mismatch vs canonical — ensure Etsy lists **this** effective URL, not the other.",
    );
  }
}
console.log(
  "\nEtsy handler route: GET /api/etsy/callback (same path as URL above).",
);
