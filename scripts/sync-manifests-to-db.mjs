/**
 * Pushes every imports/npa-manifests-and-spec/*.json into Analytics
 * (same rows as /admin/import + "Sync from repository").
 *
 * Run after deploy or from CI with DATABASE_URL set.
 * Skips quietly if DATABASE_URL is missing (e.g. local build without DB).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MANIFEST_DIR = path.join(ROOT, "imports", "npa-manifests-and-spec");

function validateManifest(m) {
  if (!m || typeof m !== "object") return { ok: false, error: "not an object" };
  if (!m.productId || typeof m.productId !== "string") return { ok: false };
  if (!m.displayName || typeof m.displayName !== "string") return { ok: false };
  if (!m.etsySku || typeof m.etsySku !== "string") return { ok: false };
  if (!Array.isArray(m.templates) || m.templates.length === 0)
    return { ok: false };
  if (!/^[a-z0-9-]+$/.test(m.productId)) return { ok: false };
  return { ok: true, manifest: m };
}

function countFilled(templates) {
  return templates.filter((t) => {
    const u = t?.canvaTemplateUrl;
    if (!u || u === "PLACEHOLDER_CANVA_URL") return false;
    return (
      u.startsWith("https://www.canva.com/") || u.startsWith("/forms/")
    );
  }).length;
}

async function main() {
  const force = process.argv.includes("--force");

  if (!process.env.DATABASE_URL?.trim()) {
    console.log(
      "[sync-manifests-to-db] DATABASE_URL not set — skipping DB sync."
    );
    process.exit(0);
  }

  // Avoid accidental prod writes from local `npm run build` when .env.local has DATABASE_URL.
  // Vercel sets VERCEL=1. CI runners often set CI=true. Use `npm run delivery:sync-db` (--force) for local.
  if (
    !force &&
    !process.env.VERCEL &&
    !process.env.CI
  ) {
    console.log(
      "[sync-manifests-to-db] Skip (only auto-sync on Vercel/CI, or run: npm run delivery:sync-db)"
    );
    process.exit(0);
  }

  if (!fs.existsSync(MANIFEST_DIR)) {
    console.error("[sync-manifests-to-db] Missing", MANIFEST_DIR);
    process.exit(1);
  }

  const prisma = new PrismaClient();
  const files = fs
    .readdirSync(MANIFEST_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  let ok = 0;
  let skipped = 0;

  try {
    for (const fileName of files) {
      const raw = JSON.parse(
        fs.readFileSync(path.join(MANIFEST_DIR, fileName), "utf8")
      );
      const { ok: vok, manifest } = validateManifest(raw);
      if (!vok || !manifest) {
        console.warn("[skip]", fileName);
        skipped += 1;
        continue;
      }

      const filled = countFilled(manifest.templates);
      await prisma.analytics.create({
        data: {
          event: `delivery_manifest:${manifest.productId}`,
          userId: null,
          metadata: {
            ...manifest,
            _importedViaAdmin: true,
            _importedBy: "sync-manifests-to-db.mjs",
            _importedAt: new Date().toISOString(),
            _importStatus:
              filled === manifest.templates.length
                ? "ready"
                : `partial_${filled}_of_${manifest.templates.length}`,
          },
        },
      });
      ok += 1;
      console.log("[ok]", manifest.productId, `${filled}/${manifest.templates.length}`);
    }
  } finally {
    await prisma.$disconnect();
  }

  console.log(
    `[sync-manifests-to-db] Done. ${ok} written, ${skipped} skipped.`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
