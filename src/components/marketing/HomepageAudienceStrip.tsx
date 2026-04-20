"use client";

import Image from "next/image";
import { useState } from "react";
import {
  HOME_AUDIENCE_STRIP,
  HOME_STRIP_AB,
  HOME_STRIP_FRICTION,
  HOME_STRIP_RECOMMENDED_BADGE,
} from "@/config/site-audiences.config";
import {
  homeStripExperimentId,
  persistExperimentForPathSession,
  readHomeStripVariants,
  type HomeStripVariants,
} from "@/lib/experiments/home-strip-ab";
import { NpaTrackedLink } from "@/components/site/NpaTrackedLink";

const CTA_GLOW_STUDENT =
  "shadow-[0_0_0_1px_rgba(45,212,191,0.45),0_0_32px_-6px_rgba(45,212,191,0.4)] ring-1 ring-teal-400/35";

const CTA_GLOW_PROVIDER =
  "shadow-[0_0_0_1px_rgba(212,83,126,0.45),0_0_32px_-6px_rgba(212,83,126,0.35)] ring-1 ring-[#D4537E]/35";

export function HomepageAudienceStrip() {
  const c = HOME_AUDIENCE_STRIP;
  const [v] = useState<HomeStripVariants>(() => readHomeStripVariants());

  const experimentId = homeStripExperimentId(v);

  const headline = HOME_STRIP_AB.headline[v.headline];
  const studentCta = HOME_STRIP_AB.studentCta[v.ctaStudent];
  const providerCta = HOME_STRIP_AB.providerCta[v.ctaProvider];

  const stripTrackBase = {
    experiment_variant: experimentId,
    strip_headline_variant: v.headline,
    strip_cta_student_variant: v.ctaStudent,
    strip_cta_provider_variant: v.ctaProvider,
  };

  const studentHref = `${c.student.href}?source=home_strip`;
  const providerHref = `${c.provider.href}?source=home_strip`;

  const beforeStripNavigate = () => {
    persistExperimentForPathSession(experimentId);
  };

  return (
    <section className="relative z-10 border-b border-white/10 bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0d0d0d] text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#D4537E]">
            No Prior Authorization
          </p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
            {c.kicker}
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-[1.15] text-balance sm:text-4xl md:text-[2.75rem] md:leading-tight">
            {headline}
          </h2>
          <p className="mx-auto mt-3 max-w-md font-medium leading-relaxed text-gray-300 sm:text-lg">
            {c.brandLine}
          </p>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">
            {c.subhead}
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-10 lg:items-stretch">
          {/* Student card */}
          <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-teal-500/20 bg-[#141414] shadow-[0_0_0_1px_rgba(45,212,191,0.08)] transition hover:border-teal-400/35 hover:shadow-[0_24px_80px_-24px_rgba(45,212,191,0.25)]">
            <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[16/9]">
              <Image
                src={c.student.image}
                alt={c.student.imageAlt}
                fill
                className="object-cover object-center transition duration-700 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2 sm:left-5 sm:top-5">
                <span className="rounded-full bg-teal-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-200 ring-1 ring-teal-400/30">
                  {c.student.eyebrow}
                </span>
                <span className="rounded-full bg-black/55 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-100/95 ring-1 ring-teal-400/25 backdrop-blur-sm">
                  {HOME_STRIP_RECOMMENDED_BADGE}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <h3 className="font-serif text-2xl font-bold leading-snug text-white sm:text-3xl">
                {c.student.title}
              </h3>
              <p className="mt-3 min-h-[4.25rem] flex-1 text-sm leading-relaxed text-gray-400 sm:min-h-0 sm:text-base">
                {c.student.body}
              </p>
              <NpaTrackedLink
                href={studentHref}
                trackEvent="npa_audience_home_strip_click"
                trackParams={{
                  audience: "student",
                  destination: studentHref,
                  ...stripTrackBase,
                }}
                onClick={beforeStripNavigate}
                className={`mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-teal-500 px-6 py-3.5 text-center text-sm font-bold text-white transition hover:bg-teal-400 sm:text-base ${CTA_GLOW_STUDENT}`}
              >
                {studentCta}
              </NpaTrackedLink>
              <p className="mt-2 text-center text-[11px] font-medium uppercase tracking-wider text-teal-400/80 sm:text-xs">
                {HOME_STRIP_FRICTION.student}
              </p>
              <p className="mt-4 text-center text-xs leading-relaxed text-gray-500 sm:text-sm">
                {c.student.cardReassurance}
              </p>
            </div>
          </article>

          {/* Provider card */}
          <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#D4537E]/25 bg-[#141414] shadow-[0_0_0_1px_rgba(212,83,126,0.12)] transition hover:border-[#D4537E]/45 hover:shadow-[0_24px_80px_-24px_rgba(212,83,126,0.3)]">
            <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[16/9]">
              <Image
                src={c.provider.image}
                alt={c.provider.imageAlt}
                fill
                className="object-cover object-center transition duration-700 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/35 to-transparent" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2 sm:left-5 sm:top-5">
                <span className="rounded-full bg-[#D4537E]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-pink-100 ring-1 ring-[#D4537E]/35">
                  {c.provider.eyebrow}
                </span>
                <span className="rounded-full bg-black/55 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-pink-100/95 ring-1 ring-[#D4537E]/25 backdrop-blur-sm">
                  {HOME_STRIP_RECOMMENDED_BADGE}
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <h3 className="font-serif text-2xl font-bold leading-snug text-white sm:text-3xl">
                {c.provider.title}
              </h3>
              <p className="mt-3 min-h-[4.25rem] flex-1 text-sm leading-relaxed text-gray-400 sm:min-h-0 sm:text-base">
                {c.provider.body}
              </p>
              <NpaTrackedLink
                href={providerHref}
                trackEvent="npa_audience_home_strip_click"
                trackParams={{
                  audience: "provider",
                  destination: providerHref,
                  ...stripTrackBase,
                }}
                onClick={beforeStripNavigate}
                className={`mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-[#D4537E] px-6 py-3.5 text-center text-sm font-bold text-white transition hover:bg-[#c7436f] sm:text-base ${CTA_GLOW_PROVIDER}`}
              >
                {providerCta}
              </NpaTrackedLink>
              <p className="mt-2 text-center text-[11px] font-medium uppercase tracking-wider text-pink-200/70 sm:text-xs">
                {HOME_STRIP_FRICTION.provider}
              </p>
              <p className="mt-4 text-center text-xs leading-relaxed text-gray-500 sm:text-sm">
                {c.provider.cardReassurance}
              </p>
            </div>
          </article>
        </div>

        <p className="mx-auto mt-12 max-w-xl text-center text-sm leading-relaxed text-gray-500">
          {c.reassurance}
        </p>
      </div>
    </section>
  );
}
