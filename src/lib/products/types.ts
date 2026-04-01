export type BrandId = "npa" | "hello-gorgeous";

export type CanvaDesignStrategy =
  | "use-existing-template"
  | "create-from-template"
  | "export-existing-design";

export type DigitalProductConfig = {
  slug: string;
  internalName: string;
  listingTitleSeed: string;
  brand: "No Prior Authorization" | "Hello Gorgeous";
  brandId: BrandId;
  category: string;
  audience: string[];
  keywords: string[];
  tagsSeed: string[];
  descriptionSeed: string;
  canvaTemplateIds?: string[];
  canvaDesignIds?: string[];
  canvaDesignStrategy: CanvaDesignStrategy;
  exportFormats: ("png" | "pdf")[];
  deliveryFiles: {
    includeInstructions: boolean;
    includeCanvaLinks: boolean;
    includeBonusFiles: boolean;
  };
  etsy: {
    priceUsd: number;
    quantity: number;
    isDigital: true;
    shouldCreateDraft: boolean;
  };
};

export type StepStatus = "ok" | "skipped" | "error";

export type BuildStepResult = {
  step: string;
  status: StepStatus;
  durationMs: number;
  message?: string;
  files?: string[];
};

export type BuildManifest = {
  slug: string;
  brand: string;
  buildId: string;
  builtAt: string;
  steps: BuildStepResult[];
  outputDir: string;
  archivePath: string | null;
  etsyDraft?: {
    listingId: number;
    state: string;
    url: string;
    createdAt: string;
  };
  canvaExports?: {
    designId: string;
    format: string;
    status: string;
    files?: string[];
  }[];
};

export class ConfigError extends Error {
  constructor(
    public field: string,
    message: string,
  ) {
    super(`Config error [${field}]: ${message}`);
    this.name = "ConfigError";
  }
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function assertValidConfig(c: unknown): asserts c is DigitalProductConfig {
  if (!c || typeof c !== "object") throw new ConfigError("root", "Must be an object");
  const o = c as Record<string, unknown>;

  if (typeof o.slug !== "string" || !SLUG_RE.test(o.slug))
    throw new ConfigError("slug", "Must be lowercase kebab-case");

  if (typeof o.internalName !== "string" || !o.internalName.trim())
    throw new ConfigError("internalName", "Required non-empty string");

  if (typeof o.listingTitleSeed !== "string" || !o.listingTitleSeed.trim())
    throw new ConfigError("listingTitleSeed", "Required non-empty string");

  if (o.brand !== "No Prior Authorization" && o.brand !== "Hello Gorgeous")
    throw new ConfigError("brand", 'Must be "No Prior Authorization" or "Hello Gorgeous"');

  if (o.brandId !== "npa" && o.brandId !== "hello-gorgeous")
    throw new ConfigError("brandId", 'Must be "npa" or "hello-gorgeous"');

  if (typeof o.category !== "string" || !o.category.trim())
    throw new ConfigError("category", "Required non-empty string");

  if (!Array.isArray(o.audience) || o.audience.length === 0)
    throw new ConfigError("audience", "Must be non-empty array");

  if (!Array.isArray(o.keywords) || o.keywords.length === 0)
    throw new ConfigError("keywords", "Must be non-empty array");

  if (!Array.isArray(o.tagsSeed) || o.tagsSeed.length === 0)
    throw new ConfigError("tagsSeed", "Must be non-empty array");

  if (typeof o.descriptionSeed !== "string" || !o.descriptionSeed.trim())
    throw new ConfigError("descriptionSeed", "Required non-empty string");

  const strategies: CanvaDesignStrategy[] = [
    "use-existing-template",
    "create-from-template",
    "export-existing-design",
  ];
  if (!strategies.includes(o.canvaDesignStrategy as CanvaDesignStrategy))
    throw new ConfigError("canvaDesignStrategy", `Must be one of: ${strategies.join(", ")}`);

  if (!Array.isArray(o.exportFormats))
    throw new ConfigError("exportFormats", "Must be an array");

  const df = o.deliveryFiles;
  if (!df || typeof df !== "object")
    throw new ConfigError("deliveryFiles", "Required object");

  const etsy = o.etsy;
  if (!etsy || typeof etsy !== "object")
    throw new ConfigError("etsy", "Required object");

  const e = etsy as Record<string, unknown>;
  if (typeof e.priceUsd !== "number" || e.priceUsd <= 0)
    throw new ConfigError("etsy.priceUsd", "Must be > 0");

  if (typeof e.quantity !== "number" || e.quantity < 1)
    throw new ConfigError("etsy.quantity", "Must be >= 1");

  if (e.isDigital !== true)
    throw new ConfigError("etsy.isDigital", "Must be true");
}
