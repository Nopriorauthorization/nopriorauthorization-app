import type { Metadata } from "next";
import Link from "next/link";
import {
  FiBriefcase,
  FiHeart,
  FiLayers,
  FiZap,
} from "react-icons/fi";
import {
  formatMembershipAnnualUsd,
  formatMembershipMonthlyUsd,
  GROWTH_SYSTEM_PAGE,
  GROWTH_SYSTEM_PRODUCT,
  GROWTH_SYSTEM_SIGNATURE,
  GROWTH_SYSTEM_SLUG,
  MEMBERSHIP_CONFIG,
} from "@/config/growth-funnel.config";
import { FunnelLink } from "@/components/shop/FunnelLink";
import { buildProductMetaDescription, buildProductMetaTitle } from "@/lib/seo/shop-product-seo";
import { getShopProductBySlug } from "@/lib/shop/products";
import { ProductPreviewGallery } from "../ProductPreviewGallery";
import { CheckoutButton } from "../[slug]/CheckoutButton";

const SITE = "https://nopriorauthorization.com";

const SECTION_ICONS = [FiLayers, FiHeart, FiZap, FiBriefcase] as const;

export function generateMetadata(): Metadata {
  const product = getShopProductBySlug(GROWTH_SYSTEM_SLUG);
  const title = product
    ? buildProductMetaTitle(product)
    : `${GROWTH_SYSTEM_PRODUCT.title} | Med spa template bundles | No Prior Authorization`;
  const description = product
    ? buildProductMetaDescription(product)
    : `${GROWTH_SYSTEM_PRODUCT.shortDescription} Instant download after purchase.`;
  return {
    title,
    description,
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `${SITE}/shop/growth-system`,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `${SITE}/shop/growth-system` },
  };
}

export default function GrowthSystemPage() {
  const product = getShopProductBySlug(GROWTH_SYSTEM_SLUG);
  const sig = GROWTH_SYSTEM_SIGNATURE;

  if (!product) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] p-10 text-white">
        Growth System product is not available. Check catalog configuration.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Cinematic hero */}
      <section className="relative overflow-hidden border-b border-amber-500/15">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212, 83, 126, 0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(245, 158, 11, 0.18), transparent)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: `linear-gradient(rgba(251, 191, 36, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 191, 36, 0.07) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-24 h-px w-[min(90%,720px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-14">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#D4537E]"
          >
            <span aria-hidden>←</span> Back to shop
          </Link>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/45 bg-amber-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-200">
              <span className="text-amber-300" aria-hidden>
                ★
              </span>
              {sig.eyebrow}
            </span>
            <span className="text-xs font-medium text-gray-500">{sig.seal}</span>
          </div>

          <h1 className="mt-6 max-w-4xl font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-[3.5rem]">
            <span className="bg-gradient-to-br from-white via-amber-50 to-amber-200/80 bg-clip-text text-transparent">
              {GROWTH_SYSTEM_PAGE.hero}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl">
            {sig.subhead}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {sig.trustStrip.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-gray-400"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_min(100%,380px)] lg:items-start lg:gap-16">
          <div className="min-w-0">
            <ProductPreviewGallery
              images={product.previewImages}
              productTitle={product.title}
              devHint={false}
              sectionTitle="Inside your download"
              sectionDescription="A living preview of the mega stack — the same files land in your inbox seconds after checkout. Brand in Canva, print, or post."
            />

            <div className="mb-12 rounded-2xl border border-[#D4537E]/25 bg-gradient-to-br from-[#D4537E]/[0.08] to-transparent p-8 sm:p-10">
              <p className="font-serif text-xl font-semibold leading-snug text-white sm:text-2xl">
                &ldquo;{sig.quote.text}&rdquo;
              </p>
              <p className="mt-4 text-sm font-semibold text-[#D4537E]">
                {sig.quote.author} · {sig.quote.role}
              </p>
            </div>

            <h2 className="mb-2 font-serif text-2xl font-semibold sm:text-3xl">Four pillars, one system</h2>
            <p className="mb-8 max-w-2xl text-sm text-gray-500 sm:text-base">
              Every pillar is packed with templates you would otherwise buy as separate bundles — this is the
              &ldquo;I want the whole practice library&rdquo; path.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {GROWTH_SYSTEM_PAGE.sections.map((s, i) => {
                const Icon = SECTION_ICONS[i] ?? FiLayers;
                return (
                  <div
                    key={s.title}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 transition hover:border-amber-400/30 hover:shadow-[0_0_40px_rgba(245,158,11,0.08)] sm:p-7"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/25 bg-amber-500/10 text-amber-200 transition group-hover:border-amber-400/40 group-hover:bg-amber-500/15">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white sm:text-xl">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400 sm:text-base">{s.body}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <p className="text-sm leading-relaxed text-gray-300 sm:text-base">{GROWTH_SYSTEM_PAGE.membershipTeaser}</p>
              <FunnelLink
                href="/membership"
                event="funnel_growth_to_membership_click"
                eventParams={{ source: "growth_system_page" }}
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#D4537E] hover:underline"
              >
                {MEMBERSHIP_CONFIG.ctaLabel} — {formatMembershipMonthlyUsd()}/mo or {formatMembershipAnnualUsd()}/yr
                <span aria-hidden>→</span>
              </FunnelLink>
            </div>

            <p className="mt-10 text-center text-xs text-gray-600 sm:text-left">
              Same template stack as our full mega bundle — one curated checkout. Instant email delivery after
              purchase.
            </p>
          </div>

          {/* Sticky checkout card */}
          <aside className="lg:sticky lg:top-24">
            <div className="relative">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-amber-400/40 via-[#D4537E]/30 to-amber-600/20 opacity-70 blur-[1px]" />
              <div className="relative overflow-hidden rounded-2xl border border-amber-400/30 bg-zinc-950/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-8">
                <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200/90">
                  {GROWTH_SYSTEM_PRODUCT.valueAnchorLine}
                </p>
                <div className="mt-4 flex flex-wrap items-baseline justify-center gap-3">
                  <span className="text-2xl text-gray-500 line-through">{GROWTH_SYSTEM_PRODUCT.wasPriceLabel}</span>
                  <span className="font-serif text-5xl font-bold text-white">{GROWTH_SYSTEM_PRODUCT.nowPriceLabel}</span>
                </div>
                <p className="mt-2 text-center text-sm text-gray-500">
                  One-time · {product.templateCount}+ templates · instant send
                </p>
                <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
                  {GROWTH_SYSTEM_PRODUCT.shortDescription}
                </p>
                <div className="mt-6">
                  <CheckoutButton
                    slug={GROWTH_SYSTEM_SLUG}
                    label={GROWTH_SYSTEM_PRODUCT.ctaLabel}
                    funnelEventOnCheckout="funnel_growth_system_click"
                    funnelEventParams={{ source: "growth_system_checkout" }}
                    proConversionUpsell
                  />
                </div>
                <ul className="mt-8 space-y-3 border-t border-white/10 pt-6 text-xs text-gray-500">
                  {sig.stats.map((st) => (
                    <li key={st.label} className="flex items-baseline justify-between gap-4">
                      <span className="font-serif text-lg font-bold tabular-nums text-amber-100">{st.value}</span>
                      <span className="text-right text-[11px] font-medium uppercase tracking-wider text-gray-500">
                        {st.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
