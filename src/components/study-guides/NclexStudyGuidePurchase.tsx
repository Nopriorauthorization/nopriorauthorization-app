"use client";

import { NclexPurchasePanel } from "@/components/study-guides/NclexPurchasePanel";

/** Study guides hub — card wrapper around shared purchase UI. */
export function NclexStudyGuidePurchase() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <NclexPurchasePanel variant="compact" />
    </div>
  );
}
