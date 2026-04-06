"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckoutEmailDialog } from "@/components/checkout/CheckoutEmailDialog";
import { type FunnelEventName, trackFunnelEvent } from "@/lib/analytics/funnel-events";
import {
  getOrCreateProductFunnelSessionId,
  trackProductFunnelStep,
} from "@/lib/analytics/product-funnel-client";

const BTN_CLASS =
  "inline-flex w-full min-h-[48px] items-center justify-center rounded-lg bg-[#D4537E] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#D4537E]/80 disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:min-h-0";

export function CheckoutButton({
  slug,
  label,
  funnelEventOnCheckout,
  funnelEventParams,
  useFunnelLanding,
  bumpSlugs,
  funnelSessionId: funnelSessionIdProp,
  funnelTrackingEnabled,
  onBeforeRedirectToSquare,
}: {
  slug: string;
  label: string;
  funnelEventOnCheckout?: FunnelEventName;
  funnelEventParams?: Record<string, string | undefined>;
  /** When true, send shoppers to the dedicated funnel landing (bumps) instead of opening checkout here. */
  useFunnelLanding?: boolean;
  bumpSlugs?: string[];
  funnelSessionId?: string | null;
  /** When true (shop funnel active for this SKU), attach a stable client session id for analytics. */
  funnelTrackingEnabled?: boolean;
  onBeforeRedirectToSquare?: () => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (buyerEmail: string) => {
    if (funnelEventOnCheckout) {
      trackFunnelEvent(funnelEventOnCheckout, funnelEventParams);
    }
    const funnelSessionId =
      funnelSessionIdProp ||
      (funnelTrackingEnabled ? getOrCreateProductFunnelSessionId() : "");
    if (funnelSessionId) {
      void trackProductFunnelStep(funnelSessionId, slug, "checkout_email_submit", {
        metadata: { bumpCount: bumpSlugs?.length ?? 0, bumpSlugs: bumpSlugs ?? [] },
      });
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: slug,
          buyerEmail,
          bumpSlugs: bumpSlugs?.length ? bumpSlugs : undefined,
          funnelSessionId: funnelSessionId || undefined,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        if (funnelSessionId) {
          void trackProductFunnelStep(funnelSessionId, slug, "checkout_redirect", {
            metadata: { bumpSlugs: bumpSlugs ?? [] },
          });
        }
        onBeforeRedirectToSquare?.();
        window.location.href = data.url;
        return;
      }
      setError(data.error || "Checkout failed. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (useFunnelLanding) {
    return (
      <Link href={`/shop/${encodeURIComponent(slug)}/funnel`} className={BTN_CLASS}>
        {label}
      </Link>
    );
  }

  return (
    <>
      <CheckoutEmailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Continue to secure checkout"
        description="We’ll use this email for your receipt, delivery link, and a one-time reminder if checkout isn’t finished — same address Square will ask for on the next screen."
        confirmLabel="Continue to Square"
        loading={loading}
        error={error}
        onConfirm={(email) => startCheckout(email)}
      />
      <button
        type="button"
        onClick={() => {
          setError(null);
          setDialogOpen(true);
        }}
        disabled={loading}
        className={BTN_CLASS}
      >
        {loading ? "Redirecting…" : label}
      </button>
    </>
  );
}
