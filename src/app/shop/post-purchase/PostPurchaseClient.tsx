"use client";

import Image from "next/image";
import Link from "next/link";
import { DELIVERY_STANDARD } from "@/config/delivery-language.config";
import { CheckoutButton } from "../[slug]/CheckoutButton";

export type PostPurchaseUpsellPayload = {
  slug: string;
  title: string;
  shortDescription: string;
  priceDisplay: string;
  previewImage: string | null;
};

export function PostPurchaseClient({
  purchasedSlug,
  purchasedTitle,
  upsell,
}: {
  purchasedSlug: string;
  purchasedTitle: string;
  upsell: PostPurchaseUpsellPayload | null;
}) {
  const showUpsell = Boolean(upsell && upsell.slug !== purchasedSlug);

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

        {showUpsell && upsell ? (
          <div className="mt-10 rounded-2xl border border-[#D4537E]/35 bg-[#D4537E]/[0.06] p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#D4537E]">Popular next step</p>
            <h2 className="mt-2 font-serif text-xl font-bold text-white md:text-2xl">{upsell.title}</h2>
            <p className="mt-2 text-sm text-gray-400">{upsell.shortDescription}</p>
            {upsell.previewImage ? (
              <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
                <Image
                  src={upsell.previewImage}
                  alt=""
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 672px) 100vw, 672px"
                />
              </div>
            ) : null}
            <div className="mt-5">
              <CheckoutButton slug={upsell.slug} label={`Add to library — ${upsell.priceDisplay}`} />
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Opens secure Square checkout for this product — one click from here, same delivery flow as your last
              order.
            </p>
          </div>
        ) : null}

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
        </div>
      </div>
    </div>
  );
}
