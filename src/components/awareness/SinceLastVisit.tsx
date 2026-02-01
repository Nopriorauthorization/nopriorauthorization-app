"use client";

// =============================================================================
// SinceLastVisit - Shows activity since user's last visit
// Calm, observational UI - NO alerts, NO anxiety
// =============================================================================

import React from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiActivity } from "react-icons/fi";
import { useUserAwareness } from "@/hooks/useUserAwareness";

interface SinceLastVisitProps {
  className?: string;
  maxItems?: number;
}

export default function SinceLastVisit({
  className = "",
  maxItems = 3,
}: SinceLastVisitProps) {
  const { awarenessState, isLoading } = useUserAwareness();

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-white/10 rounded w-32 mb-2" />
        <div className="h-3 bg-white/5 rounded w-48" />
      </div>
    );
  }

  if (!awarenessState) {
    return null;
  }

  const { recentActivity, eventsSinceLastVisit } = awarenessState;

  // If no activity since last visit, show "up to date" message
  if (eventsSinceLastVisit === 0 || recentActivity.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl bg-white/5 border border-white/10 p-4 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <FiCheckCircle className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-300">You're up to date.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Show recent activity
  const displayItems = recentActivity.slice(0, maxItems);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl bg-white/5 border border-white/10 p-4 ${className}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <FiActivity className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-medium text-gray-300">Since your last visit</h3>
      </div>

      <ul className="space-y-2">
        {displayItems.map((item, index) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-400">{item.message}</p>
          </motion.li>
        ))}
      </ul>

      {eventsSinceLastVisit > maxItems && (
        <p className="text-xs text-gray-500 mt-3">
          +{eventsSinceLastVisit - maxItems} more{" "}
          {eventsSinceLastVisit - maxItems === 1 ? "activity" : "activities"}
        </p>
      )}
    </motion.div>
  );
}
