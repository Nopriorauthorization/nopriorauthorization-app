import type { Metadata } from "next";
import {
  GROWTH_SYSTEM_PAGE,
  GROWTH_SYSTEM_PRODUCT,
  GROWTH_SYSTEM_SLUG,
  MEMBERSHIP_CONFIG,
} from "@/config/growth-funnel.config";
import { FunnelLink } from "@/components/shop/FunnelLink";
import { getShopProductBySlug } from "@/lib/shop/products";
import { CheckoutButton } from "../[slug]/CheckoutButton";

const SITE = "https://nopriorauthorization.com";

export const metadata: Metadata = {
  title: "NPA Growth System | Full med spa template library",
  description: GROWTH_SYSTEM_PRODUCT.shortDescription,
  openGraph: {
    title: "NPA Growth System",
    description: GROWTH_SYSTEM_PRODUCT.shortDescription,
    url: `${SITE}/shop/growth-system`,
  },
  alternates: { canonical: `${SITE}/shop/growth-system` },
};

export default function GrowthSystemPage() {
  const product = getShopProductBySlug(GROWTH_SYSTEM_SLUG);
  if (!product) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] p-10 text-white">
        Growth System product is not available. Check catalog configuration.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4537E]">Best value</p>
        <h1 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          {GROWTH_SYSTEM_PAGE.hero}
        </h1>
        <p className="mt-5 text-lg text-gray-400">{GROWTH_SYSTEM_PRODUCT.shortDescription}</p>

        <div className="mt-8 rounded-2xl border-2 border-amber-500/45 bg-amber-500/[0.08] p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wider text-amber-200/90">
            {GROWTH_SYSTEM_PRODUCT.valueAnchorLine}
          </p>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-xl text-gray-500 line-through sm:text-2xl">
              {GROWTH_SYSTEM_PRODUCT.wasPriceLabel}
            </span>
            <span className="text-4xl font-bold text-white">{GROWTH_SYSTEM_PRODUCT.nowPriceLabel}</span>
            <span className="text-sm text-gray-500">one-time · {product.templateCount}+ templates</span>
          </div>
          <div className="mt-6">
            <CheckoutButton
              slug={GROWTH_SYSTEM_SLUG}
              label={GROWTH_SYSTEM_PRODUCT.ctaLabel}
              funnelEventOnCheckout="funnel_growth_system_click"
              funnelEventParams={{ source: "growth_system_checkout" }}
            />
          </div>
        </div>

        <div className="mt-14 space-y-10">
          {GROWTH_SYSTEM_PAGE.sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-serif text-xl font-semibold text-white sm:text-2xl">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-400 sm:text-base">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-gray-300">{GROWTH_SYSTEM_PAGE.membershipTeaser}</p>
          <FunnelLink
            href="/membership"
            event="funnel_growth_to_membership_click"
            eventParams={{ source: "growth_system_page" }}
            className="mt-3 inline-block text-sm font-bold text-[#D4537E] hover:underline"
          >
            {MEMBERSHIP_CONFIG.ctaLabel} — ${MEMBERSHIP_CONFIG.monthlyPriceCents / 100}/mo
          </FunnelLink>
        </div>

        <p className="mt-10 text-center text-xs text-gray-600">
          Delivers the same template stack as the full mega bundle checkout — instant email delivery
          after purchase.
        </p>
      </div>
    </div>
  );
}
