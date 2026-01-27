export const dynamic = "force-dynamic";

import React from "react";
import { Metadata } from "next";
import MascotDomainShell from "@/components/mascots/MascotDomainShell";

export const metadata: Metadata = {
  title: "Family Health Patterns & Prevention | Root",
  description: "Understand your family's health patterns, inherited risks, and prevention strategies.",
};

export default function FamilyHealthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Family Health Patterns & Prevention
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 max-w-4xl mx-auto leading-relaxed">
              Your family's health history is a roadmap to prevention. Root helps you understand patterns and protect your family's future.
            </p>
          </div>
        </div>
      </div>

      {/* Root Mascot Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <MascotDomainShell
          mascotId="root"
          displayName="Root"
          tagline="Family Health Intelligence"
          description="Discover generational health patterns, genetic predispositions, and family medical history. Build a comprehensive family health map that reveals insights for prevention and early intervention."
          imageSrc="/characters/root.png"
          videoSrc="/videos/mascots/root.mp4"
          features={[
            {
              icon: "🌳",
              title: "Generational Patterns",
              description: "Map your family's health journey across generations"
            },
            {
              icon: "🧬",
              title: "Genetic Insights",
              description: "Unlock DNA-powered wisdom for prevention"
            },
            {
              icon: "🛡️",
              title: "Prevention Focus",
              description: "Stay ahead of health risks with early detection"
            },
            {
              icon: "🧠",
              title: "AI-Powered",
              description: "Smart family health analysis and recommendations"
            }
          ]}
          ctaText="Explore Your Root"
          ctaHref="/vault/family-tree"
          source="family-health"
        />
      </div>

      {/* Family Health Video */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Discover Your Family's Health Story</h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              Understanding your family's health patterns can help prevent disease and protect your loved ones.
            </p>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <video
              controls
              className="w-full h-auto"
              poster="/characters/root.png"
              preload="metadata"
            >
              <source src="/videos/marketing/family-health.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              Learn how family health patterns work and how to use them for prevention
            </p>
          </div>
        </div>
      </div>

      {/* What Root Helps With */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What Root Helps With</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-emerald-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌳</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Family Health Mapping</h3>
              <p className="text-gray-300">Visualize and understand health patterns across generations in your family.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-emerald-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Risk Assessment</h3>
              <p className="text-gray-300">Identify inherited health risks early and understand what they mean for you.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-emerald-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Prevention Strategies</h3>
              <p className="text-gray-300">Actionable steps to prevent or manage inherited health conditions.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-emerald-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Pattern Recognition</h3>
              <p className="text-gray-300">Connect lifestyle factors, genetics, and health outcomes across family members.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-emerald-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Health History Analysis</h3>
              <p className="text-gray-300">Make sense of complex family medical histories and their implications.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-emerald-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Family Protection</h3>
              <p className="text-gray-300">Strategies to protect your family's health legacy and future generations.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How This Connects to Your Vault */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How This Connects to Your Vault</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Family Tree Building</h3>
                  <p className="text-gray-300">Create comprehensive family health trees with medical history and risk factors.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Pattern Analysis</h3>
                  <p className="text-gray-300">Root identifies patterns and connections across your family's health history.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Risk Assessment</h3>
                  <p className="text-gray-300">Personalized risk calculations based on family history and genetic factors.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Prevention Planning</h3>
                  <p className="text-gray-300">Create evidence-based prevention plans tailored to your family's risk profile.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">5</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Screening Recommendations</h3>
                  <p className="text-gray-300">Personalized screening schedules based on family history and risk factors.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">6</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Family Communication</h3>
                  <p className="text-gray-300">Tools to discuss health risks and prevention strategies with family members.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
