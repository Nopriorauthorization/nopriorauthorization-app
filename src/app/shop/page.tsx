import Link from "next/link";
import { GROWTH_SYSTEM_PRODUCT, GROWTH_SYSTEM_SLUG } from "@/config/growth-funnel.config";
import {
  INFORMED_BEAUTY_GUIDE_SLUG,
  INFORMED_BEAUTY_PRICE_CENTS,
} from "@/config/informed-beauty-guide.config";
import { GrowthSystemShowcase } from "@/components/shop/GrowthSystemShowcase";
import { getShopProducts, getShopCategories, getShopProductBySlug } from "@/lib/shop/products";
import { SHOP_BADGE_MAP, SHOP_OUTCOME_MAP } from "@/lib/shop/shop-marketing";
import {
  SHOP_FAMILIES,
  familyProductCount,
  formatFamilyFloorPrice,
  getFeaturedFamiliesForHome,
} from "@/lib/shop/families";
import { ShopCategoryFilter } from "./ShopCategoryFilter";
import { EmailCapture } from "./EmailCapture";
import { PlaybookShowcase } from "./PlaybookShowcase";

export const metadata = {
  title: "Med Spa Templates & Consent Forms | NPA Shop",
  description:
    "Clinical consent forms, patient communication kits, aftercare cards, and social media templates. Instant download. Built for aesthetic providers.",
  openGraph: {
    title: "Med Spa Templates & Consent Forms | NPA Shop",
    description: "Done-for-you templates for med spas, injectors, and aesthetic entrepreneurs. Instant download.",
  },
};

const QUICK_CATEGORIES: { label: string; href: string }[] = [
  { label: "Informed Beauty Guide", href: "/informed-beauty-guide" },
  { label: "Growth System", href: "/shop/growth-system" },
  { label: "Botox & filler", href: "/shop/families/botox-filler-injectables" },
  { label: "Weight loss / GLP-1", href: "/shop/families/weight-loss-glp1" },
  { label: "IV therapy", href: "/shop/families/iv-therapy" },
  { label: "Social & content", href: "/shop/families/social-content" },
  { label: "Legal & compliance", href: "/shop/families/legal-compliance" },
  { label: "Business & reviews", href: "/shop/families/business-reputation" },
  { label: "Playbooks", href: "/shop/families/clinical-playbooks" },
  { label: "Hormone & peptide", href: "/shop/families/hormone-peptide" },
  { label: "Peel / MN / laser", href: "/shop/families/peel-microneedling-laser" },
  { label: "Lash / brow / wax", href: "/shop/families/lash-brow-wax" },
  { label: "All products", href: "#all-products" },
];

const START_HERE_SLUGS = [
  INFORMED_BEAUTY_GUIDE_SLUG,
  "growth-system",
  "med-spa-starter-kit",
  "facial-training-manual",
  "npa-49-star-system",
  "facial-anatomy-nurse-injector",
  "combo-bundle",
  "botox-consent-bundle",
  "weight-loss-kit",
];

const TESTIMONIALS = [
  {
    text: "I spent weeks trying to make my own consent forms. This bundle saved me at least 40 hours and looks way more professional than anything I could have designed.",
    author: "Sarah M.",
    role: "Nurse Practitioner, TX",
  },
  {
    text: "The social media templates are a game changer. I went from posting once a week to daily — and my bookings went up 30% in the first month.",
    author: "Jessica L.",
    role: "Med Spa Owner, FL",
  },
  {
    text: "Finally, HIPAA forms that don't look like they were made in Word 2003. My patients actually read these.",
    author: "Dr. Amanda K.",
    role: "Medical Director, CA",
  },
];

