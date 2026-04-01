"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ThankYouContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

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

        {sessionId && (
          <p className="mb-6 text-xs text-gray-600">
            Order reference: {sessionId.slice(0, 20)}…
          </p>
        )}

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
