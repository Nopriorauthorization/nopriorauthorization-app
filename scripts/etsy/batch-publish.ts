/**
 * Batch-publish digital listings from a single JSON table (idempotent + DB sync).
 *
 * Usage:
 *   pnpm etsy:batch-publish -- path/to/table.json
 *   pnpm etsy:batch-publish -- etsy-products/batch-publish-table.json --dry-run
 *
 * JSON shape: { "defaults": { "taxonomyId", "quantity", "publish"? }, "products": [ DigitalPublishRow, ... ] }
 */
import fs from "fs";
import path from "path";
import { loadEnvLocal } from "../products/load-env";
import {
  EtsyService,
  tryLoadEtsyCredsFromDb,
} from "@/lib/integrations/etsy/etsy.service";
import {
  publishDigitalListing,
  type DigitalPublishRow,
} from "@/lib/integrations/etsy/publish-digital-listing";
import prisma from "@/lib/db";

loadEnvLocal();

type TableFile = {
  defaults?: Partial<DigitalPublishRow> & {
    taxonomyId?: number;
    quantity?: number;
    publish?: boolean;
  };
  products: DigitalPublishRow[];
};

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const paths = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const tablePath = paths[0];
  if (!tablePath) {
    console.error(
      "Usage: pnpm etsy:batch-publish -- <table.json> [--dry-run]",
    );
    process.exit(1);
  }

  const abs = path.isAbsolute(tablePath)
    ? tablePath
    : path.join(process.cwd(), tablePath);
  if (!fs.existsSync(abs)) {
    console.error("File not found:", abs);
    process.exit(1);
  }

  const db = await tryLoadEtsyCredsFromDb();
  if (db?.accessToken && !process.env.ETSY_ACCESS_TOKEN) {
    process.env.ETSY_ACCESS_TOKEN = db.accessToken;
  }
  if (db?.shopId && !process.env.ETSY_SHOP_ID) {
    process.env.ETSY_SHOP_ID = db.shopId;
  }

  const etsy = new EtsyService();
  const table = JSON.parse(fs.readFileSync(abs, "utf8")) as TableFile;
  const defaults = table.defaults || {};

  let ok = 0;
  let fail = 0;
  let skip = 0;

  for (const raw of table.products) {
    const tags = (
      raw.tags?.length ? raw.tags : (defaults.tags as string[] | undefined)
    )?.slice(0, 13);
    const row: DigitalPublishRow = {
      productSlug: raw.productSlug,
      title: raw.title,
      description: raw.description,
      price: raw.price,
      imagePath: raw.imagePath,
      digitalFilePath: raw.digitalFilePath,
      tags: tags || [],
      taxonomyId: raw.taxonomyId ?? defaults.taxonomyId ?? 2078,
      quantity: raw.quantity ?? defaults.quantity ?? 999,
      publish: raw.publish ?? defaults.publish ?? false,
    };

    if (
      !row.productSlug ||
      !row.title ||
      !row.description ||
      !row.imagePath ||
      !row.digitalFilePath ||
      !row.tags.length
    ) {
      console.error(
        "SKIP invalid row (need slug, title, description, imagePath, digitalFilePath, tags):",
        raw.productSlug || raw,
      );
      fail++;
      continue;
    }

    if (dryRun) {
      console.log("[dry-run]", row.productSlug, row.title.slice(0, 48));
      ok++;
      continue;
    }

    const r = await publishDigitalListing(row, etsy, {
      prisma,
      maxAttempts: 4,
    });
    if (r.skipped) {
      console.log("SKIP active", row.productSlug, r.url);
      skip++;
    } else if (r.ok) {
      console.log("OK", row.productSlug, r.listingId, r.url);
      ok++;
    } else {
      console.error("FAIL", row.productSlug, r.error);
      fail++;
    }

    await new Promise((res) => setTimeout(res, 350));
  }

  console.log(`\nDone: ${ok} ok, ${skip} skipped, ${fail} failed`);
  if (fail) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
