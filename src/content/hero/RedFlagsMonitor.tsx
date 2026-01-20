"use client";

import React, { useState, useEffect, useMemo } from 'react';

// Red Flags Monitor Types
type RedFlag = {
  id: string;
  title: string;
  description: string;
  category: 'urgent' | 'warning' | 'monitoring' | 'preventive';
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'resolved' | 'monitoring';
  detectedAt: string;
  lastUpdated: string;
  triggers: string[];
  aiConfidence: number;
  recommendedActions: string[];
  relatedMetrics: string[];
  escalationLevel: 'immediate' | 'within-24h' | 'within-week' | 'routine';
};

type HealthMetric = {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalRange: { min: number; max: number };
  timestamp: string;
  trend: 'improving' | 'stable' | 'declining';
  flagTriggered: boolean;
};

type AlertRule = {
  id: string;
  name: string;
  condition: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  enabled: boolean;
  lastTriggered?: string;
  triggerCount: number;
};

// Mock data for demonstration
const mockRedFlags: RedFlag[] = [
  {
    id: 'flag-1',
    title: 'Elevated Blood Pressure Trend',
    description: 'Blood pressure readings have been consistently above 140/90 mmHg for the past 2 weeks',
    category: 'urgent',
    severity: 'high',
    status: 'active',
    detectedAt: '2026-01-18T10:30:00Z',
    lastUpdated: '2026-01-20T08:15:00Z',
    triggers: ['BP > 140/90 for 7+ days', 'Increasing trend over time'],
    aiConfidence: 92,
    recommendedActions: [
      'Schedule appointment with cardiologist within 48 hours',
      'Monitor blood pressure twice daily',
      'Review current medication regimen',
      'Consider lifestyle modifications'
    ],
    relatedMetrics: ['blood-pressure-systolic', 'blood-pressure-diastolic'],
    escalationLevel: 'within-24h'
  },
  {
    id: 'flag-2',
    title: 'Irregular Sleep Pattern',
    description: 'Sleep duration has decreased by 35% compared to baseline, with increased nighttime awakenings',
    category: 'warning',
    severity: 'medium',
    status: 'monitoring',
    detectedAt: '2026-01-15T22:00:00Z',
    lastUpdated: '2026-01-19T23:45:00Z',
    triggers: ['Sleep duration < 6 hours for 5+ nights', 'Sleep efficiency < 75%'],
    aiConfidence: 87,
    recommendedActions: [
      'Track sleep patterns for 7 days',
      'Consider sleep hygiene improvements',
      'Evaluate stress levels and coping mechanisms',
      'Consult sleep specialist if pattern continues'
    ],
    relatedMetrics: ['sleep-duration', 'sleep-efficiency'],
    escalationLevel: 'within-week'
  },
  {
    id: 'flag-3',
    title: 'Medication Adherence Concern',
    description: 'Blood pressure medication pickup delayed by 3 days past usual schedule',
    category: 'monitoring',
    severity: 'medium',
    status: 'active',
    detectedAt: '2026-01-17T14:20:00Z',
    lastUpdated: '2026-01-19T16:30:00Z',
    triggers: ['Medication pickup delay > 2 days', 'Prescription refill pattern change'],
    aiConfidence: 78,
    recommendedActions: [
      'Contact pharmacy to confirm medication availability',
      'Set medication reminders',
      'Discuss adherence barriers with healthcare provider',
      'Consider pill organizer or automatic refill setup'
    ],
    relatedMetrics: ['medication-adherence'],
    escalationLevel: 'routine'
  },
  {
    id: 'flag-4',
    title: 'Elevated Stress Indicators',
    description: 'Multiple stress-related symptoms detected: increased heart rate variability, reduced focus, and elevated cortisol patterns',
    category: 'preventive',
    severity: 'low',
    status: 'monitoring',
    detectedAt: '2026-01-12T09:15:00Z',
    lastUpdated: '2026-01-18T11:20:00Z',
    triggers: ['HRV decreased by 25%', 'Focus score < 70%', 'Cortisol elevation detected'],
    aiConfidence: 83,
    recommendedActions: [
      'Practice daily stress reduction techniques',
      'Consider mindfulness or meditation',
      'Evaluate work-life balance',
      'Monitor symptoms for 2 weeks'
    ],
    relatedMetrics: ['heart-rate-variability', 'focus-score', 'cortisol-level'],
    escalationLevel: 'routine'
  }
];

