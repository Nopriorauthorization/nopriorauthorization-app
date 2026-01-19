"use client";

import React, { useState } from 'react';
import { format, parseISO, subDays, subWeeks, subMonths } from 'date-fns';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

// AI Insights Types
type HealthRisk = {
  id: string;
  type: 'cardiovascular' | 'diabetes' | 'metabolic' | 'mental-health' | 'chronic-condition';
  level: 'low' | 'moderate' | 'high' | 'critical';
  score: number; // 0-100
  trend: 'improving' | 'stable' | 'worsening';
  timeframe: string;
  factors: string[];
  recommendations: string[];
  confidence: number; // 0-100
  lastUpdated: string;
};

type PredictiveInsight = {
  id: string;
  title: string;
  prediction: string;
  probability: number; // 0-100
  timeframe: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  category: 'health-outcome' | 'medication-adherence' | 'lifestyle' | 'appointment-compliance';
  supportingData: string[];
  actionable: boolean;
  preventable: boolean;
  confidence: number;
  generatedAt: string;
};

type HealthPattern = {
  id: string;
  pattern: string;
  description: string;
  strength: 'weak' | 'moderate' | 'strong' | 'very-strong';
  frequency: string;
  correlation: number; // -1 to 1
  significance: 'low' | 'medium' | 'high';
  dataPoints: number;
  timespan: string;
  relatedMetrics: string[];
  discoveredAt: string;
};

type PersonalizedRecommendation = {
  id: string;
  title: string;
  description: string;
  category: 'lifestyle' | 'medication' | 'monitoring' | 'prevention' | 'mental-health';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  evidenceLevel: 'low' | 'moderate' | 'high' | 'clinical-grade';
  personalizationScore: number; // 0-100
  expectedOutcome: string;
  timeToResult: string;
  effort: 'minimal' | 'moderate' | 'significant';
  cost: 'free' | 'low' | 'moderate' | 'high';
  providerApproved?: boolean;
  implementable: boolean;
  trackingMetrics: string[];
  generatedAt: string;
};

// Sample AI-generated data
const healthRisks: HealthRisk[] = [
  {
    id: 'risk-1',
    type: 'cardiovascular',
    level: 'moderate',
    score: 35,
    trend: 'improving',
    timeframe: '5-year outlook',
    factors: ['Blood pressure trending down', 'Improved exercise consistency', 'Weight loss progress'],
    recommendations: ['Continue current BP medication', 'Maintain walking routine', 'Consider cardiac screening in 2 years'],
    confidence: 87,
    lastUpdated: '2026-01-18'
  },
  {
    id: 'risk-2',
    type: 'diabetes',
    level: 'low',
    score: 22,
    trend: 'stable',
    timeframe: 'Current status',
    factors: ['Excellent HbA1c control', 'Consistent medication adherence', 'Stable weight management'],
    recommendations: ['Maintain current treatment plan', 'Continue glucose monitoring', 'Annual eye exam due'],
    confidence: 94,
    lastUpdated: '2026-01-18'
  },
  {
    id: 'risk-3',
    type: 'mental-health',
    level: 'moderate',
    score: 41,
    trend: 'stable',
    timeframe: 'Current assessment',
    factors: ['Stress levels elevated', 'Sleep patterns improving', 'Social support strong'],
    recommendations: ['Consider stress management techniques', 'Continue sleep hygiene practices', 'Regular check-ins with mental health provider'],
    confidence: 76,
    lastUpdated: '2026-01-18'
  }
];

const predictiveInsights: PredictiveInsight[] = [
  {
    id: 'insight-1',
    title: 'HbA1c Maintenance Success',
    prediction: 'High likelihood of maintaining HbA1c below 7.0% over next 6 months',
    probability: 89,
    timeframe: '6 months',
    impact: 'high',
    category: 'health-outcome',
    supportingData: ['Consistent medication adherence (94%)', 'Stable dietary patterns', 'Regular glucose monitoring'],
    actionable: true,
    preventable: false,
    confidence: 91,
    generatedAt: '2026-01-18'
  },
  {
    id: 'insight-2',
    title: 'Appointment Adherence Risk',
    prediction: 'Moderate risk of missing upcoming cardiology follow-up',
    probability: 32,
    timeframe: '2 weeks',
    impact: 'medium',
    category: 'appointment-compliance',
    supportingData: ['Historical pattern of rescheduling specialist appointments', 'Upcoming travel schedule', 'Previous preference for morning appointments'],
    actionable: true,
    preventable: true,
    confidence: 73,
    generatedAt: '2026-01-18'
  },
  {
    id: 'insight-3',
    title: 'Weight Maintenance Trajectory',
    prediction: 'Strong likelihood of maintaining current weight within 5lb range',
    probability: 84,
    timeframe: '3 months',
    impact: 'high',
    category: 'lifestyle',
    supportingData: ['Consistent daily weigh-ins', 'Stable activity levels', 'Dietary pattern adherence'],
    actionable: false,
    preventable: false,
    confidence: 88,
    generatedAt: '2026-01-18'
  }
];

