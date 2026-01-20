"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import VaultOnboardingModal from "@/components/vault/vault-onboarding-modal";

interface VaultFeature {
  id: string;
  title: string;
  description: string;
  tier: "instant" | "capture" | "power";
  icon: string;
  status: "active" | "coming-soon";
  href?: string;
  hasData: boolean;
}

interface VaultData {
  features: VaultFeature[];
  stats: {
    documents: number;
    chats: number;
    appointments: number;
    decoded: number;
  };
  vaultName: string | null;
  isEmpty: boolean;
}

export default function VaultPage() {
  const [data, setData] = useState<VaultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [filter, setFilter] = useState<"all" | "instant" | "capture" | "power">("all");

  useEffect(() => {
    async function fetchVaultData() {
      try {
        const res = await fetch("/api/vault/features");
        if (res.ok) {
          const vaultData = await res.json();
          setData(vaultData);
          
          if (!vaultData.vaultName) {
            setShowOnboarding(true);
            
            await fetch("/api/analytics", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                event: "vault_onboarding_shown",
                metadata: { timestamp: new Date().toISOString() },
              }),
            }).catch(console.error);
          }
        }
      } catch (error) {
        console.error("Failed to fetch vault data:", error);
        // Set fallback empty data so page still renders
        setData({
          features: [],
          stats: { documents: 0, chats: 0, appointments: 0, decoded: 0 },
          vaultName: null,
          isEmpty: true,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchVaultData();
  }, []);

  const handleOnboardingComplete = (name: string) => {
    if (data) {
      setData({ ...data, vaultName: name });
    }
    setShowOnboarding(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-white/10 rounded w-1/3"></div>
            <div className="h-12 bg-white/10 rounded w-2/3"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-white/10 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">Failed to load vault data</p>
        </div>
      </main>
    );
  }

  const displayVaultName = data.vaultName || "Sacred Vault";
  const filteredFeatures = filter === "all" 
    ? data.features 
    : data.features.filter(f => f.tier === filter);

  const tierLabels = {
    instant: "Instant Access",
    capture: "Smart Capture",
    power: "My Resources",
  };

  if (data.isEmpty) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-16">
        <VaultOnboardingModal
          open={showOnboarding}
          onComplete={handleOnboardingComplete}
          currentName={data.vaultName}
        />
        
        <div className="max-w-6xl mx-auto">
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
              We remember like ChatGPT doesn&apos;t. We talk to you like MyChart won&apos;t.
            </p>
            {data.vaultName && (
              <button
                onClick={() => setShowOnboarding(true)}
                className="text-sm text-pink-400 hover:text-pink-300 transition"
              >
                ✏️ Rename your vault
              </button>
            )}
          </div>

          <div className="rounded-2xl border border-pink-400/30 bg-pink-400/5 p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Your Vault</h2>
            <p className="text-gray-300 mb-6">
              Your vault is empty, but it won&apos;t be for long. Start by exploring these key features:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <Link href="/vault/decoder" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-pink-400/30 hover:bg-white/10 transition">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🔍</span>
                  <h3 className="font-semibold">Decode Your First Document</h3>
                </div>
                <p className="text-sm text-gray-400">Scan a prescription, lab result, or bill to get started</p>
              </Link>
              <Link href="/vault/snapshot" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-pink-400/30 hover:bg-white/10 transition">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📸</span>
                  <h3 className="font-semibold">View Your Snapshot</h3>
                </div>
                <p className="text-sm text-gray-400">See an auto-generated overview of your health journey</p>
              </Link>
              <Link href="/vault/timeline" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-pink-400/30 hover:bg-white/10 transition">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📅</span>
                  <h3 className="font-semibold">Explore Timeline</h3>
                </div>
                <p className="text-sm text-gray-400">Visual journey of treatments and milestones</p>
              </Link>
              <Link href="/vault/dashboard" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-pink-400/30 hover:bg-white/10 transition">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📊</span>
                  <h3 className="font-semibold">Go to Dashboard</h3>
                </div>
                <p className="text-sm text-gray-400">Quick access to all your vault features</p>
              </Link>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">All Available Features</h2>
            <p className="text-sm text-gray-400 mb-6">Explore everything your vault has to offer. Features marked &quot;Coming Soon&quot; are being developed.</p>
          </div>

          <div className="flex flex-wrap gap-3 mb-8 border-b border-white/10 pb-4">
            <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filter === "all" ? "bg-pink-400 text-black" : "bg-white/5 text-white/70 hover:bg-white/10"}`}>All Features</button>
            <button onClick={() => setFilter("instant")} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filter === "instant" ? "bg-pink-400 text-black" : "bg-white/5 text-white/70 hover:bg-white/10"}`}>⚡ Instant Access</button>
            <button onClick={() => setFilter("capture")} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filter === "capture" ? "bg-pink-400 text-black" : "bg-white/5 text-white/70 hover:bg-white/10"}`}>📸 Smart Capture</button>
            <button onClick={() => setFilter("power")} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filter === "power" ? "bg-pink-400 text-black" : "bg-white/5 text-white/70 hover:bg-white/10"}`}>🎯 My Resources</button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFeatures.map((feature) => {
              const isActive = feature.status === "active" && feature.href;
              return isActive ? (
                <Link key={feature.id} href={feature.href!} className="relative rounded-2xl border p-6 transition border-white/10 bg-white/5 hover:border-pink-400/30 hover:bg-white/10 cursor-pointer">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">{feature.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                      <p className="text-xs text-pink-400/70 uppercase tracking-wider">{tierLabels[feature.tier]}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                  <div className="mt-4 text-pink-400 text-sm font-semibold">Open →</div>
                </Link>
              ) : (
                <div key={feature.id} className="relative rounded-2xl border p-6 transition border-white/5 bg-white/[0.02] opacity-60">
                  <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-white/10 text-xs font-semibold text-white/60">Coming Soon</div>
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">{feature.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                      <p className="text-xs text-pink-400/70 uppercase tracking-wider">{tierLabels[feature.tier]}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-gray-400">
              <strong className="text-white">Your data. Your control.</strong> Everything in your Sacred Vault is encrypted, private, and accessible only to you. Share access with providers or family on your terms — with granular control over what they see.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <VaultOnboardingModal open={showOnboarding} onComplete={handleOnboardingComplete} currentName={data.vaultName} />
      <div className="max-w-6xl mx-auto">
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🔐</span>
            <p className="text-xs font-semibold tracking-[0.35em] text-pink-400 uppercase">{displayVaultName}</p>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight">The vault only <span className="text-pink-400">you</span> hold the key to.</h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">Your complete health journey — auto-populated, always accessible, and protected.<br />We remember like ChatGPT doesn&apos;t. We talk to you like MyChart won&apos;t.</p>
          {data.vaultName && (<button onClick={() => setShowOnboarding(true)} className="text-sm text-pink-400 hover:text-pink-300 transition">✏️ Rename your vault</button>)}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4"><div className="text-3xl font-bold text-pink-400">{data.stats.documents}</div><div className="text-sm text-gray-400 mt-1">Documents</div></div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4"><div className="text-3xl font-bold text-pink-400">{data.stats.appointments}</div><div className="text-sm text-gray-400 mt-1">Appointments</div></div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4"><div className="text-3xl font-bold text-pink-400">{data.stats.chats}</div><div className="text-sm text-gray-400 mt-1">Conversations</div></div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4"><div className="text-3xl font-bold text-pink-400">{data.stats.decoded}</div><div className="text-sm text-gray-400 mt-1">Decoded</div></div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8 border-b border-white/10 pb-4">
          <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filter === "all" ? "bg-pink-400 text-black" : "bg-white/5 text-white/70 hover:bg-white/10"}`}>All Features</button>
          <button onClick={() => setFilter("instant")} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filter === "instant" ? "bg-pink-400 text-black" : "bg-white/5 text-white/70 hover:bg-white/10"}`}>⚡ Instant Access</button>
          <button onClick={() => setFilter("capture")} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filter === "capture" ? "bg-pink-400 text-black" : "bg-white/5 text-white/70 hover:bg-white/10"}`}>📸 Smart Capture</button>
          <button onClick={() => setFilter("power")} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filter === "power" ? "bg-pink-400 text-black" : "bg-white/5 text-white/70 hover:bg-white/10"}`}>🎯 My Resources</button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFeatures.map((feature) => {
            const isActive = feature.status === "active" && feature.href;
            return isActive ? (
              <Link key={feature.id} href={feature.href!} className="relative rounded-2xl border p-6 transition border-white/10 bg-white/5 hover:border-pink-400/30 hover:bg-white/10 cursor-pointer">
                {feature.hasData && (<div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-400"></div>)}
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{feature.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                    <p className="text-xs text-pink-400/70 uppercase tracking-wider">{tierLabels[feature.tier]}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                <div className="mt-4 text-pink-400 text-sm font-semibold">{feature.hasData ? "View →" : "Open →"}</div>
              </Link>
            ) : (
              <div key={feature.id} className="relative rounded-2xl border p-6 transition border-white/5 bg-white/[0.02] opacity-60">
                <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-white/10 text-xs font-semibold text-white/60">Coming Soon</div>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{feature.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                    <p className="text-xs text-pink-400/70 uppercase tracking-wider">{tierLabels[feature.tier]}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-gray-400">
            <strong className="text-white">Your data. Your control.</strong> Everything in your Sacred Vault is encrypted, private, and accessible only to you. Share access with providers or family on your terms — with granular control over what they see.
          </p>
        </div>
      </div>
    </main>
  );
}