const mockHealthMetrics: HealthMetric[] = [
  { id: 'bp-systolic', name: 'Blood Pressure (Systolic)', value: 148, unit: 'mmHg', normalRange: { min: 90, max: 120 }, timestamp: '2026-01-20T08:00:00Z', trend: 'declining', flagTriggered: true },
  { id: 'bp-diastolic', name: 'Blood Pressure (Diastolic)', value: 92, unit: 'mmHg', normalRange: { min: 60, max: 80 }, timestamp: '2026-01-20T08:00:00Z', trend: 'stable', flagTriggered: true },
  { id: 'sleep-duration', name: 'Sleep Duration', value: 5.5, unit: 'hours', normalRange: { min: 7, max: 9 }, timestamp: '2026-01-20T06:00:00Z', trend: 'declining', flagTriggered: true },
  { id: 'heart-rate', name: 'Resting Heart Rate', value: 72, unit: 'bpm', normalRange: { min: 60, max: 100 }, timestamp: '2026-01-20T07:00:00Z', trend: 'stable', flagTriggered: false },
  { id: 'glucose', name: 'Blood Glucose', value: 98, unit: 'mg/dL', normalRange: { min: 70, max: 140 }, timestamp: '2026-01-20T08:30:00Z', trend: 'stable', flagTriggered: false }
];

const mockAlertRules: AlertRule[] = [
  {
    id: 'rule-1',
    name: 'Critical Blood Pressure',
    condition: 'Systolic BP > 180 OR Diastolic BP > 120',
    severity: 'critical',
    enabled: true,
    lastTriggered: '2026-01-18T10:30:00Z',
    triggerCount: 2
  },
  {
    id: 'rule-2',
    name: 'High Blood Pressure Trend',
    condition: 'BP > 140/90 for 7 consecutive days',
    severity: 'high',
    enabled: true,
    lastTriggered: '2026-01-18T10:30:00Z',
    triggerCount: 1
  },
  {
    id: 'rule-3',
    name: 'Sleep Duration Alert',
    condition: 'Sleep duration < 6 hours for 3+ consecutive nights',
    severity: 'medium',
    enabled: true,
    lastTriggered: '2026-01-15T22:00:00Z',
    triggerCount: 3
  },
  {
    id: 'rule-4',
    name: 'Medication Adherence',
    condition: 'Medication pickup delay > 2 days from schedule',
    severity: 'medium',
    enabled: true,
    lastTriggered: '2026-01-17T14:20:00Z',
    triggerCount: 1
  },
  {
    id: 'rule-5',
    name: 'Stress Indicator Alert',
    condition: 'Multiple stress indicators elevated simultaneously',
    severity: 'low',
    enabled: true,
    lastTriggered: '2026-01-12T09:15:00Z',
    triggerCount: 5
  }
];

