import prisma from "@/lib/db";
import { getShopProductBySlug } from "@/lib/shop/products";
import type { ResolvedShopFunnel } from "@/lib/shop/funnel-types";
import { normalizeFinalRedirect } from "@/lib/shop/funnel-types";

export async function resolveShopFunnelForSlug(productSlug: string): Promise<ResolvedShopFunnel> {
  const none: ResolvedShopFunnel = {
    enabled: false,
    useDedicatedLanding: false,
    bumpSlugs: [],
    postUpsellSlugs: [],
    finalRedirect: "post_purchase",
    source: "none",
  };

  try {
    const byProduct = await prisma.shopProductFunnel.findFirst({
      where: { productSlug, enabled: true },
    });
    if (byProduct) {
      return {
        enabled: true,
        useDedicatedLanding: byProduct.useDedicatedLanding,
        bumpSlugs: clampBumps(byProduct.bumpSlugs),
        postUpsellSlugs: clampUpsells(byProduct.postUpsellSlugs),
        finalRedirect: normalizeFinalRedirect(byProduct.finalRedirect),
        source: "product",
      };
    }

    const product = getShopProductBySlug(productSlug);
    if (!product?.category) {
      return none;
    }

    const byCat = await prisma.shopProductFunnel.findFirst({
      where: { categoryDefault: product.category, enabled: true },
    });
    if (byCat) {
      return {
        enabled: true,
        useDedicatedLanding: byCat.useDedicatedLanding,
        bumpSlugs: clampBumps(byCat.bumpSlugs),
        postUpsellSlugs: clampUpsells(byCat.postUpsellSlugs),
        finalRedirect: normalizeFinalRedirect(byCat.finalRedirect),
        source: "category",
      };
    }
  } catch (e) {
    console.warn("[resolveShopFunnelForSlug] funnel DB unavailable:", e);
  }

  return none;
}

export function clampBumps(slugs: string[]): string[] {
  return slugs.map((s) => s.trim()).filter(Boolean).slice(0, 3);
}

export function clampUpsells(slugs: string[]): string[] {
  return slugs.map((s) => s.trim()).filter(Boolean).slice(0, 2);
}

/** Validate bump selection is subset of allowed funnel bumps, all real shop SKUs. */
export function validateBumpSelection(
  allowed: string[],
  selected: string[],
): { ok: true; slugs: string[] } | { ok: false; error: string } {
  const allow = new Set(allowed);
  const out: string[] = [];
  for (const s of selected) {
    const t = s.trim();
    if (!t) continue;
    if (!allow.has(t)) {
      return { ok: false, error: `Bump not allowed for this funnel: ${t}` };
    }
    const p = getShopProductBySlug(t);
    if (!p) {
      return { ok: false, error: `Unknown bump product: ${t}` };
    }
    if (!out.includes(t)) out.push(t);
  }
  if (out.length > 3) {
    return { ok: false, error: "Maximum 3 order bumps" };
  }
  return { ok: true, slugs: out };
}
