"use client";

/**
 * Marketing / IA analytics — pushes to `dataLayer` for GTM → GA4.
 *
 * Event names (stable contracts):
 * - npa_audience_home_strip_click
 * - npa_audience_shop_lane_click
 * - npa_micro270_hub_click
 * - npa_shop_click
 * - npa_book_click (Hello Gorgeous /book)
 * - npa_path_entered (pageview intent on /for-students | /for-providers)
 * - npa_path_first_engagement (first meaningful click on /for-students | /for-providers)
 */

export type NpaAnalyticsEvent =
  | "npa_audience_home_strip_click"
  | "npa_audience_shop_lane_click"
  | "npa_micro270_hub_click"
  | "npa_shop_click"
  | "npa_book_click"
  | "npa_path_entered"
  | "npa_path_first_engagement";

export function trackNpaEvent(
  event: NpaAnalyticsEvent,
  params?: Record<string, string | undefined>,
): void {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}
