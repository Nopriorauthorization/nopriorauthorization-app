export const dynamic = "force-dynamic";

import React from "react";
import { Metadata } from "next";
import VaultStyleMascotSection from "../../content/hero/src/components/mascots/VaultStyleMascotSection";

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

      {/* Harmony Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <VaultStyleMascotSection
          mascotId="harmony"
          displayName="Harmony"
          tagline="Women's Hormone Health"
          description="Understand your hormones without fear. Harmony helps you connect symptoms to patterns — safely and scientifically."
          imageSrc="/characters/harmony.png"
          videoSrc="/videos/mascots/harmony.mp4"
          chatPersona="harmony"
          features={[
            {
              icon: "🧬",
              title: "Hormone Mapping",
              description: "Connect symptoms to hormone patterns safely"
            },
            {
              icon: "📅",
              title: "Cycle Awareness",
              description: "Track patterns and understand your body's rhythm"
            },
            {
              icon: "🌸",
              title: "Perimenopause Guide",
              description: "Navigate changes with confidence and clarity"
            },
            {
              icon: "🛡️",
              title: "Safe Science",
              description: "Evidence-based hormone education without fear"
            }
          ]}
          ctaText="Explore Women's Hormones"
          ctaHref="/vault/hormone-tracker"
          source="hormones"
        />
      </div>

      {/* Peppi Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <VaultStyleMascotSection
          mascotId="peppi"
          displayName="Peppi"
          tagline="Men's Hormones & Peptide Science"
          description="If TikTok sold it as a miracle, Peppi explains what actually works. Science-first clarity for men's health optimization."
          imageSrc="/characters/peppi.png"
          videoSrc="/videos/mascots/peppi.mp4"
          chatPersona="peppi"
          features={[
            {
              icon: "🧪",
              title: "Peptide Science",
              description: "What works vs hype in peptide research"
            },
            {
              icon: "⚡",
              title: "Hormone Myths",
              description: "Evidence-based clarity on optimization"
            },
            {
              icon: "🔬",
              title: "Research-Backed",
              description: "Real science behind trending protocols"
            },
            {
              icon: "🎯",
              title: "Precision Health",
              description: "Targeted approaches that actually work"
            }
          ]}
          ctaText="Explore Men's Hormones"
          ctaHref="/vault/hormone-tracker"
          source="hormones"
        />
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