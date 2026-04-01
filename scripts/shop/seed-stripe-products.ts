/**
 * Creates Stripe Products + Prices for all shop products.
 * Run once: tsx scripts/shop/seed-stripe-products.ts
 *
 * Saves generated price IDs to scripts/shop/stripe-price-ids.json.
 * Copy these into src/lib/shop/products.ts STRIPE_PRICE_IDS if desired,
 * or keep using price_data (inline pricing) in checkout — both work.
 */
import fs from "fs";
import path from "path";
import Stripe from "stripe";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
      val = val.slice(1, -1);
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  console.error("STRIPE_SECRET_KEY not set. Add to .env.local.");
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
});

async function main() {
  const { getShopProducts } = await import("../../src/lib/shop/products");
  const products = getShopProducts();

  console.log(`Seeding ${products.length} Stripe products...\n`);

  const priceIds: Record<string, string> = {};
  const outputPath = path.join(__dirname, "stripe-price-ids.json");

  if (fs.existsSync(outputPath)) {
    Object.assign(priceIds, JSON.parse(fs.readFileSync(outputPath, "utf8")));
  }

  for (const p of products) {
    if (priceIds[p.slug]) {
      console.log(`  SKIP  ${p.slug} — already has price ${priceIds[p.slug]}`);
      continue;
    }

    try {
      const stripeProduct = await stripe.products.create({
        name: p.title,
        description: `${p.templateCount} editable templates — instant digital delivery`,
        metadata: {
          npa_slug: p.slug,
          category: p.category,
          template_count: String(p.templateCount),
        },
      });

      const price = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: p.priceCents,
        currency: "usd",
      });

      priceIds[p.slug] = price.id;
      fs.writeFileSync(outputPath, JSON.stringify(priceIds, null, 2) + "\n");
      console.log(`  OK    ${p.slug} → ${price.id} ($${(p.priceCents / 100).toFixed(2)})`);
    } catch (err) {
      console.error(`  FAIL  ${p.slug}: ${err instanceof Error ? err.message : err}`);
    }

    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\nDone. Price IDs saved to ${outputPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
