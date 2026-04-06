import { notFound } from "next/navigation";
import Link from "next/link";
import { GROWTH_SYSTEM_SLUG } from "@/config/growth-funnel.config";
import { getDeliveryProfileForCategory } from "@/config/delivery-language.config";
import { BundleTierComparison } from "@/components/shop/BundleTierComparison";
import { BundleUpgradeMessaging } from "@/components/shop/BundleUpgradeMessaging";
import {
  buildShopProductJsonLd,
  ProductCommercialMetaSection,
} from "@/components/shop/ProductCommercialMetaSection";
import { MembershipUpsellBlock } from "@/components/shop/MembershipUpsellBlock";
import { MEGA_UPGRADE_TARGET_SLUG } from "@/lib/shop/bundle-tier-config";
import { getFamilyByProductSlug } from "@/lib/shop/families";
import { FreeTemplatesLeadStrip } from "@/components/marketing/FreeTemplatesLeadStrip";
import { CHEAT_SHEET_BONUS } from "@/config/cheat-sheet-bonus.config";
import { getShopInteractivePreviewSrc } from "@/lib/shop/form-preview";
import { buildProductMetaDescription, buildProductMetaTitle } from "@/lib/seo/shop-product-seo";
import { getShopProductBySlug, getShopProducts } from "@/lib/shop/products";
import { ProductPreviewGallery } from "../ProductPreviewGallery";
import { CheckoutButton } from "./CheckoutButton";

