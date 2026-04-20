"use client";

import { AUDIENCE_CTA_LABELS } from "@/config/site-audiences.config";
import { NpaTrackedLink } from "@/components/site/NpaTrackedLink";

export function ShopAudienceLane() {
  return (
    <div className="border-b border-white/10 bg-[#151515]">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-5 gap-y-1 px-4 py-3 text-center text-xs sm:text-sm sm:py-2.5">
        <span className="text-gray-500">Pick your lane</span>
        <NpaTrackedLink
          href="/for-students?source=shop_lane"
          trackEvent="npa_audience_shop_lane_click"
          trackParams={{
            audience: "student",
            destination: "/for-students?source=shop_lane",
          }}
          className="inline-flex min-h-[44px] items-center justify-center font-semibold text-teal-300 transition hover:text-teal-200"
        >
          {AUDIENCE_CTA_LABELS.shopLaneStudent} →
        </NpaTrackedLink>
        <span className="hidden text-gray-600 sm:inline" aria-hidden>
          ·
        </span>
        <NpaTrackedLink
          href="/for-providers?source=shop_lane"
          trackEvent="npa_audience_shop_lane_click"
          trackParams={{
            audience: "provider",
            destination: "/for-providers?source=shop_lane",
          }}
          className="inline-flex min-h-[44px] items-center justify-center font-semibold text-amber-200 transition hover:text-amber-100"
        >
          {AUDIENCE_CTA_LABELS.shopLaneProvider} →
        </NpaTrackedLink>
      </div>
    </div>
  );
}
