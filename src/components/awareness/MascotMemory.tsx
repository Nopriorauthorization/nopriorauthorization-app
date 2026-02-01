"use client";

// =============================================================================
// MascotMemory - Shows contextual memory when visiting a mascot page
// Subtle, read-only awareness - NO actions required
// =============================================================================

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock } from "react-icons/fi";
import { MascotSource, MascotMemoryItem } from "@/lib/awareness/types";

interface MascotMemoryProps {
  mascotId: MascotSource;
  className?: string;
}

export default function MascotMemory({ mascotId, className = "" }: MascotMemoryProps) {
  const [memory, setMemory] = useState<MascotMemoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        // Track the mascot visit
        if (!hasTracked) {
          await fetch("/api/awareness/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "MASCOT_VISITED",
              source: mascotId,
            }),
          });
          setHasTracked(true);
        }

        // Fetch mascot memory
        const response = await fetch(`/api/awareness/mascot/${mascotId}`);
        const data = await response.json();

        if (data.success && data.data) {
          setMemory(data.data);
        }
      } catch (err) {
        // Silent fail - memory is not critical
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemory();
  }, [mascotId, hasTracked]);

  // Don't show anything if loading or no context message
  if (isLoading || !memory?.contextMessage) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        transition={{ duration: 0.3 }}
        className={`mb-4 ${className}`}
      >
        <div className="rounded-lg bg-white/5 border border-white/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <FiClock className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <p className="text-sm text-gray-400 italic">{memory.contextMessage}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// =============================================================================
// Inline variant for use within existing components
// =============================================================================

interface MascotMemoryInlineProps {
  mascotId: MascotSource;
  className?: string;
}

export function MascotMemoryInline({ mascotId, className = "" }: MascotMemoryInlineProps) {
  const [contextMessage, setContextMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        // Track visit silently
        await fetch("/api/awareness/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "MASCOT_VISITED",
            source: mascotId,
          }),
        });

        // Fetch memory
        const response = await fetch(`/api/awareness/mascot/${mascotId}`);
        const data = await response.json();

        if (data.success && data.data?.contextMessage) {
          setContextMessage(data.data.contextMessage);
        }
      } catch (err) {
        // Silent fail
      }
    };

    fetchMemory();
  }, [mascotId]);

  if (!contextMessage) {
    return null;
  }

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`text-sm text-gray-400 italic ${className}`}
    >
      {contextMessage}
    </motion.p>
  );
}
