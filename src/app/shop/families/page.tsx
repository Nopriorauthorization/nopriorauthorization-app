import Link from "next/link";
import { getShopProducts } from "@/lib/shop/products";
import {
  SHOP_FAMILIES,
  familyProductCount,
  formatFamilyFloorPrice,
} from "@/lib/shop/families";

export const metadata = {
  title: "Shop by collection | NPA",
  description:
    "Browse med spa templates by focus area — weight loss, IV therapy, injectables, social content, legal, and more. Multiple SKUs per collection.",
};

export default function ShopFamiliesIndexPage() {
  const products = getShopProducts();

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href="/shop"
          className="mb-8 inline-block text-sm text-gray-500 transition hover:text-[#D4537E]"
        >
          &larr; Back to shop
        </Link>

        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D4537E]">
          Collections
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl md:text-5xl">
          Shop by focus area
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-400">
          Each collection groups related downloads — from $10 quick references to full bundles.
          Pick one SKU or stack several; checkout is always per product.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SHOP_FAMILIES.map((fam) => {
            const n = familyProductCount(fam, products);
            if (n === 0) return null;
            return (
              <Link
                key={fam.slug}
                href={`/shop/families/${fam.slug}`}
                className="group flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-7 transition hover:border-[#D4537E]/45"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  {fam.subtitle}
                </span>
                <h2 className="mt-2 font-serif text-2xl font-bold group-hover:text-[#D4537E]">
                  {fam.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">
                  {fam.description}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-sm">
                  <span className="font-bold text-white">{n} products</span>
                  <span className="text-[#D4537E]">
                    From {formatFamilyFloorPrice(fam, products)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
