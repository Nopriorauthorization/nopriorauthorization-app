"use client";

import { useEffect, useRef } from "react";
import type { PathEntrySource } from "@/lib/analytics/path-entry-source";
import { readExperimentFromSession } from "@/lib/experiments/home-strip-ab";
import { trackNpaEvent } from "@/lib/analytics/npa-events";

/** Fires once on mount; strips `?source=` from the URL after tracking (no reload). */
export function usePathEntryAnalytics(
  audience: "student" | "provider",
  source: PathEntrySource,
): void {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const experimentVariant = readExperimentFromSession();
    trackNpaEvent("npa_path_entered", {
      audience,
      source,
      entry_source: source,
      ...(experimentVariant ? { experiment_variant: experimentVariant } : {}),
    });

    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (!url.searchParams.has("source")) return;
    url.searchParams.delete("source");
    const qs = url.searchParams.toString();
    const next = qs ? `${url.pathname}?${qs}${url.hash}` : `${url.pathname}${url.hash}`;
    window.history.replaceState(window.history.state, "", next);
  }, [audience, source]);
}
