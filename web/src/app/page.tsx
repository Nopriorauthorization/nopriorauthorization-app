"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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

const APP_URL = "https://app.nopriorauthorization.com";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* HERO SECTION - The Hook */}
      <HeroSection />

      {/* SOCIAL PROOF BAR - Quick credibility */}
      <SocialProofBar />

      {/* PAIN SECTION - The Problem */}
      <PainSection />

      {/* SOLUTION SECTION - The Answer */}
      <SolutionSection />

      {/* PRODUCT DEMO - Visual walkthrough */}
      <ProductDemoSection />

      {/* FEATURES SECTION - What You Get */}
      <FeaturesSection />

      {/* MASCOTS SECTION - Your AI Team */}
      <MascotsSection />

      {/* TESTIMONIALS - Real stories */}
      <TestimonialsSection />

      {/* TRANSFORMATION SECTION - Before/After */}
      <TransformationSection />

      {/* PRICING SECTION - Clear value */}
      <PricingSection />

      {/* FAQ SECTION - Handle objections */}
      <FAQSection />

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
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/nopriornew.png"
              alt="No Prior Authorization"
              className="h-16 md:h-20 w-auto"
            />
          </div>

          {/* Pre-headline */}
          <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
            THE HEALTHCARE SYSTEM WASN&apos;T BUILT FOR YOU
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
            Your questions go unanswered. <span className="text-white font-semibold">It&apos;s time to take control.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href={`${APP_URL}/vault`}
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
            Healthcare was designed for hospitals, not for you. You&apos;re expected to be your own coordinator, 
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
              Map your family&apos;s health patterns. Understand inherited risks. 
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
              Nothing You Don&apos;t.
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
    { id: "decode", name: "Decode", role: "Lab Intelligence", color: "from-blue-500 to-indigo-500", href: `${APP_URL}/vault/lab-decoder` },
    { id: "root", name: "Root", role: "Family Patterns", color: "from-green-500 to-emerald-500", href: `${APP_URL}/family-health` },
    { id: "harmony", name: "Harmony", role: "Hormone Health", color: "from-purple-500 to-violet-500", href: `${APP_URL}/hormones` },
    { id: "peppi", name: "Peppi", role: "Peptide Science", color: "from-cyan-500 to-blue-500", href: `${APP_URL}/hormones` },
    { id: "slim-t", name: "Slim-T", role: "Weight & Metabolism", color: "from-red-500 to-orange-500", href: `${APP_URL}/weight-management` },
    { id: "beau-tox", name: "Beau-Tox", role: "Aesthetics", color: "from-yellow-400 to-amber-500", href: `${APP_URL}/aesthetics` },
    { id: "filla-grace", name: "Filla-Grace", role: "Fillers & Beauty", color: "from-pink-500 to-rose-500", href: `${APP_URL}/aesthetics` },
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
            Ask questions you&apos;d never ask a doctor. Get answers that actually make sense.
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
            href={`${APP_URL}/chat`}
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
// SOCIAL PROOF BAR - Quick credibility indicators
// =============================================================================

