"use client";

// =============================================================================
// ProgressSnapshot - Shows user's progress in the Vault Dashboard
// Calm, reassuring - NOT gamified, NOT pressure-inducing
// =============================================================================

import React from "react";
import { motion } from "framer-motion";
import { FiLayers, FiZap, FiTarget } from "react-icons/fi";
import { useUserAwareness } from "@/hooks/useUserAwareness";

interface ProgressSnapshotProps {
  className?: string;
  variant?: "compact" | "full";
}

export default function ProgressSnapshot({
  className = "",
  variant = "full",
}: ProgressSnapshotProps) {
  const { progressSnapshot, isLoading } = useUserAwareness();

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="rounded-xl bg-white/5 border border-white/10 p-6">
          <div className="h-4 bg-white/10 rounded w-40 mb-4" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-16 bg-white/5 rounded" />
            <div className="h-16 bg-white/5 rounded" />
            <div className="h-16 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!progressSnapshot) {
    return null;
  }

  const {
    blueprintCompletenessPercent,
    connectedSystemsCount,
    totalInsightsUnlocked,
    encouragementMessage,
  } = progressSnapshot;

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-blue-500/10 border border-purple-500/20 p-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <FiTarget className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {blueprintCompletenessPercent}% Complete
              </p>
              <p className="text-xs text-gray-400">{encouragementMessage}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-blue-500/10 border border-purple-500/20 p-6 ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <FiTarget className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Your Progress</h3>
      </div>

      <p className="text-gray-300 mb-6">{encouragementMessage}</p>

      <div className="grid grid-cols-3 gap-4">
        {/* Blueprint Completeness */}
        <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="relative inline-flex items-center justify-center mb-2">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                className="text-gray-700"
                strokeWidth="3"
                stroke="currentColor"
                fill="transparent"
                r="20"
                cx="24"
                cy="24"
              />
              <circle
                className="text-purple-400"
                strokeWidth="3"
                strokeDasharray={`${blueprintCompletenessPercent * 1.26} 126`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="20"
                cx="24"
                cy="24"
              />
            </svg>
            <span className="absolute text-sm font-bold text-white">
              {blueprintCompletenessPercent}%
            </span>
          </div>
          <p className="text-xs text-gray-400">Blueprint</p>
        </div>

        {/* Connected Systems */}
        <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-center mb-2">
            <FiLayers className="w-8 h-8 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white">{connectedSystemsCount}</p>
          <p className="text-xs text-gray-400">Systems</p>
        </div>

        {/* Insights Unlocked */}
        <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-center mb-2">
            <FiZap className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totalInsightsUnlocked}</p>
          <p className="text-xs text-gray-400">Insights</p>
        </div>
      </div>
    </motion.div>
  );
}
