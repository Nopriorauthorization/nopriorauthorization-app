import fs from "fs";
import path from "path";
import { getDeliveryCatalogGeneratedAt } from "@/lib/delivery/catalog";
import type { LibraryProductRow, LibraryTemplateRow } from "@/lib/admin/library-types";

export type { LibraryProductRow, LibraryTemplateRow } from "@/lib/admin/library-types";

function classifyUrl(url: string | undefined | null): LibraryTemplateRow["deliveryKind"] {
  if (!url || url === "PLACEHOLDER_CANVA_URL") return "placeholder";
  if (url.startsWith("/forms/")) return "html";
  if (url.startsWith("https://www.canva.com/")) return "canva";
  return "placeholder";
}

export function readLibraryManifestsFromDisk(): LibraryProductRow[] {
  const dir = path.join(process.cwd(), "imports", "npa-manifests-and-spec");
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b));

  const out: LibraryProductRow[] = [];

  for (const fileName of files) {
    let raw: Record<string, unknown>;
    try {
      raw = JSON.parse(
        fs.readFileSync(path.join(dir, fileName), "utf8")
      ) as Record<string, unknown>;
    } catch {
      continue;
    }

    const productId = raw.productId;
    const displayName = raw.displayName;
    const templatesRaw = raw.templates;
    if (typeof productId !== "string" || typeof displayName !== "string")
      continue;
    if (!Array.isArray(templatesRaw)) continue;

    const templates: LibraryTemplateRow[] = templatesRaw.map((t) => {
      const tr = t as Record<string, unknown>;
      const url = (tr.canvaTemplateUrl as string) || "";
      return {
        id: String(tr.id || ""),
        name: String(tr.name || ""),
        description: String(tr.description || ""),
        canvaTemplateUrl: url,
        format: tr.format as string | undefined,
        pages: typeof tr.pages === "number" ? tr.pages : undefined,
        category: tr.category as string | undefined,
        deliveryKind: classifyUrl(url),
      };
    });

    const filledCount = templates.filter((t) => t.deliveryKind !== "placeholder")
      .length;

    out.push({
      productId,
      displayName,
      description: String(raw.description || ""),
      version: raw.version as string | undefined,
      priceUSD: typeof raw.priceUSD === "number" ? raw.priceUSD : undefined,
      etsySku: String(raw.etsySku || ""),
      category: raw.category as string | undefined,
      targetBuyer: raw.targetBuyer as string | undefined,
      templates,
      sourceFile: fileName,
      filledCount,
      totalCount: templates.length,
    });
  }

  out.sort((a, b) => a.displayName.localeCompare(b.displayName));
  return out;
}

export function getLibraryCatalogMeta(): { generatedAt: string | null } {
  return { generatedAt: getDeliveryCatalogGeneratedAt() };
}
