import fs from "fs";
import path from "path";
import type { DigitalProductConfig } from "@/lib/products/types";
import appealKit from "./npa-appeal-kit.config";
import checklistBundle from "./npa-checklist-bundle.config";
import intakeTemplatePack from "./npa-intake-template-pack.config";

const HAND_CRAFTED: Record<string, DigitalProductConfig> = {
  "npa-appeal-kit": appealKit,
  "npa-checklist-bundle": checklistBundle,
  "npa-intake-template-pack": intakeTemplatePack,
};

function loadGeneratedConfigs(): Record<string, DigitalProductConfig> {
  const genDir = path.join(process.cwd(), "content", "products", "generated");
  if (!fs.existsSync(genDir)) return {};

  const out: Record<string, DigitalProductConfig> = {};
  const files = fs
    .readdirSync(genDir)
    .filter((f) => f.endsWith(".config.json"));

  for (const file of files) {
    try {
      const config = JSON.parse(
        fs.readFileSync(path.join(genDir, file), "utf8"),
      ) as DigitalProductConfig;
      if (config.slug) out[config.slug] = config;
    } catch {
      // skip malformed files
    }
  }

  return out;
}

let _registry: Record<string, DigitalProductConfig> | null = null;

function getRegistry(): Record<string, DigitalProductConfig> {
  if (_registry) return _registry;
  _registry = { ...HAND_CRAFTED, ...loadGeneratedConfigs() };
  return _registry;
}

export const PRODUCT_REGISTRY = new Proxy(
  {} as Record<string, DigitalProductConfig>,
  {
    get: (_target, prop: string) => getRegistry()[prop],
    ownKeys: () => Object.keys(getRegistry()),
    getOwnPropertyDescriptor: (_target, prop: string) => {
      const reg = getRegistry();
      if (prop in reg) {
        return { configurable: true, enumerable: true, value: reg[prop] };
      }
      return undefined;
    },
    has: (_target, prop: string) => prop in getRegistry(),
  },
);

export function getProductConfig(
  slug: string,
): DigitalProductConfig | undefined {
  return getRegistry()[slug];
}

export function getAllProductSlugs(): string[] {
  return Object.keys(getRegistry());
}
