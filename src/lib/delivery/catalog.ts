import { DELIVERY_PRODUCT_SLUG_ALIASES } from "@/config/growth-funnel.config";
import {
  INFORMED_BEAUTY_DELIVERY_FORM_PATH,
  INFORMED_BEAUTY_GUIDE_SLUG,
  INFORMED_BEAUTY_TITLE,
} from "@/config/informed-beauty-guide.config";
import { STUDY_GUIDE_NCLEX, STUDY_GUIDE_NCLEX_TEMPLATES } from "@/config/study-guides.config";
import catalog from "@/lib/delivery/catalog.generated.json";
import prisma from "@/lib/db";

function resolveDeliveryProductSlug(productSlug: string): string {
  return DELIVERY_PRODUCT_SLUG_ALIASES[productSlug] || productSlug;
}

export type DeliveryTemplateLink = {
  title: string;
  designId: string | null;
  editUrl: string | null;
  viewUrl: string | null;
};

export type DeliveryProduct = {
  productKey: string;
  productSlug: string;
  productTitle: string;
  templateCount: number;
  templates: DeliveryTemplateLink[];
};

/** Token delivery for products not listed in `catalog.generated.json` (e.g. study guides). */
const VIRTUAL_DELIVERY_PRODUCTS: DeliveryProduct[] = [
  {
    productKey: STUDY_GUIDE_NCLEX.slug,
    productSlug: STUDY_GUIDE_NCLEX.slug,
    productTitle: STUDY_GUIDE_NCLEX.title,
    templateCount: STUDY_GUIDE_NCLEX_TEMPLATES.length,
    templates: STUDY_GUIDE_NCLEX_TEMPLATES.map((t) => ({
      title: t.title,
      designId: t.designId,
      editUrl: t.editUrl,
      viewUrl: null as string | null,
    })),
  },
  {
    productKey: INFORMED_BEAUTY_GUIDE_SLUG,
    productSlug: INFORMED_BEAUTY_GUIDE_SLUG,
    productTitle: INFORMED_BEAUTY_TITLE,
    templateCount: 1,
    templates: [
      {
        title: "The Informed Beauty Guide — complete (all sections, one HTML)",
        designId: null,
        editUrl: INFORMED_BEAUTY_DELIVERY_FORM_PATH,
        viewUrl: null as string | null,
      },
    ],
  },
];

type ImportedManifestTemplate = {
  id?: string;
  name?: string;
  description?: string;
  canvaTemplateUrl?: string;
  format?: string;
  pages?: number;
  category?: string;
};

type ImportedManifest = {
  productId?: string;
  displayName?: string;
  templates?: ImportedManifestTemplate[];
};

type CatalogShape = {
  generatedAt?: string;
  products?: DeliveryProduct[];
};

const typedCatalog = catalog as CatalogShape;
const DELIVERY_MANIFEST_EVENT_PREFIX = "delivery_manifest:";

export function getDeliveryProducts(): DeliveryProduct[] {
  return typedCatalog.products || [];
}

export function getVirtualDeliveryProductTitle(productSlug: string): string | null {
  const resolved = resolveDeliveryProductSlug(productSlug);
  const v = VIRTUAL_DELIVERY_PRODUCTS.find((p) => p.productSlug === resolved);
  return v?.productTitle ?? null;
}

export function getDeliveryProductBySlug(
  productSlug: string
): DeliveryProduct | null {
  const resolved = resolveDeliveryProductSlug(productSlug);
  const virtual = VIRTUAL_DELIVERY_PRODUCTS.find((p) => p.productSlug === resolved);
  if (virtual) return virtual;
  return (
    getDeliveryProducts().find((product) => product.productSlug === resolved) ||
    null
  );
}

export function getDeliveryCatalogGeneratedAt(): string | null {
  return typedCatalog.generatedAt || null;
}

function normalizeImportedManifest(
  manifest: ImportedManifest
): DeliveryProduct | null {
  if (!manifest.productId || !manifest.displayName) return null;

  const templates = Array.isArray(manifest.templates)
    ? manifest.templates
        .filter(
          (template) =>
            template?.name &&
            template.canvaTemplateUrl &&
            template.canvaTemplateUrl !== "PLACEHOLDER_CANVA_URL"
        )
        .map((template) => ({
          title: template.name || "Untitled template",
          designId: template.id || null,
          editUrl: template.canvaTemplateUrl || null,
          viewUrl: null as string | null,
        }))
    : [];

  return {
    productKey: manifest.productId,
    productSlug: manifest.productId,
    productTitle: manifest.displayName,
    templateCount: templates.length,
    templates,
  };
}

export async function getDeliveryProductBySlugAsync(
  productSlug: string
): Promise<DeliveryProduct | null> {
  const resolved = resolveDeliveryProductSlug(productSlug);
  const local = getDeliveryProductBySlug(productSlug);
  if (local) return local;

  const record = await prisma.analytics.findFirst({
    where: {
      event: `${DELIVERY_MANIFEST_EVENT_PREFIX}${resolved}`,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record?.metadata) return null;
  return normalizeImportedManifest(record.metadata as ImportedManifest);
}
