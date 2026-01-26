"use client";
export const dynamic = 'force-dynamic';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  FiLock,
  FiUpload,
  FiFile,
  FiUsers,
  FiShield,
  FiArrowRight,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiHeart,
  FiActivity
} from 'react-icons/fi';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function VaultPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Vault Hero */}
        <div className="mb-16">
          <Breadcrumb className="mb-6" />
          <div className="text-center">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Sacred Vault
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your secure, intelligent command center for all health data. AI-powered insights, predictive analytics, and comprehensive care coordination in one HIPAA-compliant platform.
            </p>

            <div className="flex items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                <FiShield className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">🔒 HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <FiActivity className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">🧠 AI-Powered Intelligence</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lab Decoder Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                    <FiActivity className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-bold text-white">Lab Decoder</h2>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Transform complex lab results into clear, actionable insights. Our AI analyzes your biomarkers, explains what they mean, and provides personalized recommendations for optimal health.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full">
                    <FiCheckCircle className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-400 text-sm">AI Interpretation</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                    <FiTrendingUp className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 text-sm">Trend Analysis</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
                    <FiHeart className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-sm">Health Optimization</span>
                  </div>
                </div>

                <Link
                  href="/vault/labs"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  <span>Decode Your Labs</span>
                  <FiArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <Image
                    src="/mascots/LABDECODERMASCOT.PNG"
                    alt="Lab Decoder Mascot - Your AI lab interpretation guide"
                    width={400}
                    height={400}
                    className="rounded-2xl shadow-2xl"
                    priority
                  />
                  <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg">
                    🧪 Lab Expert
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Root Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="relative bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10 border border-emerald-500/30 rounded-3xl p-8 lg:p-12 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-green-400/5 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-400/10 to-emerald-400/5 rounded-full blur-2xl translate-y-24 -translate-x-24"></div>

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25">
                    <FiUsers className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-white">Root</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"></div>
                      <span className="text-emerald-400 text-sm font-medium">Family Health Intelligence</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  Discover generational health patterns, genetic predispositions, and family medical history. Build a comprehensive family health map that reveals insights for prevention and early intervention.
                </p>

                {/* Enhanced feature tabs */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="group bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/30 rounded-xl p-4 hover:from-emerald-500/30 hover:to-green-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <FiUsers className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                      <span className="text-emerald-400 font-semibold text-sm group-hover:text-emerald-300">Generational Patterns</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-tight">Map your family's health journey</p>
                  </div>

                  <div className="group bg-gradient-to-br from-green-500/20 to-teal-500/10 border border-green-500/30 rounded-xl p-4 hover:from-green-500/30 hover:to-teal-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <FiHeart className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors" />
                      <span className="text-green-400 font-semibold text-sm group-hover:text-green-300">Genetic Insights</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-tight">Unlock DNA-powered wisdom</p>
                  </div>

                  <div className="group bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border border-teal-500/30 rounded-xl p-4 hover:from-teal-500/30 hover:to-emerald-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-teal-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <FiShield className="w-5 h-5 text-teal-400 group-hover:text-teal-300 transition-colors" />
                      <span className="text-teal-400 font-semibold text-sm group-hover:text-teal-300">Prevention Focus</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-tight">Stay ahead of health risks</p>
                  </div>

                  <div className="group bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 rounded-xl p-4 hover:from-emerald-500/30 hover:to-cyan-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <FiActivity className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                      <span className="text-emerald-400 font-semibold text-sm group-hover:text-emerald-300">AI-Powered</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-tight">Smart family health analysis</p>
                  </div>
                </div>

                <Link
                  href="/vault/family-tree"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30"
                >
                  <span>Explore Your Root</span>
                  <FiArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="order-1 lg:order-2 flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-400/10 rounded-3xl blur-xl scale-110"></div>
                  <Image
                    src="/mascots/LABDECODERMASCOT.PNG"
                    alt="Root - Your Family Health Intelligence Guide"
                    width={400}
                    height={400}
                    className="relative rounded-3xl shadow-2xl border border-emerald-500/20"
                    priority
                  />
                  <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl border border-white/10">
                    🌳 Family Intelligence
                  </div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm">✨</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Health Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <FiTrendingUp className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-bold text-white">Health Tools</h2>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Interactive calculators, risk assessments, and health analyzers. Each tool reads from your vault data and saves results back for comprehensive insights.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
                    <FiCheckCircle className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-sm">BMI Calculator</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-pink-500/20 border border-pink-500/30 rounded-full">
                    <FiHeart className="w-4 h-4 text-pink-400" />
                    <span className="text-pink-400 text-sm">Risk Assessments</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full">
                    <FiActivity className="w-4 h-4 text-indigo-400" />
                    <span className="text-indigo-400 text-sm">Health Trackers</span>
                  </div>
                </div>

                <Link
                  href="/vault/tools"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                >
                  <span>Explore Health Tools</span>
                  <FiArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="order-1 lg:order-2 flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 text-center">
                      <FiTrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-purple-300">Calculators</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4 text-center">
                      <FiHeart className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-blue-300">Assessments</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 text-center">
                      <FiActivity className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-green-300">Trackers</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-xl p-4 text-center">
                      <FiShield className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-orange-300">Analyzers</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg">
                    🛠️ Health Tools
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Blueprint Tie-In */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-8 lg:p-12 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <FiShield className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-bold text-white">Health Blueprint</h2>
              </div>

              <p className="text-gray-300 text-xl leading-relaxed mb-8">
                All your Vault data feeds into your personal Health Blueprint - the AI-powered dashboard that analyzes patterns, predicts risks, and creates your optimized wellness roadmap.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
                  <div className="text-center">
                    <FiTrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Pattern Recognition</h3>
                    <p className="text-gray-400 text-sm">Connects lab results, family history, and symptoms</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6">
                  <div className="text-center">
                    <FiActivity className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Risk Prediction</h3>
                    <p className="text-gray-400 text-sm">Identifies potential health concerns before they arise</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 rounded-xl p-6">
                  <div className="text-center">
                    <FiHeart className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Personalized Action</h3>
                    <p className="text-gray-400 text-sm">Creates your unique wellness and prevention plan</p>
                  </div>
                </div>
              </div>

              <Link
                href="/vault/blueprint"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-5 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <span>Launch Your Health Blueprint</span>
                <FiArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Security Notice */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-3">
            <FiShield className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Your Data Security</h3>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            All data in your Sacred Vault is encrypted with 256-bit AES encryption, HIPAA compliant,
            and stored securely. You control who can access your information, and all sharing is
            logged and auditable. Your health data belongs to you - we just help you manage it.
          </p>
        </div>
      </div>
    </div>
  );
}
