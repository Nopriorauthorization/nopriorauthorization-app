import fs from "fs";
import path from "path";

/**
 * HTML under /forms/ that must never be statically public — only served through
 * GET /api/delivery/html with a valid purchase token.
 *
 * Catalog/manifests may still list editUrl as /forms/... for consistency; the
 * delivery page swaps in the gated URL for buyers.
 */
export const GATED_FORM_PUBLIC_PATHS = new Set<string>([
  "/forms/NPA-Botox-Clinical-Cheat-Sheet.html",
]);

export function isGatedFormPath(editUrl: string | null | undefined): boolean {
  return !!editUrl && GATED_FORM_PUBLIC_PATHS.has(editUrl);
}

/** Absolute path to gated file on disk, or null if unknown / missing. */
export function resolveGatedFormFile(editUrl: string): string | null {
  if (!editUrl.startsWith("/forms/")) return null;
  const fileName = path.basename(editUrl);
  const abs = path.join(process.cwd(), "delivery-assets", "forms", fileName);
  if (!fs.existsSync(abs)) return null;
  return abs;
}