export default function ShopPage() {
  const products = getShopProducts();
  const categories = getShopCategories();
  const growthSystemProduct = getShopProductBySlug(GROWTH_SYSTEM_SLUG);
  const startHereProducts = START_HERE_SLUGS.map((s) =>
    products.find((p) => p.slug === s),
  ).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* HERO */}
      <section className="border-b border-white/5 bg-gradient-to-b from-[#1A1A1A] to-[#111]">
        <div className="border-b border-amber-500/30 bg-gradient-to-r from-amber-950/80 to-[#D4537E]/20">
          <div className="mx-auto max-w-5xl px-4 py-3 text-center sm:px-6">
            <Link
              href="/informed-beauty-guide"
              className="inline-flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-amber-100 transition hover:text-white"
            >
              <span className="rounded-full bg-amber-500/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-200">
                #1 seller · patient education
              </span>
              <span>
                The Informed Beauty Guide —{" "}
                <span className="text-white">
                  ${(INFORMED_BEAUTY_PRICE_CENTS / 100).toFixed(0)} instant download
                </span>
              </span>
              <span className="text-[#D4537E]">Shareable link →</span>
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 sm:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#D4537E]">
            No Prior Authorization
          </p>
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-6xl">
            Stop designing.<br />
            <span className="text-[#D4537E]">Start posting.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            Professional templates for med spas, injectors, and aesthetic
            entrepreneurs. Consent forms, social media kits, legal bundles,
            and marketing materials &mdash; download instantly, customize in minutes.
          </p>
          <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:mx-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            {growthSystemProduct ? (
              <Link
                href="/shop/growth-system"
                className="min-h-[48px] rounded-xl border-2 border-amber-400/60 bg-gradient-to-r from-amber-500/25 to-amber-600/10 px-8 py-3 text-center text-base font-bold text-amber-100 shadow-[0_0_24px_rgba(245,158,11,0.15)] transition hover:border-amber-300/80 hover:from-amber-500/35 sm:min-h-0 sm:py-4"
              >
                Get the Growth System — {GROWTH_SYSTEM_PRODUCT.nowPriceLabel}
              </Link>
            ) : null}
            <a
              href="#start-here"
              className="min-h-[48px] rounded-xl bg-[#D4537E] px-8 py-3 text-center text-base font-bold text-white transition hover:bg-[#D4537E]/80 sm:min-h-0 sm:py-4"
            >
              Shop Best Sellers
            </a>
            <Link
              href="/shop/families"
              className="min-h-[48px] rounded-xl border border-[#D4537E]/50 bg-[#D4537E]/10 px-8 py-3 text-center text-base font-bold text-white transition hover:bg-[#D4537E]/20 sm:min-h-0 sm:py-4"
            >
              Shop by collection
            </Link>
            <a
              href="#all-products"
              className="min-h-[48px] rounded-xl border border-white/20 bg-white/5 px-8 py-3 text-center text-base font-bold text-white transition hover:bg-white/10 sm:min-h-0 sm:py-4"
            >
              Browse All Templates
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Trusted by 500+ aesthetic providers &middot; Instant digital delivery
          </p>
        </div>
      </section>

      {growthSystemProduct ? <GrowthSystemShowcase product={growthSystemProduct} /> : null}

      {/* CATEGORY NAV */}
      <section className="sticky top-14 z-30 border-b border-white/10 bg-[#1A1A1A]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1A1A1A]/90">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-6">
          <div className="flex gap-1 py-3">
            <Link
              href="/shop/families"
              className="shrink-0 rounded-full border border-[#D4537E]/40 bg-[#D4537E]/10 px-4 py-2 text-xs font-bold text-[#D4537E] transition hover:border-[#D4537E]/60 hover:bg-[#D4537E]/20"
            >
              Collections
            </Link>
            {QUICK_CATEGORIES.map((cat) => {
              const isGrowth = cat.href === "/shop/growth-system";
              const pillClass = isGrowth
                ? "shrink-0 rounded-full border border-amber-400/50 bg-amber-500/15 px-4 py-2 text-xs font-bold text-amber-100 transition hover:border-amber-300/70 hover:bg-amber-500/25"
                : "shrink-0 rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-gray-400 transition hover:border-[#D4537E]/40 hover:text-[#D4537E]";
              return cat.href.startsWith("/") ? (
                <Link key={cat.label} href={cat.href} className={pillClass}>
                  {cat.label}
                </Link>
              ) : (
                <a key={cat.label} href={cat.href} className={pillClass}>
                  {cat.label}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-gradient-to-r from-[#D4537E]/10 to-transparent">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 px-4 py-4 text-center sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2 sm:text-left">
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-white">Free for your practice:</span>{" "}
            guides and tools before you buy.
          </p>
          <Link
            href="/shop/resources"
            className="shrink-0 text-sm font-bold text-[#D4537E] underline-offset-4 hover:underline"
          >
            Explore free resources →
          </Link>
          <span className="hidden text-gray-600 sm:inline" aria-hidden>
            |
          </span>
          <Link
            href="/custom"
            className="shrink-0 text-sm font-bold text-rose-300 underline-offset-4 hover:text-rose-200 hover:underline"
          >
            Need something built for you? Custom builds →
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* PLAYBOOKS SHOWCASE */}
        <PlaybookShowcase />

        {/* SHOP BY COLLECTION */}
        <section id="collections" className="border-b border-white/5 py-16">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4537E]">
              Like an Etsy storefront
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">
              Shop by collection
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-500">
              One page per focus area — cheat sheets, consents, social packs, and bundles
              sorted low to high so you can grab a single asset or stack several.
            </p>
            <Link
              href="/shop/families"
              className="mt-5 inline-block text-sm font-bold text-[#D4537E] underline-offset-4 hover:underline"
            >
              View all {SHOP_FAMILIES.length} collections →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {getFeaturedFamiliesForHome(products, 6).map((fam) => {
              const n = familyProductCount(fam, products);
              return (
                <Link
                  key={fam.slug}
                  href={`/shop/families/${fam.slug}`}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#D4537E]/40 hover:bg-white/[0.06]"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    {fam.subtitle}
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-bold text-white group-hover:text-[#D4537E]">
                    {fam.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-gray-500 line-clamp-3">
                    {fam.description}
                  </p>
                  <p className="mt-4 text-xs font-bold text-[#D4537E]">
                    {n} products · from {formatFamilyFloorPrice(fam, products)}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* START HERE */}
        <section id="start-here" className="py-16">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4537E]">
              Start here
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">
              Top picks &amp; best sellers
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {startHereProducts.map((p) =>
              p ? (
                <Link
                  key={p.slug}
                  href={`/shop/${p.slug}`}
                  className="group relative flex flex-col rounded-2xl border-2 border-[#D4537E]/30 bg-[#D4537E]/5 p-6 transition hover:border-[#D4537E]/60"
                >
                  <span className="mb-3 inline-block self-start rounded-full bg-[#D4537E] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {SHOP_BADGE_MAP[p.slug]?.label || "Featured"}
                  </span>
                  <h3 className="mb-2 font-serif text-xl font-bold text-white">
                    {p.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm text-gray-400">
                    {SHOP_OUTCOME_MAP[p.slug] || p.shortDescription}
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-3xl font-bold">{p.priceDisplay}</span>
                      <span className="ml-2 text-xs text-gray-500">
                        {p.templateCount} templates
                      </span>
                    </div>
                    <span className="rounded-lg bg-[#D4537E] px-5 py-2.5 text-sm font-bold text-white transition group-hover:bg-white group-hover:text-[#1A1A1A]">
                      Get it now
                    </span>
                  </div>
                </Link>
              ) : null,
            )}
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="border-y border-white/10 py-16">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4537E]">
              What providers are saying
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">
              Real results from real clinics
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="mb-4 flex gap-1 text-[#D4537E]">
                  {"★★★★★".split("").map((s, j) => (
                    <span key={j}>{s}</span>
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-gray-300">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-bold text-white">{t.author}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EMAIL CAPTURE */}
        <section className="py-16">
          <EmailCapture />
        </section>

        {/* ALL PRODUCTS */}
        <section id="all-products" className="pb-20">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-3xl font-semibold">
              All templates
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {products.length} products &middot; instant download &middot; fully customizable
            </p>
          </div>

          <ShopCategoryFilter categories={categories} />

          <div
            id="product-grid"
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {products.map((p) => {
              const badge = SHOP_BADGE_MAP[p.slug];
              const outcome = SHOP_OUTCOME_MAP[p.slug];
              return (
                <Link
                  key={p.slug}
                  href={`/shop/${p.slug}`}
                  data-category={p.category}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#D4537E]/40 hover:bg-white/[0.06]"
                >
                  {p.previewImages[0] && (
                    <div className="mb-3 overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.previewImages[0]}
                        alt={p.title}
                        loading="lazy"
                        className="h-40 w-full object-cover object-top"
                      />
                    </div>
                  )}

                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {p.category}
                    </span>
                    {badge && (
                      <span
                        className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    )}
                    {!badge && p.featured && (
                      <span className="rounded-md bg-[#D4537E]/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D4537E]">
                        Featured
                      </span>
                    )}
                  </div>

                  <h2 className="mb-1 font-serif text-lg font-semibold leading-snug text-white group-hover:text-[#D4537E]">
                    {p.title}
                  </h2>

                  {outcome ? (
                    <p className="mb-3 text-xs font-medium text-[#D4537E]/80">
                      {outcome}
                    </p>
                  ) : null}

                  <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-500 line-clamp-2">
                    {p.shortDescription}
                  </p>

                  <div className="flex items-end justify-between border-t border-white/10 pt-4">
                    <div>
                      <span className="text-2xl font-bold text-white">
                        {p.priceDisplay}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        {p.templateCount} templates
                      </span>
                    </div>
                    <span className="rounded-lg bg-[#D4537E] px-4 py-2 text-sm font-bold text-white transition group-hover:bg-[#D4537E]/80">
                      View
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
