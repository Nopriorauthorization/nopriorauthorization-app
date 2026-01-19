"use client";

import React, { useState } from 'react';
import { format, parseISO, subDays, differenceInDays } from 'date-fns';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Pattern Recognition Types
type HealthPattern = {
  id: string;
  name: string;
  type: 'correlation' | 'cyclical' | 'seasonal' | 'behavioral' | 'medication-response' | 'lifestyle';
  description: string;
  strength: 'very-weak' | 'weak' | 'moderate' | 'strong' | 'very-strong';
  confidence: number; // 0-100
  significance: 'low' | 'medium' | 'high' | 'critical';
  correlationCoefficient: number; // -1 to 1
  pValue: number; // statistical significance
  dataPoints: number;
  timespan: string;
  discoveredDate: string;
  lastValidated: string;
  metrics: string[];
  triggers: string[];
  outcomes: string[];
  actionable: boolean;
  clinicalRelevance: 'low' | 'medium' | 'high' | 'very-high';
  patientSpecific: boolean;
  generalizability: number; // 0-100
};

type Anomaly = {
  id: string;
  metric: string;
  value: number;
  expectedValue: number;
  deviation: number;
  severity: 'minor' | 'moderate' | 'significant' | 'critical';
  type: 'spike' | 'drop' | 'trend-break' | 'outlier' | 'missing-data';
  detectedAt: string;
  context: string[];
  possibleCauses: string[];
  recommendedActions: string[];
  resolved: boolean;
  aiConfidence: number;
};

type TrendAnalysis = {
  metric: string;
  direction: 'improving' | 'worsening' | 'stable' | 'volatile';
  velocity: number; // rate of change
  trajectory: 'linear' | 'exponential' | 'logarithmic' | 'cyclical';
  timeframe: string;
  prediction: {
    nextValue: number;
    confidenceInterval: [number, number];
    reliability: number;
  };
  inflectionPoints: {
    date: string;
    type: 'improvement' | 'decline' | 'stabilization';
    confidence: number;
  }[];
};

type CorrelationNetwork = {
  nodes: {
    id: string;
    metric: string;
    category: string;
    influence: number;
    centrality: number;
  }[];
  edges: {
    source: string;
    target: string;
    correlation: number;
    strength: 'weak' | 'moderate' | 'strong' | 'very-strong';
    delay: number; // time delay in days
    bidirectional: boolean;
  }[];
};

