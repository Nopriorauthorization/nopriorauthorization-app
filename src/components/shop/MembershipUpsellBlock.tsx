import { FUNNEL_COPY } from "@/config/growth-funnel.config";
import { MEMBERSHIP_CONFIG } from "@/config/growth-funnel.config";
import { FunnelLink } from "./FunnelLink";

type Variant = "product" | "compact";

export function MembershipUpsellBlock({
  variant = "product",
  productSlug,
}: {
  variant?: Variant;
  productSlug?: string;
}) {
  const copy = FUNNEL_COPY.productMembershipUpsell;
  const wrap =
    variant === "compact"
      ? "rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-400"
      : "rounded-xl border border-[#D4537E]/25 bg-[#D4537E]/10 p-6 text-sm text-gray-300";

  const source =
    variant === "compact" ? "product_compact" : productSlug ? `product_${productSlug}` : "product_block";

  return (
    <div className={wrap}>
      <p className={variant === "compact" ? "mb-2" : "mb-3"}>{copy}</p>
      <FunnelLink
        href="/membership"
        event="funnel_membership_click"
        eventParams={{ source, product_slug: productSlug }}
        className="inline-flex font-bold text-[#D4537E] hover:underline"
      >
        {MEMBERSHIP_CONFIG.ctaLabel} — {formatMembershipPrice()}
      </FunnelLink>
    </div>
  );
}

function formatMembershipPrice() {
  const c = MEMBERSHIP_CONFIG.monthlyPriceCents;
  return `$${(c / 100).toFixed(0)}/mo`;
}
