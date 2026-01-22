"use client";
export const dynamic = 'force-dynamic';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiLock,
  FiUpload,
  FiFile,
  FiShare2,
  FiTrendingUp,
  FiUsers,
  FiShield,
  FiArrowRight
} from 'react-icons/fi';

interface VaultFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  isLive: boolean;
  category: 'documents' | 'health' | 'collaboration' | 'analytics';
}

const vaultFeatures: VaultFeature[] = [
  {
    id: 'personal-documents',
    name: 'Personal Documents Vault',
    description: 'Securely store and share insurance cards, IDs, medical records, and important personal documents',
    icon: <FiLock className="w-8 h-8" />,
    path: '/vault/personal-documents',
    color: 'from-red-500 to-pink-500',
    isLive: true,
    category: 'documents'
  },
  {
    id: 'rich-health-timeline',
    name: 'Rich Health Timeline',
    description: 'Upload photos, record voice notes, and attach documents to your health journey',
    icon: <FiTrendingUp className="w-8 h-8" />,
    path: '/rich-health-timeline',
    color: 'from-blue-500 to-cyan-500',
    isLive: true,
    category: 'health'
  },
  {
    id: 'lab-decoder',
    name: 'Interactive Lab Decoder',
    description: 'AI-powered analysis of medical documents with expert chat assistance',
    icon: <FiFile className="w-8 h-8" />,
    path: '/lab-decoder',
    color: 'from-purple-500 to-indigo-500',
    isLive: true,
    category: 'health'
  },
  {
    id: 'family-tree',
    name: 'Family Health Tree',
    description: 'Connect your health data with family medical history and insights',
    icon: <FiUsers className="w-8 h-8" />,
    path: '/vault/family-tree',
    color: 'from-green-500 to-emerald-500',
    isLive: true,
    category: 'health'
  },
  {
    id: 'provider-portal',
    name: 'Provider Data Sharing',
    description: 'Securely share documents and health data with healthcare providers',
    icon: <FiShare2 className="w-8 h-8" />,
    path: '/vault/provider-portal',
    color: 'from-orange-500 to-yellow-500',
    isLive: true,
    category: 'collaboration'
  },
  {
    id: 'ai-insights',
    name: 'AI Health Insights',
    description: 'Predictive analytics and personalized health recommendations',
    icon: <FiShield className="w-8 h-8" />,
    path: '/vault/ai-insights',
    color: 'from-pink-500 to-rose-500',
    isLive: true,
    category: 'analytics'
  }
];

export default function VaultPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFeatures = selectedCategory === 'all'
    ? vaultFeatures
    : vaultFeatures.filter(f => f.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Features', count: vaultFeatures.length },
    { id: 'documents', name: 'Documents', count: vaultFeatures.filter(f => f.category === 'documents').length },
    { id: 'health', name: 'Health Tracking', count: vaultFeatures.filter(f => f.category === 'health').length },
    { id: 'collaboration', name: 'Collaboration', count: vaultFeatures.filter(f => f.category === 'collaboration').length },
    { id: 'analytics', name: 'Analytics', count: vaultFeatures.filter(f => f.category === 'analytics').length }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
                Sacred Vault
              </h1>
              <p className="text-gray-400 text-lg">
                Your complete healthcare intelligence platform - interactive, secure, and personalized
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <span className="text-green-400 text-sm font-medium">
                  🔒 HIPAA Compliant
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl border border-pink-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-400 text-sm font-medium">Live Features</p>
                  <p className="text-3xl font-bold text-white">{vaultFeatures.filter(f => f.isLive).length}</p>
                </div>
                <div className="text-3xl">🚀</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Documents Stored</p>
                  <p className="text-3xl font-bold text-white">∞</p>
                </div>
                <div className="text-3xl">📄</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">AI Insights</p>
                  <p className="text-3xl font-bold text-white">94%</p>
                </div>
                <div className="text-3xl">🧠</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-xl border border-orange-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-400 text-sm font-medium">Data Security</p>
                  <p className="text-3xl font-bold text-white">256-bit</p>
                </div>
                <div className="text-3xl">🔐</div>
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
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700 p-6 hover:border-pink-500/50 transition-all hover:scale-105"
            >
              {feature.isLive && (
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 text-green-400 rounded-full text-xs font-medium">
                    LIVE
                  </span>
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-pink-400 transition">
                    {feature.name}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              <Link
                href={feature.path}
                className="block w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-center px-4 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition group-hover:shadow-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  Launch Feature
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Quick Start Your Health Journey</h2>
            <p className="text-gray-300">Begin with our most popular interactive features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/vault/personal-documents"
              className="group bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl p-6 hover:border-red-400/50 transition"
            >
              <div className="text-center">
                <FiUpload className="w-12 h-12 text-red-400 mx-auto mb-4 group-hover:scale-110 transition" />
                <h3 className="text-xl font-semibold text-white mb-2">Upload Documents</h3>
                <p className="text-gray-300 text-sm">Securely store your important personal documents</p>
              </div>
            </Link>

            <Link
              href="/chat"
              className="group bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6 hover:border-blue-400/50 transition"
            >
              <div className="text-center">
                <FiUsers className="w-12 h-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition" />
                <h3 className="text-xl font-semibold text-white mb-2">Chat with Experts</h3>
                <p className="text-gray-300 text-sm">Get personalized advice from AI healthcare specialists</p>
              </div>
            </Link>

            <Link
              href="/rich-health-timeline"
              className="group bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 hover:border-green-400/50 transition"
            >
              <div className="text-center">
                <FiTrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition" />
                <h3 className="text-xl font-semibold text-white mb-2">Track Your Health</h3>
                <p className="text-gray-300 text-sm">Build your comprehensive health timeline</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-3">
            <FiShield className="w-6 h-6 text-green-400" />
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
