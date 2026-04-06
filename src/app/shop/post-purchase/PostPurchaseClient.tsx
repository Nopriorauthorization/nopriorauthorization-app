"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DELIVERY_STANDARD } from "@/config/delivery-language.config";
import {
  getOrCreateProductFunnelSessionId,
  trackProductFunnelStep,
} from "@/lib/analytics/product-funnel-client";
import type { FunnelFinalRedirect } from "@/lib/shop/funnel-types";
import { CheckoutButton } from "../[slug]/CheckoutButton";

export type PostPurchaseUpsellPayload = {
  slug: string;
  title: string;
  shortDescription: string;
  priceDisplay: string;
  previewImage: string | null;
};

function finalHref(mode: FunnelFinalRedirect): string {
  if (mode === "thank_you") return "/shop/thank-you";
  if (mode === "membership") return "/membership";
  return "/shop";
}

export function PostPurchaseClient({
  purchasedSlug,
  purchasedTitle,
  upsells,
  finalRedirect = "post_purchase",
}: {
  purchasedSlug: string;
  purchasedTitle: string;
  upsells: PostPurchaseUpsellPayload[];
  finalRedirect?: FunnelFinalRedirect;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const sessionId = useMemo(() => getOrCreateProductFunnelSessionId(), []);

  const currentUpsell = upsells[step];
  const showUpsell =
    step < upsells.length && Boolean(currentUpsell) && currentUpsell.slug !== purchasedSlug;
  const showFooter = upsells.length === 0 || step >= upsells.length;

  useEffect(() => {
    if (!sessionId || !showUpsell || !currentUpsell) return;
    void trackProductFunnelStep(sessionId, purchasedSlug, "post_upsell_view", {
      metadata: { upsellSlug: currentUpsell.slug, stepIndex: step },
    });
  }, [sessionId, purchasedSlug, showUpsell, currentUpsell, step]);

  const goFinal = () => {
    if (finalRedirect === "post_purchase") return;
    router.push(finalHref(finalRedirect));
  };

  const onDeclineUpsell = () => {
    if (sessionId && currentUpsell) {
      void trackProductFunnelStep(sessionId, purchasedSlug, "post_upsell_decline", {
        metadata: { upsellSlug: currentUpsell.slug, stepIndex: step },
      });
    }
    if (step + 1 < upsells.length) {
      setStep((s) => s + 1);
    } else {
      if (sessionId) {
        void trackProductFunnelStep(sessionId, purchasedSlug, "final_redirect", {
          metadata: { target: finalRedirect },
        });
      }
      goFinal();
      setStep(upsells.length);
    }
  };

  const onAcceptTracking = () => {
    if (sessionId && currentUpsell) {
      void trackProductFunnelStep(sessionId, purchasedSlug, "post_upsell_accept", {
        metadata: { upsellSlug: currentUpsell.slug, stepIndex: step },
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <p className="text-center text-4xl">&#127881;</p>
        <h1 className="mt-4 text-center font-serif text-3xl font-semibold md:text-4xl">
          Thank you for your purchase
        </h1>
        <p className="mt-3 text-center text-gray-400">
          <span className="text-gray-200">{purchasedTitle}</span> — check your email for your secure download link
          (and your thank-you perks). It usually arrives within a few minutes; check spam if needed.
        </p>
        <p className="mx-auto mt-3 max-w-lg text-center text-xs text-gray-500">{DELIVERY_STANDARD.shortLine}</p>

        {showUpsell && currentUpsell ? (
          <div className="mt-10 rounded-2xl border border-[#D4537E]/35 bg-[#D4537E]/[0.06] p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#D4537E]">
              {upsells.length > 1 ? `Special offer (${step + 1} of ${upsells.length})` : "Popular next step"}
            </p>
            <h2 className="mt-2 font-serif text-xl font-bold text-white md:text-2xl">{currentUpsell.title}</h2>
            <p className="mt-2 text-sm text-gray-400">{currentUpsell.shortDescription}</p>
            {currentUpsell.previewImage ? (
              <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
                <Image
                  src={currentUpsell.previewImage}
                  alt=""
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 672px) 100vw, 672px"
                />
              </div>
            ) : null}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <CheckoutButton
                slug={currentUpsell.slug}
                label={`Add to library — ${currentUpsell.priceDisplay}`}
                onBeforeRedirectToSquare={onAcceptTracking}
              />
              <button
                type="button"
                onClick={onDeclineUpsell}
                className="min-h-[48px] rounded-lg border border-white/25 px-6 py-3 text-sm font-medium text-gray-200 hover:bg-white/10 sm:min-h-0"
              >
                No thanks
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Opens secure Square checkout for this product — same delivery flow as your last order.
            </p>
          </div>
        ) : null}

        {showFooter ? (
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
            >
              Browse shop
            </Link>
            <Link
              href="/shop/thank-you"
              className="rounded-lg bg-white/10 px-5 py-2.5 text-sm text-gray-300 hover:bg-white/15"
            >
              Order help & reference IDs
            </Link>
            {finalRedirect === "membership" ? (
              <Link
                href="/membership"
                className="rounded-lg bg-[#D4537E] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#D4537E]/85"
              >
                Explore membership
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
