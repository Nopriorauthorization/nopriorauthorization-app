"use client";

import { useCallback, useRef } from "react";
import { readExperimentFromSession } from "@/lib/experiments/home-strip-ab";
import { trackNpaEvent } from "@/lib/analytics/npa-events";

/**
 * Fires `npa_path_first_engagement` once per page mount when the visitor
 * clicks a meaningful CTA (hub, shop, book, cross-lane, etc.).
 */
export function useFirstPathEngagement(audience: "student" | "provider") {
  const fired = useRef(false);
  return useCallback(
    (action: string) => {
      if (fired.current) return;
      fired.current = true;
      const experimentVariant = readExperimentFromSession();
      trackNpaEvent("npa_path_first_engagement", {
        audience,
        action,
        ...(experimentVariant ? { experiment_variant: experimentVariant } : {}),
      });
    },
    [audience],
  );
}