const healthPatterns: HealthPattern[] = [
  {
    id: 'pattern-1',
    pattern: 'Weekly Exercise-Blood Pressure Correlation',
    description: 'Blood pressure readings consistently 8-12 mmHg lower on days following exercise sessions',
    strength: 'strong',
    frequency: 'Weekly recurring',
    correlation: -0.73,
    significance: 'high',
    dataPoints: 156,
    timespan: '6 months',
    relatedMetrics: ['Systolic BP', 'Exercise duration', 'Exercise intensity'],
    discoveredAt: '2026-01-15'
  },
  {
    id: 'pattern-2',
    pattern: 'Sleep-Glucose Relationship',
    description: 'Poor sleep quality (<6 hours) correlates with 15-20 mg/dL higher morning glucose readings',
    strength: 'moderate',
    frequency: 'Daily pattern',
    correlation: 0.64,
    significance: 'high',
    dataPoints: 89,
    timespan: '3 months',
    relatedMetrics: ['Sleep duration', 'Sleep quality', 'Morning glucose'],
    discoveredAt: '2026-01-12'
  },
  {
    id: 'pattern-3',
    pattern: 'Stress-Appointment Scheduling Behavior',
    description: 'Higher stress periods correlate with tendency to reschedule non-urgent medical appointments',
    strength: 'moderate',
    frequency: 'Monthly cycles',
    correlation: 0.58,
    significance: 'medium',
    dataPoints: 24,
    timespan: '12 months',
    relatedMetrics: ['Self-reported stress', 'Appointment changes', 'Work schedule intensity'],
    discoveredAt: '2026-01-10'
  }
];

const personalizedRecommendations: PersonalizedRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Optimize Exercise Timing for Blood Pressure',
    description: 'Based on your patterns, exercising in the morning (8-10 AM) shows 23% better blood pressure improvements compared to evening workouts.',
    category: 'lifestyle',
    priority: 'medium',
    evidenceLevel: 'high',
    personalizationScore: 91,
    expectedOutcome: '5-8 mmHg additional systolic BP reduction',
    timeToResult: '2-4 weeks',
    effort: 'minimal',
    cost: 'free',
    providerApproved: true,
    implementable: true,
    trackingMetrics: ['Morning BP readings', 'Exercise timing', 'Exercise duration'],
    generatedAt: '2026-01-18'
  },
  {
    id: 'rec-2',
    title: 'Sleep-Optimized Glucose Management',
    description: 'Implementing a consistent 7+ hour sleep schedule could improve your morning glucose readings by an estimated 12-18 mg/dL.',
    category: 'lifestyle',
    priority: 'high',
    evidenceLevel: 'moderate',
    personalizationScore: 87,
    expectedOutcome: 'More stable morning glucose levels',
    timeToResult: '1-2 weeks',
    effort: 'moderate',
    cost: 'free',
    implementable: true,
    trackingMetrics: ['Sleep duration', 'Sleep quality', 'Morning glucose', 'HbA1c trend'],
    generatedAt: '2026-01-18'
  },
  {
    id: 'rec-3',
    title: 'Proactive Appointment Scheduling Strategy',
    description: 'Schedule specialist appointments during low-stress periods (typically early in month) to reduce cancellation likelihood by 47%.',
    category: 'prevention',
    priority: 'medium',
    evidenceLevel: 'moderate',
    personalizationScore: 73,
    expectedOutcome: 'Better appointment adherence and care continuity',
    timeToResult: 'Immediate',
    effort: 'minimal',
    cost: 'free',
    implementable: true,
    trackingMetrics: ['Appointment adherence', 'Stress levels', 'Cancellation frequency'],
    generatedAt: '2026-01-18'
  },
  {
    id: 'rec-4',
    title: 'Medication Timing Optimization',
    description: 'Taking your diabetes medication 15 minutes earlier (7:45 AM instead of 8:00 AM) aligns better with your breakfast timing and may improve absorption.',
    category: 'medication',
    priority: 'high',
    evidenceLevel: 'clinical-grade',
    personalizationScore: 95,
    expectedOutcome: '3-5% improvement in post-meal glucose control',
    timeToResult: '1 week',
    effort: 'minimal',
    cost: 'free',
    providerApproved: false, // Needs provider approval
    implementable: false, // Requires provider consultation
    trackingMetrics: ['Post-meal glucose', 'Medication timing', 'Side effects'],
    generatedAt: '2026-01-18'
  }
];

