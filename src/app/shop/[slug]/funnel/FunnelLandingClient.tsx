"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getOrCreateProductFunnelSessionId,
  trackProductFunnelStep,
} from "@/lib/analytics/product-funnel-client";
import type { ShopProduct } from "@/lib/shop/products";
import { CheckoutButton } from "../CheckoutButton";

type BumpProduct = Pick<
  ShopProduct,
  "slug" | "title" | "shortDescription" | "priceDisplay" | "priceCents"
> & { previewImage: string | null };

export function FunnelLandingClient({
  primary,
  bumpProducts,
}: {
  primary: Pick<
    ShopProduct,
    "slug" | "title" | "shortDescription" | "longDescription" | "priceDisplay" | "priceCents"
  >;
  bumpProducts: BumpProduct[];
}) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    setSessionId(getOrCreateProductFunnelSessionId());
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    void trackProductFunnelStep(sessionId, primary.slug, "funnel_landing_view");
  }, [sessionId, primary.slug]);

  const selectedSlugs = useMemo(() => {
    return bumpProducts.filter((b) => selected[b.slug]).map((b) => b.slug);
  }, [bumpProducts, selected]);

  const bumpTotalCents = useMemo(() => {
    return bumpProducts
      .filter((b) => selected[b.slug])
      .reduce((a, b) => a + b.priceCents, 0);
  }, [bumpProducts, selected]);

  const totalDisplay = useMemo(() => {
    const cents = primary.priceCents + bumpTotalCents;
    return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
  }, [primary.priceCents, bumpTotalCents]);

  const toggleBump = useCallback(
    (slug: string) => {
      setSelected((prev) => {
        const next = { ...prev, [slug]: !prev[slug] };
        const slugs = bumpProducts.filter((b) => next[b.slug]).map((b) => b.slug);
        if (sessionId) {
          void trackProductFunnelStep(sessionId, primary.slug, "bump_toggle", {
            metadata: { selectedBumpSlugs: slugs },
          });
        }
        return next;
      });
    },
    [bumpProducts, sessionId, primary.slug],
  );

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Link
          href={`/shop/${encodeURIComponent(primary.slug)}`}
          className="text-sm text-gray-500 transition hover:text-[#D4537E]"
        >
          &larr; Product details
        </Link>

        <h1 className="mt-6 font-serif text-3xl font-bold leading-tight md:text-4xl">
          {primary.title}
        </h1>
        <p className="mt-3 text-lg text-gray-400">
          {primary.longDescription || primary.shortDescription}
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#D4537E]">Your order</p>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
            <span className="text-sm text-gray-400">Main product</span>
            <span className="text-xl font-bold">{primary.priceDisplay}</span>
          </div>
          {bumpProducts.length > 0 ? (
            <div className="mt-6 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Add to your order (optional)
              </p>
              {bumpProducts.map((b) => (
                <label
                  key={b.slug}
                  className="flex cursor-pointer gap-4 rounded-xl border border-white/10 bg-black/30 p-4 transition hover:border-[#D4537E]/40"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(selected[b.slug])}
                    onChange={() => toggleBump(b.slug)}
                    className="mt-1 h-5 w-5 shrink-0 rounded border-white/30 text-[#D4537E] focus:ring-[#D4537E]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">{b.title}</p>
                    <p className="mt-1 text-sm text-gray-400">{b.shortDescription}</p>
                    <p className="mt-2 text-sm font-bold text-[#D4537E]">{b.priceDisplay}</p>
                  </div>
                  {b.previewImage ? (
                    <div className="relative hidden h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-white/10 sm:block">
                      <Image src={b.previewImage} alt="" fill className="object-cover object-top" sizes="112px" />
                    </div>
                  ) : null}
                </label>
              ))}
            </div>
          ) : null}
          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-gray-300">Total today</span>
              <span className="text-2xl font-bold">{totalDisplay}</span>
            </div>
          </div>
          <div className="mt-6">
            <CheckoutButton
              slug={primary.slug}
              label={`Continue to checkout — ${totalDisplay}`}
              bumpSlugs={selectedSlugs}
              funnelSessionId={sessionId}
            />
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Secure Square checkout — same delivery email as on the product page. One payment for everything you select
            above.
          </p>
        </div>
      </div>
    </div>
  );
}
