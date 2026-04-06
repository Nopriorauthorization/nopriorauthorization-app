"use client";

import { useEffect, useId } from "react";
import { MEMBERSHIP_CONFIG } from "@/config/growth-funnel.config";
import Button from "@/components/ui/button";
import { formatUsdFromCents, useProBrowseSnapshot } from "./pro-browse-client";
import { useProUpgrade } from "./ProUpgradeContext";

export function ProUpgradeModal() {
  const id = useId();
  const { isOpen, closeProModal, modalReason } = useProUpgrade();
  const { headline, saveCents } = useProBrowseSnapshot();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeProModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60"
        onClick={closeProModal}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-xl dark:border-white/15 dark:bg-[#1A1A1A] dark:text-white"
      >
        <h2 id={`${id}-title`} className="font-serif text-xl font-bold">
          Unlock NPA Pro
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {modalReason ? (
            <p className="font-medium text-gray-900 dark:text-gray-200">{modalReason}</p>
          ) : null}
          <p>{headline}</p>
          {saveCents > 0 ? (
            <p className="rounded-md border border-emerald-500/35 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-900 dark:text-emerald-200">
              You’d save {formatUsdFromCents(saveCents)} with annual Pro vs your browsed picks.
            </p>
          ) : null}
        </div>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={closeProModal}>
            Not now
          </Button>
          <a
            href={MEMBERSHIP_CONFIG.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-base font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:bg-[#D4537E] dark:hover:bg-[#D4537E]/85 dark:focus:ring-[#D4537E]"
          >
            Upgrade to Pro — {formatUsdFromCents(MEMBERSHIP_CONFIG.annualPriceCents)}/yr
          </a>
        </div>
      </div>
    </div>
  );
}
