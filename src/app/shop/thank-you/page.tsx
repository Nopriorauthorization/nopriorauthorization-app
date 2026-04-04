"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { FUNNEL_COPY, MEMBERSHIP_CONFIG } from "@/config/growth-funnel.config";
import { FunnelLink } from "@/components/shop/FunnelLink";

/**
 * Square appends query params to `redirect_url` after payment link checkout, e.g.
 * `transactionId`, `checkoutId`, `orderId`, `referenceId` (camelCase per Square docs).
 * We show `transactionId` when present; fall back to other Square ids, then Stripe `session_id`.
 */
function getPostCheckoutReference(searchParams: URLSearchParams): {
  label: string;
  value: string;
} | null {
  const transactionId =
    searchParams.get("transactionId") ?? searchParams.get("transaction_id");
  if (transactionId) {
    return { label: "Square transaction ID", value: transactionId };
  }
  const checkoutId =
    searchParams.get("checkoutId") ?? searchParams.get("checkout_id");
  if (checkoutId) {
    return { label: "Square checkout ID", value: checkoutId };
  }
  const orderId = searchParams.get("orderId") ?? searchParams.get("order_id");
  if (orderId) {
    return { label: "Square order ID", value: orderId };
  }
  const referenceId =
    searchParams.get("referenceId") ?? searchParams.get("reference_id");
  if (referenceId) {
    return { label: "Square reference ID", value: referenceId };
  }
  const sessionId = searchParams.get("session_id");
  if (sessionId) {
    return { label: "Order reference", value: sessionId };
  }
  return null;
}

function ThankYouContent() {
  const params = useSearchParams();
  const ref = getPostCheckoutReference(params);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <div className="mb-6 text-5xl">&#127881;</div>

        <h1 className="mb-4 font-serif text-3xl font-semibold md:text-4xl">
          Thank You for Your Purchase!
        </h1>

        <p className="mb-8 text-base text-gray-400">
          Your templates are on their way to your inbox. Check your email for a
          secure download link.
        </p>

        <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.03] p-6 text-left">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#D4537E]">
            What happens next
          </h2>
          <ol className="space-y-3 text-sm text-gray-400">
            <li className="flex gap-3">
              <span className="font-bold text-white">1.</span>
              Check your email for your delivery link (arrives within 5 minutes)
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-white">2.</span>
              Click the link to access all your templates
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-white">3.</span>
              Print directly or save as PDF — customize for your practice
            </li>
          </ol>
        </div>

        <div className="mb-8 rounded-xl border border-[#D4537E]/30 bg-[#D4537E]/5 p-4 text-sm text-gray-400">
          Didn&apos;t receive your email? Check your spam folder or{" "}
          <a
            href="mailto:support@nopriorauthorization.com"
            className="text-[#D4537E] underline"
          >
            contact us
          </a>
          .
        </div>

        {ref && (
          <p className="mb-6 break-all text-left text-xs text-gray-500">
            <span className="text-gray-600">{ref.label}:</span>{" "}
            <span className="font-mono text-gray-400">{ref.value}</span>
          </p>
        )}

        <div className="mb-10 grid gap-4 text-left sm:grid-cols-2">
          <div className="rounded-xl border border-amber-500/35 bg-amber-500/[0.06] p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-200/90">
              Go bigger
            </h2>
            <p className="mt-2 text-sm text-gray-400">{FUNNEL_COPY.thankYouGrowth}</p>
            <FunnelLink
              href="/shop/growth-system"
              event="funnel_growth_system_click"
              eventParams={{ source: "thank_you" }}
              className="mt-3 inline-block text-sm font-bold text-[#D4537E] hover:underline"
            >
              View Growth System
            </FunnelLink>
          </div>
          <div className="rounded-xl border border-[#D4537E]/25 bg-[#D4537E]/10 p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#D4537E]">
              Stay stocked
            </h2>
            <p className="mt-2 text-sm text-gray-400">{FUNNEL_COPY.thankYouMembership}</p>
            <FunnelLink
              href="/membership"
              event="funnel_membership_click"
              eventParams={{ source: "thank_you" }}
              className="mt-3 inline-block text-sm font-bold text-[#D4537E] hover:underline"
            >
              {MEMBERSHIP_CONFIG.ctaLabel} — $
              {(MEMBERSHIP_CONFIG.monthlyPriceCents / 100).toFixed(0)}
              /mo
            </FunnelLink>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/shop"
            className="rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="rounded-lg bg-[#D4537E] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#D4537E]/80"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#1A1A1A] text-white">
          Loading...
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
