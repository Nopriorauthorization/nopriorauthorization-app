"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FiShield,
  FiUsers,
  FiArrowRight,
  FiCheck,
  FiLock,
  FiUpload,
  FiShare2,
  FiClock,
  FiDownload,
  FiAlertCircle,
} from "react-icons/fi";

// =============================================================================
// NPA LANDING PAGE
// "Your health history. Owned by you."
//
// Core message: Patient-owned health identity and record continuity
// that works TODAY without provider adoption.
// =============================================================================

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <FeaturesSection />
      <DifferentiatorSection />
      <TrustSection />
      <CTASection />
      <Footer />
    </div>
  );
}

// =============================================================================
// HERO SECTION - The Hook
// =============================================================================

function HeroSection() {
  const [currentProblem, setCurrentProblem] = useState(0);
  const problems = [
    "scattered across 10 providers",
    "locked in patient portals",
    "lost when you switch doctors",
    "impossible to share",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProblem((prev) => (prev + 1) % problems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600">
              <span className="text-3xl font-bold text-white">NPA</span>
            </div>
          </div>

          {/* Pre-headline */}
          <p className="text-purple-400 text-lg md:text-xl font-medium mb-6 tracking-wide uppercase">
            No Prior Authorization
          </p>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Your health history.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              Owned by you.
            </span>
          </h1>

          {/* Problem statement */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-4">
            Your medical records are{" "}
            <span className="relative inline-block min-w-[280px]">
              <motion.span
                key={currentProblem}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400"
              >
                {problems[currentProblem]}
              </motion.span>
            </span>
          </p>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
            One secure vault. One health ID. Share with any provider instantly.
            <span className="text-white font-semibold"> No app for them to download. No permission needed.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/signup"
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Get Your NPA Health ID
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
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <FiShield className="text-blue-400" />
              <span>HIPAA-Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <FiDownload className="text-purple-400" />
              <span>Export Anytime</span>
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
            className="w-1.5 h-1.5 bg-purple-400 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}

// =============================================================================
// PROBLEM SECTION - The pain
// =============================================================================

function ProblemSection() {
  const problems = [
    {
      icon: "📋",
      title: "Fragmented Records",
      description: "Your health story is spread across 10+ providers. Each one sees only their piece. Nobody sees the whole picture.",
      stat: "10+",
      statLabel: "avg providers per patient",
    },
    {
      icon: "🔒",
      title: "Locked Away",
      description: "Patient portals trap your data. Good luck getting records from a hospital you visited 5 years ago.",
      stat: "73%",
      statLabel: "struggle accessing records",
    },
    {
      icon: "📞",
      title: "Phone Tag",
      description: "New doctor? Prepare for weeks of faxes, phone calls, and release forms. It's 2026.",
      stat: "3-6",
      statLabel: "weeks to transfer records",
    },
    {
      icon: "🚑",
      title: "Emergency Gaps",
      description: "In an emergency, your allergies and medications are in 5 different systems. None of them talk to each other.",
      stat: "250K",
      statLabel: "deaths from medical errors/year",
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
            Healthcare was built for institutions, not for you. Your records are their asset, not yours.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-red-500/20 rounded-2xl p-8 hover:border-red-500/40 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-4xl">{problem.icon}</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-400">{problem.stat}</div>
                  <div className="text-xs text-gray-500">{problem.statLabel}</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{problem.title}</h3>
              <p className="text-gray-400 leading-relaxed">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SOLUTION SECTION - The answer
// =============================================================================

function SolutionSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-purple-400 text-lg font-medium mb-4">THE SOLUTION</p>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            One ID. One Vault.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              Complete Control.
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your NPA Health ID is a patient-owned identity that follows you across every provider,
            every system, your entire life.
          </p>
        </motion.div>

        {/* Three pillars */}
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-8 bg-white/5 rounded-2xl border border-white/10"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <FiShield className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Your Health Vault</h3>
            <p className="text-gray-400">
              Upload records from anywhere. MyChart, hospital PDFs, lab results, images.
              One secure place that you control.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center p-8 bg-white/5 rounded-2xl border border-white/10"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
              <FiShare2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Share Instantly</h3>
            <p className="text-gray-400">
              Generate a secure link. Send to any provider.
              They view your records without creating an account. Revoke anytime.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center p-8 bg-white/5 rounded-2xl border border-white/10"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <FiClock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Lifetime Continuity</h3>
            <p className="text-gray-400">
              Your health timeline grows with every visit. Providers can add to your record.
              Your history follows you forever.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// HOW IT WORKS SECTION
// =============================================================================

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Get Your NPA Health ID",
      description: "Sign up in 30 seconds. Your unique, immutable health identifier is created instantly.",
      icon: FiUsers,
      color: "from-purple-500 to-indigo-500",
    },
    {
      number: "02",
      title: "Upload Your Records",
      description: "Drag and drop PDFs from MyChart, photos of documents, anything. We organize it into a timeline.",
      icon: FiUpload,
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "03",
      title: "Share With Anyone",
      description: "Generate a secure link. Your provider clicks it, sees your records. No account needed for them.",
      icon: FiShare2,
      color: "from-green-500 to-emerald-500",
    },
    {
      number: "04",
      title: "Build Your Timeline",
      description: "Providers can contribute visit summaries back to your vault. Your history becomes longitudinal.",
      icon: FiClock,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-gradient-to-b from-black via-purple-950/10 to-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Works in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              4 Simple Steps
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            No IT integration. No provider onboarding. Works today.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-6 p-6 bg-white/5 rounded-2xl border border-white/10"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-sm text-purple-400 font-medium mb-1">Step {step.number}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
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
      title: "Health Timeline",
      description: "Every document organized chronologically. See your complete health journey at a glance.",
      icon: "📊",
    },
    {
      title: "Document Intelligence",
      description: "We extract and organize information from your records. Medications, allergies, diagnoses—structured and searchable.",
      icon: "🔍",
    },
    {
      title: "Provider Sharing",
      description: "Generate secure links with custom permissions. Read-only, download allowed, or let them upload too.",
      icon: "🔗",
    },
    {
      title: "Provider Contributions",
      description: "With your permission, providers add visit summaries directly to your vault. One continuous record.",
      icon: "👨‍⚕️",
    },
    {
      title: "Emergency Access",
      description: "Opt-in emergency access shows critical info (allergies, medications) to first responders. Time-limited, audited.",
      icon: "🚨",
    },
    {
      title: "Full Governance",
      description: "See who accessed what, when. Revoke permissions instantly. Export everything with one click.",
      icon: "🔒",
    },
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
            Everything You Need.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              Nothing You Don't.
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all"
            >
              <span className="text-4xl mb-4 block">{feature.icon}</span>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// DIFFERENTIATOR SECTION - Why NPA is different
// =============================================================================

function DifferentiatorSection() {
  const comparisons = [
    {
      others: "Requires providers to adopt new software",
      npa: "Providers just click a link—no account needed",
    },
    {
      others: "Tries to replace hospital EMRs",
      npa: "Works alongside any system, adds value to all",
    },
    {
      others: "Data owned by the platform",
      npa: "Data owned by you—export everything anytime",
    },
    {
      others: "AI that claims to diagnose",
      npa: "Organizes information—never practices medicine",
    },
    {
      others: "Sells or monetizes health data",
      npa: "Never sells data. Patient trust isn't for sale.",
    },
    {
      others: "Requires institutional partnerships to work",
      npa: "Works today with records you already have",
    },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-black via-indigo-950/10 to-black">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why NPA Is{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              Different
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Most health tech fails because it requires providers to change.
            NPA works because patients are in control from day one.
          </p>
        </motion.div>

        <div className="space-y-4">
          {comparisons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="grid md:grid-cols-2 gap-4"
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                <span className="text-red-400 flex-shrink-0">✕</span>
                <span className="text-gray-400">{item.others}</span>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
                <FiCheck className="text-green-400 flex-shrink-0" />
                <span className="text-white">{item.npa}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// TRUST SECTION
// =============================================================================

function TrustSection() {
  const principles = [
    "Patient remains root authority",
    "No silent access, ever",
    "No PHI monetization",
    "No diagnostic claims",
    "Export anytime, leave anytime",
    "Full audit transparency",
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Built on{" "}
            <span className="text-purple-400">Trust</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We don't just talk about patient ownership. We enforce it in code.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-purple-500/20 rounded-3xl p-8 md:p-12"
        >
          <p className="text-lg text-gray-300 italic text-center mb-8">
            &quot;No Prior Authorization exists to restore continuity and patient control in healthcare.
            It does not replace clinicians, does not diagnose, and does not monetize personal health data.&quot;
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {principles.map((principle, index) => (
              <div key={index} className="flex items-center gap-3 text-gray-300">
                <FiCheck className="text-green-400 flex-shrink-0" />
                <span>{principle}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FiLock className="text-green-400" />
              <span>256-bit AES Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <FiShield className="text-blue-400" />
              <span>HIPAA-Ready Architecture</span>
            </div>
            <div className="flex items-center gap-2">
              <FiAlertCircle className="text-purple-400" />
              <span>SOC 2 Compliance Path</span>
            </div>
          </div>
        </motion.div>
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
          className="relative bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-blue-900/50 rounded-3xl p-12 md:p-16 text-center border border-white/10 overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Take Control of Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                Health Story
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get your NPA Health ID in 30 seconds. Upload your first record.
              Share with your next provider. It's that simple.
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
                href="/security"
                className="px-8 py-4 border border-white/30 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Learn About Security
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-8">
              No credit card required. Your data, your control, always.
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
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <span className="text-sm font-bold text-white">NPA</span>
              </div>
              <span className="text-xl font-bold text-white">No Prior Authorization</span>
            </div>
            <p className="text-gray-400 text-sm">
              Patient-owned health identity and record continuity.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/vault/dashboard" className="hover:text-white transition">Health Vault</Link></li>
              <li><Link href="/vault/timeline" className="hover:text-white transition">Timeline</Link></li>
              <li><Link href="/vault/governance" className="hover:text-white transition">Governance Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Trust</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/security" className="hover:text-white transition">Security & Trust</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="mailto:support@nopriorauthorization.com" className="hover:text-white transition">Contact Support</a></li>
              <li><Link href="/api/governance/policies" className="hover:text-white transition">Governance Policies</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} No Prior Authorization. All rights reserved.</p>
          <p className="mt-2">
            Built by healthcare workers who believe patients deserve to own their health story.
          </p>
        </div>
      </div>
    </footer>
  );
}
