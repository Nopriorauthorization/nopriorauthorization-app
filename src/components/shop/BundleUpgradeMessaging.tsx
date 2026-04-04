import Link from "next/link";
import {
  MEGA_COMPLETE_STACK_SLUGS,
  MEGA_UPGRADE_TARGET_SLUG,
  type BundleTierId,
} from "@/lib/shop/bundle-tier-config";
import type { ShopProduct } from "@/lib/shop/products";

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
            <strong className="text-white">Everything in this stack — </strong>
            no need to buy anything else to run the full combo we designed. Add individual
            playbooks later only if you want niche depth.
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
      <strong className="text-white">Upgrade to the Mega Bundle and save — </strong>
      <Link href={`/shop/${MEGA_UPGRADE_TARGET_SLUG}`} className="font-bold text-[#D4537E] hover:underline">
        {megaProduct.title}
      </Link>
      <span> ({megaProduct.priceDisplay}) bundles clinical, social, and ops templates so you stop buying piecemeal.</span>
    </div>
  );
}
