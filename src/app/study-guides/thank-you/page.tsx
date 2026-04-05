import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank you | Study guides | No Prior Authorization",
  description: "Your NCLEX study bundle confirmation — check your email for the download link.",
  robots: { index: false, follow: true },
};

export default function StudyGuidesThankYouPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D4537E]">
          No Prior Authorization
        </p>
        <h1 className="mt-4 font-serif text-3xl font-bold">Thank you</h1>
        <p className="mt-6 text-lg leading-relaxed text-gray-400">
          Square is processing your payment. When it completes, you&apos;ll get an email with a{" "}
          <strong className="text-gray-200">secure link</strong> to open and print your full NCLEX bundle
          (same delivery flow as our shop — check spam if you don&apos;t see it within a few minutes).
        </p>
        <p className="mt-4 text-sm text-gray-500">
          This purchase is separate from the main template shop — you bought it from Study guides only.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/study-guides"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white hover:bg-white/5"
          >
            Back to study guides
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-[#D4537E] px-6 py-3 text-sm font-bold text-white hover:bg-[#D4537E]/85"
          >
            Need help?
          </Link>
        </div>
      </div>
    </div>
  );
}
