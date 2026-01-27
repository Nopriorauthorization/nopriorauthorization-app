"use client";

import React from "react";
import MascotDomainShell from "@/components/mascots/MascotDomainShell";

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
          imageSrc="/mascots/FAMILYTREEMASCOT.PNG"
          videoSrc="/videos/mascots/roots.mp4"
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
              poster="/mascots/FAMILYTREEMASCOT.PNG"
              preload="metadata"
            >
              <source src="/videos/mascots/roots.mp4" type="video/mp4" />
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
            {[
              { icon: "🫀", title: "Heart Disease", description: "Track cardiovascular patterns across generations" },
              { icon: "🩺", title: "Diabetes Risk", description: "Understand metabolic predispositions in your family" },
              { icon: "🧬", title: "Cancer History", description: "Map cancer patterns for early screening awareness" },
              { icon: "🧠", title: "Mental Health", description: "Recognize patterns in anxiety, depression, and more" },
              { icon: "🦴", title: "Autoimmune Conditions", description: "Track conditions like lupus, RA, and thyroid issues" },
              { icon: "👶", title: "Pregnancy Planning", description: "Know what to discuss before starting a family" },
            ].map((item, index) => (
              <div key={index} className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-all hover:bg-white/10">
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
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore Your Family's Health?</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Build your family health tree and discover insights that could help you and your loved ones live healthier lives.
          </p>
          <a
            href="https://app.nopriorauthorization.com/vault/family-tree"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all hover:scale-105 hover:shadow-xl"
          >
            Start Your Family Tree
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