export default function RedFlagsMonitor() {
  const [activeTab, setActiveTab] = useState<'flags' | 'metrics' | 'rules' | 'analytics'>('flags');
  const [selectedFlag, setSelectedFlag] = useState<RedFlag | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Flags', icon: '🚩' },
    { id: 'urgent', name: 'Urgent', icon: '🚨' },
    { id: 'warning', name: 'Warning', icon: '⚠️' },
    { id: 'monitoring', name: 'Monitoring', icon: '👁️' },
    { id: 'preventive', name: 'Preventive', icon: '🛡️' }
  ];

  const severities = [
    { id: 'all', name: 'All Severities' },
    { id: 'critical', name: 'Critical', color: 'text-red-400' },
    { id: 'high', name: 'High', color: 'text-orange-400' },
    { id: 'medium', name: 'Medium', color: 'text-yellow-400' },
    { id: 'low', name: 'Low', color: 'text-green-400' }
  ];

  const filteredFlags = useMemo(() => {
    let filtered = mockRedFlags;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(flag => flag.category === selectedCategory);
    }

    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(flag => flag.severity === selectedSeverity);
    }

    return filtered;
  }, [selectedCategory, selectedSeverity]);

  const getSeverityColor = (severity: RedFlag['severity']) => {
    const colors = {
      critical: 'from-red-500 to-red-600',
      high: 'from-orange-500 to-orange-600',
      medium: 'from-yellow-500 to-yellow-600',
      low: 'from-green-500 to-green-600'
    };
    return colors[severity];
  };

  const getCategoryColor = (category: RedFlag['category']) => {
    const colors = {
      urgent: 'from-red-500 to-red-700',
      warning: 'from-orange-500 to-orange-700',
      monitoring: 'from-blue-500 to-blue-700',
      preventive: 'from-green-500 to-green-700'
    };
    return colors[category];
  };

  const getStatusColor = (status: RedFlag['status']) => {
    const colors = {
      active: 'text-red-400 bg-red-500/20',
      resolved: 'text-green-400 bg-green-500/20',
      monitoring: 'text-blue-400 bg-blue-500/20'
    };
    return colors[status];
  };

  const getEscalationColor = (level: RedFlag['escalationLevel']) => {
    const colors = {
      immediate: 'text-red-400',
      'within-24h': 'text-orange-400',
      'within-week': 'text-yellow-400',
      routine: 'text-green-400'
    };
    return colors[level];
  };

  const getMetricStatus = (metric: HealthMetric) => {
    const { value, normalRange } = metric;
    if (value < normalRange.min || value > normalRange.max) {
      return 'abnormal';
    }
    return 'normal';
  };

  const flagStats = useMemo(() => {
    return {
      total: mockRedFlags.length,
      active: mockRedFlags.filter(f => f.status === 'active').length,
      critical: mockRedFlags.filter(f => f.severity === 'critical').length,
      urgent: mockRedFlags.filter(f => f.category === 'urgent').length
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent mb-2">
            Red Flags Monitor
          </h1>
          <p className="text-gray-400">
            AI-powered early warning system for health risks and anomalies
          </p>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl border border-red-500/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-400 text-sm font-medium">Active Flags</p>
                <p className="text-3xl font-bold text-white">{flagStats.active}</p>
              </div>
              <div className="text-3xl">🚨</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl border border-orange-500/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-400 text-sm font-medium">Critical Issues</p>
                <p className="text-3xl font-bold text-white">{flagStats.critical}</p>
              </div>
              <div className="text-3xl">⚠️</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Monitoring</p>
                <p className="text-3xl font-bold text-white">{mockRedFlags.filter(f => f.status === 'monitoring').length}</p>
              </div>
              <div className="text-3xl">👁️</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Resolved</p>
                <p className="text-3xl font-bold text-white">{mockRedFlags.filter(f => f.status === 'resolved').length}</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900 p-1 rounded-lg">
          {[
            { id: 'flags', label: 'Red Flags', icon: '🚩' },
            { id: 'metrics', label: 'Health Metrics', icon: '📊' },
            { id: 'rules', label: 'Alert Rules', icon: '⚙️' },
            { id: 'analytics', label: 'Analytics', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Red Flags Tab */}
        {activeTab === 'flags' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">Category:</span>
                <div className="flex space-x-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">Severity:</span>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:outline-none"
                >
                  {severities.map((severity) => (
                    <option key={severity.id} value={severity.id}>{severity.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Flags List */}
            <div className="space-y-4">
              {filteredFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="bg-gray-900 rounded-xl p-6 cursor-pointer hover:bg-gray-800 transition border-l-4"
                  style={{ borderLeftColor: flag.severity === 'critical' ? '#ef4444' : flag.severity === 'high' ? '#f97316' : flag.severity === 'medium' ? '#eab308' : '#22c55e' }}
                  onClick={() => setSelectedFlag(flag)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{flag.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${getSeverityColor(flag.severity)} text-white`}>
                          {flag.severity}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(flag.status)}`}>
                          {flag.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{flag.description}</p>

                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`font-medium ${getEscalationColor(flag.escalationLevel)}`}>
                          {flag.escalationLevel.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className="text-gray-400">
                          Detected: {new Date(flag.detectedAt).toLocaleDateString()}
                        </span>
                        <span className="text-purple-400">
                          AI Confidence: {flag.aiConfidence}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl mb-2">
                        {flag.category === 'urgent' ? '🚨' :
                         flag.category === 'warning' ? '⚠️' :
                         flag.category === 'monitoring' ? '👁️' : '🛡️'}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${getCategoryColor(flag.category)} text-white`}>
                        {flag.category}
                      </span>
                    </div>
                  </div>

                  {/* Triggers */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Triggers:</h4>
                    <div className="flex flex-wrap gap-1">
                      {flag.triggers.map((trigger, idx) => (
                        <span key={idx} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {flag.recommendedActions.slice(0, 2).map((action, idx) => (
                        <span key={idx} className="text-xs text-gray-400">• {action}</span>
                      ))}
                      {flag.recommendedActions.length > 2 && (
                        <span className="text-xs text-gray-400">+{flag.recommendedActions.length - 2} more</span>
                      )}
                    </div>
                    <button className="text-sm text-blue-400 hover:text-blue-300">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Health Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-blue-400">📊 Health Metrics Monitoring</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockHealthMetrics.map((metric) => {
                const status = getMetricStatus(metric);
                return (
                  <div key={metric.id} className={`p-6 rounded-xl border-2 ${
                    status === 'abnormal' ? 'bg-red-500/10 border-red-500/50' : 'bg-gray-900 border-gray-700'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{metric.name}</h3>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          status === 'abnormal' ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {metric.value} {metric.unit}
                        </div>
                        <div className="text-xs text-gray-400">
                          Normal: {metric.normalRange.min}-{metric.normalRange.max} {metric.unit}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-400">Status</span>
                        <span className={`font-medium ${
                          status === 'abnormal' ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {status === 'abnormal' ? '⚠️ Abnormal' : '✅ Normal'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-400">Trend</span>
                        <span className={`font-medium ${
                          metric.trend === 'improving' ? 'text-green-400' :
                          metric.trend === 'declining' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {metric.trend === 'improving' ? '📈 Improving' :
                           metric.trend === 'declining' ? '📉 Declining' : '➡️ Stable'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Last Updated</span>
                        <span className="text-white">{new Date(metric.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    {metric.flagTriggered && (
                      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-400">🚩</span>
                          <span className="text-red-400 text-sm font-medium">Flag Triggered</span>
                        </div>
                        <p className="text-red-300 text-sm mt-1">
                          This metric has triggered a red flag alert. Review recommended actions.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Alert Rules Tab */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-orange-400">⚙️ Alert Rules Configuration</h2>
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition">
                + New Rule
              </button>
            </div>

            <div className="space-y-4">
              {mockAlertRules.map((rule) => (
                <div key={rule.id} className="bg-gray-900 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{rule.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${getSeverityColor(rule.severity as any)} text-white`}>
                          {rule.severity}
                        </span>
                        <span className={`text-sm ${rule.enabled ? 'text-green-400' : 'text-red-400'}`}>
                          {rule.enabled ? '● Enabled' : '○ Disabled'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{rule.condition}</p>

                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-400">
                          Triggered: {rule.triggerCount} times
                        </span>
                        {rule.lastTriggered && (
                          <span className="text-gray-400">
                            Last: {new Date(rule.lastTriggered).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm font-medium transition">
                        Edit
                      </button>
                      <button className={`px-3 py-1 rounded text-sm font-medium transition ${
                        rule.enabled ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                      }`}>
                        {rule.enabled ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-green-400">📈 Red Flags Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Detection Performance */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Detection Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Average Detection Time</span>
                    <span className="text-white font-bold">4.2 hours</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">False Positive Rate</span>
                    <span className="text-green-400 font-bold">3.2%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">AI Confidence Average</span>
                    <span className="text-blue-400 font-bold">85%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Resolution Rate</span>
                    <span className="text-green-400 font-bold">92%</span>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Flags by Category</h3>
                <div className="space-y-3">
                  {[
                    { category: 'Urgent', count: 1, color: 'from-red-500 to-red-600' },
                    { category: 'Warning', count: 1, color: 'from-orange-500 to-orange-600' },
                    { category: 'Monitoring', count: 1, color: 'from-blue-500 to-blue-600' },
                    { category: 'Preventive', count: 1, color: 'from-green-500 to-green-600' }
                  ].map((cat) => (
                    <div key={cat.category} className="flex items-center justify-between">
                      <span className="text-white">{cat.category}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${cat.color} h-2 rounded-full`}
                            style={{ width: `${(cat.count / mockRedFlags.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-gray-400 text-sm w-6">{cat.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Times */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Response Times</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                    <h4 className="font-medium text-red-400 mb-2">Critical Alerts</h4>
                    <p className="text-sm text-gray-300">Average response: 2.1 hours</p>
                    <p className="text-xs text-gray-400">Target: &lt; 4 hours</p>
                  </div>
                  <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <h4 className="font-medium text-orange-400 mb-2">High Priority</h4>
                    <p className="text-sm text-gray-300">Average response: 8.3 hours</p>
                    <p className="text-xs text-gray-400">Target: &lt; 24 hours</p>
                  </div>
                  <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <h4 className="font-medium text-yellow-400 mb-2">Medium Priority</h4>
                    <p className="text-sm text-gray-300">Average response: 3.2 days</p>
                    <p className="text-xs text-gray-400">Target: &lt; 7 days</p>
                  </div>
                </div>
              </div>

              {/* System Health */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-lg font-bold text-green-400">99.7%</div>
                    <div className="text-sm text-gray-400">Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-lg font-bold text-blue-400">94%</div>
                    <div className="text-sm text-gray-400">Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-lg font-bold text-purple-400">1.2s</div>
                    <div className="text-sm text-gray-400">Response Time</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">🚨</div>
                    <div className="text-lg font-bold text-orange-400">247</div>
                    <div className="text-sm text-gray-400">Alerts This Month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Flag Detail Modal */}
        {selectedFlag && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">{selectedFlag.title}</h2>
                  <button
                    onClick={() => setSelectedFlag(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded text-sm font-medium bg-gradient-to-r ${getSeverityColor(selectedFlag.severity)} text-white`}>
                      {selectedFlag.severity} severity
                    </span>
                    <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(selectedFlag.status)}`}>
                      {selectedFlag.status}
                    </span>
                    <span className={`px-3 py-1 rounded text-sm font-medium bg-gradient-to-r ${getCategoryColor(selectedFlag.category)} text-white`}>
                      {selectedFlag.category}
                    </span>
                  </div>

                  <p className="text-gray-300">{selectedFlag.description}</p>

                  {/* AI Confidence */}
                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-400 font-medium">AI Confidence Level</span>
                      <span className="text-purple-400 font-bold">{selectedFlag.aiConfidence}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${selectedFlag.aiConfidence}%` }}
                      />
                    </div>
                  </div>

                  {/* Triggers */}
                  <div>
                    <h3 className="text-lg font-semibold text-red-400 mb-3">🚨 Trigger Conditions</h3>
                    <div className="space-y-2">
                      {selectedFlag.triggers.map((trigger, idx) => (
                        <div key={idx} className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                          <p className="text-red-300">{trigger}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-3">💡 Recommended Actions</h3>
                    <div className="space-y-3">
                      {selectedFlag.recommendedActions.map((action, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <span className="text-blue-400 font-bold">{idx + 1}.</span>
                          <p className="text-gray-300">{action}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Related Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold text-green-400 mb-3">📊 Related Health Metrics</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFlag.relatedMetrics.map((metric, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                          {metric.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-700">
                    <span>Detected: {new Date(selectedFlag.detectedAt).toLocaleString()}</span>
                    <span>Last Updated: {new Date(selectedFlag.lastUpdated).toLocaleString()}</span>
                    <span className={`font-medium ${getEscalationColor(selectedFlag.escalationLevel)}`}>
                      {selectedFlag.escalationLevel.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}