// Sample data
const healthPatterns: HealthPattern[] = [
  {
    id: 'pattern-1',
    name: 'Exercise-Blood Pressure Correlation',
    type: 'correlation',
    description: 'Strong negative correlation between morning exercise duration and next-day blood pressure readings',
    strength: 'strong',
    confidence: 87,
    significance: 'high',
    correlationCoefficient: -0.73,
    pValue: 0.001,
    dataPoints: 156,
    timespan: '6 months',
    discoveredDate: '2025-12-15',
    lastValidated: '2026-01-18',
    metrics: ['Exercise Duration', 'Systolic BP', 'Diastolic BP'],
    triggers: ['Morning exercise sessions >20 minutes', 'Aerobic activity', 'Consistent timing'],
    outcomes: ['8-12 mmHg systolic reduction', 'Sustained for 18-24 hours', 'Cumulative effect over time'],
    actionable: true,
    clinicalRelevance: 'very-high',
    patientSpecific: true,
    generalizability: 75
  },
  {
    id: 'pattern-2',
    name: 'Sleep-Glucose Relationship',
    type: 'behavioral',
    description: 'Poor sleep quality (<6 hours) correlates with elevated morning glucose readings',
    strength: 'moderate',
    confidence: 79,
    significance: 'high',
    correlationCoefficient: 0.64,
    pValue: 0.003,
    dataPoints: 89,
    timespan: '3 months',
    discoveredDate: '2025-11-22',
    lastValidated: '2026-01-15',
    metrics: ['Sleep Duration', 'Sleep Quality Score', 'Morning Glucose'],
    triggers: ['Sleep <6 hours', 'Poor sleep quality', 'Late bedtime >11 PM'],
    outcomes: ['15-20 mg/dL higher glucose', 'Increased insulin resistance', 'Afternoon energy crashes'],
    actionable: true,
    clinicalRelevance: 'high',
    patientSpecific: true,
    generalizability: 82
  },
  {
    id: 'pattern-3',
    name: 'Weekly Stress-Appointment Cycle',
    type: 'cyclical',
    description: 'Stress levels follow 7-day cycle, peaking on Mondays and affecting appointment adherence',
    strength: 'moderate',
    confidence: 71,
    significance: 'medium',
    correlationCoefficient: 0.58,
    pValue: 0.02,
    dataPoints: 48,
    timespan: '12 months',
    discoveredDate: '2025-10-08',
    lastValidated: '2026-01-12',
    metrics: ['Self-reported stress', 'Appointment attendance', 'Work schedule intensity'],
    triggers: ['Monday work meetings', 'Week start pressure', 'Weekend-weekday transition'],
    outcomes: ['47% higher cancellation rate', 'Preference for Friday appointments', 'Delayed care seeking'],
    actionable: true,
    clinicalRelevance: 'medium',
    patientSpecific: false,
    generalizability: 65
  },
  {
    id: 'pattern-4',
    name: 'Medication Timing Optimization',
    type: 'medication-response',
    description: 'Diabetes medication shows 15% better efficacy when taken 15 minutes before first meal',
    strength: 'strong',
    confidence: 91,
    significance: 'critical',
    correlationCoefficient: -0.68,
    pValue: 0.0001,
    dataPoints: 203,
    timespan: '8 months',
    discoveredDate: '2025-09-14',
    lastValidated: '2026-01-16',
    metrics: ['Medication timing', 'Post-meal glucose', 'HbA1c trend', 'Side effects'],
    triggers: ['Medication 15 min pre-meal', 'Consistent breakfast timing', 'Meal composition stable'],
    outcomes: ['15% better glucose control', 'Reduced post-meal spikes', 'Fewer side effects'],
    actionable: true,
    clinicalRelevance: 'very-high',
    patientSpecific: true,
    generalizability: 88
  },
  {
    id: 'pattern-5',
    name: 'Seasonal Weight Fluctuation',
    type: 'seasonal',
    description: 'Weight shows predictable seasonal pattern with 3-5 lb gain during winter months',
    strength: 'moderate',
    confidence: 84,
    significance: 'medium',
    correlationCoefficient: 0.72,
    pValue: 0.005,
    dataPoints: 365,
    timespan: '24 months',
    discoveredDate: '2025-08-03',
    lastValidated: '2026-01-10',
    metrics: ['Daily weight', 'Seasonal temperature', 'Activity levels', 'Mood scores'],
    triggers: ['Temperature <40°F', 'Daylight <10 hours', 'Holiday season'],
    outcomes: ['3-5 lb weight gain', 'Decreased activity', 'Comfort eating patterns'],
    actionable: true,
    clinicalRelevance: 'medium',
    patientSpecific: false,
    generalizability: 92
  }
];

const anomalies: Anomaly[] = [
  {
    id: 'anomaly-1',
    metric: 'Blood Pressure',
    value: 158,
    expectedValue: 122,
    deviation: 36,
    severity: 'significant',
    type: 'spike',
    detectedAt: '2026-01-17',
    context: ['Unusual reading', 'Outside normal pattern', 'No recent medication changes'],
    possibleCauses: ['Measurement error', 'Acute stress', 'Sodium intake', 'Dehydration'],
    recommendedActions: ['Re-measure BP', 'Review recent diet', 'Check hydration', 'Contact provider if persists'],
    resolved: false,
    aiConfidence: 82
  },
  {
    id: 'anomaly-2',
    metric: 'Daily Steps',
    value: 1250,
    expectedValue: 8500,
    deviation: -7250,
    severity: 'moderate',
    type: 'drop',
    detectedAt: '2026-01-16',
    context: ['Significant decrease', 'Below 7-day average', 'Weekend pattern broken'],
    possibleCauses: ['Illness', 'Weather conditions', 'Schedule disruption', 'Device not worn'],
    recommendedActions: ['Check if feeling unwell', 'Verify device function', 'Plan indoor activities'],
    resolved: true,
    aiConfidence: 76
  }
];

