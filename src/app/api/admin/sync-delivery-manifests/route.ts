export const dynamic = "force-dynamic";

import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin-guard";
import {
  persistDeliveryManifest,
  validateManifestPayload,
} from "@/lib/delivery/persist-manifest";

const MANIFEST_DIR = path.join(
  process.cwd(),
  "imports",
  "npa-manifests-and-spec"
);

function authorizeAutomation(req: NextRequest): boolean {
  const configured = process.env.DELIVERY_ADMIN_KEY?.trim();
  if (!configured) return false;
  const provided = req.headers.get("x-delivery-admin-key")?.trim();
  return Boolean(provided && provided === configured);
}

/**
 * POST /api/admin/sync-delivery-manifests
 *
 * Loads every *.json manifest from imports/npa-manifests-and-spec and
 * persists each to Analytics (same as manual /admin/import).
 *
 * Auth (either):
 * - Header `x-delivery-admin-key` matching env DELIVERY_ADMIN_KEY (CI / curl)
 * - Valid admin session via getAdminUser() (browser button on /admin/import)
 */
export async function POST(req: NextRequest) {
  const byKey = authorizeAutomation(req);
  const admin = byKey ? null : await getAdminUser();

  if (!byKey && !admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const actor = admin ?? {
    id: "sync-job",
    email: "delivery-sync@system",
  };

  if (!fs.existsSync(MANIFEST_DIR)) {
    return NextResponse.json(
      { error: `Manifest directory missing: ${MANIFEST_DIR}` },
      { status: 500 }
    );
  }

  const names = fs
    .readdirSync(MANIFEST_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  const results: {
    file: string;
    ok: boolean;
    productId?: string;
    error?: string;
    templatesFilled?: number;
    templatesTotal?: number;
  }[] = [];

  for (const fileName of names) {
    const filePath = path.join(MANIFEST_DIR, fileName);
    let raw: unknown;
    try {
      raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (e) {
      results.push({
        file: fileName,
        ok: false,
        error: e instanceof Error ? e.message : "Invalid JSON",
      });
      continue;
    }

    const parsed = validateManifestPayload(raw);
    if (!parsed.valid) {
      results.push({
        file: fileName,
        ok: false,
        error: parsed.error,
      });
      continue;
    }

    try {
      const stats = await persistDeliveryManifest(parsed.manifest, {
        id: actor.id,
        email: actor.email ?? "admin",
      });
      results.push({
        file: fileName,
        ok: true,
        productId: parsed.manifest.productId,
        templatesFilled: stats.templatesFilled,
        templatesTotal: stats.templatesTotal,
      });
    } catch (e) {
      results.push({
        file: fileName,
        ok: false,
        productId: parsed.manifest.productId,
        error: e instanceof Error ? e.message : "Persist failed",
      });
    }
  }

  const okCount = results.filter((r) => r.ok).length;
  const failCount = results.filter((r) => !r.ok).length;

  return NextResponse.json({
    success: failCount === 0,
    message: `Synced ${okCount} manifest(s) to the database.${failCount ? ` ${failCount} failed.` : ""}`,
    manifestDir: MANIFEST_DIR,
    results,
    okCount,
    failCount,
  });
}
