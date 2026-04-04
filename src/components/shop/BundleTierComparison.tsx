import Link from "next/link";
import {
  BUNDLE_TIERS,
  BUNDLE_TIER_SHOWCASE_SLUG,
  type BundleTierId,
} from "@/lib/shop/bundle-tier-config";
import type { ShopProduct } from "@/lib/shop/products";

export function BundleTierComparison({
  currentSlug,
  products,
}: {
  currentSlug: string;
  products: ShopProduct[];
}) {
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const currentTierId = products.find((x) => x.slug === currentSlug)?.bundleTierId;

  return (
    <section className="mb-10" aria-labelledby="bundle-tier-table-heading">
      <h2 id="bundle-tier-table-heading" className="mb-2 font-serif text-2xl font-semibold">
        Compare bundle tiers
      </h2>
      <p className="mb-5 max-w-2xl text-sm text-gray-500">
        Same ladder across the shop — start small, scale up, or jump to Mega when you want maximum value.
      </p>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.04]">
              <th className="px-4 py-3 font-bold text-gray-300">Tier</th>
              <th className="px-4 py-3 font-bold text-gray-300">Anchor</th>
              <th className="px-4 py-3 font-bold text-gray-300">Featured pack</th>
              <th className="px-4 py-3 font-bold text-gray-300">From</th>
              <th className="px-4 py-3 font-bold text-gray-300">Templates</th>
            </tr>
          </thead>
          <tbody>
            {BUNDLE_TIERS.map((tier) => {
              const showcaseSlug = BUNDLE_TIER_SHOWCASE_SLUG[tier.id as BundleTierId];
              const p = bySlug.get(showcaseSlug);
              const isCurrentTier = currentTierId === tier.id;
              const isRecommended = tier.emphasis === "recommended";
              const isBest = tier.emphasis === "best_value";

              const rowAccent =
                isBest ? "border-l-4 border-amber-500/80" : isRecommended ? "border-l-4 border-sky-500/70" : "";

              return (
                <tr
                  key={tier.id}
                  className={`border-b border-white/10 last:border-0 ${rowAccent} ${
                    isCurrentTier ? "bg-[#D4537E]/15" : "bg-white/[0.02]"
                  }`}
                >
                  <td className="px-4 py-4 align-top">
                    <div className="font-serif font-bold text-white">{tier.title}</div>
                    {tier.badge ? (
                      <span className="mt-1 inline-block rounded-full bg-[#D4537E]/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#D4537E]">
                        {tier.badge}
                      </span>
                    ) : null}
                    {isRecommended ? (
                      <span className="mt-1 ml-0 block text-[10px] font-bold uppercase tracking-wider text-sky-400">
                        Recommended band
                      </span>
                    ) : null}
                    {isBest ? (
                      <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        Best value band
                      </span>
                    ) : null}
                    {isCurrentTier ? (
                      <span className="mt-2 block text-[10px] font-bold uppercase text-[#D4537E]">
                        Your tier
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 align-top text-gray-400">{tier.anchorLabel}</td>
                  <td className="px-4 py-4 align-top">
                    {p ? (
                      <Link
                        href={`/shop/${p.slug}`}
                        className="font-medium text-white underline-offset-2 hover:text-[#D4537E] hover:underline"
                      >
                        {p.title}
                      </Link>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                    <p className="mt-1 max-w-xs text-xs text-gray-500">{tier.summary}</p>
                  </td>
                  <td className="px-4 py-4 align-top font-bold text-white">
                    {p ? p.priceDisplay : "—"}
                  </td>
                  <td className="px-4 py-4 align-top text-gray-400">
                    {p ? `${p.templateCount}` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
