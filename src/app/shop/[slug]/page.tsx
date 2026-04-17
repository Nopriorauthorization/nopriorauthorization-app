import { notFound } from "next/navigation";
import Link from "next/link";
import { GROWTH_SYSTEM_SLUG } from "@/config/growth-funnel.config";
import { getDeliveryProfileForCategory } from "@/config/delivery-language.config";
import { buildShopProductJsonLd } from "@/components/shop/ProductCommercialMetaSection";
import {
  baseOpenGraphSiteFields,
  openGraphImagesForProduct,
  twitterImagesForProduct,
} from "@/lib/seo/brand-social-meta";
import { buildProductMetaDescription, buildProductMetaTitle } from "@/lib/seo/shop-product-seo";
import { NPA_SITE_URL } from "@/config/npa-brand.config";
import { getShopProductBySlug, getShopProducts } from "@/lib/shop/products";
import { resolveShopFunnelForSlug } from "@/lib/shop/funnel-resolve";
import { isShopProductIncludedInPro } from "@/lib/membership/pro-catalog";
import { ProProductRecordView } from "@/components/membership/ProProductRecordView";
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
  const canonical = `${NPA_SITE_URL}/shop/${params.slug}`;
  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical },
    openGraph: {
      ...baseOpenGraphSiteFields(),
      title,
      description,
      url: canonical,
      images: openGraphImagesForProduct(product),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: twitterImagesForProduct(product),
    },
  };
}

/**
 * Simplified PDP (Eric / Dani): one job — read, buy, FAQ.
 * No mid-page Growth System / Pro / tier-table / “frequently bought next” upsells;
 * post-purchase email is the right place for library upsells.
 */
export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getShopProductBySlug(params.slug);
  if (!product) notFound();

  const shopFunnel = await resolveShopFunnelForSlug(params.slug);
  const useFunnelLanding = shopFunnel.enabled && shopFunnel.useDedicatedLanding;

  const deliveryProfile = getDeliveryProfileForCategory(product.category);
  const productJsonLd = buildShopProductJsonLd(product, params.slug);
  const includedInPro = isShopProductIncludedInPro(params.slug);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProProductRecordView
        slug={params.slug}
        priceCents={product.priceCents}
        enabled={includedInPro}
      />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <Link href="/shop" className="text-sm text-gray-500 transition hover:text-[#D4537E]">
            &larr; Back to shop
          </Link>
        </div>

        <section className="mb-10 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 sm:p-10">
          <div className="mb-3">
            <span className="inline-block rounded-md bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              {product.category}
            </span>
          </div>
          <h1 className="mb-3 font-serif text-3xl font-bold leading-tight md:text-4xl">
            {product.title}
          </h1>
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-gray-400">
            {product.longDescription || product.shortDescription}
          </p>

          <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-3">
                {product.compareAtDisplay ? (
                  <span className="text-lg text-gray-500 line-through sm:text-xl">
                    {product.compareAtDisplay}
                  </span>
                ) : null}
                <span className="text-4xl font-bold">{product.priceDisplay}</span>
                <span className="text-sm text-gray-500">one-time payment</span>
              </div>
            </div>
            <CheckoutButton
              slug={product.slug}
              label={`Buy now — ${product.priceDisplay}`}
              useFunnelLanding={useFunnelLanding}
              funnelTrackingEnabled={shopFunnel.enabled}
              proConversionUpsell={false}
            />
          </div>
          <p className="mt-4 max-w-2xl text-xs leading-relaxed text-gray-500">
            {deliveryProfile.shortLine}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-5 font-serif text-2xl font-semibold">What&apos;s included</h2>
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

        <section className="mb-10">
          <h2 className="mb-5 font-serif text-2xl font-semibold">Frequently asked questions</h2>
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
            <CheckoutButton
              slug={product.slug}
              label="Buy now"
              useFunnelLanding={useFunnelLanding}
              funnelTrackingEnabled={shopFunnel.enabled}
              proConversionUpsell={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
