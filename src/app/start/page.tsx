"use client";

import { useState } from "react";
import Link from "next/link";

type Step = "role" | "stage" | "need" | "result";
type Role = "owner" | "injector" | "esthetician" | "manager" | "other";
type Stage = "starting" | "growing" | "scaling";
type Need = "patients" | "systems" | "marketing" | "training" | "everything";

type Recommendation = {
  title: string;
  slug: string;
  price: string;
  why: string;
};

function getRecommendations(role: Role, stage: Stage, need: Need): Recommendation[] {
  const recs: Recommendation[] = [];

  if (need === "patients" || need === "everything") {
    recs.push({
      title: "Google Domination Playbook",
      slug: "google-domination-playbook",
      price: "$127",
      why: "87% of patients Google before booking. This gets you found.",
    });
  }

  if (need === "marketing" || need === "everything") {
    recs.push({
      title: "The Social Media System",
      slug: "medspa-social-media-system",
      price: "$147",
      why: "90 days of content done. Stop staring at a blank screen.",
    });
  }

  if (need === "systems" || need === "everything") {
    if (stage === "starting") {
      recs.push({
        title: "Med Spa Legal Startup Bundle",
        slug: "med-spa-legal-startup-bundle",
        price: "$197",
        why: "34 legal templates — contracts, HIPAA, policies. Open your doors legally.",
      });
    } else {
      recs.push({
        title: "Botox Patient Journey Kit",
        slug: "botox-patient-journey-kit",
        price: "$67",
        why: "Every touchpoint from inquiry to rebooking. Hand it to your front desk.",
      });
    }
  }

  if (need === "training" || need === "everything") {
    if (role === "injector" || role === "owner") {
      recs.push({
        title: "The Injector's Playbook",
        slug: "injectors-playbook",
        price: "$127",
        why: "Ryan's consultation scripts, dosing protocols, and complication management.",
      });
    }
    if (role === "manager" || role === "owner") {
      recs.push({
        title: "New Injector Onboarding Kit",
        slug: "new-injector-onboarding-kit",
        price: "$67",
        why: "Train your next injector in 30 days, not 6 months.",
      });
    }
  }

  if (stage === "scaling" || need === "everything") {
    recs.push({
      title: "NPA Pro Membership",
      slug: "membership",
      price: "$47/mo",
      why: "Every product + new monthly drops. The best value if you need everything.",
    });
  }

  if (recs.length === 0) {
    recs.push({
      title: "Complete DIY Google Setup Kit",
      slug: "diy-google-setup-kit",
      price: "$297",
      why: "The most comprehensive bundle — playbook, FAQs, templates, checklists.",
    });
  }

  return recs.slice(0, 4);
}

export default function StartPage() {
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role | null>(null);
  const [stage, setStage] = useState<Stage | null>(null);
  const [need, setNeed] = useState<Need | null>(null);

  const pickRole = (r: Role) => { setRole(r); setStep("stage"); };
  const pickStage = (s: Stage) => { setStage(s); setStep("need"); };
  const pickNeed = (n: Need) => { setNeed(n); setStep("result"); };

  const recs = role && stage && need ? getRecommendations(role, stage, need) : [];

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4537E]">
            Not sure where to start?
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold md:text-4xl">
            {step === "result" ? "Here's your personalized plan." : "Let's find what you need."}
          </h1>
          {step !== "result" && (
            <p className="mt-3 text-sm text-gray-400">
              3 quick questions. Personalized product recommendations.
            </p>
          )}
        </div>

        {step === "role" && (
          <div className="space-y-3">
            <p className="mb-4 text-center text-sm text-gray-500">I am a...</p>
            {([
              ["owner", "Med Spa Owner / Founder"],
              ["injector", "Nurse Injector / NP / PA"],
              ["esthetician", "Esthetician"],
              ["manager", "Practice Manager / Front Desk"],
              ["other", "Other / Exploring"],
            ] as [Role, string][]).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => pickRole(val)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-[#D4537E]/40 hover:bg-white/[0.06]"
              >
                <span className="text-sm font-bold text-white">{label}</span>
              </button>
            ))}
          </div>
        )}

        {step === "stage" && (
          <div className="space-y-3">
            <p className="mb-4 text-center text-sm text-gray-500">My practice is...</p>
            {([
              ["starting", "Just starting — haven't opened yet or just opened"],
              ["growing", "Open and growing — need more patients and better systems"],
              ["scaling", "Established — ready to scale and systematize everything"],
            ] as [Stage, string][]).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => pickStage(val)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-[#D4537E]/40 hover:bg-white/[0.06]"
              >
                <span className="text-sm font-bold text-white">{label}</span>
              </button>
            ))}
            <button onClick={() => setStep("role")} className="mt-4 block text-xs text-gray-500 hover:text-[#D4537E]">← Back</button>
          </div>
        )}

        {step === "need" && (
          <div className="space-y-3">
            <p className="mb-4 text-center text-sm text-gray-500">My biggest need right now is...</p>
            {([
              ["patients", "Getting more patients — Google, visibility, bookings"],
              ["marketing", "Social media and content — I don't know what to post"],
              ["systems", "Operations — forms, consent, policies, patient flow"],
              ["training", "Clinical training — protocols, scripts, onboarding"],
              ["everything", "Honestly? I need a little of everything"],
            ] as [Need, string][]).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => pickNeed(val)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-[#D4537E]/40 hover:bg-white/[0.06]"
              >
                <span className="text-sm font-bold text-white">{label}</span>
              </button>
            ))}
            <button onClick={() => setStep("stage")} className="mt-4 block text-xs text-gray-500 hover:text-[#D4537E]">← Back</button>
          </div>
        )}

        {step === "result" && (
          <div>
            <p className="mb-6 text-center text-sm text-gray-400">
              Based on your answers, here&apos;s what we recommend:
            </p>
            <div className="space-y-4">
              {recs.map((rec, i) => (
                <Link
                  key={rec.slug}
                  href={rec.slug === "membership" ? "/membership" : `/shop/${rec.slug}`}
                  className="group flex gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#D4537E]/40 hover:bg-white/[0.06]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4537E]/20 text-sm font-bold text-[#D4537E]">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-[#D4537E]">
                      {rec.title}
                      <span className="ml-2 text-[#D4537E]">{rec.price}</span>
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">{rec.why}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => { setStep("role"); setRole(null); setStage(null); setNeed(null); }}
                className="rounded-lg border border-white/20 px-6 py-3 text-sm text-gray-400 transition hover:text-white"
              >
                Start over
              </button>
              <Link
                href="/shop"
                className="rounded-lg bg-[#D4537E] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#D4537E]/80"
              >
                Browse all products
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
