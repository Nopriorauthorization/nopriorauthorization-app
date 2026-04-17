"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckoutEmailDialog } from "@/components/checkout/CheckoutEmailDialog";
import type { CheckoutBumpOffer } from "@/components/checkout/CheckoutEmailDialog";
import { ProCheckoutUpsell } from "@/components/membership/ProCheckoutUpsell";
import { type FunnelEventName, trackFunnelEvent } from "@/lib/analytics/funnel-events";
import {
  getOrCreateProductFunnelSessionId,
  trackProductFunnelStep,
} from "@/lib/analytics/product-funnel-client";

const BTN_CLASS =
  "inline-flex w-full min-h-[48px] items-center justify-center rounded-lg bg-[#D4537E] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#D4537E]/80 disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:min-h-0";

type FunnelConfigResponse = {
  enabled?: boolean;
  primaryProduct?: { title: string; priceDisplay: string; priceCents: number };
  bumpProducts?: CheckoutBumpOffer[];
};

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
  proConversionUpsell = false,
  buttonClassName,
}: {
  slug: string;
  label: string;
  funnelEventOnCheckout?: FunnelEventName;
  funnelEventParams?: Record<string, string | undefined>;
  /** When true, send shoppers to the dedicated funnel landing (bumps) instead of opening checkout here. */
  useFunnelLanding?: boolean;
  /** When set (e.g. funnel landing page), these slugs are sent to checkout and bump UI stays on the parent page. */
  bumpSlugs?: string[];
  funnelSessionId?: string | null;
  /** When true (shop funnel active for this SKU), attach a stable client session id for analytics. */
  funnelTrackingEnabled?: boolean;
  onBeforeRedirectToSquare?: () => void;
  /** Show Pro membership savings strip in the email/checkout dialog */
  proConversionUpsell?: boolean;
  /** Override default button styles (e.g. landing pages that match non-shop UI). */
  buttonClassName?: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutContextLoading, setCheckoutContextLoading] = useState(false);
  const [dialogPrimary, setDialogPrimary] = useState<FunnelConfigResponse["primaryProduct"] | null>(null);
  const [dialogBumpOffers, setDialogBumpOffers] = useState<CheckoutBumpOffer[]>([]);
  const bumpsPickedOffPage = bumpSlugs !== undefined;

  useEffect(() => {
    if (!dialogOpen || bumpsPickedOffPage) {
      return;
    }

    let cancelled = false;
    setCheckoutContextLoading(true);
    setDialogPrimary(null);
    setDialogBumpOffers([]);

    (async () => {
      try {
        const res = await fetch(`/api/shop/funnel-config/${encodeURIComponent(slug)}`);
        const data = (await res.json()) as FunnelConfigResponse & { error?: string };
        if (cancelled) return;
        if (!res.ok || !data.primaryProduct) {
          setDialogPrimary(null);
          setDialogBumpOffers([]);
          return;
        }
        setDialogPrimary(data.primaryProduct);
        const bumps =
          data.enabled && Array.isArray(data.bumpProducts) && data.bumpProducts.length > 0
            ? data.bumpProducts
            : [];
        setDialogBumpOffers(bumps);
      } catch {
        if (!cancelled) {
          setDialogPrimary(null);
          setDialogBumpOffers([]);
        }
      } finally {
        if (!cancelled) setCheckoutContextLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dialogOpen, slug, bumpsPickedOffPage]);

  useEffect(() => {
    if (!dialogOpen || bumpsPickedOffPage || dialogBumpOffers.length === 0) return;
    if (!funnelTrackingEnabled) return;
    const sid = getOrCreateProductFunnelSessionId();
    if (!sid) return;
    void trackProductFunnelStep(sid, slug, "checkout_bumps_shown", {
      metadata: { bumpOfferSlugs: dialogBumpOffers.map((b) => b.slug) },
    });
  }, [dialogOpen, bumpsPickedOffPage, dialogBumpOffers, funnelTrackingEnabled, slug]);

  const startCheckout = async (buyerEmail: string, selectedFromDialog: string[]) => {
    if (funnelEventOnCheckout) {
      trackFunnelEvent(funnelEventOnCheckout, funnelEventParams);
    }
    const funnelSessionId =
      funnelSessionIdProp ||
      (funnelTrackingEnabled ? getOrCreateProductFunnelSessionId() : "");
    const effectiveBumps = bumpsPickedOffPage ? (bumpSlugs ?? []) : selectedFromDialog;

    if (funnelSessionId) {
      void trackProductFunnelStep(funnelSessionId, slug, "checkout_email_submit", {
        metadata: {
          bumpCount: effectiveBumps.length,
          bumpSlugs: effectiveBumps,
          bumpAttach: effectiveBumps.length > 0,
        },
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
          bumpSlugs: effectiveBumps.length ? effectiveBumps : undefined,
          funnelSessionId: funnelSessionId || undefined,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string; detail?: string };
      if (data.url) {
        if (funnelSessionId) {
          void trackProductFunnelStep(funnelSessionId, slug, "checkout_redirect", {
            metadata: { bumpSlugs: effectiveBumps, bumpAttach: effectiveBumps.length > 0 },
          });
        }
        onBeforeRedirectToSquare?.();
        window.location.href = data.url;
        return;
      }
      const msg = data.error || "Checkout failed. Please try again.";
      setError(data.detail ? `${msg} (${data.detail})` : msg);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const btnClass = buttonClassName ?? BTN_CLASS;

  if (useFunnelLanding) {
    return (
      <Link href={`/shop/${encodeURIComponent(slug)}/funnel`} className={btnClass}>
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
        orderSummaryLoading={!bumpsPickedOffPage && dialogOpen && checkoutContextLoading}
        productSummary={bumpsPickedOffPage ? null : dialogPrimary}
        bumpOffers={bumpsPickedOffPage ? null : dialogBumpOffers.length ? dialogBumpOffers : null}
        onBumpSelectionChange={(slugs) => {
          if (!funnelTrackingEnabled) return;
          const sid = getOrCreateProductFunnelSessionId();
          if (!sid) return;
          void trackProductFunnelStep(sid, slug, "bump_toggle", {
            metadata: { context: "checkout_dialog", selectedBumpSlugs: slugs },
          });
        }}
        onConfirm={(email, selectedBumpSlugs) => startCheckout(email, selectedBumpSlugs)}
        proConversionSlot={proConversionUpsell ? <ProCheckoutUpsell /> : undefined}
      />
      <button
        type="button"
        onClick={() => {
          setError(null);
          setDialogOpen(true);
        }}
        disabled={loading}
        className={btnClass}
      >
        {loading ? "Redirecting…" : label}
      </button>
    </>
  );
}
