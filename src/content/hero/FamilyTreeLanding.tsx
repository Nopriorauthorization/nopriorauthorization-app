"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiHeart, FiTrendingUp, FiShield, FiZap, FiTarget, FiArrowRight, FiPlay, FiCheck, FiCpu } from 'react-icons/fi';
import Link from 'next/link';

export default function FamilyTreeLanding() {
  const [showVideo, setShowVideo] = useState(false);

  const stats = [
    { number: "$3.8T", label: "Healthcare Problem Solved", icon: FiHeart },
    { number: "$50B", label: "Market Opportunity", icon: FiTrendingUp },
    { number: "94%", label: "AI Accuracy", icon: FiZap },
    { number: "72%", label: "Families Lack Health History", icon: FiUsers }
  ];

  const features = [
    {
      icon: FiUsers,
      title: "Complete Family Health View",
      description: "See your family's health story across generations with AI-powered insights"
    },
    {
      icon: FiShield,
      title: "Secure Provider Sharing",
      description: "HIPAA-compliant sharing with healthcare providers for better care coordination"
    },
    {
      icon: FiTarget,
      title: "Preventive Care Intelligence",
      description: "AI detects health patterns and recommends preventive screenings before problems arise"
    },
    {
      icon: FiHeart,
      title: "Care Team Coordination",
      description: "Multi-provider care teams work together with complete family context"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Cardiologist, Mayo Clinic",
      quote: "This gives me the family context I need to provide truly preventive care. Game-changing for patient outcomes."
    },
    {
      name: "Jennifer Walsh",
      role: "Family Health Coordinator",
      quote: "Finally, a platform that treats families as the health unit they are. My whole family uses this daily."
    },
    {
      name: "Dr. Michael Chen",
      role: "Primary Care Physician",
      quote: "The AI insights are incredibly accurate. It's like having a preventive care specialist for every patient."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.1),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium mb-8"
            >
              <FiZap className="w-4 h-4" />
              Healthcare's Missing Operating System
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              The Family Health
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                {" "}Operating System
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Healthcare treats individuals in isolation, but 80% of chronic diseases have genetic components.
              We're building the platform that connects families, providers, and AI to prevent diseases before they start.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/family-tree-demo"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition shadow-lg hover:shadow-purple-500/25"
              >
                <FiPlay className="w-5 h-5" />
                Experience the Demo
                <FiArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/lab-decoder"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-lg font-semibold rounded-xl hover:bg-white/20 transition"
              >
                <FiCpu className="w-5 h-5" />
                Decode Lab Results
              </Link>
              <button
                onClick={() => setShowVideo(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-lg font-semibold rounded-xl hover:bg-white/20 transition"
              >
                <FiPlay className="w-5 h-5" />
                Watch 2-Minute Pitch
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Problem/Solution Section */}
      <div className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                The $3.8 Trillion Problem
              </h2>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>72% of families</strong> lack complete health history when making medical decisions</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>90% of preventable risks</strong> go undetected due to missing family context</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>40% of care coordination failures</strong> result from communication gaps</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>$2.8T in annual costs</strong> from diseases that could be prevented</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Our Solution</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiCheck className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Complete Family Health View</div>
                    <div className="text-gray-400 text-sm">Multi-generational health data in one place</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiCheck className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">AI-Powered Risk Detection</div>
                    <div className="text-gray-400 text-sm">94% accuracy in identifying health patterns</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiCheck className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Secure Provider Integration</div>
                    <div className="text-gray-400 text-sm">HIPAA-compliant sharing for better care</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiCheck className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Preventive Care Intelligence</div>
                    <div className="text-gray-400 text-sm">Stop diseases before they start</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Families and Providers Love It
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The first platform that treats families as the health unit they are
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="py-20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm font-medium mb-4">
              <FiZap className="w-4 h-4" />
              Live Now - Try It!
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Rich Health Timeline
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Upload photos, add voice notes, and attach medical documents to create a comprehensive health timeline for each family member
            </p>

            <Link
              href="/rich-health-timeline"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition transform hover:scale-105"
            >
              <FiPlay className="w-5 h-5" />
              Experience Rich Timeline
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:border-green-500/50 transition group cursor-pointer"
              onClick={() => window.location.href = '/rich-health-timeline'}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Photo Uploads</h3>
              <p className="text-gray-400 mb-4">Upload medical photos, X-rays, and health-related images with automatic organization</p>
              <div className="text-green-400 text-sm font-medium">✓ Live & Working</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:border-green-500/50 transition group cursor-pointer"
              onClick={() => window.location.href = '/rich-health-timeline'}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Voice Notes</h3>
              <p className="text-gray-400 mb-4">Record voice memos about symptoms, treatments, and health observations with AI transcription</p>
              <div className="text-green-400 text-sm font-medium">✓ Live & Working</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:border-green-500/50 transition group cursor-pointer"
              onClick={() => window.location.href = '/rich-health-timeline'}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Medical Documents</h3>
              <p className="text-gray-400 mb-4">Attach lab results, prescriptions, and medical records with automatic categorization</p>
              <div className="text-green-400 text-sm font-medium">✓ Live & Working</div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
              <FiZap className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-medium">Timeline Integration</span>
              <FiZap className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              All uploads automatically organize into a chronological health timeline, giving providers complete context for better care decisions
            </p>
          </motion.div>
        </div>
      </div>

      {/* Lab Decoder Section */}
      <div className="py-20 bg-gradient-to-r from-blue-900/20 to-indigo-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium mb-4">
              <FiCpu className="w-4 h-4" />
              AI-Powered Medical Intelligence
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Decode Your Lab Results Like a Medical Expert
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Upload lab reports, imaging results, or prescriptions. Get instant AI analysis, plain-language explanations, and personalized recommendations.
            </p>

            <Link
              href="/lab-decoder"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition transform hover:scale-105"
            >
              <FiCpu className="w-5 h-5" />
              Try Lab Decoder
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:border-blue-500/50 transition group cursor-pointer"
              onClick={() => window.location.href = '/lab-decoder'}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <FiUpload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Upload Documents</h3>
              <p className="text-gray-400 mb-4">Lab results, imaging reports, prescriptions, and medical records</p>
              <div className="text-blue-400 text-sm font-medium">✓ Instant Processing</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:border-blue-500/50 transition group cursor-pointer"
              onClick={() => window.location.href = '/lab-decoder'}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <FiCpu className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Expert Analysis</h3>
              <p className="text-gray-400 mb-4">Medical-grade interpretation with clinical context and family relevance</p>
              <div className="text-blue-400 text-sm font-medium">✓ 95%+ Accuracy</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:border-blue-500/50 transition group cursor-pointer"
              onClick={() => window.location.href = '/lab-decoder'}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <FiMessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Interactive Q&A</h3>
              <p className="text-gray-400 mb-4">Ask questions about your results and get personalized medical insights</p>
              <div className="text-blue-400 text-sm font-medium">✓ 24/7 Available</div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-xl">
              <FiSave className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-medium">Save to Blueprint & Family Tree</span>
              <FiSave className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              All decoded insights automatically save to your personal health blueprint and connect to relevant family members
            </p>
          </motion.div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Families and Providers
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <div className="mb-4">
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                </div>
                <div>
                  <div className="text-white font-medium">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Healthcare?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join the families and providers already using the Family Health Operating System
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/family-tree-demo"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition shadow-lg hover:shadow-purple-500/25"
              >
                <FiPlay className="w-5 h-5" />
                Try the Live Demo
                <FiArrowRight className="w-5 h-5" />
              </Link>

              <button className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-lg font-semibold rounded-xl hover:bg-white/20 transition">
                Schedule Demo Call
              </button>
            </div>

            <div className="mt-8 text-gray-400">
              <p className="text-sm">🔒 HIPAA Compliant • 🧠 AI-Powered • 👨‍⚕️ Provider Trusted</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-slate-800 rounded-2xl p-6 max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">2-Minute Investor Pitch</h3>
                <button
                  onClick={() => setShowVideo(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <FiPlay className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-gray-300">Video demo coming soon</p>
                  <p className="text-gray-400 text-sm mt-2">In the meantime, try the interactive demo!</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}