const trendAnalyses: TrendAnalysis[] = [
  {
    metric: 'HbA1c',
    direction: 'improving',
    velocity: -0.1, // decreasing by 0.1% per month
    trajectory: 'linear',
    timeframe: '6 months',
    prediction: {
      nextValue: 5.7,
      confidenceInterval: [5.5, 5.9],
      reliability: 89
    },
    inflectionPoints: [
      {
        date: '2025-09-15',
        type: 'improvement',
        confidence: 91
      }
    ]
  },
  {
    metric: 'Weight',
    direction: 'stable',
    velocity: 0.2, // slight increase
    trajectory: 'cyclical',
    timeframe: '3 months',
    prediction: {
      nextValue: 161,
      confidenceInterval: [158, 164],
      reliability: 78
    },
    inflectionPoints: [
      {
        date: '2025-12-01',
        type: 'stabilization',
        confidence: 85
      }
    ]
  }
];

const correlationNetwork: CorrelationNetwork = {
  nodes: [
    { id: 'exercise', metric: 'Exercise Duration', category: 'lifestyle', influence: 0.85, centrality: 0.72 },
    { id: 'bp', metric: 'Blood Pressure', category: 'vital', influence: 0.78, centrality: 0.68 },
    { id: 'sleep', metric: 'Sleep Quality', category: 'lifestyle', influence: 0.71, centrality: 0.55 },
    { id: 'glucose', metric: 'Blood Glucose', category: 'metabolic', influence: 0.82, centrality: 0.61 },
    { id: 'stress', metric: 'Stress Level', category: 'mental', influence: 0.65, centrality: 0.48 },
    { id: 'weight', metric: 'Weight', category: 'physical', influence: 0.59, centrality: 0.41 }
  ],
  edges: [
    { source: 'exercise', target: 'bp', correlation: -0.73, strength: 'strong', delay: 1, bidirectional: false },
    { source: 'sleep', target: 'glucose', correlation: -0.64, strength: 'moderate', delay: 0, bidirectional: false },
    { source: 'stress', target: 'bp', correlation: 0.58, strength: 'moderate', delay: 0, bidirectional: true },
    { source: 'exercise', target: 'weight', correlation: -0.52, strength: 'moderate', delay: 7, bidirectional: false },
    { source: 'glucose', target: 'weight', correlation: 0.43, strength: 'weak', delay: 30, bidirectional: true }
  ]
};

// Sample visualization data
const patternStrengthData = [
  { pattern: 'Exercise-BP', strength: 87, points: 156 },
  { pattern: 'Sleep-Glucose', strength: 79, points: 89 },
  { pattern: 'Stress-Appointments', strength: 71, points: 48 },
  { pattern: 'Med Timing', strength: 91, points: 203 },
  { pattern: 'Seasonal Weight', strength: 84, points: 365 }
];

const anomalyTimelineData = [
  { date: '2026-01-10', count: 0, severity: 'none' },
  { date: '2026-01-11', count: 1, severity: 'minor' },
  { date: '2026-01-12', count: 0, severity: 'none' },
  { date: '2026-01-13', count: 2, severity: 'moderate' },
  { date: '2026-01-14', count: 0, severity: 'none' },
  { date: '2026-01-15', count: 1, severity: 'moderate' },
  { date: '2026-01-16', count: 2, severity: 'moderate' },
  { date: '2026-01-17', count: 3, severity: 'significant' },
  { date: '2026-01-18', count: 0, severity: 'none' }
];

