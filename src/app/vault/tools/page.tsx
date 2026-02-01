"use client";
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiActivity,
  FiHeart,
  FiTrendingUp,
  FiShield,
  FiArrowRight,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';
import { Breadcrumb } from '@/components/ui/breadcrumb';

type HealthTool = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
  category: 'calculator' | 'assessment' | 'tracker' | 'analyzer';
  available: boolean;
  savesToVault: boolean;
};

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userData, setUserData] = useState<any>({});

  // Load user data from vault context
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Load existing vault data to inform tool recommendations
      const responses = await Promise.all([
        fetch('/api/vault/labs/metadata').then(r => r.json()).catch(() => []),
        fetch('/api/vault/family-members').then(r => r.json()).catch(() => []),
        fetch('/api/documents').then(r => r.json()).catch(() => [])
      ]);

      setUserData({
        hasLabs: responses[0]?.length > 0,
        hasFamilyData: responses[1]?.members?.length > 0,
        hasDocuments: responses[2]?.documents?.length > 0
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const healthTools: HealthTool[] = [
    {
      id: 'bmi-calculator',
      name: 'BMI Calculator',
      description: 'Calculate your Body Mass Index and get personalized insights',
      icon: <FiActivity className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      path: '/vault/tools/bmi-calculator',
      category: 'calculator',
      available: true,
      savesToVault: true
    },
    {
      id: 'heart-risk',
      name: 'Heart Risk Assessment',
      description: 'Evaluate your cardiovascular risk factors',
      icon: <FiHeart className="w-6 h-6" />,
      color: 'from-red-500 to-pink-500',
      path: '/vault/tools/heart-risk',
      category: 'assessment',
      available: true,
      savesToVault: true
    },
    {
      id: 'metabolic-health',
      name: 'Metabolic Health Score',
      description: 'Analyze your metabolic markers and insulin sensitivity',
      icon: <FiActivity className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      path: '/vault/tools/metabolic-health',
      category: 'analyzer',
      available: true,
      savesToVault: true
    },
    {
      id: 'hormone-tracker',
      name: 'Hormone Cycle Tracker',
      description: 'Track and analyze your hormonal patterns',
      icon: <FiTrendingUp className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      path: '/vault/tools/hormone-tracker',
      category: 'tracker',
      available: true,
      savesToVault: true
    },
    {
      id: 'nutrient-analyzer',
      name: 'Nutrient Deficiency Analyzer',
      description: 'Identify potential nutrient deficiencies from your labs',
      icon: <FiShield className="w-6 h-6" />,
      color: 'from-orange-500 to-yellow-500',
      path: '/vault/tools/nutrient-analyzer',
      category: 'analyzer',
      available: userData.hasLabs,
      savesToVault: true
    },
    {
      id: 'genetic-risk',
      name: 'Genetic Risk Calculator',
      description: 'Calculate genetic predispositions based on family history',
      icon: <FiActivity className="w-6 h-6" />,
      color: 'from-indigo-500 to-purple-500',
      path: '/vault/tools/genetic-risk',
      category: 'calculator',
      available: userData.hasFamilyData,
      savesToVault: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Tools', count: healthTools.length },
    { id: 'calculator', name: 'Calculators', count: healthTools.filter(t => t.category === 'calculator').length },
    { id: 'assessment', name: 'Assessments', count: healthTools.filter(t => t.category === 'assessment').length },
    { id: 'tracker', name: 'Trackers', count: healthTools.filter(t => t.category === 'tracker').length },
    { id: 'analyzer', name: 'Analyzers', count: healthTools.filter(t => t.category === 'analyzer').length }
  ];

  const filteredTools = selectedCategory === 'all'
    ? healthTools
    : healthTools.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumb className="mb-6" />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Health Tools
              </h1>
              <p className="text-gray-400">
                Interactive calculators, assessments, and analyzers powered by your vault data
              </p>
              <p className="text-sm text-purple-400 mt-2">
                🛠️ Tool results feed directly into your Health Blueprint
              </p>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="text-center">
                <FiActivity className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Interactive Tools</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border p-6 transition-all hover:scale-105 ${
                tool.available
                  ? 'border-gray-700 hover:border-purple-500/50'
                  : 'border-gray-600 opacity-60'
              }`}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {tool.available ? (
                  <span className="px-2 py-1 border border-green-500/30 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                    AVAILABLE
                  </span>
                ) : (
                  <span className="px-2 py-1 border border-yellow-500/30 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400">
                    NEEDS DATA
                  </span>
                )}
                {tool.savesToVault && (
                  <FiCheckCircle className="w-4 h-4 text-blue-400" title="Saves to Vault" />
                )}
              </div>

              {/* Tool Content */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${tool.color} text-white`}>
                  {tool.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-semibold mb-2 transition ${
                    tool.available
                      ? 'text-white group-hover:text-purple-400'
                      : 'text-gray-300'
                  }`}>
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {tool.description}
                  </p>
                  {tool.savesToVault && (
                    <p className="text-xs text-blue-400 mt-2">
                      💾 Results saved to Vault
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {tool.available ? (
                <Link
                  href={tool.path}
                  className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center px-4 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition group-hover:shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    Launch Tool
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </span>
                </Link>
              ) : (
                <div className="w-full bg-gradient-to-r from-gray-500/20 to-gray-600/20 border border-gray-500/30 text-gray-400 text-center px-4 py-3 rounded-lg font-semibold cursor-not-allowed">
                  <span className="flex items-center justify-center gap-2">
                    <FiClock className="w-4 h-4" />
                    {tool.id.includes('lab') ? 'Upload Lab Results First' : 'Add Family Data First'}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Data Connection Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Smart Tool Recommendations</h2>
            <p className="text-gray-300">Tools unlock based on your vault data</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                userData.hasLabs ? 'bg-green-500/20' : 'bg-gray-700'
              }`}>
                <FiActivity className={`w-8 h-8 ${
                  userData.hasLabs ? 'text-green-400' : 'text-gray-500'
                }`} />
              </div>
              <h3 className="font-semibold mb-1">Lab Data</h3>
              <p className="text-sm text-gray-400">
                {userData.hasLabs ? '✅ Unlocks nutrient analyzers' : 'Upload labs to unlock advanced tools'}
              </p>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                userData.hasFamilyData ? 'bg-green-500/20' : 'bg-gray-700'
              }`}>
                <FiHeart className={`w-8 h-8 ${
                  userData.hasFamilyData ? 'text-green-400' : 'text-gray-500'
                }`} />
              </div>
              <h3 className="font-semibold mb-1">Family History</h3>
              <p className="text-sm text-gray-400">
                {userData.hasFamilyData ? '✅ Unlocks genetic risk tools' : 'Add family data to unlock genetic tools'}
              </p>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                userData.hasDocuments ? 'bg-green-500/20' : 'bg-gray-700'
              }`}>
                <FiShield className={`w-8 h-8 ${
                  userData.hasDocuments ? 'text-green-400' : 'text-gray-500'
                }`} />
              </div>
              <h3 className="font-semibold mb-1">Health Records</h3>
              <p className="text-sm text-gray-400">
                {userData.hasDocuments ? '✅ Unlocks comprehensive analysis' : 'Upload documents for full insights'}
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/vault/blueprint"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <span>View All Results in Blueprint</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Security Notice */}
        <div className="mt-8 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-3">
            <FiShield className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Tool Data Security</h3>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            All tool calculations and results are processed securely and stored in your encrypted vault.
            Your health data powers personalized insights while remaining completely private and under your control.
          </p>
        </div>
      </div>
    </div>
  );
}