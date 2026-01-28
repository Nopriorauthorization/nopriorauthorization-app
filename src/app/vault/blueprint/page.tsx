"use client";
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiTrendingUp, FiAlertTriangle, FiInfo, FiCheckCircle } from 'react-icons/fi';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { SourceTransparency } from '@/components/ui/SourceTransparency';

interface BlueprintInsight {
  id: string;
  vaultId: string;
  source: 'LAB' | 'FAMILY' | 'TOOL' | 'DOCUMENT';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  createdAt: Date;
}

type PriorityGroup = {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  label: string;
  color: string;
  bgColor: string;
  icon: React.ComponentType<any>;
  insights: BlueprintInsight[];
  isExpanded: boolean;
};

export default function BlueprintPage() {
  const [insights, setInsights] = useState<BlueprintInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<PriorityGroup[]>([]);

  useEffect(() => {
    loadInsights();
  }, []);

  useEffect(() => {
    // Group insights by priority
    const grouped = insights.reduce((acc, insight) => {
      const existing = acc.find(g => g.priority === insight.priority);
      if (existing) {
        existing.insights.push(insight);
      } else {
        acc.push({
          priority: insight.priority,
          label: getPriorityLabel(insight.priority),
          color: getPriorityColor(insight.priority),
          bgColor: getPriorityBgColor(insight.priority),
          icon: getPriorityIcon(insight.priority),
          insights: [insight],
          isExpanded: insight.priority === 'HIGH' // High priority expanded by default
        });
      }
      return acc;
    }, [] as PriorityGroup[]);

    // Sort groups: HIGH, MEDIUM, LOW
    grouped.sort((a, b) => {
      const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return order[a.priority] - order[b.priority];
    });

    setGroups(grouped);
  }, [insights]);

  const loadInsights = async () => {
    try {
      const response = await fetch('/api/vault/blueprint?vaultId=default_vault');
      if (response.ok) {
        const data = await response.json();
        setInsights(data);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (priority: 'HIGH' | 'MEDIUM' | 'LOW') => {
    setGroups(prev => prev.map(group =>
      group.priority === priority
        ? { ...group, isExpanded: !group.isExpanded }
        : group
    ));
  };

  const getSourceExplanation = (source: string) => {
    switch (source) {
      case 'LAB':
        return 'This insight was generated based on your lab results.';
      case 'FAMILY':
        return 'This insight was generated based on your family health history.';
      case 'TOOL':
        return 'This insight was generated based on your health tool usage.';
      case 'DOCUMENT':
        return 'This insight was generated based on your health documents.';
      default:
        return 'This insight was generated based on your health data.';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded w-1/3"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
            <div className="space-y-3">
              <div className="h-20 bg-white/10 rounded"></div>
              <div className="h-20 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Breadcrumb items={[
          { label: 'Vault', href: '/vault' },
          { label: 'Blueprint', href: '/vault/blueprint' }
        ]} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Your Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Blueprint</span>
          </h1>
          <p className="text-xl text-white/80">
            AI-powered insights based on your health data
          </p>
        </motion.div>

        <SourceTransparency variant="compact" className="mb-8" />

        {insights.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiTrendingUp className="w-12 h-12 text-pink-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Your Blueprint is Building</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              As you add information to your Vault, your Blueprint will begin to surface what matters most.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {groups.map((group) => (
              <motion.div
                key={group.priority}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => toggleGroup(group.priority)}
                  className="w-full p-6 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${group.bgColor}`}>
                        <group.icon className={`w-6 h-6 ${group.color}`} />
                      </div>
                      <div>
                        <h2 className={`text-xl font-bold ${group.color}`}>
                          {group.label}
                        </h2>
                        <p className="text-white/60 text-sm">
                          {group.insights.length} insight{group.insights.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    {group.isExpanded ? (
                      <FiChevronUp className="w-6 h-6 text-white/60" />
                    ) : (
                      <FiChevronDown className="w-6 h-6 text-white/60" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {group.isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/10"
                    >
                      <div className="p-6 space-y-4">
                        {group.insights.map((insight) => (
                          <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/5 rounded-xl p-4 border border-white/10"
                          >
                            <p className="text-white/90 text-sm leading-relaxed mb-2">
                              {insight.message}
                            </p>
                            <p className="text-white/50 text-xs">
                              {getSourceExplanation(insight.source)}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getPriorityLabel(priority: 'HIGH' | 'MEDIUM' | 'LOW'): string {
  switch (priority) {
    case 'HIGH': return 'High Attention';
    case 'MEDIUM': return 'Medium Attention';
    case 'LOW': return 'Low Attention';
  }
}

function getPriorityColor(priority: 'HIGH' | 'MEDIUM' | 'LOW'): string {
  switch (priority) {
    case 'HIGH': return 'text-red-400';
    case 'MEDIUM': return 'text-yellow-400';
    case 'LOW': return 'text-green-400';
  }
}

function getPriorityBgColor(priority: 'HIGH' | 'MEDIUM' | 'LOW'): string {
  switch (priority) {
    case 'HIGH': return 'bg-red-500/20';
    case 'MEDIUM': return 'bg-yellow-500/20';
    case 'LOW': return 'bg-green-500/20';
  }
}

function getPriorityIcon(priority: 'HIGH' | 'MEDIUM' | 'LOW'): React.ComponentType<any> {
  switch (priority) {
    case 'HIGH': return FiAlertTriangle;
    case 'MEDIUM': return FiInfo;
    case 'LOW': return FiCheckCircle;
  }
}