// Sample trend data for visualizations
const riskTrendData = [
  { month: 'Jul', cardiovascular: 42, diabetes: 28, mental: 38 },
  { month: 'Aug', cardiovascular: 39, diabetes: 25, mental: 41 },
  { month: 'Sep', cardiovascular: 37, diabetes: 24, mental: 39 },
  { month: 'Oct', cardiovascular: 35, diabetes: 23, mental: 42 },
  { month: 'Nov', cardiovascular: 34, diabetes: 22, mental: 40 },
  { month: 'Dec', cardiovascular: 35, diabetes: 22, mental: 41 },
  { month: 'Jan', cardiovascular: 35, diabetes: 22, mental: 41 }
];

const aiConfidenceData = [
  { category: 'Health Risk Assessment', confidence: 87, accuracy: 94 },
  { category: 'Pattern Recognition', confidence: 82, accuracy: 89 },
  { category: 'Predictive Insights', confidence: 79, accuracy: 85 },
  { category: 'Personalized Recommendations', confidence: 91, accuracy: 92 }
];

export default function AIHealthInsightsEngine() {
  const [activeTab, setActiveTab] = useState<'overview' | 'risks' | 'predictions' | 'patterns' | 'recommendations'>('overview');
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | '3months' | '6months'>('month');

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'worsening': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'very-strong': return 'text-purple-400 bg-purple-500/20';
      case 'strong': return 'text-blue-400 bg-blue-500/20';
      case 'moderate': return 'text-yellow-400 bg-yellow-500/20';
      case 'weak': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                AI Health Insights Engine
              </h1>
              <p className="text-gray-400">
                Advanced AI-powered health analytics with predictive insights and personalized recommendations
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">AI Active</span>
              </div>
              <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition">
                Refresh Analysis
              </button>
            </div>
          </div>

          {/* AI Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">AI Confidence</p>
                  <p className="text-2xl font-bold text-white">87%</p>
                </div>
                <div className="text-2xl">🧠</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Patterns Found</p>
                  <p className="text-2xl font-bold text-white">{healthPatterns.length}</p>
                </div>
                <div className="text-2xl">🔍</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Active Insights</p>
                  <p className="text-2xl font-bold text-white">{predictiveInsights.length}</p>
                </div>
                <div className="text-2xl">💡</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 rounded-xl border border-pink-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-400 text-sm font-medium">Recommendations</p>
                  <p className="text-2xl font-bold text-white">{personalizedRecommendations.length}</p>
                </div>
                <div className="text-2xl">🎯</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'overview', label: 'AI Overview', icon: '🤖' },
              { id: 'risks', label: 'Health Risks', icon: '⚠️' },
              { id: 'predictions', label: 'Predictions', icon: '🔮' },
              { id: 'patterns', label: 'Patterns', icon: '🧩' },
              { id: 'recommendations', label: 'Recommendations', icon: '🎯' }
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
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Health Summary */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold text-white mb-4">AI Health Intelligence Summary</h3>
              
              {/* Risk Assessment Overview */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6 mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">🎯 Risk Assessment Trends</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={riskTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }} 
                      />
                      <Line type="monotone" dataKey="cardiovascular" stroke="#ef4444" strokeWidth={2} name="Cardiovascular" />
                      <Line type="monotone" dataKey="diabetes" stroke="#22c55e" strokeWidth={2} name="Diabetes" />
                      <Line type="monotone" dataKey="mental" stroke="#8b5cf6" strokeWidth={2} name="Mental Health" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Key AI Insights */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">🧠 Key AI Insights</h4>
                
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20 p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">✅</div>
                    <div>
                      <h5 className="text-white font-semibold mb-1">Diabetes Management Excellence</h5>
                      <p className="text-gray-300 text-sm mb-2">
                        AI analysis shows 94% confidence in maintaining excellent diabetes control. Your HbA1c trend is optimal.
                      </p>
                      <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">Confidence: 94%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl border border-yellow-500/20 p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💡</div>
                    <div>
                      <h5 className="text-white font-semibold mb-1">Exercise-BP Pattern Discovered</h5>
                      <p className="text-gray-300 text-sm mb-2">
                        Strong correlation found: Blood pressure drops 8-12 mmHg consistently after morning exercise sessions.
                      </p>
                      <span className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded">Pattern Strength: Strong</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20 p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🔮</div>
                    <div>
                      <h5 className="text-white font-semibold mb-1">Predictive Health Outlook</h5>
                      <p className="text-gray-300 text-sm mb-2">
                        Based on current trends, 89% likelihood of maintaining HbA1c goals over the next 6 months.
                      </p>
                      <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded">Probability: 89%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Performance Dashboard */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                <h4 className="font-semibold text-white mb-4">AI Performance</h4>
                <div className="space-y-3">
                  {aiConfidenceData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">{item.category}</span>
                        <span className="text-sm font-semibold text-white">{item.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${item.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Risk Levels */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                <h4 className="font-semibold text-white mb-4">Risk Levels</h4>
                <div className="space-y-3">
                  {healthRisks.map((risk) => (
                    <div key={risk.id} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-white capitalize">{risk.type.replace('-', ' ')}</div>
                        <div className="text-xs text-gray-400">{getTrendIcon(risk.trend)} {risk.trend}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">{risk.score}/100</div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(risk.level)}`}>
                          {risk.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent AI Activity */}
              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20 p-6">
                <h4 className="font-semibold text-white mb-4">Recent AI Activity</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Pattern analysis completed</span>
                    <span className="text-xs text-gray-500 ml-auto">2m ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Risk assessment updated</span>
                    <span className="text-xs text-gray-500 ml-auto">15m ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">New recommendations generated</span>
                    <span className="text-xs text-gray-500 ml-auto">1h ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-white">AI Health Risk Assessment</h3>
              <div className="flex items-center gap-3">
                <select 
                  value={timeframe} 
                  onChange={(e) => setTimeframe(e.target.value as any)}
                  className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                >
                  <option value="week">1 Week</option>
                  <option value="month">1 Month</option>
                  <option value="3months">3 Months</option>
                  <option value="6months">6 Months</option>
                </select>
                <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition">
                  Export Report
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {healthRisks.map((risk) => (
                <div key={risk.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1 capitalize">
                        {risk.type.replace('-', ' ')} Risk
                      </h4>
                      <p className="text-gray-400 text-sm">{risk.timeframe}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white mb-1">{risk.score}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(risk.level)}`}>
                        {risk.level.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Risk Score Visualization */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Risk Score</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{getTrendIcon(risk.trend)}</span>
                        <span className="text-sm text-gray-300 capitalize">{risk.trend}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          risk.level === 'low' ? 'bg-gradient-to-r from-green-500 to-green-400' :
                          risk.level === 'moderate' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                          risk.level === 'high' ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                          'bg-gradient-to-r from-red-500 to-red-400'
                        }`}
                        style={{ width: `${risk.score}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Contributing Factors */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-white mb-2">Contributing Factors:</h5>
                    <ul className="space-y-1">
                      {risk.factors.map((factor, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Recommendations */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-white mb-2">AI Recommendations:</h5>
                    <ul className="space-y-1">
                      {risk.recommendations.slice(0, 3).map((rec, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-pink-400 mt-1">→</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Confidence & Last Updated */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">AI Confidence:</span>
                      <span className="text-xs font-semibold text-green-400">{risk.confidence}%</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      Updated: {format(parseISO(risk.lastUpdated), 'MMM dd')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab === 'predictions' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">Predictive Health Insights</h3>
            
            <div className="space-y-4">
              {predictiveInsights.map((insight) => (
                <div key={insight.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">{insight.title}</h4>
                      <p className="text-gray-300">{insight.prediction}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-pink-400 mb-1">{insight.probability}%</div>
                      <span className="text-xs text-gray-400">{insight.timeframe}</span>
                    </div>
                  </div>

                  {/* Probability visualization */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Probability</span>
                      <span className="text-sm text-gray-300">{insight.confidence}% confidence</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${insight.probability}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Supporting data */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-white mb-2">Supporting Evidence:</h5>
                    <ul className="space-y-1">
                      {insight.supportingData.map((data, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          {data}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.impact === 'critical' ? 'text-red-400 bg-red-500/20' :
                      insight.impact === 'high' ? 'text-orange-400 bg-orange-500/20' :
                      insight.impact === 'medium' ? 'text-yellow-400 bg-yellow-500/20' :
                      'text-green-400 bg-green-500/20'
                    }`}>
                      {insight.impact.toUpperCase()} IMPACT
                    </span>
                    
                    <span className="px-2 py-1 rounded-full text-xs font-medium text-blue-400 bg-blue-500/20">
                      {insight.category.replace('-', ' ').toUpperCase()}
                    </span>
                    
                    {insight.actionable && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium text-green-400 bg-green-500/20">
                        ACTIONABLE
                      </span>
                    )}
                    
                    {insight.preventable && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium text-purple-400 bg-purple-500/20">
                        PREVENTABLE
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-6xl mb-4">🧩</div>
            <h3 className="text-2xl font-semibold text-white mb-2">Health Pattern Analysis</h3>
            <p className="text-gray-400">Advanced pattern recognition and correlation analysis coming soon!</p>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-semibold text-white mb-2">Personalized AI Recommendations</h3>
            <p className="text-gray-400">Intelligent personalized health recommendations coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}