export function generateStaticParams() {
  return getShopProducts()
    .filter((p) => p.slug !== GROWTH_SYSTEM_SLUG)
    .map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getShopProductBySlug(params.slug);
  if (!product) return {};
  const title = buildProductMetaTitle(product);
  const description = buildProductMetaDescription(product);
  return {
    title,
    description,
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function findRelatedSizes(slug: string, allProducts: ReturnType<typeof getShopProducts>) {
  const parts = slug.split("-");
  if (parts.length < 3) return [];
  const basePrefix = parts.slice(0, -1).join("-");
  return allProducts
    .filter(
      (p) =>
        p.slug !== slug &&
        (p.slug.startsWith(basePrefix) || p.slug === basePrefix.replace(/-social-media$/, "-mega-bundle")),
    )
    .sort((a, b) => a.priceCents - b.priceCents);
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const allProducts = getShopProducts();
  const product = getShopProductBySlug(params.slug);
  if (!product) notFound();

  const interactivePreviewSrc = getShopInteractivePreviewSrc(params.slug);
  const relatedSizes = findRelatedSizes(params.slug, allProducts);
  const hasPricingLadder = relatedSizes.length > 0;
  const onBundleLadder = Boolean(product.bundleTierId);
  const megaProduct = getShopProductBySlug(MEGA_UPGRADE_TARGET_SLUG);
  const collection = getFamilyByProductSlug(params.slug);

  const priceEmphasisClass =
    product.bundleTierEmphasis === "best_value"
      ? "rounded-xl border-2 border-amber-500/45 bg-amber-500/[0.08] p-5 sm:p-6"
      : product.bundleTierEmphasis === "recommended"
        ? "rounded-xl border border-sky-500/40 bg-sky-500/[0.06] p-5 sm:p-6"
        : "";

  const deliveryProfile = getDeliveryProfileForCategory(product.category);
  const productJsonLd = buildShopProductJsonLd(product, params.slug);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
          <Link href="/shop" className="text-gray-500 transition hover:text-[#D4537E]">
            &larr; Back to shop
          </Link>
          {collection ? (
            <>
              <span className="text-gray-600">·</span>
              <Link
                href={`/shop/families/${collection.slug}`}
                className="font-medium text-[#D4537E] transition hover:underline"
              >
                More in {collection.title}
              </Link>
            </>
          ) : null}
        </div>

        {/* HOOK */}
        <section className="mb-10 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 sm:p-10">
          {product.category === "Cheat Sheets" ? (
            <div className="mb-6 rounded-xl border border-amber-400/35 bg-gradient-to-r from-amber-500/[0.12] to-[#D4537E]/[0.08] p-4 sm:p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-200/95">
                {CHEAT_SHEET_BONUS.eyebrow}
              </p>
              <p className="mt-2 font-serif text-lg font-bold text-white sm:text-xl">
                {CHEAT_SHEET_BONUS.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-amber-100/85 sm:text-base">
                {CHEAT_SHEET_BONUS.body}
              </p>
            </div>
          ) : null}
          <span className="mb-3 inline-block rounded-md bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {product.category}
          </span>
          <h1 className="mb-3 font-serif text-3xl font-bold leading-tight md:text-4xl">
            {product.title}
          </h1>
          <p className="mb-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            {product.longDescription || product.shortDescription}
          </p>
          <div className={`flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6 ${priceEmphasisClass}`}>
            <div className="min-w-0 flex-1">
              {product.bundleTierBadge ? (
                <span className="mb-2 inline-block rounded-full bg-[#D4537E]/25 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D4537E]">
                  {product.bundleTierBadge}
                </span>
              ) : null}
              <div className="flex flex-wrap items-baseline gap-3">
                {product.compareAtDisplay ? (
                  <span className="text-lg text-gray-500 line-through sm:text-xl">
                    {product.compareAtDisplay}
                  </span>
                ) : null}
                <span className="text-4xl font-bold">{product.priceDisplay}</span>
                <span className="text-sm text-gray-500">one-time payment</span>
              </div>
              {product.bundleTierTitle ? (
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                  {product.bundleTierTitle} tier
                </p>
              ) : null}
            </div>
            <CheckoutButton slug={product.slug} label={`Buy Now — ${product.priceDisplay}`} />
          </div>
          {onBundleLadder && product.bundleTierId ? (
            <BundleUpgradeMessaging
              slug={product.slug}
              tierId={product.bundleTierId}
              megaProduct={megaProduct}
            />
          ) : null}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
            <span>{deliveryProfile.fileType}</span>
            <span>&middot;</span>
            <span>{product.templateCount} templates</span>
            <span>&middot;</span>
            <span>Secure email delivery</span>
            <span>&middot;</span>
            <span>Print-ready</span>
          </div>
          <p className="mt-3 max-w-2xl text-xs leading-relaxed text-gray-500">{deliveryProfile.shortLine}</p>
          <div className="mt-6">
            <MembershipUpsellBlock productSlug={params.slug} />
          </div>
        </section>

        <ProductCommercialMetaSection product={product} />

        {interactivePreviewSrc ? (
          <section className="mb-10" aria-label="Watermarked interactive preview">
            <h2 className="mb-2 font-serif text-2xl font-semibold">
              Interactive preview (sample)
            </h2>
            <p className="mb-4 max-w-2xl text-sm text-gray-500">
              Watermarked teaser — after purchase, your email has a private link to the
              full print-ready file (not hosted on a public URL).
            </p>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a]">
              <iframe
                src={interactivePreviewSrc}
                title={`${product.title} — sample preview`}
                className="h-[min(32rem,72vh)] w-full border-0"
                loading="lazy"
              />
            </div>
          </section>
        ) : null}

        {product.previewImages.length > 0 ? (
          <ProductPreviewGallery
            images={product.previewImages.slice(0, 12)}
            productTitle={product.title}
          />
        ) : null}

        {/* OUTCOME SECTION */}
        <section className="mb-10 rounded-2xl border border-[#D4537E]/20 bg-[#D4537E]/5 p-8">
          <h2 className="mb-4 font-serif text-2xl font-semibold">
            What this does for your practice
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: "&#9201;", text: "Save 20+ hours of design and formatting time" },
              { icon: "&#10003;", text: "Look professional from day one — no designer needed" },
              { icon: "&#128200;", text: "Post consistently and book more consultations" },
              { icon: "&#128274;", text: "Stay compliant with industry-standard documentation" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className="mt-0.5 text-lg text-[#D4537E]"
                  dangerouslySetInnerHTML={{ __html: item.icon }}
                />
                <span className="text-sm text-gray-300">{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* WHAT'S INCLUDED */}
        <section className="mb-10">
          <h2 className="mb-5 font-serif text-2xl font-semibold">
            What&apos;s included
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {product.features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <span className="mt-0.5 text-[#D4537E]">&#10003;</span>
                <span className="text-sm text-gray-300">{f}</span>
              </div>
            ))}
          </div>
        </section>

        {/* WHO IT'S FOR */}
        {product.audience.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-5 font-serif text-2xl font-semibold">
              Built for
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {product.audience.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-300"
                >
                  <span className="text-[#D4537E]">&#8594;</span>
                  {a}
                </div>
              ))}
            </div>
          </section>
        )}

        {onBundleLadder ? (
          <BundleTierComparison currentSlug={params.slug} products={allProducts} />
        ) : null}

        {/* PRICING LADDER (non–bundle-ladder related SKUs only) */}
        {hasPricingLadder && !onBundleLadder && (
          <section className="mb-10">
            <h2 className="mb-5 font-serif text-2xl font-semibold">
              Choose your size
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {/* Current product highlighted */}
              <div className="relative rounded-xl border-2 border-[#D4537E] bg-[#D4537E]/10 p-5">
                <span className="absolute -top-3 left-4 rounded-full bg-[#D4537E] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Current
                </span>
                <h3 className="mt-1 font-serif text-lg font-bold">
                  {product.title}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  {product.templateCount} templates
                </p>
                <p className="mt-3 text-2xl font-bold">{product.priceDisplay}</p>
              </div>
              {relatedSizes.slice(0, 3).map((r) => (
                <Link
                  key={r.slug}
                  href={`/shop/${r.slug}`}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#D4537E]/40"
                >
                  <h3 className="font-serif text-lg font-bold">{r.title}</h3>
                  <p className="mt-1 text-xs text-gray-400">
                    {r.templateCount} templates
                  </p>
                  <p className="mt-3 text-2xl font-bold">{r.priceDisplay}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* HOW IT WORKS */}
        <section className="mb-10">
          <h2 className="mb-5 font-serif text-2xl font-semibold">
            How it works
          </h2>
          <div className="space-y-4">
            {[
              { n: "1", t: "Purchase instantly — secure checkout, no account needed" },
              { n: "2", t: "Check your email — delivery link arrives in under 5 minutes" },
              { n: "3", t: "Open and customize — edit in your browser, add your logo and details" },
              { n: "4", t: "Print or post — download as PDF, print, or share on social media" },
            ].map((step) => (
              <div key={step.n} className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4537E]/20 text-sm font-bold text-[#D4537E]">
                  {step.n}
                </span>
                <span className="pt-1 text-sm text-gray-400">{step.t}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="mb-5 font-serif text-2xl font-semibold">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {[
              { q: "Can I customize the templates?", a: "Yes — add your practice name, logo, colors, and contact info before printing." },
              {
                q: "What format are the files?",
                a: deliveryProfile.longLine,
              },
              { q: "Is this a physical product?", a: "No — instant digital delivery by email. Nothing ships." },
              {
                q: "Do I need Canva Pro?",
                a: "No. Most products are browser-only HTML. If this pack includes optional Canva links, Canva Free is enough.",
              },
              { q: "Can I use this for multiple locations?", a: "Licensed for your own practice. No redistribution or resale of files." },
              { q: "What if I need help?", a: "Reply to your delivery email or use hello@nopriorauthorization.com — we respond within 24 hours." },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
              >
                <h3 className="mb-2 text-sm font-bold text-white">{item.q}</h3>
                <p className="text-sm text-gray-500">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {product.category === "Cheat Sheets" ? <FreeTemplatesLeadStrip /> : null}

        {/* TRUST */}
        <div className="mb-10 rounded-xl border border-[#D4537E]/30 bg-[#D4537E]/5 p-6 text-center">
          <p className="text-sm text-gray-400">
            Created by{" "}
            <strong className="text-white">Hello Gorgeous Med Spa</strong> (10
            years in business) &middot; Board-certified FNP-BC &middot; Used by
            500+ providers
          </p>
        </div>

        {/* STICKY BUY (mobile) */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#1A1A1A]/95 px-4 py-3 backdrop-blur sm:hidden">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-2">
                {product.compareAtDisplay ? (
                  <span className="text-xs text-gray-500 line-through">{product.compareAtDisplay}</span>
                ) : null}
                <span className="text-lg font-bold">{product.priceDisplay}</span>
              </div>
              <span className="text-xs text-gray-500">{product.templateCount} templates</span>
            </div>
            <CheckoutButton slug={product.slug} label="Buy Now" />
          </div>
        </div>
      </div>
    </div>
  );
}
