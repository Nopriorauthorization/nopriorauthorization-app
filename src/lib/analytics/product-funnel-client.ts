"use client";

import type { FunnelStepId } from "@/lib/shop/funnel-types";

export const PRODUCT_FUNNEL_SESSION_KEY = "npa_product_funnel_session";

export function getOrCreateProductFunnelSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }
  try {
    let id = window.sessionStorage.getItem(PRODUCT_FUNNEL_SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.sessionStorage.setItem(PRODUCT_FUNNEL_SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export async function trackProductFunnelStep(
  sessionId: string,
  primarySlug: string,
  step: FunnelStepId,
  opts?: { revenueCents?: number; metadata?: Record<string, unknown> },
): Promise<void> {
  if (!sessionId) return;
  try {
    await fetch("/api/funnel/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        primarySlug,
        step,
        revenueCents: opts?.revenueCents,
        metadata: opts?.metadata,
      }),
    });
  } catch {
    // non-blocking
  }
}
