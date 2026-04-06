"use client";

import { FiZap } from "react-icons/fi";
import Button from "@/components/ui/button";
import { formatUsdFromCents, useProBrowseSnapshot } from "./pro-browse-client";
import { useProUpgrade } from "./ProUpgradeContext";

type Props = {
  variant?: "default" | "compact";
  className?: string;
};

export function ProConversionStrip({ variant = "default", className = "" }: Props) {
  const { openProModal } = useProUpgrade();
  const { headline: line, saveCents: save } = useProBrowseSnapshot();

  if (variant === "compact") {
    return (
      <div
        className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border border-violet-500/25 bg-violet-500/10 px-3 py-2 text-sm ${className}`.trim()}
      >
        <span className="flex items-center gap-2">
          <FiZap className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-300" />
          {save > 0 ? (
            <span>
              Save <strong>{formatUsdFromCents(save)}</strong> with Pro vs what you browsed.
            </span>
          ) : (
            <span>Templates you viewed — compare to Pro.</span>
          )}
        </span>
        <Button type="button" size="sm" variant="outline" onClick={() => openProModal()}>
          Pro details
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent p-4 ${className}`.trim()}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <FiZap className="mt-0.5 h-5 w-5 shrink-0 text-violet-600 dark:text-violet-300" />
          <p className="text-sm leading-relaxed">{line}</p>
        </div>
        <Button type="button" className="shrink-0" onClick={() => openProModal()}>
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
}
