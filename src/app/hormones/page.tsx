export const dynamic = "force-dynamic";

// Harmony Hormones Domain Page
import React from "react";
import { Metadata } from "next";
import MascotDomainCard from "../../content/hero/src/components/mascots/MascotDomainCard";

export const metadata: Metadata = {
  title: "Hormone Balance & Wellness | Harmony",
  description: "Understand hormone balance, optimization, and wellness basics with evidence-based guidance.",
};

export default function HormonesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Hormone Balance & Wellness
            </h1>
            <p className="text-xl md:text-2xl text-pink-100 max-w-4xl mx-auto leading-relaxed">
              Understanding your hormones is the foundation of true wellness. Harmony provides clear, compassionate guidance for hormone health.
            </p>
          </div>
        </div>
      </div>

      {/* Mascot Domain Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <MascotDomainCard
          mascotId="harmony"
          displayName="Harmony"
          title="Hormone balance and wellness basics"
          description="Harmony helps you understand hormone balance, what it really means, and how to work with your body toward optimal wellness."
          posterSrc="/characters/harmony.png"
          mp4Src="/videos/mascots/harmony.mp4"
          chatPersona="harmony"
          primaryCtaLabel="Learn with Harmony"
          chatCtaLabel="Ask Harmony"
        />
      </div>

      {/* Hormone Harmony Video */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Find Your Hormone Harmony</h2>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto">
              Discover how understanding your hormones can transform your energy, mood, and overall wellness.
            </p>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <video
              controls
              className="w-full h-auto"
              poster="/characters/harmony.png"
              preload="metadata"
            >
              <source src="/videos/marketing/hormone-harmony.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              Learn about hormone balance, common signs, and how to prepare for consultations
            </p>
          </div>
        </div>
      </div>

      {/* What Harmony Helps With */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What Harmony Helps With</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-pink-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚖️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Hormone Balance Basics</h3>
              <p className="text-gray-300">Understanding what hormone balance really means and why it matters for your health.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-pink-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Symptom Recognition</h3>
              <p className="text-gray-300">Connecting how you feel to potential hormone patterns and what they might mean.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-pink-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Consult Preparation</h3>
              <p className="text-gray-300">Knowing exactly what to ask and discuss during hormone-related appointments.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-pink-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Wellness Foundations</h3>
              <p className="text-gray-300">Building sustainable habits that support hormone health and overall wellness.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-pink-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💪</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Energy & Vitality</h3>
              <p className="text-gray-300">Supporting natural energy levels, sleep quality, and daily vitality.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-pink-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Personalized Guidance</h3>
              <p className="text-gray-300">Tailored insights based on your unique health history and wellness goals.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How This Connects to Your Vault */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How This Connects to Your Vault</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Symptom Tracking</h3>
                  <p className="text-gray-300">Log patterns and connect them to potential hormone influences for better understanding.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Lab Result Context</h3>
                  <p className="text-gray-300">Harmony helps interpret hormone-related labs and understand what they mean for you.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Wellness Planning</h3>
                  <p className="text-gray-300">Create personalized wellness plans that support hormone health and balance.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Provider Preparation</h3>
                  <p className="text-gray-300">Get clear on what to discuss and ask during hormone-related appointments.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">5</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Progress Monitoring</h3>
                  <p className="text-gray-300">Track changes in symptoms, energy, and wellness markers over time.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">6</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Ongoing Support</h3>
                  <p className="text-gray-300">Continuous guidance as your hormone health and wellness needs evolve.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}