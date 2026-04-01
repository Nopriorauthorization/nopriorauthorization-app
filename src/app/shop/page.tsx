import Link from "next/link";
import { getShopProducts, getShopCategories } from "@/lib/shop/products";
import { ShopCategoryFilter } from "./ShopCategoryFilter";

export const metadata = {
  title: "Digital Templates for Aesthetic Professionals | No Prior Authorization",
  description:
    "Done-for-you templates for med spas, injectors, and aesthetic entrepreneurs. Consent forms, social media kits, legal bundles, and more — instant download.",
};

export default function ShopPage() {
  const products = getShopProducts();
  const categories = getShopCategories();

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4537E]">
            No Prior Authorization
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">
            Digital Templates
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-400">
            Done-for-you templates by Danielle &amp; Ryan Kent, FNP-BC.
            Consent forms, social media kits, legal bundles &mdash; instant
            download, fully customizable.
          </p>
        </div>

        <ShopCategoryFilter categories={categories} />

        <div
          id="product-grid"
          className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/shop/${p.slug}`}
              data-category={p.category}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#D4537E]/40 hover:bg-white/[0.06]"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {p.category}
                </span>
                {p.featured && (
                  <span className="rounded-md bg-[#D4537E]/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D4537E]">
                    Featured
                  </span>
                )}
              </div>

              <h2 className="mb-2 font-serif text-lg font-semibold leading-snug text-white group-hover:text-[#D4537E]">
                {p.title}
              </h2>

              <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-500 line-clamp-3">
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
          ))}
        </div>
      </div>
    </div>
  );
}
