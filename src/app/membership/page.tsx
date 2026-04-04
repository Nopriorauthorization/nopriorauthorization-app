import type { Metadata } from "next";
import { MEMBERSHIP_CONFIG } from "@/config/growth-funnel.config";
import { FunnelLink } from "@/components/shop/FunnelLink";

const SITE = "https://nopriorauthorization.com";

export const metadata: Metadata = {
  title: MEMBERSHIP_CONFIG.metaTitle,
  description: MEMBERSHIP_CONFIG.metaDescription,
  openGraph: {
    title: MEMBERSHIP_CONFIG.metaTitle,
    description: MEMBERSHIP_CONFIG.metaDescription,
    url: `${SITE}/membership`,
  },
  alternates: { canonical: `${SITE}/membership` },
};

function formatMonthly() {
  return `$${(MEMBERSHIP_CONFIG.monthlyPriceCents / 100).toFixed(0)}`;
}

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4537E]">Membership</p>
        <h1 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          {MEMBERSHIP_CONFIG.hero}
        </h1>
        <p className="mt-5 text-lg text-gray-400">{MEMBERSHIP_CONFIG.heroSubline}</p>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <h2 className="font-serif text-lg font-semibold text-white sm:text-xl">What&apos;s included</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-300 sm:text-base">
            {MEMBERSHIP_CONFIG.bullets.map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-0.5 shrink-0 text-[#D4537E]">&#10003;</span>
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-white/10 pt-8">
            <p className="text-sm text-gray-500">
              {formatMonthly()}/month — cancel anytime. Annual and plan updates coming soon.
            </p>
            <FunnelLink
              href={MEMBERSHIP_CONFIG.checkoutUrl}
              event="funnel_membership_click"
              eventParams={{ source: "membership_page" }}
              className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#D4537E] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#D4537E]/80"
            >
              {MEMBERSHIP_CONFIG.ctaLabel}
            </FunnelLink>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-gray-600">
          Checkout opens our secure membership form. Same team as NPA template delivery.
        </p>
      </div>
    </div>
  );
}
