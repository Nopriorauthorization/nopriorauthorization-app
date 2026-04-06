"use client";

import { type ReactNode, useEffect, useId, useMemo, useState } from "react";

export type CheckoutBumpOffer = {
  slug: string;
  title: string;
  priceDisplay: string;
  priceCents: number;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  loading: boolean;
  error: string | null;
  /** Always receives selected bump slugs (possibly empty). */
  onConfirm: (email: string, selectedBumpSlugs: string[]) => void;
  /** Shown above bumps; when bumps exist, include main line item. */
  productSummary?: {
    title: string;
    priceDisplay: string;
    priceCents: number;
  } | null;
  bumpOffers?: CheckoutBumpOffer[] | null;
  /** Skeleton while loading order context (shop funnel-config fetch). */
  orderSummaryLoading?: boolean;
  onBumpSelectionChange?: (selectedSlugs: string[]) => void;
  /** e.g. Pro membership savings strip between order summary and email */
  proConversionSlot?: ReactNode;
};

function formatTotal(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export function CheckoutEmailDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  loading,
  error,
  onConfirm,
  productSummary,
  bumpOffers,
  orderSummaryLoading,
  onBumpSelectionChange,
  proConversionSlot,
}: Props) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const offers = bumpOffers ?? [];
  const showBumps = offers.length > 0 && productSummary;

  useEffect(() => {
    if (!open) {
      setEmail("");
      setSelected({});
    }
  }, [open]);

  const selectedSlugs = useMemo(() => offers.filter((o) => selected[o.slug]).map((o) => o.slug), [offers, selected]);

  const totalCents = useMemo(() => {
    if (!productSummary) return 0;
    const bumpSum = offers.filter((o) => selected[o.slug]).reduce((a, o) => a + o.priceCents, 0);
    return productSummary.priceCents + bumpSum;
  }, [productSummary, offers, selected]);

  const toggleBump = (slug: string) => {
    setSelected((prev) => {
      const next = { ...prev, [slug]: !prev[slug] };
      const slugs = offers.filter((o) => next[o.slug]).map((o) => o.slug);
      onBumpSelectionChange?.(slugs);
      return next;
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/70"
        onClick={() => !loading && onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        className="relative z-10 max-h-[min(90vh,720px)] w-full max-w-md overflow-y-auto rounded-2xl border border-white/15 bg-[#1A1A1A] p-6 shadow-xl"
      >
        <h2 id={`${id}-title`} className="font-serif text-xl font-bold text-white">
          {title}
        </h2>
        <p className="mt-2 text-sm text-gray-400">{description}</p>

        {orderSummaryLoading ? (
          <div
            className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-4"
            aria-busy="true"
            aria-label="Loading order summary"
          >
            <div className="h-2.5 w-28 animate-pulse rounded bg-white/15" />
            <div className="mt-4 h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-white/10" />
          </div>
        ) : productSummary ? (
          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Order summary</p>
            <div className="mt-2 flex items-start justify-between gap-3">
              <span className="text-sm font-medium text-white">{productSummary.title}</span>
              <span className="shrink-0 text-sm font-semibold text-white">{productSummary.priceDisplay}</span>
            </div>

            {showBumps ? (
              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#D4537E]">Add to order</p>
                <ul className="mt-2 space-y-2">
                  {offers.map((o) => (
                    <li key={o.slug}>
                      <label className="flex cursor-pointer gap-3 rounded-lg border border-white/10 bg-black/25 p-3 transition hover:border-[#D4537E]/35">
                        <input
                          type="checkbox"
                          checked={Boolean(selected[o.slug])}
                          onChange={() => toggleBump(o.slug)}
                          disabled={loading}
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/30 text-[#D4537E] focus:ring-[#D4537E]"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-white">{o.title}</span>
                          <span className="mt-0.5 block text-xs text-gray-400">{o.priceDisplay}</span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total</span>
              <span className="text-lg font-bold text-white">{formatTotal(totalCents)}</span>
            </div>
          </div>
        ) : null}

        {proConversionSlot}

        <label htmlFor={`${id}-email`} className="mt-5 block text-xs font-bold uppercase tracking-wide text-gray-500">
          Email
        </label>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2.5 text-white placeholder:text-gray-600 focus:border-[#D4537E] focus:outline-none focus:ring-1 focus:ring-[#D4537E] disabled:opacity-60"
          placeholder="you@example.com"
        />
        {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading || !email.trim()}
            onClick={() => onConfirm(email, selectedSlugs)}
            className="rounded-lg bg-[#D4537E] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#D4537E]/85 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Redirecting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
