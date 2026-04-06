"use client";

import { useEffect } from "react";
import { recordProProductView } from "./pro-browse-client";

export function ProProductRecordView({
  slug,
  priceCents,
  enabled,
}: {
  slug: string;
  priceCents: number;
  enabled: boolean;
}) {
  useEffect(() => {
    if (!enabled) return;
    recordProProductView(slug, priceCents);
  }, [slug, priceCents, enabled]);

  return null;
}
