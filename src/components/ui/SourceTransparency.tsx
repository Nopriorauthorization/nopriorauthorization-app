"use client";

import React, { useState } from "react";

interface SourceTransparencyProps {
  /** Variant for different contexts */
  variant?: "full" | "compact";
  /** Custom className for styling */
  className?: string;
}

/**
 * SourceTransparency Component
 *
 * A trust infrastructure component that explains:
 * - Where AI explanations come from
 * - What the system does and does not do
 * - How credibility is maintained
 */
export function SourceTransparency({
  variant = "full",
  className = ""
}: SourceTransparencyProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (variant === "compact") {
    return (
      <div className={`bg-white/5 border border-white/10 rounded-lg p-4 ${className}`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🔍</span>
            <span className="text-sm font-medium text-gray-300">
              How No Prior Authorization Works
            </span>
          </div>
          <span className="text-gray-400 text-xs">
            {isExpanded ? "▲" : "▼"}
          </span>
        </button>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <SourceContent />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="text-3xl">🔍</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-4">
            How No Prior Authorization Works
          </h3>
          <SourceContent />
        </div>
      </div>
    </div>
  );
}

function SourceContent() {
  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-300 leading-relaxed">
        No Prior Authorization helps you understand and organize your health information.
      </p>

      <p className="text-amber-300 font-medium">
        We do not diagnose, predict, or replace your healthcare provider.
      </p>

      <div>
        <p className="text-gray-400 mb-2">Our explanations are based on:</p>
        <ul className="space-y-1 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>Your own uploaded data</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>Established medical education and reference standards</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>Plain-language interpretation designed for clarity</span>
          </li>
        </ul>
      </div>

      <p className="text-gray-300 pt-2 border-t border-white/10">
        This platform is designed to help you <strong className="text-white">ask better questions</strong> — not to give medical advice.
      </p>

      <a
        href="/how-our-intelligence-works"
        className="inline-block text-blue-400 hover:text-blue-300 text-xs mt-2"
      >
        Learn more about our approach →
      </a>
    </div>
  );
}

export default SourceTransparency;
