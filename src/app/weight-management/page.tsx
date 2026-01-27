"use client";
export const dynamic = "force-dynamic";

import React from "react";
import MascotDomainShell from "@/components/mascots/MascotDomainShell";

export default function WeightManagementPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          Weight Loss Isn't Willpower. It's Biology.
        </h1>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          If calorie math actually worked, most people wouldn't still be stuck.
          Slim-T explains how hormones, metabolism, medications, and lifestyle actually affect weight — and why most programs fail you.
        </p>
      </div>

      {/* Slim-T Mascot Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MascotDomainShell
          mascotId="slim-t"
          displayName="Slim-T"
          tagline="Weight & Metabolism Intelligence"
          description="Weight Loss Without the Lies. Slim-T breaks down the real science of weight management — hormonal resistance, metabolic adaptation, GLP-1s, and what labs actually matter. This isn't hype. It's clarity."
          imageSrc="/characters/slim-t.png"
          videoSrc="/hero/avatars/slim-t-intro.mp4"
          showVideo={true}
          features={[
            {
              icon: "🔥",
              title: "Why Weight Stalls",
              description: "Hormonal resistance and metabolic adaptation"
            },
            {
              icon: "💊",
              title: "GLP-1s Explained",
              description: "What they do and who they help"
            },
            {
              icon: "📊",
              title: "Labs That Matter",
              description: "Which biomarkers to track"
            },
            {
              icon: "🎯",
              title: "What Actually Works",
              description: "Evidence-based strategies"
            }
          ]}
          ctaText="Explore Weight Intelligence"
          ctaHref="/chat?mascot=slim-t&source=weight-management"
          source="weight-management"
        />
      </div>

      {/* What Slim-T Reveals Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What Slim-T Reveals</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-3">Why Weight Loss Stalls</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Hormonal resistance</li>
                <li>• Metabolic adaptation</li>
                <li>• Inflammation & stress</li>
                <li>• Medication misunderstanding</li>
              </ul>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-orange-400 mb-3">What Moves the Needle</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• GLP-1s explained simply</li>
                <li>• Lifestyle vs medication roles</li>
                <li>• What labs matter (and why)</li>
              </ul>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">Track What Matters</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Weight trends ≠ daily scale panic</li>
                <li>• Labs + symptoms + history</li>
                <li>• Blueprint integration</li>
              </ul>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3">Ask Better Questions</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• What to ask your provider</li>
                <li>• Red flags to avoid</li>
                <li>• Myths Slim-T shuts down</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* TRUST & SAFETY CALLOUT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-red-400 mb-4">Important:</h3>
          <p className="text-white/90 leading-relaxed">
            Slim-T does not prescribe or diagnose. This tool helps you understand weight-related biology so you can make informed decisions with your provider.
          </p>
        </div>
      </div>

      {/* SECONDARY CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h3 className="text-2xl font-semibold text-white mb-4">
          Confused about weight loss, meds, or hormones?
        </h3>
        <a
          href="/chat?mascot=slim-t&source=weight-management"
          className="inline-block bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 hover:from-red-600 hover:via-orange-600 hover:to-amber-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
        >
          Ask Slim-T
        </a>
      </div>
    </div>
  );
}
