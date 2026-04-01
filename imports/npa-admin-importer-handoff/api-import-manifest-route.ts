/**
 * NPA Admin — Import Manifest API Route
 * File: src/app/api/admin/import-manifest/route.ts
 *
 * POST /api/admin/import-manifest
 * Receives a single manifest JSON object, validates it,
 * merges it into catalog.generated.json, and triggers re-import.
 *
 * SECURITY: Add your auth middleware or check ADMIN_SECRET header before
 * deploying to production. See the comment block below.
 *
 * Called by: src/app/admin/import/page.tsx
 */

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ManifestTemplate {
  id: string;
  name: string;
  description: string;
  canvaTemplateUrl: string;
  format: string;
  pages: number;
  category: string;
}

interface Manifest {
  productId: string;
  displayName: string;
  description: string;
  version: string;
  priceUSD: number;
  etsySku: string;
  templates: ManifestTemplate[];
  deliveryNote: string;
  expirationDays: number;
  [key: string]: unknown;
}

interface CatalogEntry {
  productId: string;
  displayName: string;
  description: string;
  priceUSD: number;
  etsySku: string;
  deliveryNote: string;
  expirationDays: number;
  templates: ManifestTemplate[];
  importedAt: string;
  version: string;
}

interface Catalog {
  version: string;
  generatedAt: string;
  products: CatalogEntry[];
}

// ─── Paths ────────────────────────────────────────────────────────────────────

const CATALOG_PATH = path.join(
  process.cwd(),
  "src/lib/delivery/catalog.generated.json"
);

const MANIFESTS_DIR = path.join(
  process.cwd(),
  "canva-automation/output/products"
);

// ─── Auth check (ENABLE IN PRODUCTION) ────────────────────────────────────────
// Uncomment this block and set ADMIN_SECRET in your Vercel env vars:
//
// function isAuthorized(req: NextRequest): boolean {
//   const secret = req.headers.get("x-admin-secret");
//   return secret === process.env.ADMIN_SECRET;
// }

// ─── Validation ───────────────────────────────────────────────────────────────

function validateIncoming(data: unknown): { valid: boolean; error?: string } {
  if (!data || typeof data !== "object") return { valid: false, error: "Not a valid JSON object" };
  const m = data as Record<string, unknown>;

  if (!m.productId || typeof m.productId !== "string")
    return { valid: false, error: "Missing productId" };
  if (!m.displayName || typeof m.displayName !== "string")
    return { valid: false, error: "Missing displayName" };
  if (!m.etsySku || typeof m.etsySku !== "string")
    return { valid: false, error: "Missing etsySku" };
  if (!Array.isArray(m.templates) || m.templates.length === 0)
    return { valid: false, error: "Missing or empty templates array" };

  // productId must be kebab-case safe
  if (!/^[a-z0-9-]+$/.test(m.productId as string))
    return { valid: false, error: "productId must be lowercase letters, numbers, and hyphens only" };

  return { valid: true };
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // ── Auth (uncomment when ready) ──
  // if (!isAuthorized(req)) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { valid, error } = validateIncoming(body);
  if (!valid) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const incoming = body as Manifest;

  // ── Count filled templates ──
  const filledTemplates = incoming.templates.filter(
    (t) =>
      t.canvaTemplateUrl &&
      t.canvaTemplateUrl !== "PLACEHOLDER_CANVA_URL" &&
      t.canvaTemplateUrl.startsWith("https://www.canva.com/")
  );

  // ── Write the raw manifest JSON to the products folder ──
  // This preserves the file-based workflow Anthony already built
  try {
    await fs.mkdir(MANIFESTS_DIR, { recursive: true });
    const manifestPath = path.join(MANIFESTS_DIR, `${incoming.productId}.json`);
    const toWrite = {
      ...incoming,
      _importedViaAdmin: true,
      _importedAt: new Date().toISOString(),
      _importStatus: filledTemplates.length === incoming.templates.length
        ? "ready"
        : `partial_${filledTemplates.length}_of_${incoming.templates.length}`,
    };
    await fs.writeFile(manifestPath, JSON.stringify(toWrite, null, 2), "utf-8");
  } catch (err) {
    console.error("[import-manifest] Failed to write manifest file:", err);
    return NextResponse.json(
      { error: "Failed to write manifest file — check server filesystem permissions" },
      { status: 500 }
    );
  }

  // ── Update catalog.generated.json ──
  let catalog: Catalog = {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    products: [],
  };

  try {
    const raw = await fs.readFile(CATALOG_PATH, "utf-8");
    catalog = JSON.parse(raw) as Catalog;
  } catch {
    // Catalog doesn't exist yet — we'll create it fresh
    console.warn("[import-manifest] catalog.generated.json not found — creating new");
  }

  // Remove existing entry for this productId (upsert)
  catalog.products = catalog.products.filter(
    (p) => p.productId !== incoming.productId
  );

  // Build the catalog entry (only include delivery-relevant fields)
  const entry: CatalogEntry = {
    productId: incoming.productId,
    displayName: incoming.displayName,
    description: incoming.description,
    priceUSD: incoming.priceUSD,
    etsySku: incoming.etsySku,
    deliveryNote: incoming.deliveryNote,
    expirationDays: incoming.expirationDays ?? 365,
    version: incoming.version ?? "1.0.0",
    importedAt: new Date().toISOString(),
    templates: incoming.templates.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      canvaTemplateUrl: t.canvaTemplateUrl,
      format: t.format,
      pages: t.pages,
      category: t.category,
    })),
  };

  catalog.products.push(entry);
  catalog.generatedAt = new Date().toISOString();

  try {
    await fs.writeFile(CATALOG_PATH, JSON.stringify(catalog, null, 2), "utf-8");
  } catch (err) {
    console.error("[import-manifest] Failed to update catalog:", err);
    return NextResponse.json(
      { error: "Manifest file written but catalog update failed — run npm run delivery:import manually" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    productId: incoming.productId,
    displayName: incoming.displayName,
    etsySku: incoming.etsySku,
    templatesTotal: incoming.templates.length,
    templatesFilled: filledTemplates.length,
    deliveryReady: filledTemplates.length === incoming.templates.length,
    message: filledTemplates.length === incoming.templates.length
      ? `${incoming.displayName} is fully imported and delivery-ready.`
      : `${incoming.displayName} imported with ${filledTemplates.length}/${incoming.templates.length} templates filled. Remaining templates have placeholder URLs.`,
  });
}