export default function HealthPatternRecognition() {
  const [activeTab, setActiveTab] = useState<'patterns' | 'anomalies' | 'trends' | 'correlations' | 'insights'>('patterns');
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | '3months' | '6months' | 'year'>('3months');
  const [showOnlyActionable, setShowOnlyActionable] = useState(false);

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'very-strong': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'strong': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'weak': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'very-weak': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'significant': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'minor': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'correlation': return '📊';
      case 'cyclical': return '🔄';
      case 'seasonal': return '🌱';
      case 'behavioral': return '🧠';
      case 'medication-response': return '💊';
      case 'lifestyle': return '🏃';
      default: return '🔍';
    }
  };

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case 'very-high': return 'text-purple-400 bg-purple-500/20';
      case 'high': return 'text-blue-400 bg-blue-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filteredPatterns = showOnlyActionable 
    ? healthPatterns.filter(p => p.actionable)
    : healthPatterns;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Health Pattern Recognition
              </h1>
              <p className="text-gray-400">
                AI-powered analysis of health patterns, trends, and correlations in your data
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-purple-400 text-sm font-medium">Analyzing</span>
              </div>
              <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition">
                Generate Report
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Patterns Found</p>
                  <p className="text-2xl font-bold text-white">{healthPatterns.length}</p>
                </div>
                <div className="text-2xl">🧩</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Strong Correlations</p>
                  <p className="text-2xl font-bold text-white">
                    {healthPatterns.filter(p => p.strength === 'strong' || p.strength === 'very-strong').length}
                  </p>
                </div>
                <div className="text-2xl">📈</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl border border-yellow-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-medium">Anomalies Today</p>
                  <p className="text-2xl font-bold text-white">{anomalies.filter(a => !a.resolved).length}</p>
                </div>
                <div className="text-2xl">⚠️</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Actionable Insights</p>
                  <p className="text-2xl font-bold text-white">
                    {healthPatterns.filter(p => p.actionable).length}
                  </p>
                </div>
                <div className="text-2xl">🎯</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'patterns', label: 'Health Patterns', icon: '🧩' },
              { id: 'anomalies', label: 'Anomalies', icon: '⚠️' },
              { id: 'trends', label: 'Trend Analysis', icon: '📈' },
              { id: 'correlations', label: 'Correlations', icon: '🔗' },
              { id: 'insights', label: 'AI Insights', icon: '💡' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'patterns' && (
          <div>
            {/* Filters */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                >
                  <option value="week">1 Week</option>
                  <option value="month">1 Month</option>
                  <option value="3months">3 Months</option>
                  <option value="6months">6 Months</option>
                  <option value="year">1 Year</option>
                </select>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showOnlyActionable}
                    onChange={(e) => setShowOnlyActionable(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-300">Show only actionable patterns</span>
                </label>
              </div>
              
              <div className="text-sm text-gray-400">
                {filteredPatterns.length} of {healthPatterns.length} patterns
              </div>
            </div>

            {/* Pattern Strength Overview */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Pattern Strength Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={patternStrengthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="pattern" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                    <Bar dataKey="strength" fill="url(#gradientBar)" />
                    <defs>
                      <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pattern Cards */}
            <div className="space-y-6">
              {filteredPatterns.map((pattern) => (
                <div key={pattern.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getPatternIcon(pattern.type)}</span>
                        <h4 className="text-xl font-semibold text-white">{pattern.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStrengthColor(pattern.strength)}`}>
                          {pattern.strength.replace('-', ' ').toUpperCase()}
                        </span>
                        {pattern.actionable && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium text-green-400 bg-green-500/20">
                            ACTIONABLE
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 mb-3">{pattern.description}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-pink-400 mb-1">{pattern.confidence}%</div>
                      <p className="text-xs text-gray-400">AI Confidence</p>
                    </div>
                  </div>

                  {/* Statistical Details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-black/20 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{pattern.correlationCoefficient.toFixed(2)}</div>
                      <p className="text-xs text-gray-400">Correlation</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{pattern.pValue.toFixed(4)}</div>
                      <p className="text-xs text-gray-400">P-Value</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{pattern.dataPoints}</div>
                      <p className="text-xs text-gray-400">Data Points</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{pattern.timespan}</div>
                      <p className="text-xs text-gray-400">Timespan</p>
                    </div>
                  </div>

                  {/* Triggers and Outcomes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h5 className="text-sm font-medium text-white mb-2">🔍 Pattern Triggers:</h5>
                      <ul className="space-y-1">
                        {pattern.triggers.map((trigger, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            {trigger}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-white mb-2">🎯 Observed Outcomes:</h5>
                      <ul className="space-y-1">
                        {pattern.outcomes.map((outcome, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-pink-400 mt-1">→</span>
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Pattern Metrics */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs text-gray-400">Metrics:</span>
                    {pattern.metrics.map((metric, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                        {metric}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>Clinical Relevance:</span>
                      <span className={`px-2 py-1 rounded-full font-medium ${getRelevanceColor(pattern.clinicalRelevance)}`}>
                        {pattern.clinicalRelevance.replace('-', ' ').toUpperCase()}
                      </span>
                      <span>Discovered: {format(parseISO(pattern.discoveredDate), 'MMM dd, yyyy')}</span>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedPattern(selectedPattern === pattern.id ? null : pattern.id)}
                      className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded text-sm hover:bg-purple-500/30 transition"
                    >
                      {selectedPattern === pattern.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {selectedPattern === pattern.id && (
                    <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Significance Level:</span>
                          <p className="text-white">{pattern.significance} ({pattern.pValue < 0.001 ? 'p < 0.001' : `p = ${pattern.pValue}`})</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Patient-Specific:</span>
                          <p className="text-white">{pattern.patientSpecific ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Generalizability:</span>
                          <p className="text-white">{pattern.generalizability}%</p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-gray-400 text-sm">Last Validated:</span>
                        <p className="text-white">{format(parseISO(pattern.lastValidated), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'anomalies' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-white">Health Data Anomalies</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">
                  {anomalies.filter(a => !a.resolved).length} active anomalies
                </span>
                <button className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition">
                  Alert Provider
                </button>
              </div>
            </div>

            {/* Anomaly Timeline */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6 mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">Anomaly Timeline (Last 9 Days)</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={anomalyTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      tickFormatter={(date) => format(parseISO(date), 'MMM dd')}
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      labelFormatter={(date) => format(parseISO(date), 'MMM dd, yyyy')} 
                    />
                    <Line type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={2} name="Anomaly Count" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Anomaly List */}
            <div className="space-y-4">
              {anomalies.map((anomaly) => (
                <div key={anomaly.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-white">{anomaly.metric} Anomaly</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(anomaly.severity)}`}>
                          {anomaly.severity.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          anomaly.type === 'spike' ? 'text-red-400 bg-red-500/20' :
                          anomaly.type === 'drop' ? 'text-blue-400 bg-blue-500/20' :
                          anomaly.type === 'outlier' ? 'text-purple-400 bg-purple-500/20' :
                          'text-gray-400 bg-gray-500/20'
                        }`}>
                          {anomaly.type.replace('-', ' ').toUpperCase()}
                        </span>
                        {anomaly.resolved && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium text-green-400 bg-green-500/20">
                            RESOLVED
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">
                        Detected: {format(parseISO(anomaly.detectedAt), 'MMM dd, yyyy h:mm a')}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white mb-1">{anomaly.aiConfidence}%</div>
                      <p className="text-xs text-gray-400">AI Confidence</p>
                    </div>
                  </div>

                  {/* Anomaly Values */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-black/20 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-400">{anomaly.value}</div>
                      <p className="text-xs text-gray-400">Actual Value</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{anomaly.expectedValue}</div>
                      <p className="text-xs text-gray-400">Expected Value</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400">
                        {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation}
                      </div>
                      <p className="text-xs text-gray-400">Deviation</p>
                    </div>
                  </div>

                  {/* Context and Causes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h5 className="text-sm font-medium text-white mb-2">📋 Context:</h5>
                      <ul className="space-y-1">
                        {anomaly.context.map((ctx, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            {ctx}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-white mb-2">🔍 Possible Causes:</h5>
                      <ul className="space-y-1">
                        {anomaly.possibleCauses.map((cause, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">→</span>
                            {cause}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommended Actions */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-white mb-2">🎯 Recommended Actions:</h5>
                    <ul className="space-y-1">
                      {anomaly.recommendedActions.map((action, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-pink-400 mt-1">✓</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {!anomaly.resolved && (
                      <button className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition">
                        Mark Resolved
                      </button>
                    )}
                    <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition">
                      View Data Context
                    </button>
                    <button className="px-4 py-2 bg-gray-500/20 border border-gray-500/30 text-gray-400 rounded-lg hover:bg-gray-500/30 transition">
                      Add to Journal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab === 'trends' && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-2xl font-semibold text-white mb-2">Advanced Trend Analysis</h3>
            <p className="text-gray-400">Predictive trend modeling and trajectory analysis coming soon!</p>
          </div>
        )}

        {activeTab === 'correlations' && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-6xl mb-4">🔗</div>
            <h3 className="text-2xl font-semibold text-white mb-2">Correlation Network Analysis</h3>
            <p className="text-gray-400">Interactive correlation network visualization coming soon!</p>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-6xl mb-4">💡</div>
            <h3 className="text-2xl font-semibold text-white mb-2">AI-Generated Insights</h3>
            <p className="text-gray-400">Advanced AI insights and recommendations coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}