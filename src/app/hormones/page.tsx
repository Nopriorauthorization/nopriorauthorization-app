export const dynamic = "force-dynamic";

import React from "react";
import { Metadata } from "next";
import MascotDomainCard from "../../content/hero/src/components/mascots/MascotDomainCard";

export const metadata: Metadata = {
  title: "Hormones & Peptides | Harmony & Peppi",
  description: "Clarity for women. Science for men. Hormone education, peptide science, and evidence-based wellness guidance.",
};

export default function HormonesPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          Hormones & Peptides
        </h1>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Clarity for women. Science for men. One system. No confusion.
        </p>
      </div>

      {/* SPLIT MASCOT LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT CARD – HARMONY */}
          <div className="bg-black/40 border border-purple-500/20 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Harmony</h2>
              <p className="text-purple-400 text-sm font-medium">Women's Hormone Health</p>
            </div>

            <MascotDomainCard
              mascotId="harmony"
              displayName="Harmony"
              title="Women's hormones, safety, balance"
              description="Understand your hormones without fear. Harmony helps you connect symptoms to patterns — safely."
              posterSrc="/characters/harmony.png"
              mp4Src="/videos/mascots/harmony.mp4"
              chatPersona="harmony"
              primaryCtaLabel="Learn With Harmony"
              chatCtaLabel="Ask Harmony"
              source="hormones"
            />

            {/* Interactive Tools Preview */}
            <div className="mt-6 space-y-3">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold mb-2">🧬 Hormone symptom mapping</h4>
                <p className="text-gray-300 text-sm">Connect how you feel to hormone patterns</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold mb-2">📅 Cycle awareness</h4>
                <p className="text-gray-300 text-sm">Track patterns and understand your body</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold mb-2">🌸 Perimenopause education</h4>
                <p className="text-gray-300 text-sm">Navigate changes with confidence</p>
              </div>
            </div>
          </div>

          {/* RIGHT CARD – PEPPI */}
          <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Peppi</h2>
              <p className="text-cyan-400 text-sm font-medium">Men's Hormones & Peptide Science</p>
            </div>

            <MascotDomainCard
              mascotId="peppi"
              displayName="Peppi"
              title="Men's hormones, peptides, science"
              description="If TikTok sold it as a miracle, Peppi explains what actually works."
              posterSrc="/characters/peppi.png"
              mp4Src="/videos/mascots/peppi.mp4"
              chatPersona="peppi"
              primaryCtaLabel="Learn With Peppi"
              chatCtaLabel="Ask Peppi"
              source="hormones"
            />

            {/* Interactive Tools Preview */}
            <div className="mt-6 space-y-3">
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                <h4 className="text-cyan-300 font-semibold mb-2">🧪 Peptide education</h4>
                <p className="text-gray-300 text-sm">What works vs hype in peptide science</p>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                <h4 className="text-cyan-300 font-semibold mb-2">⚡ Hormone optimization myths</h4>
                <p className="text-gray-300 text-sm">Evidence-based clarity on men's health</p>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                <h4 className="text-cyan-300 font-semibold mb-2">🔬 Science-first explanations</h4>
                <p className="text-gray-300 text-sm">Real research behind trending protocols</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "How This Fits Your Blueprint" Section */}
      <div className="bg-gray-900/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How This Fits Your Blueprint
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-black/40 border border-purple-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-purple-300 mb-4">Women's Hormone Blueprint</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <span className="text-purple-400 mr-3">📊</span>
                  Symptom tracking integrated with lab results
                </li>
                <li className="flex items-center">
                  <span className="text-purple-400 mr-3">🔄</span>
                  Cycle phase recommendations
                </li>
                <li className="flex items-center">
                  <span className="text-purple-400 mr-3">🎯</span>
                  Personalized hormone optimization goals
                </li>
              </ul>
            </div>

            <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">Men's Peptide Blueprint</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <span className="text-cyan-400 mr-3">🧬</span>
                  Evidence-based peptide recommendations
                </li>
                <li className="flex items-center">
                  <span className="text-cyan-400 mr-3">📈</span>
                  Hormone trend analysis and insights
                </li>
                <li className="flex items-center">
                  <span className="text-cyan-400 mr-3">⚖️</span>
                  Risk-benefit analysis for protocols
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA to Lab Decoder */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h3 className="text-2xl font-semibold text-white mb-6">
          Ready to decode your labs?
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/lab-decoder"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Go to Lab Decoder
          </a>
          <a
            href="/blueprint"
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            View Your Blueprint
          </a>
        </div>
      </div>
    </div>
  );
}