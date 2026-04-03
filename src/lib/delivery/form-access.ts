import fs from "fs";
import path from "path";
import { FREE_PUBLIC_FORM_SET } from "@/lib/delivery/free-public-forms";

/**
 * Paid / shop HTML: file on disk under delivery-assets/forms/.
 * Catalog URLs stay /forms/Filename.html for backwards compatibility.
 */
export function isFreePublicFormPath(editUrl: string | null | undefined): boolean {
  return !!editUrl && FREE_PUBLIC_FORM_SET.has(editUrl);
}

export function isGatedFormPath(editUrl: string | null | undefined): boolean {
  if (!editUrl || !editUrl.startsWith("/forms/") || !editUrl.endsWith(".html")) {
    return false;
  }
  if (isFreePublicFormPath(editUrl)) return false;
  return resolveGatedFormFile(editUrl) !== null;
}

export function resolveGatedFormFile(editUrl: string): string | null {
  if (!editUrl.startsWith("/forms/")) return null;
  const fileName = path.basename(editUrl);
  const abs = path.join(process.cwd(), "delivery-assets", "forms", fileName);
  if (!fs.existsSync(abs)) return null;
  return abs;
}
