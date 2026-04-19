import { DELIVERY_PRODUCT_SLUG_ALIASES } from "@/config/growth-funnel.config";
import {
  HELLO_GORGEOUS_BOOK_SLUG,
  HELLO_GORGEOUS_BOOK_TITLE,
} from "@/config/hello-gorgeous-book.config";
import {
  ANATOMY_STUDY_SHOP_SLUG,
  getAnatomyStudyShopProductDef,
} from "@/config/anatomy-study.config";
import {
  MICRO270_SHOP_SLUG_BANK,
  MICRO270_SHOP_SLUG_BUNDLE,
  MICRO270_SHOP_SLUG_FULL,
} from "@/config/micro270-shop.config";
import { STUDY_GUIDE_NCLEX, STUDY_GUIDE_NCLEX_TEMPLATES } from "@/config/study-guides.config";
import catalog from "@/lib/delivery/catalog.generated.json";
import prisma from "@/lib/db";
import { isPrintifyPhysicalSku } from "@/lib/printify/products";

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
  /** When `physical`, checkout should route fulfillment to Printify (with SKU + inventory). */
  fulfillmentType?: "digital" | "physical";
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
    productKey: HELLO_GORGEOUS_BOOK_SLUG,
    productSlug: HELLO_GORGEOUS_BOOK_SLUG,
    productTitle: HELLO_GORGEOUS_BOOK_TITLE,
    templateCount: 1,
    templates: [
      {
        title: "Hello Gorgeous — THE BOOK (full PDF, 24 chapters)",
        designId: null,
        editUrl: "/deliverables/HelloGorgeous-THE-BOOK.pdf",
        viewUrl: null as string | null,
      },
    ],
  },
  {
    productKey: MICRO270_SHOP_SLUG_BANK,
    productSlug: MICRO270_SHOP_SLUG_BANK,
    productTitle: "Micro 270 — Complete Question Bank",
    templateCount: 1,
    templates: [
      {
        title: "Micro 270 Study Hub — all 20 chapters",
        designId: null,
        editUrl: "/micro270",
        viewUrl: null as string | null,
      },
    ],
  },
  {
    productKey: MICRO270_SHOP_SLUG_BUNDLE,
    productSlug: MICRO270_SHOP_SLUG_BUNDLE,
    productTitle: "Micro 270 Bank + AI Cram Tool (3 generations)",
    templateCount: 1,
    templates: [
      {
        title: "Micro 270 Study Hub — all 20 chapters",
        designId: null,
        editUrl: "/micro270",
        viewUrl: null as string | null,
      },
    ],
  },
  {
    productKey: MICRO270_SHOP_SLUG_FULL,
    productSlug: MICRO270_SHOP_SLUG_FULL,
    productTitle: "Micro 270 Full Access — Bank + unlimited AI cram",
    templateCount: 1,
    templates: [
      {
        title: "Micro 270 Study Hub — all 20 chapters",
        designId: null,
        editUrl: "/micro270",
        viewUrl: null as string | null,
      },
    ],
  },
  (() => {
    const def = getAnatomyStudyShopProductDef();
    return {
      productKey: ANATOMY_STUDY_SHOP_SLUG,
      productSlug: ANATOMY_STUDY_SHOP_SLUG,
      productTitle: def.title,
      templateCount: def.templateCount,
      templates: [
        {
          title: "Anatomy & Physiology Study Hub — activate in browser",
          designId: null,
          editUrl: "/nursing-study/anatomy",
          viewUrl: null as string | null,
        },
      ],
    };
  })(),
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

export function getFulfillmentTypeForProductSlug(
  productSlug: string,
): "digital" | "physical" {
  const resolved = resolveDeliveryProductSlug(productSlug);
  const row = getDeliveryProductBySlug(productSlug);
  if (row?.fulfillmentType === "physical") return "physical";
  if (isPrintifyPhysicalSku(resolved) || isPrintifyPhysicalSku(productSlug)) {
    return "physical";
  }
  return "digital";
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
