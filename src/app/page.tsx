"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FiShield,
  FiUsers,
  FiActivity,
  FiMessageCircle,
  FiArrowRight,
  FiCheck,
  FiLock,
  FiZap,
  FiTrendingUp,
  FiHeart,
  FiStar,
} from "react-icons/fi";

// =============================================================================
// HOMEPAGE - "No Prior Authorization"
// Purpose: Make visitors FEEL the pain, SEE the solution, WANT the future
// =============================================================================

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* HERO SECTION - The Hook */}
      <HeroSection />

      {/* PAIN SECTION - The Problem */}
      <PainSection />

      {/* SOLUTION SECTION - The Answer */}
      <SolutionSection />

      {/* FEATURES SECTION - What You Get */}
      <FeaturesSection />

      {/* MASCOTS SECTION - Your AI Team */}
      <MascotsSection />

      {/* TRANSFORMATION SECTION - Before/After */}
      <TransformationSection />

      {/* TRUST SECTION - Why Trust Us */}
      <TrustSection />

      {/* CTA SECTION - Take Action */}
      <CTASection />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

// =============================================================================
// HERO SECTION
// =============================================================================

function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["dismissed", "confused", "forgotten", "ignored"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
      
      {/* Animated background orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Pre-headline */}
          <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
            THE HEALTHCARE SYSTEM WASN'T BUILT FOR YOU
          </p>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            Stop Being{" "}
            <span className="relative inline-block">
              <motion.span
                key={currentWord}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"
              >
                {words[currentWord]}
              </motion.span>
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            Your medical records are scattered. Your family history is forgotten. 
            Your questions go unanswered. <span className="text-white font-semibold">It's time to take control.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/vault"
              className="group px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Enter Your Sacred Vault
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-4 border border-white/20 rounded-full text-lg font-semibold hover:bg-white/5 transition-all duration-300"
            >
              See How It Works
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <FiLock className="text-green-400" />
              <span>HIPAA-Ready Security</span>
            </div>
            <div className="flex items-center gap-2">
              <FiShield className="text-blue-400" />
              <span>Your Data, Your Control</span>
            </div>
            <div className="flex items-center gap-2">
              <FiZap className="text-yellow-400" />
              <span>AI-Powered Insights</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-pink-400 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}

// =============================================================================
// PAIN SECTION - Make them feel the problem
// =============================================================================

