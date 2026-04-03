import fs from "fs";
import path from "path";
import catalog from "@/lib/delivery/catalog.generated.json";

type CatalogEntry = {
  productSlug: string;
  templates?: { editUrl?: string | null }[];
};

/**
 * Public teaser HTML in `public/forms/previews/{Name}-PREVIEW.html` (optional per product).
 * Full file lives in `delivery-assets/forms/{Name}.html` and is token-gated.
 */
export function getShopInteractivePreviewSrc(productSlug: string): string | null {
  const products = (catalog as { products?: CatalogEntry[] }).products || [];
  const p = products.find((x) => x.productSlug === productSlug);
  const first = p?.templates?.[0]?.editUrl;
  if (!first?.startsWith("/forms/") || !first.endsWith(".html")) return null;

  const base = path.basename(first, ".html");
  const previewFile = `${base}-PREVIEW.html`;
  const abs = path.join(
    process.cwd(),
    "public",
    "forms",
    "previews",
    previewFile,
  );
  if (!fs.existsSync(abs)) return null;
  return `/forms/previews/${previewFile}`;
}
