"use client";

import React from "react";
import MascotDomainShell from "@/components/mascots/MascotDomainShell";

export default function HormonesPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          Hormones & Peptides
        </h1>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Clarity for women. Science for men. One system.{" "}
          <span className="text-white font-medium">No confusion. No fear. Just understanding.</span>
        </p>
      </div>

      {/* Harmony Section - Women's Hormones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MascotDomainShell
          mascotId="harmony"
          displayName="Harmony"
          tagline="Women's Hormone Health"
          description="Understand your hormones without fear. Harmony helps you connect symptoms to patterns — safely and scientifically. From cycle awareness to perimenopause, get clarity on what your body is telling you."
          imageSrc="/characters/harmony.png"
          videoSrc="/videos/mascots/harmony.mp4"
          showVideo={true}
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
          ctaHref="/vault/tools/hormone-tracker"
          source="hormones"
        />
      </div>

      {/* Peppi Section - Men's Hormones & Peptides */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <MascotDomainShell
          mascotId="peppi"
          displayName="Peppi"
          tagline="Men's Hormones & Peptide Science"
          description="If TikTok sold it as a miracle, Peppi explains what actually works. Science-first clarity for men's health optimization. No hype, no broscience — just evidence-based facts."
          imageSrc="/characters/peppi.png"
          videoSrc="/videos/mascots/peppi.mp4"
          showVideo={true}
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
          ctaHref="/vault/tools/hormone-tracker"
          source="hormones"
        />
      </div>

      {/* SAFETY & TRUST CALLOUT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-purple-400 mb-4">Important:</h3>
          <p className="text-white/90 leading-relaxed">
            Harmony and Peppi do not replace licensed providers. They exist to help you understand treatments so you can make informed, safer decisions.
          </p>
        </div>
      </div>

      {/* FINAL CTA SECTION */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h3 className="text-2xl font-semibold text-white mb-6">
          Ready to understand your hormones?
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://app.nopriorauthorization.com/chat?mascot=harmony&source=hormones"
            className="bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 hover:from-purple-600 hover:via-violet-600 hover:to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Ask Harmony
          </a>
          <a
            href="https://app.nopriorauthorization.com/chat?mascot=peppi&source=hormones"
            className="bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 hover:from-cyan-600 hover:via-blue-600 hover:to-teal-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Ask Peppi
          </a>
        </div>
      </div>
    </div>
  );
}