function PainSection() {
  const pains = [
    {
      icon: "📋",
      title: "Scattered Records",
      description: "Your health history is spread across 10+ providers. Good luck getting a complete picture.",
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Lost Family History",
      description: "Your grandmother had diabetes. Your uncle had heart issues. But where's that written down?",
    },
    {
      icon: "🤷",
      title: "Unanswered Questions",
      description: "\"What does this lab result mean?\" Google gives you cancer. Your doctor has 7 minutes.",
    },
    {
      icon: "💊",
      title: "Medication Confusion",
      description: "Is this interacting with that? Will anyone tell you before it's a problem?",
    },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-black via-red-950/10 to-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The System Is{" "}
            <span className="text-red-400">Broken</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Healthcare was designed for hospitals, not for you. You're expected to be your own coordinator, 
            translator, and advocate—with no tools to help.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {pains.map((pain, index) => (
            <motion.div
              key={pain.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-red-500/20 rounded-2xl p-8 hover:border-red-500/40 transition-colors"
            >
              <span className="text-4xl mb-4 block">{pain.icon}</span>
              <h3 className="text-xl font-semibold text-white mb-3">{pain.title}</h3>
              <p className="text-gray-400 leading-relaxed">{pain.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-2xl font-semibold text-white mt-16"
        >
          You deserve better. <span className="text-pink-400">You deserve control.</span>
        </motion.p>
      </div>
    </section>
  );
}

// =============================================================================
// SOLUTION SECTION - The answer
// =============================================================================

function SolutionSection() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-pink-400 text-lg font-medium mb-4">INTRODUCING</p>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            No Prior Authorization
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            One place for your health records, your family history, and AI-powered guidance 
            that actually understands you. <span className="text-white font-semibold">No waiting. No gatekeeping. No permission needed.</span>
          </p>
        </motion.div>

        {/* Three pillars */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <FiShield className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Sacred Vault</h3>
            <p className="text-gray-400">
              Every document, every record, every detail—encrypted, organized, and always accessible. 
              Your data never leaves your control.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <FiActivity className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Health Blueprint</h3>
            <p className="text-gray-400">
              See your complete health picture. Track patterns. Spot connections your doctors miss. 
              Know what questions to ask.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
              <FiUsers className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Family Intelligence</h3>
            <p className="text-gray-400">
              Map your family's health patterns. Understand inherited risks. 
              Protect your kids by knowing what runs in your blood.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// FEATURES SECTION
// =============================================================================

function FeaturesSection() {
  const features = [
    {
      icon: FiZap,
      title: "AI Lab Decoder",
      description: "Upload any lab result. Get plain-English explanations in seconds. Know what's normal, what's not, and what to do about it.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FiHeart,
      title: "Family Health Tree",
      description: "Map conditions across generations. See inherited patterns before they become your problems. Prevention starts with knowledge.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: FiMessageCircle,
      title: "AI Health Specialists",
      description: "7 AI-powered experts covering hormones, weight, aesthetics, and more. Ask anything. Get real answers. No judgment.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FiTrendingUp,
      title: "Health Timeline",
      description: "Your complete medical journey in one view. See how everything connects. Share with new providers in one click.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: FiLock,
      title: "Provider Packets",
      description: "Generate professional summaries for any appointment. Walk in prepared. Walk out informed.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: FiShield,
      title: "Trusted Circle",
      description: "Share access with family members or caregivers. They see what you allow. Nothing more, nothing less.",
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-black via-purple-950/10 to-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Nothing You Don't.
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We built the tools we wished existed when we needed them most.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300 hover:bg-white/[0.07] group"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// MASCOTS SECTION
// =============================================================================

function MascotsSection() {
  const mascots = [
    { id: "decode", name: "Decode", role: "Lab Intelligence", color: "from-blue-500 to-indigo-500", href: "/vault/lab-decoder" },
    { id: "root", name: "Root", role: "Family Patterns", color: "from-green-500 to-emerald-500", href: "/family-health" },
    { id: "harmony", name: "Harmony", role: "Hormone Health", color: "from-purple-500 to-violet-500", href: "/hormones" },
    { id: "peppi", name: "Peppi", role: "Peptide Science", color: "from-cyan-500 to-blue-500", href: "/hormones" },
    { id: "slim-t", name: "Slim-T", role: "Weight & Metabolism", color: "from-red-500 to-orange-500", href: "/weight-management" },
    { id: "beau-tox", name: "Beau-Tox", role: "Aesthetics", color: "from-yellow-400 to-amber-500", href: "/aesthetics" },
    { id: "filla-grace", name: "Filla-Grace", role: "Fillers & Beauty", color: "from-pink-500 to-rose-500", href: "/aesthetics" },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Meet Your AI Health Team
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            7 specialized AI experts. Each one trained in a specific domain. 
            Ask questions you'd never ask a doctor. Get answers that actually make sense.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {mascots.map((mascot, index) => (
            <motion.div
              key={mascot.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={mascot.href}
                className="block text-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.07] group"
              >
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${mascot.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="font-semibold text-white text-sm">{mascot.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{mascot.role}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all"
          >
            Start a Conversation
            <FiMessageCircle className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// TRANSFORMATION SECTION
// =============================================================================

function TransformationSection() {
  const before = [
    "Searching through boxes for old medical records",
    "Forgetting what medications your parents took",
    "Googling symptoms and getting terrified",
    "Showing up to appointments unprepared",
    "Feeling like you're bothering the doctor with questions",
  ];

  const after = [
    "Every record in one secure, searchable place",
    "Complete family health tree at your fingertips",
    "AI explanations you can actually understand",
    "Professional health summaries for every visit",
    "Confidence to ask the right questions",
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-black via-green-950/10 to-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Health Journey,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-green-400">
              Transformed
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2">
              <span>❌</span> Before
            </h3>
            <ul className="space-y-4">
              {before.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-400">
                  <span className="text-red-400 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-green-500/5 border border-green-500/20 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-2">
              <span>✅</span> After
            </h3>
            <ul className="space-y-4">
              {after.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <FiCheck className="text-green-400 mt-1 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// TRUST SECTION
// =============================================================================

function TrustSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Built by Patients,{" "}
            <span className="text-pink-400">For Patients</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We're not a hospital. We're not an insurance company. We're healthcare workers 
            who got tired of watching patients struggle with a broken system.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-8 bg-white/5 rounded-2xl border border-white/10"
          >
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-2">
              RN-Founded
            </div>
            <p className="text-gray-400">
              Built by a registered nurse who saw the gaps firsthand
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center p-8 bg-white/5 rounded-2xl border border-white/10"
          >
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
              100%
            </div>
            <p className="text-gray-400">
              Your data stays yours. We never sell. We never share.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center p-8 bg-white/5 rounded-2xl border border-white/10"
          >
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-2">
              HIPAA
            </div>
            <p className="text-gray-400">
              Enterprise-grade security. Your records, fully protected.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// CTA SECTION
// =============================================================================

function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-blue-900/50 rounded-3xl p-12 md:p-16 text-center border border-white/10 overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Your Health Story Deserves{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Better
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start organizing your health records today. Build your family health tree. 
              Get answers to the questions you've been afraid to ask.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="group px-8 py-4 bg-white text-black rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Started Free
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/vault"
                className="px-8 py-4 border border-white/30 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Explore the Vault
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-8">
              No credit card required. Start building your health picture in minutes.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// FOOTER
// =============================================================================

function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">No Prior Authorization</h3>
            <p className="text-gray-400 text-sm">
              Take control of your health journey. No gatekeepers. No permission needed.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/vault" className="hover:text-white transition">Sacred Vault</Link></li>
              <li><Link href="/blueprint" className="hover:text-white transition">Health Blueprint</Link></li>
              <li><Link href="/family-health" className="hover:text-white transition">Family Tree</Link></li>
              <li><Link href="/vault/lab-decoder" className="hover:text-white transition">Lab Decoder</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">AI Specialists</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/hormones" className="hover:text-white transition">Harmony & Peppi</Link></li>
              <li><Link href="/weight-management" className="hover:text-white transition">Slim-T</Link></li>
              <li><Link href="/aesthetics" className="hover:text-white transition">Beau-Tox & Filla-Grace</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/science" className="hover:text-white transition">Our Science</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} No Prior Authorization. All rights reserved.</p>
          <p className="mt-2">Built with 💜 by healthcare workers who believe patients deserve better.</p>
        </div>
      </div>
    </footer>
  );
}
