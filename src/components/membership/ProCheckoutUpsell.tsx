"use client";

import { ProConversionStrip } from "./ProConversionStrip";

/** Dark checkout dialog-friendly strip (parent is `bg-[#1A1A1A]`). */
export function ProCheckoutUpsell() {
  return (
    <ProConversionStrip
      variant="compact"
      className="mt-4 border-white/15 bg-violet-950/40 text-gray-200 [&_strong]:text-white"
    />
  );
}
