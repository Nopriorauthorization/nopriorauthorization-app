"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type PlaybookData = {
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  image: string;
  peekItems: string[];
  outcome: string;
};

const PLAYBOOKS: PlaybookData[] = [
  {
    slug: "injectors-playbook",
    title: "The Injector's Playbook",
    subtitle: "Botox & Filler Practice Guide",
    price: "$127",
    image: "/shop-previews/playbooks/npa-playbook-botox-filler.png",
    peekItems: [
      "Ryan's word-for-word consultation opening script",
      "Botox dosing chart — units by area, by gender, by goal",
      "The 2-week follow-up call protocol that keeps patients coming back",
      "Complication decision tree — what to do when something goes wrong",
      "Documentation templates that protect your license",
    ],
    outcome:
      "Stop guessing. Start injecting with the confidence of a 10-year veteran.",
  },
  {
    slug: "new-injector-onboarding-kit",
    title: "New Injector Onboarding Kit",
    subtitle: "30-Day Training System",
    price: "$67",
    image: "/shop-previews/playbooks/npa-playbook-onboarding-kit.png",
    peekItems: [
      "Week 1: Credentialing, insurance, scope-of-practice checklist",
      "Week 2: Hands-on skills with observation protocol",
      "Week 3: Advanced techniques + complication scenarios",
      "Week 4: Independent practice readiness assessment",
      "Performance benchmarks — know exactly when they're ready",
    ],
    outcome:
      "Train your next injector in 30 days — not 6 months of trial and error.",
  },
  {
    slug: "guidebook-category-strategy",
    title: "Product Category Strategy",
    subtitle: "3 Tiers — 9 Products — Built to Scale",
    price: "$47",
    image: "/shop-previews/playbooks/npa-playbook-category-strategy.png",
    peekItems: [
      "Tier 1: Guidebooks at $37–$57 — your entry point",
      "Tier 2: Playbooks at $97–$147 — your authority builder",
      "Tier 3: Complete Systems at $197–$297 — your profit center",
      "Revenue model: $2,090 total catalog value from 9 products",
      "Scaling roadmap — from launch to passive income",
    ],
    outcome:
      "Build a digital product business that earns while you sleep.",
  },
  {
    slug: "medspa-social-media-system",
    title: "The Social Media System",
    subtitle: "90 Days of Content — Done",
    price: "$147",
    image: "/shop-previews/playbooks/npa-thumbnail-social-media-system.png",
    peekItems: [
      "The 5-pillar content strategy that converts followers to patients",
      "Full 30-day content calendar — what to post every single day",
      "Copy-paste caption templates for education, promos, and engagement",
      "50+ scroll-stopping hooks — tested and ready to use",
      "Compliance cheat sheet — what you CAN'T say on social media",
      "The batching system — create a month of content in one afternoon",
    ],
    outcome:
      "Stop staring at a blank screen every Monday. Post with confidence, stay compliant, book more patients.",
  },
  {
    slug: "microblading-pmu-playbook",
    title: "Microblading & PMU Playbook",
    subtitle: "The Complete PMU Business System",
    price: "$127",
    image: "/shop-previews/playbooks/npa-playbook-microblading-pmu.png",
    peekItems: [
      "Consultation script — how to set expectations before you touch a brow",
      "Contraindication screening that protects you legally",
      "Pricing system with cost-per-service breakdown",
      "Aftercare protocol that prevents callbacks and bad reviews",
      "Touch-up management — when to charge, when to fix for free",
    ],
    outcome:
      "Run your PMU business like a clinic, not a side hustle.",
  },
];

export function PlaybookShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [peekIndex, setPeekIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPeekIndex((prev) => {
        const current = PLAYBOOKS[activeIndex];
        return (prev + 1) % current.peekItems.length;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const pb = PLAYBOOKS[activeIndex];

  return (
    <section className="py-16">
      <div className="mb-8 text-center">
        <span className="rounded-full bg-[#C9A96E]/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A96E]">
          Premium Education
        </span>
        <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">
          Playbooks &amp; Practice Guides
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-gray-400">
          Written by Ryan Kent, FNP-BC — real clinical systems from a real
          practice. Not theory. Not fluff.
        </p>
      </div>

      {/* Tab selector */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {PLAYBOOKS.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => {
              setActiveIndex(i);
              setPeekIndex(0);
            }}
            className={`rounded-full px-4 py-2 text-xs font-bold transition ${
              i === activeIndex
                ? "bg-[#D4537E] text-white"
                : "bg-white/10 text-gray-400 hover:text-white"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Showcase card */}
      <div className="overflow-hidden rounded-2xl border border-[#C9A96E]/30 bg-gradient-to-br from-[#C9A96E]/5 to-transparent">
        <div className="grid gap-0 md:grid-cols-2">
          {/* Image */}
          <div className="relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pb.image}
              alt={pb.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-wider text-[#C9A96E]">
              {pb.subtitle}
            </p>
            <h3 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
              {pb.title}
            </h3>

            {/* Peek-a-boo slideshow */}
            <div className="mt-6 min-h-[80px] rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#D4537E]">
                Inside this playbook
              </p>
              <p
                key={peekIndex}
                className="mt-2 text-sm text-gray-300 animate-pulse"
              >
                {pb.peekItems[peekIndex]}
              </p>
              <div className="mt-3 flex gap-1">
                {pb.peekItems.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i === peekIndex ? "bg-[#D4537E]" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="mt-5 text-sm font-medium text-[#C9A96E]">
              {pb.outcome}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="text-3xl font-bold">{pb.price}</span>
              <Link
                href={`/shop/${pb.slug}`}
                className="rounded-lg bg-[#D4537E] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#D4537E]/80"
              >
                See what&apos;s inside
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
