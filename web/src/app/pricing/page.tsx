"use client";

import { useState } from "react";
import Link from "next/link";
import { FiCheck, FiArrowRight } from "react-icons/fi";

const APP_URL = "https://app.nopriorauthorization.com";

export default function PricingPage() {
  const [mode, setMode] = useState<"consumer" | "provider">("consumer");

  const consumerPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      detail: "Get started with the basics",
      features: [
        "Secure document storage (up to 50)",
        "Basic lab decoder (5/month)",
        "Health timeline view",
        "1 AI specialist chat",
        "Family tree (up to 10 members)",
      ],
      cta: "Start Free",
      href: `${APP_URL}/signup`,
      highlighted: false,
    },
    {
      name: "Core",
      price: "$19",
      period: "/month",
      detail: "For individuals taking control",
      features: [
        "Unlimited document storage",
        "Unlimited lab decoding",
        "Full health blueprint",
        "All 7 AI specialists",
        "Unlimited family tree",
        "Provider packet generator",
        "Priority support",
      ],
      cta: "Subscribe Today",
      href: `${APP_URL}/subscribe?plan=core`,
      highlighted: true,
      badge: "MOST POPULAR",
    },
    {
      name: "Family",
      price: "$49",
      period: "/month",
      detail: "For families who care",
      features: [
        "Everything in Core",
        "Up to 5 family accounts",
        "Shared family health tree",
        "Trusted circle access",
        "Family health reports",
        "Caregiver dashboard",
        "Dedicated support",
      ],
      cta: "Subscribe Today",
      href: `${APP_URL}/subscribe?plan=family`,
      highlighted: false,
    },
  ];

  const providerPlans = [
    {
      name: "Starter",
      price: "$149",
      period: "/month",
      detail: "Embed widget + basic analytics",
      features: [
        "Embeddable chat widget",
        "Basic analytics dashboard",
        "Up to 500 patient interactions/mo",
        "Email support",
      ],
      cta: "Subscribe Today",
      href: `${APP_URL}/subscribe?plan=provider-starter`,
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$499",
      period: "/month",
      detail: "Multi-clinic support + expanded analytics",
      features: [
        "Everything in Starter",
        "Multi-clinic support",
        "Advanced analytics & reporting",
        "Unlimited patient interactions",
        "API access",
        "Dedicated account manager",
        "Priority support",
      ],
      cta: "Subscribe Today",
      href: `${APP_URL}/subscribe?plan=provider-pro`,
      highlighted: true,
      badge: "BEST VALUE",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-pink-400">
              Pricing
            </p>
            <h1 className="font-display text-4xl md:text-6xl">
              Simple pricing for clarity at scale.
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl">
              No hidden fees. No surprise charges. Cancel anytime.
            </p>
          </div>
          <div className="inline-flex rounded-full border border-white/10 bg-black/70 p-1 text-xs">
            <button
              type="button"
              onClick={() => setMode("consumer")}
              className={`rounded-full px-4 py-2 font-semibold uppercase tracking-[0.2em] ${
                mode === "consumer"
                  ? "bg-white text-black"
                  : "text-white/60"
              }`}
            >
              Consumer
            </button>
            <button
              type="button"
              onClick={() => setMode("provider")}
              className={`rounded-full px-4 py-2 font-semibold uppercase tracking-[0.2em] ${
                mode === "provider"
                  ? "bg-white text-black"
                  : "text-white/60"
              }`}
            >
              Provider
            </button>
          </div>
        </div>

        {mode === "consumer" ? (
          <div className="grid gap-6 md:grid-cols-3">
            {consumerPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-green-500/20 to-emerald-500/10 border-2 border-green-500/50"
                    : "border border-white/10 bg-black/70"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs font-semibold text-white">
                    {plan.badge}
                  </div>
                )}
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-white/60">{plan.detail}</p>
                
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <FiCheck className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-green-400" : "text-pink-400"}`} />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-full font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/25"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {plan.cta}
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {providerPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-green-500/20 to-emerald-500/10 border-2 border-green-500/50"
                    : "border border-white/10 bg-black/70"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs font-semibold text-white">
                    {plan.badge}
                  </div>
                )}
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-white/60">{plan.detail}</p>
                
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <FiCheck className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-green-400" : "text-pink-400"}`} />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-full font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/25"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {plan.cta}
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Stripe Integration Notice */}
        <div className="text-center pt-8 border-t border-white/10">
          <p className="text-sm text-gray-500">
            Secure payments powered by Stripe. All plans include HIPAA-compliant security.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="text-xs text-gray-600">🔒 SSL Encrypted</span>
            <span className="text-xs text-gray-600">💳 Secure Checkout</span>
            <span className="text-xs text-gray-600">❌ Cancel Anytime</span>
          </div>
        </div>
      </div>
    </main>
  );
}
