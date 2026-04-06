import Link from "next/link";
import {
  getDeliveryProfileForCategory,
  LICENSE_SHOP_STANDARD,
  MEMBERSHIP_INCLUSION_LINE,
} from "@/config/delivery-language.config";
import { formatMembershipMonthlyUsd, MEMBERSHIP_CONFIG } from "@/config/growth-funnel.config";
import { NPA_OG_IMAGE_PATH, NPA_SITE_URL } from "@/config/npa-brand.config";
import { getUpsellSlugAfterPurchase } from "@/config/post-purchase-upsell.config";
import type { ShopProduct } from "@/lib/shop/products";
import { getShopProductBySlug } from "@/lib/shop/products";
import { CheckoutButton } from "../../app/shop/[slug]/CheckoutButton";

export function ProductCommercialMetaSection({ product }: { product: ShopProduct }) {
  const profile = getDeliveryProfileForCategory(product.category);
  const upsellSlug = getUpsellSlugAfterPurchase(product.slug);
  const upsell =
    upsellSlug && upsellSlug !== product.slug ? getShopProductBySlug(upsellSlug) : undefined;

  return (
    <section className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <h2 className="font-serif text-xl font-semibold sm:text-2xl">Product details</h2>
      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">File type</dt>
          <dd className="mt-1 text-gray-300">{profile.fileType}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">Templates / assets</dt>
          <dd className="mt-1 text-gray-300">{product.templateCount} included</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">Delivery</dt>
          <dd className="mt-1 text-gray-300">{profile.longLine}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">Who it&apos;s for</dt>
          <dd className="mt-1 text-gray-300">
            {product.audience.length > 0 ? product.audience.join(" · ") : "Med spa teams and aesthetic practices."}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">What&apos;s included</dt>
          <dd className="mt-1 text-gray-300">See the checklist below — {product.features.length} listed items.</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">License</dt>
          <dd className="mt-1 text-gray-300">{LICENSE_SHOP_STANDARD}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">Pro Membership</dt>
          <dd className="mt-1 text-gray-300">
            {MEMBERSHIP_INCLUSION_LINE}{" "}
            <Link href="/membership" className="font-semibold text-[#D4537E] hover:underline">
              {MEMBERSHIP_CONFIG.displayName} — {formatMembershipMonthlyUsd()}/mo
            </Link>
            .
          </dd>
        </div>
      </dl>

      {upsell ? (
        <div className="mt-8 border-t border-white/10 pt-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4537E]">Frequently bought next</h3>
          <p className="mt-2 font-serif text-lg font-bold text-white">{upsell.title}</p>
          <p className="mt-1 text-sm text-gray-400">{upsell.shortDescription}</p>
          <div className="mt-4">
            <CheckoutButton slug={upsell.slug} label={`View checkout — ${upsell.priceDisplay}`} />
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function buildShopProductJsonLd(product: ShopProduct, slug: string) {
  const url = `${NPA_SITE_URL}/shop/${slug}`;
  const images =
    product.previewImages.length > 0
      ? product.previewImages.map((src) => (src.startsWith("http") ? src : `${NPA_SITE_URL}${src}`))
      : [`${NPA_SITE_URL}${NPA_OG_IMAGE_PATH}`];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: NPA_SITE_URL },
          { "@type": "ListItem", position: 2, name: "Shop", item: `${NPA_SITE_URL}/shop` },
          { "@type": "ListItem", position: 3, name: product.title, item: url },
        ],
      },
      {
        "@type": "Product",
        name: product.title,
        description: product.shortDescription,
        sku: slug,
        image: images,
        brand: {
          "@type": "Brand",
          name: "No Prior Authorization",
        },
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "USD",
          price: (product.priceCents / 100).toFixed(2),
          availability: "https://schema.org/InStock",
        },
      },
    ],
  };
}
