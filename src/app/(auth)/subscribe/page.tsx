"use client";
export const dynamic = 'force-dynamic';
import { useState } from "react";
import { TIERS } from "@/lib/tiers";
import Button from "@/components/ui/button";

const faqs = [
  {
    question: "What is the Blueprint?",
    answer: "Your Blueprint is a comprehensive health profile that consolidates your medical history, treatments, medications, and documents in one place. Export it as a PDF or secure link to share with any provider—no more repeating your story at every appointment.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes! Cancel anytime with no penalties or fees. You'll retain access to your Blueprint until the end of your billing period.",
  },
  {
    question: "How does the family plan work?",
    answer: "The Family Blueprint includes up to 4 members for $49/month. Each family member gets their own Blueprint, documents vault, and health tracking. Need more than 4? Add additional members for $10/month each.",
  },
  {
    question: "Do you sell my data?",
    answer: "Never. We're privacy-first. Your health data belongs to you. We don't sell, share, or monetize your personal information. Period.",
  },
];

export default function SubscribePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubscribe = (tierId: string) => {
    if (tierId === "starter") {
      window.location.href = "/signup";
    } else {
      // TODO: Stripe checkout integration (P3)
      alert(`Stripe checkout for ${tierId} coming soon!`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Take Authority Over Your Healthcare
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            Choose the plan that fits your needs. All plans include access to our expert mascots
            and privacy-first approach to health data.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mb-20 grid gap-8 md:grid-cols-3">
          {Object.values(TIERS).map((tier) => (
            <div
              key={tier.id}
              className={`rounded-2xl border p-8 ${
                tier.id === "blueprint"
                  ? "border-hot-pink bg-hot-pink/5"
                  : "border-white/20 bg-white/5"
              }`}
            >
              <div className="mb-6">
                <h2 className="mb-2 text-2xl font-bold">{tier.displayName}</h2>
                <div className="mb-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-sm text-gray-300">{tier.description}</p>
              </div>

              <ul className="mb-8 space-y-3">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 text-hot-pink">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.id === "blueprint" ? "primary" : "secondary"}
                size="lg"
                className="w-full"
                onClick={() => handleSubscribe(tier.id)}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/20 bg-white/5 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-6 text-left transition hover:bg-white/5"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <span className="text-2xl text-hot-pink">
                    {openFaq === idx ? "−" : "+"}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="border-t border-white/10 p-6 pt-4">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Privacy callout */}
        <div className="mt-16 rounded-2xl border border-hot-pink/40 bg-hot-pink/5 p-8 text-center">
          <h3 className="mb-3 text-xl font-bold">Privacy-First Promise</h3>
          <p className="mx-auto max-w-2xl text-gray-300">
            Your health data is yours. We never sell, share, or monetize your personal
            information. All exports and shares are encrypted, expiring, and fully revocable
            by you.
          </p>
        </div>
      </div>
    </div>
  );
}
