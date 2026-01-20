"use client";

import React, { useState, useEffect, useMemo } from 'react';

// Dynamic UX Adaptation Types
type UXPreference = {
  id: string;
  category: 'layout' | 'theme' | 'navigation' | 'content' | 'interactions';
  preference: string;
  confidence: number;
  lastUpdated: string;
  source: 'behavior' | 'explicit' | 'context';
};

type AdaptationRule = {
  id: string;
  trigger: string;
  condition: string;
  action: string;
  priority: number;
  active: boolean;
  performance: number;
};

type UserContext = {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  userState: 'new' | 'returning' | 'power';
  currentTask: string;
  emotionalState: 'focused' | 'stressed' | 'relaxed' | 'tired';
  location: 'home' | 'work' | 'travel' | 'unknown';
};

type AdaptationMetric = {
  metric: string;
  baseline: number;
  current: number;
  improvement: number;
  confidence: number;
};

// Mock data for demonstration
const mockPreferences: UXPreference[] = [
  {
    id: 'pref-1',
    category: 'layout',
    preference: 'Compact card layout with side navigation',
    confidence: 94,
    lastUpdated: '2026-01-20T10:30:00Z',
    source: 'behavior'
  },
  {
    id: 'pref-2',
    category: 'theme',
    preference: 'Dark mode with blue accent colors',
    confidence: 87,
    lastUpdated: '2026-01-19T18:45:00Z',
    source: 'explicit'
  },
  {
    id: 'pref-3',
    category: 'navigation',
    preference: 'Tab-based navigation with quick actions',
    confidence: 91,
    lastUpdated: '2026-01-20T08:15:00Z',
    source: 'behavior'
  },
  {
    id: 'pref-4',
    category: 'content',
    preference: 'Prioritize visual data over text-heavy content',
    confidence: 78,
    lastUpdated: '2026-01-19T14:20:00Z',
    source: 'context'
  },
  {
    id: 'pref-5',
    category: 'interactions',
    preference: 'Hover previews and keyboard shortcuts',
    confidence: 85,
    lastUpdated: '2026-01-18T16:30:00Z',
    source: 'behavior'
  }
];

const mockRules: AdaptationRule[] = [
  {
    id: 'rule-1',
    trigger: 'Mobile device detected',
    condition: 'Screen width < 768px',
    action: 'Switch to mobile-optimized layout with bottom navigation',
    priority: 9,
    active: true,
    performance: 94
  },
  {
    id: 'rule-2',
    trigger: 'Evening usage (6-10 PM)',
    condition: 'Time between 18:00-22:00',
    action: 'Reduce blue light, increase font size, show relaxation features',
    priority: 7,
    active: true,
    performance: 89
  },
  {
    id: 'rule-3',
    trigger: 'High stress detected',
    condition: 'Typing speed > 200 WPM with frequent corrections',
    action: 'Simplify interface, show calming colors, reduce cognitive load',
    priority: 8,
    active: true,
    performance: 91
  },
  {
    id: 'rule-4',
    trigger: 'New user session',
    condition: 'First visit in 7 days',
    action: 'Show onboarding hints, highlight key features, reduce information density',
    priority: 10,
    active: true,
    performance: 96
  },
  {
    id: 'rule-5',
    trigger: 'Goal-focused task',
    condition: 'User navigating to goals section',
    action: 'Pre-load relevant data, show progress indicators, hide distractions',
    priority: 6,
    active: true,
    performance: 87
  }
];

const mockContext: UserContext = {
  timeOfDay: 'afternoon',
  deviceType: 'desktop',
  userState: 'power',
  currentTask: 'Reviewing health analytics',
  emotionalState: 'focused',
  location: 'home'
};

const mockMetrics: AdaptationMetric[] = [
  { metric: 'Task Completion Time', baseline: 100, current: 87, improvement: 13, confidence: 92 },
  { metric: 'User Engagement Score', baseline: 100, current: 115, improvement: 15, confidence: 88 },
  { metric: 'Error Rate', baseline: 100, current: 78, improvement: 22, confidence: 95 },
  { metric: 'Feature Discovery', baseline: 100, current: 142, improvement: 42, confidence: 91 },
  { metric: 'Session Duration', baseline: 100, current: 128, improvement: 28, confidence: 89 }
];

