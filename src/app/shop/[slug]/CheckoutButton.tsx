"use client";

import { useState } from "react";
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
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (funnelEventOnCheckout) {
      trackFunnelEvent(funnelEventOnCheckout, funnelEventParams);
    }
    setLoading(true);
    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug: slug }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Checkout failed. Please try again.");
        setLoading(false);
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className="w-full min-h-[48px] rounded-lg bg-[#D4537E] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#D4537E]/80 disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:min-h-0"
    >
      {loading ? "Redirecting…" : label}
    </button>
  );
}
