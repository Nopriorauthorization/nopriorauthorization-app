import Link from "next/link";
import { notFound } from "next/navigation";
import { getShopProducts } from "@/lib/shop/products";
import {
  SHOP_FAMILIES,
  getFamilyBySlug,
  resolveFamilyProducts,
  formatFamilyFloorPrice,
} from "@/lib/shop/families";
import { SHOP_BADGE_MAP, SHOP_OUTCOME_MAP } from "@/lib/shop/shop-marketing";

export function generateStaticParams() {
  return SHOP_FAMILIES.map((f) => ({ familySlug: f.slug }));
}

type Props = { params: { familySlug: string } };

export function generateMetadata({ params }: Props) {
  const fam = getFamilyBySlug(params.familySlug);
  if (!fam) return { title: "Collection | NPA" };
  return {
    title: `${fam.title} templates & downloads | NPA`,
    description: fam.description,
  };
}

export default function ShopFamilyDetailPage({ params }: Props) {
  const family = getFamilyBySlug(params.familySlug);
  if (!family) notFound();

  const allProducts = getShopProducts();
  const items = resolveFamilyProducts(family, allProducts);
  if (items.length === 0) notFound();

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 flex flex-wrap gap-4 text-sm">
          <Link href="/shop" className="text-gray-500 transition hover:text-[#D4537E]">
            &larr; Shop
          </Link>
          <span className="text-gray-600">/</span>
          <Link href="/shop/families" className="text-gray-500 transition hover:text-[#D4537E]">
            Collections
          </Link>
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D4537E]">
          Collection
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl md:text-5xl">
          {family.title}
        </h1>
        <p className="mt-2 text-lg text-[#D4537E]/90">{family.subtitle}</p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-400">
          {family.description}
        </p>
        <p className="mt-4 text-sm text-gray-500">
          {items.length} products in this collection · entry from{" "}
          <span className="font-semibold text-white">
            {formatFamilyFloorPrice(family, allProducts)}
          </span>{" "}
          · sorted low to high
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => {
            const badge = SHOP_BADGE_MAP[p.slug];
            const outcome = SHOP_OUTCOME_MAP[p.slug];
            return (
              <Link
                key={p.slug}
                href={`/shop/${p.slug}`}
                data-category={p.category}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#D4537E]/40 hover:bg-white/[0.06]"
              >
                {p.previewImages[0] ? (
                  <div className="mb-3 overflow-hidden rounded-xl border border-white/5 shadow-lg shadow-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.previewImages[0]}
                      alt={p.title}
                      loading="lazy"
                      className="aspect-[4/3] h-44 w-full object-cover object-top transition duration-300 group-hover:scale-[1.02] sm:h-48"
                    />
                  </div>
                ) : null}

                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {p.category}
                  </span>
                  {badge ? (
                    <span
                      className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                  ) : p.featured ? (
                    <span className="rounded-md bg-[#D4537E]/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D4537E]">
                      Featured
                    </span>
                  ) : null}
                </div>

                <h2 className="mb-1 font-serif text-lg font-semibold leading-snug group-hover:text-[#D4537E]">
                  {p.title}
                </h2>
                {outcome ? (
                  <p className="mb-2 text-xs font-medium text-[#D4537E]/80 line-clamp-2">
                    {outcome}
                  </p>
                ) : null}
                <p className="mb-4 flex-1 text-sm text-gray-500 line-clamp-2">
                  {p.shortDescription}
                </p>
                <div className="flex items-end justify-between border-t border-white/10 pt-4">
                  <div>
                    <span className="text-2xl font-bold">{p.priceDisplay}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      {p.templateCount} templates
                    </span>
                  </div>
                  <span className="rounded-lg bg-[#D4537E] px-4 py-2 text-sm font-bold text-white">
                    View
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
