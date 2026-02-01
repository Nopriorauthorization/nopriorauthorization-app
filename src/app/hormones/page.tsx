"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import MascotDomainShell from "@/components/mascots/MascotDomainShell";
import { FiChevronDown, FiChevronUp, FiCheck, FiAlertCircle, FiArrowRight } from "react-icons/fi";

// =============================================================================
// HORMONES & PEPTIDES DOMAIN PAGE
// Harmony (Women's Hormones) + Peppi (Men's Hormones & Peptides)
// =============================================================================

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

      {/* Harmony Interactive Tools Section */}
      <HarmonyToolsSection />

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

      {/* Peppi Interactive Tools Section */}
      <PeppiToolsSection />

      {/* Blueprint Integration Section */}
      <BlueprintIntegrationSection />

      {/* CTA to Lab Decoder */}
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
            <Link
              href="/vault/lab-decoder"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 hover:from-purple-600 hover:via-violet-600 hover:to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
            >
              Go to Lab Decoder
              <FiArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/blueprint"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 hover:from-cyan-600 hover:via-blue-600 hover:to-teal-600 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25"
            >
              View Your Blueprint
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// =============================================================================
// HARMONY TOOLS SECTION - Women's Hormone Interactive Tools
// =============================================================================

function HarmonyToolsSection() {
  const [activeSymptom, setActiveSymptom] = useState<string | null>(null);
  
  const symptomMappings = [
    {
      id: "fatigue",
      symptom: "Fatigue & Low Energy",
      icon: "😴",
      relatedHormones: ["Thyroid (T3/T4)", "Cortisol", "Estrogen", "Progesterone"],
      possibleCauses: [
        "Low thyroid function",
        "Adrenal fatigue",
        "Hormone imbalance during cycle",
        "Perimenopause transition"
      ],
      labsToConsider: ["Complete thyroid panel", "Cortisol (AM)", "Estradiol", "Progesterone"],
      harmonyTip: "Track when fatigue occurs in your cycle. Many women experience energy dips around ovulation and before menstruation."
    },
    {
      id: "mood",
      symptom: "Mood Changes & Anxiety",
      icon: "🎭",
      relatedHormones: ["Progesterone", "Estrogen", "DHEA", "Cortisol"],
      possibleCauses: [
        "Progesterone deficiency",
        "Estrogen fluctuations",
        "Chronic stress response",
        "Luteal phase changes"
      ],
      labsToConsider: ["Progesterone (Day 21)", "Estradiol", "DHEA-S", "Cortisol rhythm"],
      harmonyTip: "Progesterone has a calming effect. Low levels, especially in the second half of your cycle, can trigger anxiety and mood swings."
    },
    {
      id: "weight",
      symptom: "Weight Changes",
      icon: "⚖️",
      relatedHormones: ["Insulin", "Thyroid", "Cortisol", "Estrogen"],
      possibleCauses: [
        "Insulin resistance",
        "Hypothyroidism",
        "Cortisol elevation",
        "Estrogen dominance"
      ],
      labsToConsider: ["Fasting insulin", "HbA1c", "TSH + Free T3/T4", "Cortisol"],
      harmonyTip: "Unexplained weight gain around the middle often signals cortisol or insulin issues. Both are treatable with the right approach."
    },
    {
      id: "sleep",
      symptom: "Sleep Disturbances",
      icon: "🌙",
      relatedHormones: ["Progesterone", "Cortisol", "Melatonin", "Estrogen"],
      possibleCauses: [
        "Low progesterone",
        "Cortisol dysregulation",
        "Night sweats (estrogen)",
        "Melatonin deficiency"
      ],
      labsToConsider: ["Progesterone", "Cortisol (4-point)", "Estradiol", "Sleep study if severe"],
      harmonyTip: "Progesterone is nature's sedative. If you sleep well the first half of your cycle but struggle the second half, this is a clue."
    },
  ];

  const cyclePhases = [
    { phase: "Menstrual", days: "Days 1-5", color: "bg-red-500", description: "Rest & restore. Hormone levels are lowest." },
    { phase: "Follicular", days: "Days 6-14", color: "bg-pink-500", description: "Rising estrogen. Energy increases." },
    { phase: "Ovulation", days: "Days 14-16", color: "bg-purple-500", description: "Peak estrogen & testosterone. Peak energy." },
    { phase: "Luteal", days: "Days 17-28", color: "bg-indigo-500", description: "Rising progesterone. Prepare for rest." },
  ];

  return (
    <div className="bg-gradient-to-b from-purple-900/10 to-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            🌸 Hormone Symptom Mapping
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Click on a symptom to understand which hormones might be involved and what labs to consider.
          </p>
        </motion.div>

        {/* Symptom Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {symptomMappings.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => setActiveSymptom(activeSymptom === item.id ? null : item.id)}
                className={`w-full text-left p-6 rounded-2xl border transition-all ${
                  activeSymptom === item.id
                    ? "bg-purple-500/20 border-purple-500/50"
                    : "bg-black/40 border-purple-500/20 hover:border-purple-500/40"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="text-lg font-semibold text-white">{item.symptom}</h3>
                  </div>
                  {activeSymptom === item.id ? (
                    <FiChevronUp className="text-purple-400" />
                  ) : (
                    <FiChevronDown className="text-gray-500" />
                  )}
                </div>
                
                <AnimatePresence>
                  {activeSymptom === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-purple-500/20 space-y-4">
                        <div>
                          <p className="text-purple-300 text-sm font-medium mb-2">Related Hormones:</p>
                          <div className="flex flex-wrap gap-2">
                            {item.relatedHormones.map((h) => (
                              <span key={h} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                                {h}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-purple-300 text-sm font-medium mb-2">Possible Causes:</p>
                          <ul className="space-y-1">
                            {item.possibleCauses.map((cause) => (
                              <li key={cause} className="text-gray-400 text-sm flex items-start gap-2">
                                <FiCheck className="text-purple-400 mt-1 flex-shrink-0" />
                                {cause}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="text-purple-300 text-sm font-medium mb-2">Labs to Consider:</p>
                          <div className="flex flex-wrap gap-2">
                            {item.labsToConsider.map((lab) => (
                              <span key={lab} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                                {lab}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                          <p className="text-purple-200 text-sm">
                            <span className="font-medium">💡 Harmony's Tip:</span> {item.harmonyTip}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Cycle Awareness */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-black/40 border border-purple-500/20 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            📅 Cycle Phase Awareness
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            {cyclePhases.map((phase) => (
              <div key={phase.phase} className="text-center">
                <div className={`w-16 h-16 ${phase.color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                  <span className="text-white font-bold">{phase.days.split(" ")[1]}</span>
                </div>
                <h4 className="text-white font-semibold mb-1">{phase.phase}</h4>
                <p className="text-gray-500 text-xs mb-2">{phase.days}</p>
                <p className="text-gray-400 text-sm">{phase.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// =============================================================================
// PEPPI TOOLS SECTION - Men's Hormone & Peptide Interactive Tools
// =============================================================================

function PeppiToolsSection() {
  const [activePeptide, setActivePeptide] = useState<string | null>(null);

  const peptideEducation = [
    {
      id: "bpc157",
      name: "BPC-157",
      category: "Healing",
      icon: "🩹",
      whatItIs: "A peptide derived from a protein found in gastric juice. Promotes tissue repair and healing.",
      whatItDoes: ["Accelerates wound healing", "Supports gut health", "May help tendon/ligament repair", "Anti-inflammatory properties"],
      theHype: "Miracle healing peptide that fixes everything",
      theReality: "Promising research mostly in animal studies. Human data is limited. Generally well-tolerated but long-term effects unknown.",
      evidenceLevel: "Moderate - mostly animal studies",
      peppiVerdict: "Interesting compound with real potential, but don't believe the miracle claims. Best used short-term for specific healing goals."
    },
    {
      id: "mk677",
      name: "MK-677 (Ibutamoren)",
      category: "Growth Hormone",
      icon: "💪",
      whatItIs: "A growth hormone secretagogue that stimulates your body to produce more GH and IGF-1.",
      whatItDoes: ["Increases growth hormone", "May improve sleep quality", "Can increase appetite", "Potential muscle-sparing effects"],
      theHype: "Legal alternative to HGH that builds muscle while you sleep",
      theReality: "Does raise GH levels, but comes with water retention, increased hunger, and potential blood sugar issues. Not a magic muscle builder.",
      evidenceLevel: "Moderate - human studies exist",
      peppiVerdict: "It works for raising GH, but side effects are real. Not for everyone, especially if you have blood sugar concerns."
    },
    {
      id: "pt141",
      name: "PT-141 (Bremelanotide)",
      category: "Sexual Health",
      icon: "🔥",
      whatItIs: "A melanocortin receptor agonist that works in the brain to influence sexual desire.",
      whatItDoes: ["May increase libido", "Works differently than PDE5 inhibitors", "Affects desire, not just mechanics", "FDA-approved version exists (Vyleesi)"],
      theHype: "The 'desire drug' that makes you want it",
      theReality: "Can cause nausea, flushing, and headaches. Effects vary significantly person to person. Not a guaranteed fix.",
      evidenceLevel: "High - FDA approved (female version)",
      peppiVerdict: "One of the few peptides with solid evidence. Worth discussing with a doctor if other options haven't worked."
    },
    {
      id: "sermorelin",
      name: "Sermorelin",
      category: "Growth Hormone",
      icon: "📈",
      whatItIs: "A GHRH analog that stimulates your pituitary to release its own growth hormone.",
      whatItDoes: ["Stimulates natural GH production", "More physiological than injecting GH", "May improve sleep", "Potential anti-aging benefits"],
      theHype: "The safe, legal way to boost growth hormone naturally",
      theReality: "Works more gently than synthetic GH. Results take time. Not as dramatic as direct GH injection.",
      evidenceLevel: "Moderate-High - prescription use",
      peppiVerdict: "Good option for those wanting to optimize GH naturally. Patience required - this isn't a quick fix."
    },
  ];

  const hormoneMythBusters = [
    {
      myth: "More testosterone = more muscle automatically",
      reality: "Testosterone helps, but training, nutrition, and genetics matter more. Super-physiological levels have diminishing returns and more side effects.",
      icon: "💪"
    },
    {
      myth: "TRT will shrink your testicles permanently",
      reality: "HCG can maintain testicular size and function during TRT. Proper protocols minimize this concern.",
      icon: "🔬"
    },
    {
      myth: "Natural testosterone boosters work as well as TRT",
      reality: "Most OTC 'testosterone boosters' have minimal effect on actual testosterone levels. Don't confuse marketing with medicine.",
      icon: "💊"
    },
    {
      myth: "Peptides are completely safe because they're 'natural'",
      reality: "Peptides can have real effects and real side effects. Natural doesn't mean harmless. Quality and dosing matter enormously.",
      icon: "⚠️"
    },
  ];

  return (
    <div className="bg-gradient-to-b from-cyan-900/10 to-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            🧪 Peptide Education Center
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Cut through the TikTok hype. Here's what the science actually says about popular peptides.
          </p>
        </motion.div>

        {/* Peptide Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {peptideEducation.map((peptide) => (
            <motion.div
              key={peptide.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => setActivePeptide(activePeptide === peptide.id ? null : peptide.id)}
                className={`w-full text-left p-6 rounded-2xl border transition-all ${
                  activePeptide === peptide.id
                    ? "bg-cyan-500/20 border-cyan-500/50"
                    : "bg-black/40 border-cyan-500/20 hover:border-cyan-500/40"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{peptide.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{peptide.name}</h3>
                      <span className="text-cyan-400 text-sm">{peptide.category}</span>
                    </div>
                  </div>
                  {activePeptide === peptide.id ? (
                    <FiChevronUp className="text-cyan-400" />
                  ) : (
                    <FiChevronDown className="text-gray-500" />
                  )}
                </div>
                
                <AnimatePresence>
                  {activePeptide === peptide.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-cyan-500/20 space-y-4">
                        <div>
                          <p className="text-cyan-300 text-sm font-medium mb-2">What It Is:</p>
                          <p className="text-gray-400 text-sm">{peptide.whatItIs}</p>
                        </div>
                        
                        <div>
                          <p className="text-cyan-300 text-sm font-medium mb-2">What It Does:</p>
                          <ul className="space-y-1">
                            {peptide.whatItDoes.map((item) => (
                              <li key={item} className="text-gray-400 text-sm flex items-start gap-2">
                                <FiCheck className="text-cyan-400 mt-1 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-red-500/10 rounded-xl p-3 border border-red-500/20">
                            <p className="text-red-300 text-xs font-medium mb-1">🚨 The Hype:</p>
                            <p className="text-gray-400 text-sm">{peptide.theHype}</p>
                          </div>
                          <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/20">
                            <p className="text-green-300 text-xs font-medium mb-1">✅ The Reality:</p>
                            <p className="text-gray-400 text-sm">{peptide.theReality}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-cyan-300 text-sm font-medium">Evidence Level:</span>
                          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
                            {peptide.evidenceLevel}
                          </span>
                        </div>

                        <div className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-500/20">
                          <p className="text-cyan-200 text-sm">
                            <span className="font-medium">🧪 Peppi's Verdict:</span> {peptide.peppiVerdict}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Myth Busters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-black/40 border border-cyan-500/20 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            ⚡ Hormone Myth Busters
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {hormoneMythBusters.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-5 border border-cyan-500/20">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-red-400 text-sm font-medium">Myth:</p>
                    <p className="text-white font-medium">{item.myth}</p>
                  </div>
                </div>
                <div className="ml-10">
                  <p className="text-green-400 text-sm font-medium">Reality:</p>
                  <p className="text-gray-400 text-sm">{item.reality}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// =============================================================================
// BLUEPRINT INTEGRATION SECTION
// =============================================================================

function BlueprintIntegrationSection() {
  return (
    <div className="bg-gray-900/30 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            How This Fits Your Blueprint
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Your hormone insights connect directly to your health blueprint for a complete picture.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Harmony Blueprint */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/30 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600">
                <span className="text-2xl">🌸</span>
              </div>
              <h3 className="text-xl font-semibold text-purple-300">Women's Hormone Blueprint</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-purple-400 text-lg">📊</span>
                <div>
                  <p className="text-white font-medium">Symptom-Lab Integration</p>
                  <p className="text-gray-400 text-sm">Track symptoms alongside lab results for pattern recognition</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 text-lg">🔄</span>
                <div>
                  <p className="text-white font-medium">Cycle Phase Recommendations</p>
                  <p className="text-gray-400 text-sm">Get personalized insights based on your cycle phase</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 text-lg">🎯</span>
                <div>
                  <p className="text-white font-medium">Personalized Goals</p>
                  <p className="text-gray-400 text-sm">Set and track hormone optimization goals over time</p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Peppi Blueprint */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                <span className="text-2xl">🧪</span>
              </div>
              <h3 className="text-xl font-semibold text-cyan-300">Men's Peptide Blueprint</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 text-lg">🧬</span>
                <div>
                  <p className="text-white font-medium">Evidence-Based Tracking</p>
                  <p className="text-gray-400 text-sm">Log protocols with scientific context and expected outcomes</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 text-lg">📈</span>
                <div>
                  <p className="text-white font-medium">Hormone Trend Analysis</p>
                  <p className="text-gray-400 text-sm">Visualize testosterone, GH markers, and metabolic indicators</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 text-lg">⚖️</span>
                <div>
                  <p className="text-white font-medium">Risk-Benefit Analysis</p>
                  <p className="text-gray-400 text-sm">Understand tradeoffs with clear, honest information</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
