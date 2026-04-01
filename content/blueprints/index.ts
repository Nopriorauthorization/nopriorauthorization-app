import type { ProductBlueprint } from "@/lib/products/blueprint";
import medSpa from "./med-spa.blueprint";
import weightLoss from "./weight-loss.blueprint";
import ivTherapy from "./iv-therapy.blueprint";

export const BLUEPRINT_REGISTRY: Record<string, ProductBlueprint> = {
  "med-spa": medSpa,
  "weight-loss": weightLoss,
  "iv-therapy": ivTherapy,
};

export function getBlueprint(niche: string): ProductBlueprint | undefined {
  return BLUEPRINT_REGISTRY[niche];
}

export function getAllBlueprintNiches(): string[] {
  return Object.keys(BLUEPRINT_REGISTRY);
}