export default function DynamicUXAdaptation() {
  const [activeTab, setActiveTab] = useState<'preferences' | 'rules' | 'context' | 'metrics' | 'preview'>('preferences');
  const [selectedRule, setSelectedRule] = useState<AdaptationRule | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const getCategoryColor = (category: UXPreference['category']) => {
    const colors = {
      layout: 'from-blue-500 to-blue-600',
      theme: 'from-purple-500 to-purple-600',
      navigation: 'from-green-500 to-green-600',
      content: 'from-orange-500 to-orange-600',
      interactions: 'from-pink-500 to-pink-600'
    };
    return colors[category];
  };

  const getSourceColor = (source: UXPreference['source']) => {
    const colors = {
      behavior: 'text-blue-400',
      explicit: 'text-green-400',
      context: 'text-purple-400'
    };
    return colors[source];
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 9) return 'text-red-400 bg-red-500/20';
    if (priority >= 7) return 'text-orange-400 bg-orange-500/20';
    return 'text-green-400 bg-green-500/20';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
            Dynamic UX Adaptation
          </h1>
          <p className="text-gray-400">
            AI-powered interface personalization that adapts to your behavior, preferences, and context
          </p>
        </div>

        {/* Current Context Display */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-purple-400 mb-4">🎯 Current User Context</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-black/40 rounded-lg">
              <div className="text-2xl mb-1">
                {mockContext.timeOfDay === 'morning' ? '🌅' :
                 mockContext.timeOfDay === 'afternoon' ? '☀️' :
                 mockContext.timeOfDay === 'evening' ? '🌆' : '🌙'}
              </div>
              <div className="text-sm text-gray-400 capitalize">{mockContext.timeOfDay}</div>
            </div>
            <div className="text-center p-3 bg-black/40 rounded-lg">
              <div className="text-2xl mb-1">
                {mockContext.deviceType === 'mobile' ? '📱' :
                 mockContext.deviceType === 'tablet' ? '📱' : '💻'}
              </div>
              <div className="text-sm text-gray-400 capitalize">{mockContext.deviceType}</div>
            </div>
            <div className="text-center p-3 bg-black/40 rounded-lg">
              <div className="text-2xl mb-1">
                {mockContext.userState === 'new' ? '👋' :
                 mockContext.userState === 'returning' ? '🔄' : '⚡'}
              </div>
              <div className="text-sm text-gray-400 capitalize">{mockContext.userState} User</div>
            </div>
            <div className="text-center p-3 bg-black/40 rounded-lg">
              <div className="text-2xl mb-1">
                {mockContext.emotionalState === 'focused' ? '🎯' :
                 mockContext.emotionalState === 'stressed' ? '😰' :
                 mockContext.emotionalState === 'relaxed' ? '😌' : '😴'}
              </div>
              <div className="text-sm text-gray-400 capitalize">{mockContext.emotionalState}</div>
            </div>
            <div className="text-center p-3 bg-black/40 rounded-lg">
              <div className="text-2xl mb-1">
                {mockContext.location === 'home' ? '🏠' :
                 mockContext.location === 'work' ? '🏢' :
                 mockContext.location === 'travel' ? '✈️' : '📍'}
              </div>
              <div className="text-sm text-gray-400 capitalize">{mockContext.location}</div>
            </div>
            <div className="text-center p-3 bg-black/40 rounded-lg">
              <div className="text-2xl mb-1">🎮</div>
              <div className="text-sm text-gray-400">Active Task</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <p className="text-purple-300 text-sm">
              <strong>Current Task:</strong> {mockContext.currentTask}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900 p-1 rounded-lg">
          {[
            { id: 'preferences', label: 'Learned Preferences', icon: '🧠' },
            { id: 'rules', label: 'Adaptation Rules', icon: '⚙️' },
            { id: 'context', label: 'Context Awareness', icon: '👁️' },
            { id: 'metrics', label: 'Performance Metrics', icon: '📊' },
            { id: 'preview', label: 'Live Preview', icon: '👀' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-purple-400">🧠 Learned Preferences</h2>
              <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-medium transition">
                + Add Preference
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockPreferences.map((pref) => (
                <div key={pref.id} className="bg-gray-900 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${getCategoryColor(pref.category)} text-white`}>
                          {pref.category}
                        </span>
                        <span className={`text-xs ${getSourceColor(pref.source)}`}>
                          {pref.source}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{pref.preference}</h3>
                      <p className="text-sm text-gray-400">
                        Last updated: {new Date(pref.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">{pref.confidence}%</div>
                      <div className="text-xs text-gray-400">Confidence</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="text-sm text-blue-400 hover:text-blue-300">Edit</button>
                      <button className="text-sm text-red-400 hover:text-red-300">Remove</button>
                    </div>
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                        style={{ width: `${pref.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Preference Learning Insights */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">🔍 How Preferences Are Learned</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h4 className="font-medium text-blue-400 mb-2">Behavioral Analysis</h4>
                  <p className="text-sm text-gray-300">
                    Tracks clicks, scrolling, time spent, and interaction patterns to understand preferences.
                  </p>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <h4 className="font-medium text-green-400 mb-2">Explicit Settings</h4>
                  <p className="text-sm text-gray-300">
                    User-defined preferences through settings panels and configuration options.
                  </p>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <h4 className="font-medium text-purple-400 mb-2">Context Awareness</h4>
                  <p className="text-sm text-gray-300">
                    Adapts based on time, device, location, and environmental factors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-orange-400">⚙️ Adaptation Rules</h2>
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition">
                + New Rule
              </button>
            </div>

            <div className="space-y-4">
              {mockRules.map((rule) => (
                <div key={rule.id} className="bg-gray-900 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(rule.priority)}`}>
                          Priority {rule.priority}
                        </span>
                        <span className={`text-sm ${rule.active ? 'text-green-400' : 'text-red-400'}`}>
                          {rule.active ? '● Active' : '○ Inactive'}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">{rule.trigger}</h3>
                      <p className="text-sm text-gray-400 mb-2">{rule.condition}</p>
                      <p className="text-gray-300">{rule.action}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">{rule.performance}%</div>
                      <div className="text-xs text-gray-400">Performance</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setSelectedRule(rule)}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        View Details
                      </button>
                      <button className="text-sm text-orange-400 hover:text-orange-300">Edit</button>
                      <button className={`text-sm ${rule.active ? 'text-red-400' : 'text-green-400'} hover:opacity-80`}>
                        {rule.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        style={{ width: `${rule.performance}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'context' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-green-400">👁️ Context Awareness Engine</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Real-time Context Monitoring */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📊 Real-time Context Monitoring</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Device Type</span>
                    <span className="text-white font-medium capitalize">{mockContext.deviceType}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Screen Size</span>
                    <span className="text-white font-medium">1920x1080</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Connection Speed</span>
                    <span className="text-green-400 font-medium">Fast (100 Mbps)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Battery Level</span>
                    <span className="text-yellow-400 font-medium">78%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Time Zone</span>
                    <span className="text-white font-medium">EST (UTC-5)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Session Duration</span>
                    <span className="text-white font-medium">24m 32s</span>
                  </div>
                </div>
              </div>

              {/* Behavioral Context */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🧠 Behavioral Context</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Typing Speed</span>
                    <span className="text-white font-medium">87 WPM</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Click Frequency</span>
                    <span className="text-white font-medium">2.3 clicks/min</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Scroll Behavior</span>
                    <span className="text-blue-400 font-medium">Smooth scrolling</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Feature Usage</span>
                    <span className="text-green-400 font-medium">High engagement</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Error Rate</span>
                    <span className="text-green-400 font-medium">0.2%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Task Completion</span>
                    <span className="text-white font-medium">94%</span>
                  </div>
                </div>
              </div>

              {/* Environmental Context */}
              <div className="bg-gray-900 rounded-xl p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">🌍 Environmental Context</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">🌡️</div>
                    <div className="text-lg font-bold text-white">72°F</div>
                    <div className="text-sm text-gray-400">Temperature</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">💡</div>
                    <div className="text-lg font-bold text-white">Well Lit</div>
                    <div className="text-sm text-gray-400">Lighting</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">🔊</div>
                    <div className="text-lg font-bold text-white">Quiet</div>
                    <div className="text-sm text-gray-400">Noise Level</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">📶</div>
                    <div className="text-lg font-bold text-green-400">Strong</div>
                    <div className="text-sm text-gray-400">Connectivity</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-blue-400">📊 Performance Metrics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Adaptation Performance */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🎯 Adaptation Performance</h3>
                <div className="space-y-4">
                  {mockMetrics.map((metric, index) => (
                    <div key={index} className="p-4 bg-black/40 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{metric.metric}</h4>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">+{metric.improvement}%</div>
                          <div className="text-xs text-gray-400">vs baseline</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                              style={{ width: `${(metric.current / metric.baseline) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-gray-400">{metric.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* A/B Testing Results */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🧪 A/B Testing Results</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-green-400">Compact Layout vs Standard</h4>
                      <span className="text-sm text-green-400">Winner: Compact</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      Compact layout increased task completion by 23% and reduced bounce rate by 18%.
                    </p>
                    <div className="text-xs text-green-400">Confidence: 96%</div>
                  </div>

                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-blue-400">Dark Theme vs Light Theme</h4>
                      <span className="text-sm text-blue-400">Winner: Dark</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      Dark theme improved user engagement by 31% and reduced eye strain reports by 67%.
                    </p>
                    <div className="text-xs text-blue-400">Confidence: 92%</div>
                  </div>

                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-purple-400">Tab Navigation vs Sidebar</h4>
                      <span className="text-sm text-purple-400">Winner: Tabs</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      Tab navigation reduced navigation time by 28% and increased feature discovery by 42%.
                    </p>
                    <div className="text-xs text-purple-400">Confidence: 89%</div>
                  </div>
                </div>
              </div>

              {/* System Health */}
              <div className="bg-gray-900 rounded-xl p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">⚡ System Health</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">🚀</div>
                    <div className="text-lg font-bold text-green-400">99.7%</div>
                    <div className="text-sm text-gray-400">Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-lg font-bold text-blue-400">142ms</div>
                    <div className="text-sm text-gray-400">Response Time</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-lg font-bold text-purple-400">94%</div>
                    <div className="text-sm text-gray-400">Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">👥</div>
                    <div className="text-lg font-bold text-orange-400">1,247</div>
                    <div className="text-sm text-gray-400">Active Users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-pink-400">👀 Live Preview</h2>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg font-medium transition"
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>

            {showPreview && (
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🎨 Adapted Interface Preview</h3>
                <div className="bg-black rounded-lg p-4 border border-gray-700">
                  <div className="text-center text-gray-400 py-8">
                    <div className="text-4xl mb-4">🎭</div>
                    <p>Live interface adaptation preview would appear here</p>
                    <p className="text-sm mt-2">This would show how the interface adapts in real-time based on current context</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Adaptation Examples */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🔄 Adaptation Examples</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <h4 className="font-medium text-blue-400 mb-2">Mobile Adaptation</h4>
                    <p className="text-sm text-gray-300">
                      Bottom navigation, larger touch targets, simplified layout
                    </p>
                  </div>
                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <h4 className="font-medium text-purple-400 mb-2">Evening Mode</h4>
                    <p className="text-sm text-gray-300">
                      Warmer colors, reduced blue light, larger fonts
                    </p>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <h4 className="font-medium text-green-400 mb-2">Focus Mode</h4>
                    <p className="text-sm text-gray-300">
                      Distraction-free layout, progress indicators, streamlined navigation
                    </p>
                  </div>
                </div>
              </div>

              {/* Customization Options */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">⚙️ Customization Options</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Auto-adaptation</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Context awareness</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Behavioral learning</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">A/B testing</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rule Detail Modal */}
        {selectedRule && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">Rule Details</h2>
                  <button
                    onClick={() => setSelectedRule(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Trigger</h3>
                    <p className="text-white bg-black/40 rounded-lg p-3">{selectedRule.trigger}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Condition</h3>
                    <p className="text-gray-300 bg-black/40 rounded-lg p-3">{selectedRule.condition}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Action</h3>
                    <p className="text-blue-300 bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                      {selectedRule.action}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-300 mb-2">Priority</h3>
                      <div className={`px-3 py-2 rounded-lg text-center font-medium ${getPriorityColor(selectedRule.priority)}`}>
                        {selectedRule.priority}/10
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-300 mb-2">Performance</h3>
                      <div className="px-3 py-2 bg-blue-500/20 rounded-lg text-center">
                        <div className="text-xl font-bold text-blue-400">{selectedRule.performance}%</div>
                      </div>
                    </div>
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