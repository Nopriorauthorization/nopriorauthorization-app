"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import VaultOnboardingModal from "@/components/vault/vault-onboarding-modal";

type VaultFeature = {
  id: string;
  title: string;
  description: string;
  tier: "instant" | "capture" | "power";
  icon: string;
  status: "active" | "coming-soon";
  href?: string;
};

const VAULT_FEATURES: VaultFeature[] = [
  // INSTANT ACCESS (Zero Input)
  {
    id: "snapshot",
    title: "My Snapshot",
    description: "Your complete health identity — auto-assembled from your Blueprint, treatments, and goals.",
    tier: "instant",
    icon: "📸",
    status: "active",
    href: "/vault/snapshot",
  },
  {
    id: "timeline",
    title: "My Treatment Timeline",
    description: "Visual journey of every treatment, upload, and milestone — automatically organized by date.",
    tier: "instant",
    icon: "📅",
    status: "active",
    href: "/vault/timeline",
  },
  {
    id: "providers",
    title: "My Providers Hub",
    description: "Timestamped directory of every provider you've seen, with visit history and quick contact info.",
    tier: "instant",
    icon: "👩‍⚕️",
    status: "active",
    href: "/vault/providers",
  },
  {
    id: "questions",
    title: "Questions I Should Ask",
    description: "AI-generated prep questions before appointments — based on your meds, treatments, and goals.",
    tier: "instant",
    icon: "❓",
    status: "coming-soon",
  },

  // SMART CAPTURE (One-Tap Magic)
  {
    id: "photos",
    title: "Smart Photo Vault",
    description: "Snap a photo → AI categorizes, timestamps, and encrypts it. No filing, no hassle.",
    tier: "capture",
    icon: "📷",
    status: "active",
    href: "/vault/photos",
  },
  {
    id: "before-after",
    title: "Before/After Gallery",
    description: "AI compares progress photos, highlights changes, and tracks results over time.",
    tier: "capture",
    icon: "🖼️",
    status: "coming-soon",
  },
  {
    id: "decoder",
    title: "Treatment Decoder",
    description: "Scan a prescription, lab result, or bill → get a plain-English explanation instantly.",
    tier: "capture",
    icon: "🔍",
    status: "coming-soon",
  },
  {
    id: "voice",
    title: "Voice Memos",
    description: "Post-appointment brain dump → transcribed, organized, and searchable. Just talk.",
    tier: "capture",
    icon: "🎙️",
    status: "coming-soon",
  },

  // MY RESOURCES (Always Ready)
  {
    id: "rewards",
    title: "Rewards Tracker",
    description: "All loyalty programs (Allē, Evolve, Aspire) in one place — with point balances and expiration alerts.",
    tier: "power",
    icon: "🎁",
    status: "active",
    href: "/vault/rewards",
  },
  {
    id: "provider-tracker",
    title: "Provider Tracker",
    description: "Rate and tag providers — trustworthy, pushy, amazing. Your private notes, always accessible.",
    tier: "power",
    icon: "⭐",
    status: "coming-soon",
  },
  {
    id: "red-flags",
    title: "Red Flags Monitor",
    description: "AI watches for drug interactions, timing conflicts, and safety issues — before they become problems.",
    tier: "power",
    icon: "🚩",
    status: "coming-soon",
  },
  {
    id: "trusted-circle",
    title: "Trusted Circle",
    description: "Share vault access with family or providers — with granular control over what they see.",
    tier: "power",
    icon: "🔐",
    status: "coming-soon",
  },
];

export default function VaultPage() {
  const [vaultName, setVaultName] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVaultSettings() {
      try {
        const res = await fetch("/api/vault/settings");
        if (res.ok) {
          const data = await res.json();
          setVaultName(data.vaultName);
          
          // Show onboarding if no vault name set
          if (!data.vaultName) {
            setShowOnboarding(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch vault settings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVaultSettings();
  }, []);

  const handleOnboardingComplete = (name: string) => {
    setVaultName(name);
    setShowOnboarding(false);
  };

  const displayVaultName = vaultName || "Sacred Vault";
  const [filter, setFilter] = useState<"all" | "instant" | "capture" | "power">("all");

  const filteredFeatures = filter === "all" 
    ? VAULT_FEATURES 
    : VAULT_FEATURES.filter(f => f.tier === filter);

  const tierLabels = {
    instant: "Instant Access",
    capture: "Smart Capture",
    power: "My Resources",
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <VaultOnboardingModal
        open={showOnboarding}
        onComplete={handleOnboardingComplete}
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🔐</span>
            <p className="text-xs font-semibold tracking-[0.35em] text-pink-400 uppercase">
              {displayVaultName}
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
            The vault only <span className="text-pink-400">you</span> hold the key to.
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
            Your complete health journey — auto-populated, always accessible, and protected.
            <br />
            We remember like ChatGPT doesn't. We talk to you like MyChart won't.
          </p>
          {vaultName && (
            <button
              onClick={() => setShowOnboarding(true)}
              className="text-sm text-pink-400 hover:text-pink-300 transition"
            >
              ✏️ Rename your vault
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 border-b border-white/10 pb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              filter === "all"
                ? "bg-pink-400 text-black"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            All Features
          </button>
          <button
            onClick={() => setFilter("instant")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              filter === "instant"
                ? "bg-pink-400 text-black"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            ⚡ Instant Access
          </button>
          <button
            onClick={() => setFilter("capture")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              filter === "capture"
                ? "bg-pink-400 text-black"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            📸 Smart Capture
          </button>
          <button
            onClick={() => setFilter("power")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              filter === "power"
                ? "bg-pink-400 text-black"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            🎯 My Resources
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFeatures.map((feature) => {
            const isActive = feature.status === "active" && feature.href;

            return isActive ? (
              <Link
                key={feature.id}
                href={feature.href!}
                className="relative rounded-2xl border p-6 transition border-white/10 bg-white/5 hover:border-pink-400/30 hover:bg-white/10 cursor-pointer"
              >
                {/* Icon & Title */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{feature.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                    <p className="text-xs text-pink-400/70 uppercase tracking-wider">
                      {tierLabels[feature.tier]}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Action Arrow */}
                <div className="mt-4 text-pink-400 text-sm font-semibold">
                  Open →
                </div>
              </Link>
            ) : (
              <div
                key={feature.id}
                className="relative rounded-2xl border p-6 transition border-white/5 bg-white/[0.02] opacity-60"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-white/10 text-xs font-semibold text-white/60">
                  Coming Soon
                </div>

                {/* Icon & Title */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{feature.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                    <p className="text-xs text-pink-400/70 uppercase tracking-wider">
                      {tierLabels[feature.tier]}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-12 rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-gray-400">
            <strong className="text-white">Your data. Your control.</strong> Everything in your Sacred Vault is encrypted, private, and accessible only to you. 
            Share access with providers or family on your terms — with granular control over what they see.
          </p>
        </div>
      </div>
    </main>
  );
}
