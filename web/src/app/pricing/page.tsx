"use client";

import { useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [mode, setMode] = useState<"consumer" | "provider">("consumer");

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-hot-pink">
              Pricing
            </p>
            <h1 className="font-display text-4xl md:text-6xl">
              Simple pricing for clarity at scale.
            </h1>
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
            {[
              { name: "Free", price: "$0", detail: "Limited access" },
              { name: "Premium", price: "$19–$29/mo", detail: "Full access" },
              { name: "Annual", price: "$199/yr", detail: "Best value" },
            ].map((plan) => (
              <div
                key={plan.name}
                className="rounded-2xl border border-white/10 bg-black/70 p-6"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  {plan.name}
                </p>
                <p className="mt-4 text-3xl font-semibold">{plan.price}</p>
                <p className="mt-2 text-xs text-white/60">{plan.detail}</p>
                <Link
                  href="https://app.nopriorauthorization.com"
                  className="mt-6 inline-flex rounded-full bg-hot-pink px-5 py-2 text-sm font-semibold text-black"
                >
                  Start Asking
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                name: "Starter",
                price: "$149–$299/mo",
                detail: "Embed widget + basic analytics",
              },
              {
                name: "Pro",
                price: "$499–$1,500/mo",
                detail: "Multi-clinic support + expanded analytics",
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className="rounded-2xl border border-white/10 bg-black/70 p-6"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  {plan.name}
                </p>
                <p className="mt-4 text-3xl font-semibold">{plan.price}</p>
                <p className="mt-2 text-xs text-white/60">{plan.detail}</p>
                <Link
                  href="/install"
                  className="mt-6 inline-flex rounded-full bg-hot-pink px-5 py-2 text-sm font-semibold text-black"
                >
                  Get the Widget
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
