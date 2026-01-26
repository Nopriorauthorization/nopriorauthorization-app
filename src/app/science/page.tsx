export const dynamic = "force-dynamic";

// Peppi Science & Peptides Domain Page
import React from "react";
import { Metadata } from "next";
import MascotDomainCard from "../../content/hero/src/components/mascots/MascotDomainCard";

export const metadata: Metadata = {
  title: "Science & Peptide Intelligence | Peppi",
  description: "Understand peptides, supplements, and evidence-based medicine without hype or misinformation.",
};

export default function SciencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Science & Peptide Intelligence
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
              Why evidence matters more than trends. Peppi helps you understand peptides, supplements, and protocols using real science — separating facts from marketing.
            </p>
          </div>
        </div>
      </div>

      {/* Mascot Domain Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <MascotDomainCard
          mascotId="peppi"
          displayName="Peppi"
          title="Peptides, supplements, evidence-based protocols"
          description="Peppi breaks down peptides, supplements, and trending protocols using real science — so you can understand what's evidence-based, what's experimental, and what's just marketing."
          posterSrc="/characters/peppi.png"
          mp4Src="/videos/mascots/peppi.mp4"
          chatPersona="peppi"
          primaryCtaLabel="Learn with Peppi"
          chatCtaLabel="Ask Peppi"
        />
      </div>

      {/* What Peppi Helps With */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What Peppi Helps With</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🧬</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Peptide Education</h3>
              <p className="text-gray-300">Understanding peptide therapies, their mechanisms, and evidence-based applications.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💊</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Supplement Science</h3>
              <p className="text-gray-300">Evidence-based analysis of supplements, dosages, interactions, and clinical studies.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Research Analysis</h3>
              <p className="text-gray-300">Breaking down clinical trials, meta-analyses, and separating signal from noise.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Protocol Evaluation</h3>
              <p className="text-gray-300">Assessing treatment protocols, hormone optimization, and wellness strategies.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Safety & Risks</h3>
              <p className="text-gray-300">Understanding side effects, contraindications, and safe usage guidelines.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Personalized Guidance</h3>
              <p className="text-gray-300">Tailored recommendations based on your health history and goals.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How This Connects to Your Vault */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How This Connects to Your Vault</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Lab Result Analysis</h3>
                  <p className="text-gray-300">Peppi reviews your lab results to identify peptide or supplement opportunities based on your biomarkers.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Protocol Recommendations</h3>
                  <p className="text-gray-300">Evidence-based protocols are saved to your care plans with tracking and follow-up recommendations.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Progress Monitoring</h3>
                  <p className="text-gray-300">Track effectiveness through follow-up labs and adjust protocols based on real data.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Provider Communication</h3>
                  <p className="text-gray-300">Share evidence-based insights with your care team through secure provider packets.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">5</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Safety Monitoring</h3>
                  <p className="text-gray-300">Continuous monitoring for side effects, interactions, and protocol adjustments.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">6</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Knowledge Building</h3>
                  <p className="text-gray-300">Build your understanding over time with personalized education and research updates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}// Force redeploy
