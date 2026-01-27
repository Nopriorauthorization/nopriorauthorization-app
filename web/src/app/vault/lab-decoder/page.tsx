"use client";

import React from "react";
import MascotDomainShell from "@/components/mascots/MascotDomainShell";

export default function LabDecoderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Lab Results & Biomarker Intelligence
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Your labs tell a story. Decode translates complex biomarkers into clear, actionable health insights.
            </p>
          </div>
        </div>
      </div>

      {/* Decode Mascot Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <MascotDomainShell
          mascotId="decode"
          displayName="Decode"
          tagline="Lab Intelligence & Biomarker Analysis"
          description="Transform complex lab results into clear, actionable health insights. Decode explains what your biomarkers mean, identifies patterns, and guides you toward optimal health decisions."
          imageSrc="/mascots/LABDECODERMASCOT.PNG"
          videoSrc="/videos/mascots/decode.mp4"
          features={[
            {
              icon: "🔬",
              title: "Biomarker Analysis",
              description: "Decode complex lab values into understandable insights"
            },
            {
              icon: "📊",
              title: "Trend Detection",
              description: "Track changes over time and identify patterns"
            },
            {
              icon: "📤",
              title: "Result Upload",
              description: "Securely upload and analyze your lab results"
            },
            {
              icon: "🧠",
              title: "AI Insights",
              description: "Get personalized recommendations based on your labs"
            }
          ]}
          ctaText="Explore Lab Intelligence"
          ctaHref="/vault/decoder"
          source="lab-decoder"
        />
      </div>

      {/* Lab Intelligence Video */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Unlock Your Lab Intelligence</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Stop guessing what your labs mean. Decode provides the context and clarity you need to take control of your health.
            </p>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <video
              controls
              className="w-full h-auto"
              poster="/mascots/LABDECODERMASCOT.PNG"
              preload="metadata"
            >
              <source src="/videos/mascots/decode.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              Learn how to interpret your biomarkers and make informed health decisions
            </p>
          </div>
        </div>
      </div>

      {/* What Decode Helps With */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What Decode Helps With</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "🩸", title: "Blood Chemistry", description: "Understand glucose, cholesterol, liver and kidney markers" },
              { icon: "🦴", title: "Metabolic Panels", description: "Decode comprehensive metabolic insights" },
              { icon: "🧬", title: "Hormone Levels", description: "Track thyroid, cortisol, testosterone, estrogen patterns" },
              { icon: "💪", title: "Inflammation Markers", description: "Monitor CRP, ESR, and immune indicators" },
              { icon: "🫀", title: "Cardiovascular Health", description: "Lipid panels, cardiac enzymes, and heart risk factors" },
              { icon: "🧪", title: "Vitamin & Mineral Status", description: "D3, B12, iron, magnesium and nutrient levels" },
            ].map((item, index) => (
              <div key={index} className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all hover:bg-white/10">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Decode Your Labs?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands who've gained clarity about their health through intelligent lab analysis.
          </p>
          <a
            href="https://app.nopriorauthorization.com/vault/decoder"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all hover:scale-105 hover:shadow-xl"
          >
            Start Decoding Now
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
