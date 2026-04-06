"use client";

import { useState } from "react";
import { CheckoutEmailDialog } from "@/components/checkout/CheckoutEmailDialog";
import { type FunnelEventName, trackFunnelEvent } from "@/lib/analytics/funnel-events";

export function CheckoutButton({
  slug,
  label,
  funnelEventOnCheckout,
  funnelEventParams,
}: {
  slug: string;
  label: string;
  funnelEventOnCheckout?: FunnelEventName;
  funnelEventParams?: Record<string, string | undefined>;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (buyerEmail: string) => {
    if (funnelEventOnCheckout) {
      trackFunnelEvent(funnelEventOnCheckout, funnelEventParams);
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug: slug, buyerEmail }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
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
        className="w-full min-h-[48px] rounded-lg bg-[#D4537E] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#D4537E]/80 disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:min-h-0"
      >
        {loading ? "Redirecting…" : label}
      </button>
    </>
  );
}
