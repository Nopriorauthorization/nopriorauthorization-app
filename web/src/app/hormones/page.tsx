"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import MascotDomainShell from "@/components/mascots/MascotDomainShell";
import { FiArrowRight } from "react-icons/fi";

export default function HormonesPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Page Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-cyan-900/10 to-black" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-purple-400 text-sm font-medium tracking-wider mb-4">
              HORMONE INTELLIGENCE
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Hormones & Peptides
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Clarity for women. Science for men. One system.{" "}
              <span className="text-white font-medium">No confusion. No fear. Just understanding.</span>
            </p>
          </motion.div>
        </div>
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

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to decode your labs?
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Upload your hormone panel and get instant, personalized insights from Harmony or Peppi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://app.nopriorauthorization.com/vault/lab-decoder"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 hover:from-purple-600 hover:via-violet-600 hover:to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
            >
              Go to Lab Decoder
              <FiArrowRight className="w-5 h-5" />
            </a>
            <a
              href="https://app.nopriorauthorization.com/blueprint"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 hover:from-cyan-600 hover:via-blue-600 hover:to-teal-600 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25"
            >
              View Your Blueprint
              <FiArrowRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
