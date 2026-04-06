import type { ShopProductFunnel } from "@prisma/client";

export const FUNNEL_FINAL_REDIRECTS = ["post_purchase", "thank_you", "membership"] as const;
export type FunnelFinalRedirect = (typeof FUNNEL_FINAL_REDIRECTS)[number];

export const FUNNEL_STEPS = [
  "funnel_landing_view",
  "bump_toggle",
  "checkout_email_submit",
  "checkout_redirect",
  "payment_complete",
  "post_upsell_view",
  "post_upsell_accept",
  "post_upsell_decline",
  "final_redirect",
] as const;
export type FunnelStepId = (typeof FUNNEL_STEPS)[number];

export type ResolvedShopFunnel = Pick<
  ShopProductFunnel,
  "enabled" | "useDedicatedLanding" | "bumpSlugs" | "postUpsellSlugs" | "finalRedirect"
> & {
  source: "product" | "category" | "none";
};

export function normalizeFinalRedirect(v: string): FunnelFinalRedirect {
  if (FUNNEL_FINAL_REDIRECTS.includes(v as FunnelFinalRedirect)) {
    return v as FunnelFinalRedirect;
  }
  return "post_purchase";
}
