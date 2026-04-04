import { FUNNEL_COPY } from "@/config/growth-funnel.config";
import {
  MEGA_COMPLETE_STACK_SLUGS,
  MEGA_UPGRADE_TARGET_SLUG,
  type BundleTierId,
} from "@/lib/shop/bundle-tier-config";
import type { ShopProduct } from "@/lib/shop/products";
import { FunnelLink } from "./FunnelLink";

export function BundleUpgradeMessaging({
  slug,
  tierId,
  megaProduct,
}: {
  slug: string;
  tierId: BundleTierId;
  megaProduct: ShopProduct | undefined;
}) {
  if (tierId === "mega") {
    const complete = MEGA_COMPLETE_STACK_SLUGS.has(slug);
    return (
      <div
        className={`mt-5 rounded-xl border p-4 text-sm leading-relaxed ${
          complete
            ? "border-amber-500/40 bg-amber-500/10 text-amber-100"
            : "border-white/10 bg-white/[0.04] text-gray-400"
        }`}
      >
        {complete ? (
          <>
            <strong className="text-white">Everything included — </strong>
            no need to buy anything else for this stack. Add individual playbooks only if you
            want niche depth later.
          </>
        ) : (
          <>
            <strong className="text-white">Premium suite — </strong>
            one of our largest single investments. Pair with the shop catalog only if you need
            a specialty line we don&apos;t bundle here.
          </>
        )}
      </div>
    );
  }

  if (!megaProduct) return null;

  return (
    <div className="mt-5 rounded-xl border border-[#D4537E]/35 bg-[#D4537E]/10 p-4 text-sm text-gray-300">
      <span className="text-white/95">{FUNNEL_COPY.upgradeToGrowth} </span>
      <FunnelLink
        href={`/shop/${MEGA_UPGRADE_TARGET_SLUG}`}
        event="funnel_upgrade_growth_click"
        eventParams={{ from_tier: tierId }}
        className="font-bold text-[#D4537E] hover:underline"
      >
        {megaProduct.title}
      </FunnelLink>
      <span>
        {" "}
        ({megaProduct.priceDisplay}) — full Growth System instead of stacking smaller bundles.
      </span>
    </div>
  );
}
