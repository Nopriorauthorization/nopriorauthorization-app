"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { type FunnelEventName, trackFunnelEvent } from "@/lib/analytics/funnel-events";

type Props = Omit<ComponentProps<typeof Link>, "onClick"> & {
  event: FunnelEventName;
  eventParams?: Record<string, string | undefined>;
};

export function FunnelLink({ event, eventParams, href, ...rest }: Props) {
  return (
    <Link
      href={href}
      {...rest}
      onClick={() => trackFunnelEvent(event, eventParams)}
    />
  );
}
