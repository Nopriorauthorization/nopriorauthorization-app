"use client";

/**
 * Funnel analytics — pushes to dataLayer for GTM / GA4.
 */

export type FunnelEventName =
  | "funnel_growth_system_click"
  | "funnel_membership_click"
  | "funnel_upgrade_growth_click"
  | "funnel_tier_table_product_click"
  | "funnel_growth_to_membership_click"
  | "funnel_informed_beauty_checkout";

export function trackFunnelEvent(
  event: FunnelEventName,
  params?: Record<string, string | undefined>,
): void {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}