function SocialProofBar() {
  return (
    <section className="py-8 px-6 border-y border-white/5 bg-white/[0.02]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">10,000+</div>
            <div className="text-sm text-gray-500">Health Records Secured</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">50,000+</div>
            <div className="text-sm text-gray-500">Labs Decoded</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">4.9/5</div>
            <div className="text-sm text-gray-500">User Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">HIPAA</div>
            <div className="text-sm text-gray-500">Compliant</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// PRODUCT DEMO SECTION - Visual walkthrough
// =============================================================================

function ProductDemoSection() {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      title: "Upload Your Records",
      description: "Drag and drop any medical document. We accept PDFs, images, and photos of paperwork.",
      visual: "📤",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "AI Decodes Everything",
      description: "Our AI reads your documents, extracts key information, and explains it in plain English.",
      visual: "🤖",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Build Your Blueprint",
      description: "Watch as your health picture comes together. See patterns. Spot connections.",
      visual: "📊",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Share With Anyone",
      description: "Generate provider packets, share with family, or export everything—you're in control.",
      visual: "🔗",
      color: "from-orange-500 to-red-500",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-black via-blue-950/10 to-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            See How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            From scattered records to complete health picture in minutes.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Steps list */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.button
                key={step.title}
                onClick={() => setActiveStep(index)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                  activeStep === index
                    ? "bg-white/10 border-white/20"
                    : "bg-white/5 border-white/10 hover:bg-white/[0.07]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </div>
                </div>
                {/* Progress bar */}
                {activeStep === index && (
                  <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4, ease: "linear" }}
                      className={`h-full bg-gradient-to-r ${step.color}`}
                    />
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Visual display */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className={`aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br ${steps[activeStep].color} p-1`}>
              <div className="w-full h-full rounded-3xl bg-black/90 flex items-center justify-center">
                <div className="text-center p-8">
                  <span className="text-8xl mb-6 block">{steps[activeStep].visual}</span>
                  <h3 className="text-2xl font-bold text-white mb-2">{steps[activeStep].title}</h3>
                  <p className="text-gray-400">{steps[activeStep].description}</p>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${steps[activeStep].color} rounded-full blur-2xl opacity-50`} />
            <div className={`absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br ${steps[activeStep].color} rounded-full blur-2xl opacity-30`} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// TESTIMONIALS SECTION
// =============================================================================

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "I finally understand my lab results. For the first time in my life, I walked into my doctor's appointment knowing exactly what questions to ask.",
      name: "Sarah M.",
      title: "Mom of 3, Managing Thyroid Issues",
      avatar: "👩",
      rating: 5,
    },
    {
      quote: "After my dad passed, I realized I had no idea about our family health history. This tool helped me map everything out for my kids' future.",
      name: "Michael T.",
      title: "Father, Building Family Health Tree",
      avatar: "👨",
      rating: 5,
    },
    {
      quote: "The AI specialists don't judge. I asked questions I was too embarrassed to ask my doctor. Game changer for my weight journey.",
      name: "Jennifer L.",
      title: "Lost 45 lbs with Slim-T Guidance",
      avatar: "👩‍🦰",
      rating: 5,
    },
    {
      quote: "I have records from 12 different providers over 20 years. Now they're all in one place, organized, and I can actually find things.",
      name: "Robert K.",
      title: "Retired, Managing Multiple Conditions",
      avatar: "👴",
      rating: 5,
    },
    {
      quote: "My daughter uses this to track her hormone health. As her mom, I love that she's taking control of her health education.",
      name: "Patricia D.",
      title: "Mother Supporting Daughter's Health",
      avatar: "👩‍🦳",
      rating: 5,
    },
    {
      quote: "The provider packet feature saved my life. New specialist had my complete history before I even walked in. No more repeating myself.",
      name: "David W.",
      title: "Chronic Illness Warrior",
      avatar: "🧔",
      rating: 5,
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
            Real People.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Real Results.
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Thousands of people have taken control of their health journey. Here&apos;s what they&apos;re saying.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-gray-300 mb-6 leading-relaxed">&quot;{testimonial.quote}&quot;</p>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// PRICING SECTION
// =============================================================================

function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Get started with the basics",
      features: [
        "Secure document storage (up to 50)",
        "Basic lab decoder (5/month)",
        "Health timeline view",
        "1 AI specialist chat",
        "Family tree (up to 10 members)",
      ],
      cta: "Start Free",
      href: `${APP_URL}/signup`,
      highlighted: false,
    },
    {
      name: "Core",
      price: "$19",
      period: "/month",
      description: "For individuals taking control",
      features: [
        "Unlimited document storage",
        "Unlimited lab decoding",
        "Full health blueprint",
        "All 7 AI specialists",
        "Unlimited family tree",
        "Provider packet generator",
        "Priority support",
      ],
      cta: "Start 14-Day Trial",
      href: `${APP_URL}/signup?plan=core`,
      highlighted: true,
      badge: "MOST POPULAR",
    },
    {
      name: "Family",
      price: "$49",
      period: "/month",
      description: "For families who care",
      features: [
        "Everything in Core",
        "Up to 5 family accounts",
        "Shared family health tree",
        "Trusted circle access",
        "Family health reports",
        "Caregiver dashboard",
        "Dedicated support",
      ],
      cta: "Start Family Trial",
      href: `${APP_URL}/signup?plan=family`,
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 px-6 bg-gradient-to-b from-black via-purple-950/10 to-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, Honest Pricing
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            No hidden fees. No surprise charges. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-3xl p-8 ${
                plan.highlighted
                  ? "bg-gradient-to-b from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-semibold">
                  {plan.badge}
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <p className="text-gray-400 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <FiCheck className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-purple-400" : "text-green-400"}`} />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full py-4 rounded-xl font-semibold text-center transition-all ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-500 mt-12"
        >
          All plans include HIPAA-compliant security, data encryption, and the ability to export your data anytime.
        </motion.p>
      </div>
    </section>
  );
}

// =============================================================================
// FAQ SECTION
// =============================================================================

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is my health data really private and secure?",
      answer: "Absolutely. We use bank-level encryption (AES-256) for all data at rest and in transit. We're HIPAA-compliant, meaning we meet the strictest healthcare privacy standards. We never sell your data, never share it with third parties, and you can delete everything at any time. Your data is yours—period.",
    },
    {
      question: "How is this different from my patient portal?",
      answer: "Patient portals only show you records from ONE provider. No Prior Authorization brings ALL your records together—every doctor, every hospital, every lab—into one searchable, organized system. Plus, we give you AI tools to actually understand what your records mean.",
    },
    {
      question: "What if I'm not tech-savvy?",
      answer: "We designed this for real people, not engineers. Upload a document by taking a photo with your phone. Ask questions in plain English. Our AI explains everything like a friend would—no medical jargon, no confusing terms. If you can send a text, you can use No Prior Authorization.",
    },
    {
      question: "Can I share my records with my doctor?",
      answer: "Yes! Generate a professional 'Provider Packet' with one click. It creates a clean summary of your health history, current medications, family history, and any specific concerns—perfect for any appointment. You can share it via secure link or download as a PDF.",
    },
    {
      question: "What about my family's health information?",
      answer: "The Family Health Tree feature lets you map conditions across generations—parents, grandparents, siblings. This helps you and your doctors understand inherited risks. You can also invite family members to their own accounts and share relevant information through our Trusted Circle feature.",
    },
    {
      question: "Are the AI specialists replacing real doctors?",
      answer: "No, and that's important. Our AI specialists help you understand health topics, decode medical jargon, and prepare better questions for your real doctors. They provide education and awareness, not diagnoses or treatment plans. Think of them as health-literate friends who are always available.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, with no penalties or hidden fees. Cancel your subscription anytime from your account settings. If you cancel, you'll keep access until the end of your billing period, and you can always export all your data before you go.",
    },
    {
      question: "What happens to my data if I stop using the service?",
      answer: "Your data remains secure and accessible even on the free plan. If you choose to delete your account, we permanently remove all your data within 30 days. Before deleting, you can export everything in standard formats (PDF, JSON) so you never lose your health history.",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Questions? We&apos;ve Got{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              Answers.
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to know before getting started.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="border border-white/10 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <span className="font-semibold text-white pr-8">{faq.question}</span>
                <span className={`text-2xl text-pink-400 transition-transform ${openIndex === index ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6"
                >
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-4">Still have questions?</p>
          <Link
            href={`${APP_URL}/chat`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-all"
          >
            <FiMessageCircle className="w-5 h-5" />
            Chat with our team
          </Link>
        </motion.div>
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
            We&apos;re not a hospital. We&apos;re not an insurance company. We&apos;re healthcare workers 
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
              Get answers to the questions you&apos;ve been afraid to ask.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`${APP_URL}/signup`}
                className="group px-8 py-4 bg-white text-black rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Started Free
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={`${APP_URL}/vault`}
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
              <li><Link href={`${APP_URL}/vault`} className="hover:text-white transition">Sacred Vault</Link></li>
              <li><Link href={`${APP_URL}/blueprint`} className="hover:text-white transition">Health Blueprint</Link></li>
              <li><Link href={`${APP_URL}/family-health`} className="hover:text-white transition">Family Tree</Link></li>
              <li><Link href={`${APP_URL}/vault/lab-decoder`} className="hover:text-white transition">Lab Decoder</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">AI Specialists</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href={`${APP_URL}/hormones`} className="hover:text-white transition">Harmony & Peppi</Link></li>
              <li><Link href={`${APP_URL}/weight-management`} className="hover:text-white transition">Slim-T</Link></li>
              <li><Link href={`${APP_URL}/aesthetics`} className="hover:text-white transition">Beau-Tox & Filla-Grace</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
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
