"use client";

import Link, { type LinkProps } from "next/link";
import type { NpaAnalyticsEvent } from "@/lib/analytics/npa-events";
import { trackNpaEvent } from "@/lib/analytics/npa-events";

type Props = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: React.ReactNode;
    className?: string;
    /** Fires before navigation; safe for analytics only. */
    trackEvent?: NpaAnalyticsEvent;
    trackParams?: Record<string, string | undefined>;
  };

export function NpaTrackedLink({
  trackEvent,
  trackParams,
  onClick,
  ...rest
}: Props) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        if (trackEvent) trackNpaEvent(trackEvent, trackParams);
        onClick?.(e);
      }}
    />
  );
}
