"use client";

import React from "react";
import { motion } from "framer-motion";
import MascotDomainShell from "@/components/mascots/MascotDomainShell";
import { FiArrowRight } from "react-icons/fi";

export default function WeightManagementPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Page Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-orange-900/10 to-black" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-orange-400 text-sm font-medium tracking-wider mb-4">
              METABOLIC INTELLIGENCE
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Weight Management
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Evidence-based weight management without the fads.{" "}
              <span className="text-white font-medium">Science-backed approaches that actually work.</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Slim-T Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MascotDomainShell
          mascotId="slim-t"
          displayName="Slim-T"
          tagline="Weight & Metabolic Health"
          description="Cut through the noise of fad diets and miracle pills. Slim-T delivers evidence-based guidance on weight management, metabolic health, and sustainable lifestyle changes that actually work."
          imageSrc="/characters/slim-t.png"
          videoSrc="/hero/avatars/slim-t-intro.mp4"
          showVideo={true}
          features={[
            {
              icon: "⚖️",
              title: "Metabolic Science",
              description: "Understand how your body actually burns fat"
            },
            {
              icon: "🍽️",
              title: "Nutrition Facts",
              description: "Evidence-based dietary guidance"
            },
            {
              icon: "💊",
              title: "GLP-1 Education",
              description: "Honest info on Ozempic, Wegovy & more"
            },
            {
              icon: "📊",
              title: "Progress Tracking",
              description: "Meaningful metrics beyond the scale"
            }
          ]}
          ctaText="Start Your Journey"
          ctaHref="/vault/tools/metabolic-health"
          source="weight-management"
        />
      </div>

      {/* What Slim-T Helps With */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">What Slim-T Helps With</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🎯", title: "Weight Loss Plateaus", description: "Why you're stuck and what to do about it" },
              { icon: "🧬", title: "Metabolic Rate", description: "Understanding your body's energy needs" },
              { icon: "💉", title: "GLP-1 Medications", description: "Honest facts about weight loss drugs" },
              { icon: "🏃", title: "Exercise & Weight", description: "The real relationship between movement and fat loss" },
              { icon: "😴", title: "Sleep & Weight", description: "How rest affects your metabolism" },
              { icon: "🧠", title: "Emotional Eating", description: "Understanding the psychology of food" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <span className="text-4xl block mb-3">{item.icon}</span>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to understand your metabolism?
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Get personalized metabolic insights and evidence-based guidance from Slim-T.
          </p>
          <a
            href="https://app.nopriorauthorization.com/chat?mascot=slim-t&source=weight-management"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 hover:from-red-600 hover:via-orange-600 hover:to-amber-600 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-red-500/25"
          >
            Talk to Slim-T
            <FiArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
