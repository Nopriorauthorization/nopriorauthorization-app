"use client";

import { useEffect, useMemo, useState } from "react";
import { MEMBERSHIP_CONFIG } from "@/config/growth-funnel.config";
import {
  PRO_BROWSE_MAX_ENTRIES,
  PRO_BROWSE_STORAGE_KEY,
} from "@/config/pro-membership-layer.config";

type BrowseEntry = { slug: string; priceCents: number; at: number };

type Stored = { v: 1; entries: BrowseEntry[] };

function readStore(): Stored {
  if (typeof window === "undefined") return { v: 1, entries: [] };
  try {
    const raw = window.localStorage.getItem(PRO_BROWSE_STORAGE_KEY);
    if (!raw) return { v: 1, entries: [] };
    const p = JSON.parse(raw) as Stored;
    if (p?.v !== 1 || !Array.isArray(p.entries)) return { v: 1, entries: [] };
    return p;
  } catch {
    return { v: 1, entries: [] };
  }
}

export const PRO_BROWSE_CHANGED_EVENT = "npa_pro_browse_changed";

function notifyProBrowseChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PRO_BROWSE_CHANGED_EVENT));
}

function writeStore(s: Stored) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PRO_BROWSE_STORAGE_KEY, JSON.stringify(s));
    notifyProBrowseChanged();
  } catch {
    // ignore quota
  }
}

/** Record a product view with price (call from product page client island). */
export function recordProProductView(slug: string, priceCents: number): void {
  const s = slug.trim();
  if (!s || !Number.isFinite(priceCents) || priceCents <= 0) return;
  const store = readStore();
  const filtered = store.entries.filter((e) => e.slug !== s);
  filtered.push({ slug: s, priceCents: Math.round(priceCents), at: Date.now() });
  filtered.sort((a, b) => b.at - a.at);
  writeStore({
    v: 1,
    entries: filtered.slice(0, PRO_BROWSE_MAX_ENTRIES),
  });
}

export function getUniqueBrowseTotals(): { slugs: string[]; sumCents: number; count: number } {
  const store = readStore();
  const bySlug = new Map<string, number>();
  for (const e of store.entries) {
    if (!bySlug.has(e.slug)) {
      bySlug.set(e.slug, e.priceCents);
    }
  }
  let sum = 0;
  for (const c of bySlug.values()) {
    sum += c;
  }
  return { slugs: [...bySlug.keys()], sumCents: sum, count: bySlug.size };
}

export function savingsVsProAnnualCents(): number {
  const { sumCents } = getUniqueBrowseTotals();
  const annual = MEMBERSHIP_CONFIG.annualPriceCents;
  return Math.max(0, sumCents - annual);
}

export function formatUsdFromCents(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

/**
 * Primary dynamic line for strips / modal (browse-based).
 */
export function getProSavingsHeadline(): string {
  const { sumCents, count } = getUniqueBrowseTotals();
  const annual = MEMBERSHIP_CONFIG.annualPriceCents;
  const save = Math.max(0, sumCents - annual);
  if (count === 0) {
    return `NPA Pro unlocks the full template library for ${formatUsdFromCents(annual)}/year — new drops included while you’re subscribed.`;
  }
  if (save > 0) {
    return `You’d save ${formatUsdFromCents(save)} with Pro (annual) vs buying the ${count} template${count === 1 ? "" : "s"} you’ve browsed separately (${formatUsdFromCents(sumCents)} catalog value).`;
  }
  return `You’ve browsed about ${formatUsdFromCents(sumCents)} in templates. Pro is ${formatUsdFromCents(annual)}/year for the full library — including products you haven’t opened yet.`;
}

/** Re-read browse totals when storage or same-tab updates fire (for live savings copy). */
export function useProBrowseSnapshot() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    if (typeof window === "undefined") return;
    window.addEventListener(PRO_BROWSE_CHANGED_EVENT, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(PRO_BROWSE_CHANGED_EVENT, bump);
      window.removeEventListener("storage", bump);
    };
  }, []);
  return useMemo(
    () => ({
      headline: getProSavingsHeadline(),
      saveCents: savingsVsProAnnualCents(),
      totals: getUniqueBrowseTotals(),
    }),
    [tick],
  );
}
