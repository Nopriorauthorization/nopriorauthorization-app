"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveFamilyTree from './FamilyTree';

interface HealthFeature {
  id: string;
  name: string;
  icon: string;
  description: string;
  path: string;
  category: 'tracking' | 'ai' | 'collaboration' | 'analytics';
  color: string;
  position: { x: number; y: number };
  connectedTo?: string[]; // Family member IDs this feature connects to
}

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  position: { x: number; y: number };
}

// Health features that connect to family members
const healthFeatures: HealthFeature[] = [
  {
    id: 'timeline',
    name: 'Health Timeline',
    icon: '📅',
    description: 'Chronological health journey',
    path: '/vault/timeline',
    category: 'tracking',
    color: 'from-blue-500 to-cyan-500',
    position: { x: 200, y: 150 }
  },
  {
    id: 'personal-documents',
    name: 'Personal Documents',
    icon: '🔒',
    description: 'Secure document storage & sharing',
    path: '/vault/personal-documents',
    category: 'tracking',
    color: 'from-red-500 to-pink-500',
    position: { x: 100, y: 250 }
  },
  {
    id: 'ai-insights',
    name: 'AI Health Insights',
    icon: '🧠',
    description: 'Predictive analytics',
    path: '/vault/ai-insights',
    category: 'ai',
    color: 'from-purple-500 to-pink-500',
    position: { x: 600, y: 200 }
  },
  {
    id: 'provider-portal',
    name: 'Provider Portal',
    icon: '👨‍⚕️',
    description: 'Secure data sharing',
    path: '/vault/provider-portal',
    category: 'collaboration',
    color: 'from-green-500 to-emerald-500',
    position: { x: 400, y: 350 }
  },
  {
    id: 'care-team',
    name: 'Care Team',
    icon: '👥',
    description: 'Healthcare coordination',
    path: '/vault/care-team',
    category: 'collaboration',
    color: 'from-orange-500 to-red-500',
    position: { x: 150, y: 400 }
  },
  {
    id: 'pattern-recognition',
    name: 'Pattern Analysis',
    icon: '📈',
    description: 'Health trend detection',
    path: '/vault/patterns',
    category: 'analytics',
    color: 'from-indigo-500 to-purple-500',
    position: { x: 650, y: 450 }
  },
  {
    id: 'recommendations',
    name: 'Smart Recommendations',
    icon: '💊',
    description: 'Personalized care suggestions',
    path: '/vault/recommendations',
    category: 'ai',
    color: 'from-pink-500 to-rose-500',
    position: { x: 300, y: 500 }
  }
];

export default function FamilyTreeCentricDashboard() {
  const [selectedFeature, setSelectedFeature] = useState<HealthFeature | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [familyData, setFamilyData] = useState<any>(null);

  useEffect(() => {
    // Auto-hide welcome message after 5 seconds
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleFamilyMemberClick = (member: FamilyMember) => {
    // Find features relevant to this family member
    const relevantFeatures = healthFeatures.filter(feature =>
      feature.connectedTo?.includes(member.id) ||
      feature.category === 'tracking' // All members can use tracking
    );

    if (relevantFeatures.length > 0) {
      setSelectedFeature(relevantFeatures[0]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.1),transparent_50%)]" />
      </div>

      {/* Welcome Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8 max-w-md mx-4 text-center"
            >
              <div className="text-6xl mb-4">🌟</div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to Your Health Universe</h2>
              <p className="text-gray-300 mb-6">
                Your family health story comes together here. Click on family members to explore their health journey.
              </p>
              <button
                onClick={() => setShowWelcome(false)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition"
              >
                Start Exploring ✨
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Family Health Universe
              </h1>
              <p className="text-gray-400 mt-2">
                Where your family's health story comes alive
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Live & Connected</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Family Members</p>
                  <p className="text-2xl font-bold text-white">8</p>
                </div>
                <div className="text-2xl">👨‍👩‍👧‍👦</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Health Features</p>
                  <p className="text-2xl font-bold text-white">{healthFeatures.length}</p>
                </div>
                <div className="text-2xl">⚡</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">AI Insights</p>
                  <p className="text-2xl font-bold text-white">24</p>
                </div>
                <div className="text-2xl">🧠</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 rounded-xl border border-pink-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-400 text-sm font-medium">Connections</p>
                  <p className="text-2xl font-bold text-white">∞</p>
                </div>
                <div className="text-2xl">🔗</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Family Tree - Main Centerpiece */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 h-[800px] overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Your Family Health Tree</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Interactive • Live Data</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="h-full">
                <InteractiveFamilyTree />
              </div>
            </motion.div>
          </div>

          {/* Connected Features Sidebar */}
          <div className="space-y-6">

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg text-left hover:from-blue-500/30 hover:to-cyan-500/30 transition">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📊</span>
                    <div>
                      <div className="text-white font-medium">View Health Dashboard</div>
                      <div className="text-xs text-gray-400">Comprehensive metrics</div>
                    </div>
                  </div>
                </button>

                <button className="w-full p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-left hover:from-purple-500/30 hover:to-pink-500/30 transition">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🤖</span>
                    <div>
                      <div className="text-white font-medium">AI Health Assistant</div>
                      <div className="text-xs text-gray-400">Get personalized insights</div>
                    </div>
                  </div>
                </button>

                <button className="w-full p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg text-left hover:from-green-500/30 hover:to-emerald-500/30 transition">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📅</span>
                    <div>
                      <div className="text-white font-medium">Schedule Check-up</div>
                      <div className="text-xs text-gray-400">Book with care team</div>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Connected Health Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Health Intelligence Hub</h3>
              <div className="space-y-3">
                {healthFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Link
                      href={feature.path}
                      className="block p-3 bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-white/10 rounded-lg hover:border-white/20 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{feature.icon}</span>
                        <div className="flex-1">
                          <div className="text-white font-medium group-hover:text-purple-400 transition">
                            {feature.name}
                          </div>
                          <div className="text-xs text-gray-400">{feature.description}</div>
                        </div>
                        <div className="text-xs text-gray-500">→</div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* AI Insights Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">🧠</span>
                AI Health Insights
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="text-sm text-purple-300 font-medium mb-1">Family Pattern Detected</div>
                  <div className="text-xs text-gray-400">Cardiovascular risk trending in paternal line</div>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="text-sm text-blue-300 font-medium mb-1">Preventive Recommendation</div>
                  <div className="text-xs text-gray-400">Consider genetic screening for family members</div>
                </div>

                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="text-sm text-green-300 font-medium mb-1">Health Score Improvement</div>
                  <div className="text-xs text-gray-400">+15 points this month across family</div>
                </div>
              </div>

              <Link
                href="/vault/ai-insights"
                className="block w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition"
              >
                View All Insights
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Feature Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedFeature(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/20 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-4xl p-3 rounded-xl bg-gradient-to-r ${selectedFeature.color} text-white`}>
                  {selectedFeature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedFeature.name}</h3>
                  <p className="text-gray-400">{selectedFeature.description}</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6">
                This feature connects directly to your family health data, providing personalized insights and recommendations.
              </p>

              <div className="flex gap-3">
                <Link
                  href={selectedFeature.path}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition"
                >
                  Launch Feature
                </Link>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}