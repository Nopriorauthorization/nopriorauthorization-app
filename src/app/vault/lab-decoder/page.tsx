export const dynamic = "force-dynamic";

import React from "react";
import { Metadata } from "next";
import MascotDomainCard from "@/content/hero/src/components/mascots/MascotDomainCard";
import LabDecoder from "@/content/hero/LabDecoder";

export const metadata: Metadata = {
  title: "Lab Intelligence | Decode Your Health",
  description: "Transform complex lab results into clear, actionable insights with AI-powered analysis.",
};

export default function LabDecoderPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Lab Intelligence
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Decode translates your lab results into plain language, highlights patterns over time, and helps you understand what actually matters before your next appointment.
            </p>
          </div>
        </div>
      </div>

      {/* Decode Mascot Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <MascotDomainCard
          mascotId="decode"
          displayName="Decode"
          title="Lab results, patterns, and what actually matters"
          description="Decode translates your lab results into plain language, highlights patterns over time, and helps you understand what actually matters before your next appointment."
          posterSrc="/characters/decode.png"
          mp4Src="/videos/mascots/decode.mp4"
          chatPersona="decode"
          primaryCtaLabel="Learn with Decode"
          chatCtaLabel="Ask Decode"
        />
      </div>

      {/* Lab Decoder Tool */}
      <div className="bg-gray-900/50">
        <LabDecoder />
      </div>
    </div>
  );
}
