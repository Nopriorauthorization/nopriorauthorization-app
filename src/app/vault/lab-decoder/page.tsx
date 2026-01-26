export const dynamic = "force-dynamic";

// Decode Lab Decoder Domain Page
import React from "react";
import { Metadata } from "next";
import VaultStyleMascotSection from "../../../content/hero/src/components/mascots/VaultStyleMascotSection";

export const metadata: Metadata = {
  title: "Lab Results & Biomarker Intelligence | Decode",
  description: "Transform lab results into actionable health insights. Decode explains what your biomarkers mean and what to do next.",
};

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

      {/* Vault Style Mascot Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <VaultStyleMascotSection
          mascotId="decode"
          displayName="Decode"
          tagline="Lab Intelligence & Biomarker Analysis"
          description="Transform complex lab results into clear, actionable health insights. Decode explains what your biomarkers mean, identifies patterns, and guides you toward optimal health decisions."
          imageSrc="/characters/decode.png"
          videoSrc="/videos/mascots/decode.mp4"
          chatPersona="decode"
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
          ctaHref="/vault/lab-decoder"
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
              poster="/characters/decode.png"
              preload="metadata"
            >
              <source src="/videos/marketing/lab-decoder-intro.mp4" type="video/mp4" />
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
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🧬</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Biomarker Interpretation</h3>
              <p className="text-gray-300">Understanding what your lab values actually mean for your health and wellness.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Trend Analysis</h3>
              <p className="text-gray-300">Tracking how your biomarkers change over time and what those patterns indicate.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Actionable Insights</h3>
              <p className="text-gray-300">Clear recommendations based on your unique biomarker profile and health goals.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Reference Range Context</h3>
              <p className="text-gray-300">Understanding why reference ranges vary and what optimal levels look like for you.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Red Flag Detection</h3>
              <p className="text-gray-300">Identifying concerning patterns and when to seek additional medical attention.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Optimization Strategies</h3>
              <p className="text-gray-300">Evidence-based approaches to improve your biomarkers and overall health markers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How This Connects to Your Vault */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How This Connects to Your Vault</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Lab Result Upload</h3>
                  <p className="text-gray-300">Securely upload your lab results for intelligent analysis and interpretation.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Biomarker Intelligence</h3>
                  <p className="text-gray-300">Decode provides context for each biomarker, explaining what it measures and why it matters.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Personalized Insights</h3>
                  <p className="text-gray-300">Receive tailored recommendations based on your unique biomarker profile and health history.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Trend Tracking</h3>
                  <p className="text-gray-300">Monitor how your biomarkers change over time and identify meaningful patterns.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">5</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Blueprint Integration</h3>
                  <p className="text-gray-300">Automatically connect lab insights to your personalized health blueprint and care plan.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">6</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Provider Communication</h3>
                  <p className="text-gray-300">Generate clear questions and discussion points for your healthcare providers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
