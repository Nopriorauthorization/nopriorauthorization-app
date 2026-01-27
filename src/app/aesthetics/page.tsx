"use client";
export const dynamic = "force-dynamic";

import React from "react";
import MascotDomainShell from "@/components/mascots/MascotDomainShell";

export default function AestheticsPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          Aesthetics Without the Guesswork
        </h1>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Botox and fillers aren't the same — and confusing them leads to bad outcomes.
          Learn how they actually work before letting anyone touch your face.
        </p>
      </div>

      {/* Beau-Tox Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MascotDomainShell
          mascotId="beau-tox"
          displayName="Beau-Tox"
          tagline="Botox & Neuromodulators"
          description="Botox Without the BS. Beau-Tox explains neuromodulators — what they do, what they don't do, how long they last, and the myths that need to stop."
          imageSrc="/characters/beau.png"
          videoSrc="/hero/avatars/beau-tox-intro.mp4"
          showVideo={true}
          features={[
            {
              icon: "💉",
              title: "How It Works",
              description: "Understand the science of neuromodulators"
            },
            {
              icon: "⏱️",
              title: "Duration",
              description: "Realistic timeline expectations"
            },
            {
              icon: "🚫",
              title: "Myth Busting",
              description: "Debunking common misconceptions"
            },
            {
              icon: "✅",
              title: "Safety First",
              description: "What to know before treatment"
            }
          ]}
          ctaText="Learn About Botox"
          ctaHref="/chat?mascot=beau-tox&source=aesthetics"
          source="aesthetics"
        />
      </div>

      {/* Filla-Grace Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MascotDomainShell
          mascotId="filla-grace"
          displayName="Filla-Grace"
          tagline="Dermal Fillers & Facial Anatomy"
          description="Fillers Done Right. Filla-Grace teaches facial anatomy, the difference between structure and volume, why 'natural' is often misunderstood, and safety essentials."
          imageSrc="/characters/filla-grace.png"
          videoSrc="/hero/avatars/f-ill-intro.mp4"
          showVideo={true}
          features={[
            {
              icon: "💎",
              title: "Structure vs Volume",
              description: "Understanding the key difference"
            },
            {
              icon: "🎭",
              title: "Facial Anatomy",
              description: "Why placement matters"
            },
            {
              icon: "⚠️",
              title: "Red Flags",
              description: "Signs of overfilling and bad work"
            },
            {
              icon: "🛡️",
              title: "Safety Zones",
              description: "High-risk areas to know about"
            }
          ]}
          ctaText="Learn About Fillers"
          ctaHref="/chat?mascot=filla-grace&source=aesthetics"
          source="aesthetics"
        />
      </div>

      {/* SAFETY & TRUST CALLOUT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-pink-400 mb-4">Important:</h3>
          <p className="text-white/90 leading-relaxed">
            Beau-Tox and Filla-Grace do not replace licensed providers. They exist to help you understand treatments so you can make informed, safer decisions.
          </p>
        </div>
      </div>

      {/* FINAL CTA SECTION */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h3 className="text-2xl font-semibold text-white mb-6">
          Not sure what's right for your face?
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/chat?mascot=beau-tox&source=aesthetics"
            className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 hover:from-yellow-500 hover:via-amber-500 hover:to-orange-500 text-black font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Ask Beau-Tox
          </a>
          <a
            href="/chat?mascot=filla-grace&source=aesthetics"
            className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:from-pink-600 hover:via-rose-600 hover:to-fuchsia-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Ask Filla-Grace
          </a>
        </div>
      </div>
    </div>
  );
}
