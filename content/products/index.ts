import type { DigitalProductConfig } from "@/lib/products/types";
import appealKit from "./npa-appeal-kit.config";
import checklistBundle from "./npa-checklist-bundle.config";
import intakeTemplatePack from "./npa-intake-template-pack.config";

export const PRODUCT_REGISTRY: Record<string, DigitalProductConfig> = {
  "npa-appeal-kit": appealKit,
  "npa-checklist-bundle": checklistBundle,
  "npa-intake-template-pack": intakeTemplatePack,
};

export function getProductConfig(
  slug: string,
): DigitalProductConfig | undefined {
  return PRODUCT_REGISTRY[slug];
}

export function getAllProductSlugs(): string[] {
  return Object.keys(PRODUCT_REGISTRY);
}
