"use client";

import React from 'react';
import { FiCheck, FiClock, FiTrendingUp } from 'react-icons/fi';

interface ProgressItem {
  id: string;
  label: string;
  completed: boolean;
  description?: string;
}

interface ProgressIndicatorProps {
  items: ProgressItem[];
  title?: string;
  className?: string;
}

export function ProgressIndicator({ items, title, className = "" }: ProgressIndicatorProps) {
  const completedCount = items.filter(item => item.completed).length;
  const progressPercentage = (completedCount / items.length) * 100;

  return (
    <div className={`bg-white/5 rounded-lg p-6 border border-white/10 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <FiTrendingUp className="w-4 h-4" />
            {completedCount}/{items.length} Complete
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-white/10 rounded-full h-2 mb-6">
        <div
          className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Progress Items */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
              item.completed
                ? 'bg-green-500/20 border border-green-500/50'
                : 'bg-white/10 border border-white/20'
            }`}>
              {item.completed ? (
                <FiCheck className="w-3 h-3 text-green-400" />
              ) : (
                <FiClock className="w-3 h-3 text-white/40" />
              )}
            </div>
            <div className="flex-1">
              <div className={`text-sm font-medium ${
                item.completed ? 'text-white' : 'text-white/60'
              }`}>
                {item.label}
              </div>
              {item.description && (
                <div className="text-xs text-white/40 mt-1">
                  {item.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}