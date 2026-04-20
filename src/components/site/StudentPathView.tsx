"use client";

import Image from "next/image";
import {
  AUDIENCE_CTA_LABELS,
  AUDIENCE_IMAGES,
  FOR_STUDENTS_META,
  STUDENT_CORE_TOOLS,
  STUDENT_EXTRA_HELP,
  STUDENT_HERO_VIDEO,
  STUDENT_HUB_STEP_DECK,
  STUDENT_REASSURANCE,
  STUDENT_TRUST_LINE,
} from "@/config/site-audiences.config";
import type { PathEntrySource } from "@/lib/analytics/path-entry-source";
import { usePathEntryAnalytics } from "@/lib/analytics/use-path-entry-analytics";
import { useFirstPathEngagement } from "@/lib/analytics/use-first-path-engagement";
import { NpaTrackedLink } from "@/components/site/NpaTrackedLink";

type Props = {
  entrySource: PathEntrySource;
};

export function StudentPathView({ entrySource }: Props) {
  usePathEntryAnalytics("student", entrySource);
  const reportEngagement = useFirstPathEngagement("student");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.12),transparent)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:gap-12 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-teal-400">
              No Prior Authorization
            </p>
            <h1 className="mt-5 text-balance font-serif text-3xl font-bold leading-[1.12] sm:text-4xl md:text-[2.75rem] md:leading-tight">
              {FOR_STUDENTS_META.title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-gray-400 sm:text-lg">
              {FOR_STUDENTS_META.subtitle}
            </p>

            <div className="mt-8 rounded-2xl border border-teal-500/30 bg-[#080d0c] p-5 shadow-[inset_0_1px_0_rgba(45,212,191,0.12)] sm:p-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400/95">
                Recommended first step
              </p>
              <p className="mt-2 text-xs leading-snug text-gray-500 sm:text-sm">
                {STUDENT_HUB_STEP_DECK}
              </p>
              <NpaTrackedLink
                href="/micro270/hub"
                trackEvent="npa_micro270_hub_click"
                trackParams={{ source: "for-students-hero-primary" }}
                onClick={() => reportEngagement("micro270_hub")}
                className="mt-5 flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-teal-500 px-6 py-3.5 text-center text-base font-bold text-white shadow-[0_0_40px_-10px_rgba(45,212,191,0.55)] transition hover:bg-teal-400"
              >
                {AUDIENCE_CTA_LABELS.micro270HubButton}
              </NpaTrackedLink>
              <p className="mt-5 text-sm leading-relaxed text-gray-400">
                {STUDENT_REASSURANCE}
              </p>
            </div>

            <p className="mt-7 text-center text-sm font-medium leading-snug text-teal-200/90 sm:text-left">
              {STUDENT_TRUST_LINE}
            </p>

            <NpaTrackedLink
              href="/for-providers?source=nav"
              onClick={() => reportEngagement("cross_provider_lane")}
              className="mt-7 inline-flex min-h-[44px] items-center text-sm font-semibold text-gray-500 underline-offset-4 transition hover:text-gray-300 hover:underline"
            >
              Need provider tools instead? {AUDIENCE_CTA_LABELS.providerPathLink} →
            </NpaTrackedLink>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-[#1a1a1a] shadow-[0_32px_120px_-40px_rgba(0,0,0,0.9)] sm:aspect-[3/4]">
              <Image
                src={AUDIENCE_IMAGES.studentCramming}
                alt="Nursing student study moment — focused late-night coursework, brand neon accent"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-300/90">
                  Guided lane
                </p>
                <p className="mt-1 text-sm text-gray-200">
                  Hub first → core tools → extras only if you need them.
                </p>
              </div>
              <video
                className="pointer-events-none absolute -bottom-3 -right-3 z-10 hidden w-[38%] rounded-xl border border-white/10 shadow-2xl lg:block lg:-right-4 lg:-bottom-4"
                autoPlay
                muted
                loop
                playsInline
                poster={AUDIENCE_IMAGES.micro250Cover}
              >
                <source src={STUDENT_HERO_VIDEO} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Core study tools */}
      <section className="border-b border-white/5 bg-[#0d0d0d]/90 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-teal-500/80">
            Then
          </p>
          <div className="max-w-2xl">
            <h2 className="mt-2 text-balance font-serif text-2xl font-bold sm:text-3xl md:text-4xl">
              Core study tools
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-400 sm:text-base">
              After the hub, add depth: bundles, anatomy, companion courses, and printable
              packs—in that order of impact.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {STUDENT_CORE_TOOLS.map((item) => {
              const isShop = item.href.startsWith("/shop");
              const eg = isShop ? "shop" : "anatomy_hub";
              return (
                <NpaTrackedLink
                  key={item.href}
                  href={item.href}
                  trackEvent={isShop ? "npa_shop_click" : undefined}
                  trackParams={
                    isShop
                      ? { source: "for-students-core-grid", path: item.href }
                      : undefined
                  }
                  onClick={() => reportEngagement(eg)}
                  className="group flex min-h-[120px] flex-col rounded-2xl border border-white/10 bg-[#141414] p-6 transition hover:border-teal-400/30 hover:bg-[#181818] sm:min-h-0 sm:p-7"
                >
                  {item.badge ? (
                    <span className="mb-3 w-fit rounded-full bg-teal-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-200">
                      {item.badge}
                    </span>
                  ) : null}
                  <span className="text-lg font-bold leading-snug group-hover:text-teal-100">
                    {item.label}
                  </span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-gray-400">
                    {item.description}
                  </span>
                  <span className="mt-4 text-sm font-semibold text-teal-300">Open →</span>
                </NpaTrackedLink>
              );
            })}
          </div>
        </div>
      </section>

      {/* Extra help */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-teal-500/80">
            Finally
          </p>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="mt-2 text-balance font-serif text-2xl font-bold sm:text-3xl md:text-4xl">
                Extra help &amp; advanced resources
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-400 sm:text-base">
                Print editions, NCLEX-wide bundles, bank-only tiers, and AI cram—when you
                already know the hub and want more leverage.
              </p>
            </div>
            <div className="hidden shrink-0 lg:block">
              <Image
                src={AUDIENCE_IMAGES.micro250Cover}
                alt="Micro exam prep cover — supplemental high-yield visual"
                width={200}
                height={250}
                className="rounded-xl border border-white/10 shadow-xl"
              />
            </div>
          </div>
          <ul className="mt-10 divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#141414]/80">
            {STUDENT_EXTRA_HELP.map((item) => {
              const isShop = item.href.startsWith("/shop");
              let eg = "resource";
              if (isShop) eg = "shop";
              else if (item.href === "/micro270/cram") eg = "cram";
              else if (item.href === "/study-guides") eg = "study_guides";
              else if (item.href === "/micro270") eg = "micro270_marketing";
              return (
                <li key={item.href}>
                  <NpaTrackedLink
                    href={item.href}
                    trackEvent={isShop ? "npa_shop_click" : undefined}
                    trackParams={
                      isShop
                        ? { source: "for-students-extra-list", path: item.href }
                        : undefined
                    }
                    onClick={() => reportEngagement(eg)}
                    className="flex min-h-[52px] flex-col gap-1 px-5 py-4 transition hover:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <span className="font-semibold text-white">{item.label}</span>
                      {item.badge ? (
                        <span className="ml-2 rounded-full bg-teal-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-teal-200">
                          {item.badge}
                        </span>
                      ) : null}
                      <p className="mt-1 text-sm text-gray-400">{item.description}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-teal-300">→</span>
                  </NpaTrackedLink>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Cross-sell */}
      <section className="border-t border-white/10 bg-[#0d0d0d] py-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-sm text-gray-400">
            Need consent forms, social templates, and practice systems instead?
          </p>
          <NpaTrackedLink
            href="/for-providers?source=nav"
            onClick={() => reportEngagement("cross_provider_lane")}
            className="mt-3 inline-flex min-h-[44px] items-center justify-center text-base font-bold text-[#D4537E] transition hover:text-pink-300"
          >
            {AUDIENCE_CTA_LABELS.providerPathLink} →
          </NpaTrackedLink>
        </div>
      </section>
    </div>
  );
}
