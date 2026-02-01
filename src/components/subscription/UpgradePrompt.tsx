"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import Link from 'next/link';

interface UpgradePromptProps {
  feature: string;
  className?: string;
}

export function UpgradePrompt({ feature, className = '' }: UpgradePromptProps) {
  const getPromptContent = (feature: string) => {
    switch (feature) {
      case 'blueprint_insights':
        return {
          title: 'Unlock Full Blueprint Intelligence',
          message: 'You\'re seeing your most important insights. Upgrade to view the complete picture and unlock deeper health patterns.',
          cta: 'Upgrade to Core',
          icon: FiTrendingUp,
        };

      case 'lab_history':
        return {
          title: 'Access Full Lab History',
          message: 'Your recent lab is included. Upgrade to access full lab history and see how your results change over time.',
          cta: 'Upgrade to Core',
          icon: FiTrendingUp,
        };

      case 'family_patterns':
        return {
          title: 'Discover Family Health Patterns',
          message: 'Deeper family pattern insights are available with Blueprint Intelligence. See connections across generations.',
          cta: 'Upgrade to Core',
          icon: FiTrendingUp,
        };

      case 'blueprint_export':
        return {
          title: 'Export Your Blueprint',
          message: 'Create PDF summaries of your health insights to share with providers or keep for your records.',
          cta: 'Upgrade to Premium',
          icon: FiTrendingUp,
        };

      default:
        return {
          title: 'Unlock More Features',
          message: 'Upgrade to access advanced health intelligence features.',
          cta: 'Upgrade Now',
          icon: FiTrendingUp,
        };
    }
  };

  const content = getPromptContent(feature);
  const Icon = content.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            {content.title}
          </h3>
          <p className="text-gray-300 mb-4 leading-relaxed">
            {content.message}
          </p>
          <Link
            href="/subscribe"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all text-sm"
          >
            {content.cta}
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}