"use client";

import React, { useState } from 'react';
import { format, parseISO, subDays, subWeeks, subMonths, differenceInDays, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

// Analytics Types
type UsageSession = {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  featuresUsed: string[];
  actionsPerformed: number;
  pageViews: number;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  primaryActivity: 'metrics-review' | 'document-upload' | 'provider-communication' | 'insights-exploration' | 'goal-tracking';
  engagementScore: number; // 0-100
  productivityScore: number; // 0-100
};

type FeatureAnalytics = {
  featureName: string;
  category: 'metrics' | 'ai-insights' | 'documents' | 'providers' | 'goals' | 'wellness';
  totalUses: number;
  uniqueUsers: number;
  avgDuration: number; // minutes
  completionRate: number; // 0-100
  satisfactionScore: number; // 0-100
  trendDirection: 'increasing' | 'stable' | 'decreasing';
  weekOverWeekGrowth: number; // percentage
  retentionRate: number; // 0-100
  lastUsed: string;
};

type EngagementMetrics = {
  period: string;
  date: string;
  activeUsers: number;
  sessions: number;
  avgSessionDuration: number;
  pageViewsPerSession: number;
  bounceRate: number;
  featureAdoptionRate: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  retentionRate: number;
  churnRisk: number; // 0-100
};

type HealthGoal = {
  id: string;
  name: string;
  category: 'weight' | 'fitness' | 'nutrition' | 'medication' | 'mental-health' | 'sleep' | 'chronic-condition';
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  targetDate: string;
  status: 'on-track' | 'at-risk' | 'ahead' | 'behind' | 'completed' | 'abandoned';
  progress: number; // 0-100
  milestones: GoalMilestone[];
  trackingFrequency: 'daily' | 'weekly' | 'monthly';
  motivationLevel: number; // 0-100
  supportLevel: number; // 0-100
  confidenceScore: number; // 0-100 AI prediction of success
};

type GoalMilestone = {
  id: string;
  name: string;
  targetDate: string;
  completedDate?: string;
  status: 'pending' | 'completed' | 'missed';
  value: number;
};

type UserJourney = {
  stage: 'discovery' | 'activation' | 'engagement' | 'retention' | 'advocacy';
  daysInStage: number;
  completionRate: number; // 0-100
  keyActions: { action: string; completed: boolean; completedDate?: string; }[];
  nextRecommendedActions: string[];
  stageHealth: 'excellent' | 'good' | 'fair' | 'poor';
  predictedTimeToNextStage: number; // days
};

type BehaviorCohort = {
  name: string;
  description: string;
  userCount: number;
  avgEngagement: number;
  avgRetention: number;
  commonBehaviors: string[];
  keyMetrics: { metric: string; value: number; }[];
  color: string;
};

type PredictiveModel = {
  modelType: 'churn-prediction' | 'goal-success' | 'feature-adoption' | 'engagement-forecast';
  confidence: number; // 0-100
  prediction: string;
  factors: { factor: string; impact: number; importance: number; }[];
  recommendations: string[];
  accuracyRate: number; // 0-100
  lastUpdated: string;
};

// Sample Data
const recentSessions: UsageSession[] = [
  {
    id: 'session-1',
    startTime: '2026-01-18T07:15:00Z',
    endTime: '2026-01-18T07:42:00Z',
    duration: 27,
    featuresUsed: ['Health Metrics Dashboard', 'AI Health Insights', 'Pattern Recognition'],
    actionsPerformed: 23,
    pageViews: 12,
    deviceType: 'desktop',
    primaryActivity: 'metrics-review',
    engagementScore: 94,
    productivityScore: 88
  },
  {
    id: 'session-2',
    startTime: '2026-01-17T19:30:00Z',
    endTime: '2026-01-17T20:15:00Z',
    duration: 45,
    featuresUsed: ['Document Analysis', 'AI Health Insights', 'Provider Dashboard', 'Health Timeline'],
    actionsPerformed: 31,
    pageViews: 18,
    deviceType: 'desktop',
    primaryActivity: 'document-upload',
    engagementScore: 96,
    productivityScore: 92
  },
  {
    id: 'session-3',
    startTime: '2026-01-17T12:20:00Z',
    endTime: '2026-01-17T12:35:00Z',
    duration: 15,
    featuresUsed: ['Smart Alerts', 'Health Metrics Dashboard'],
    actionsPerformed: 8,
    pageViews: 4,
    deviceType: 'mobile',
    primaryActivity: 'metrics-review',
    engagementScore: 72,
    productivityScore: 68
  }
];

const featureAnalytics: FeatureAnalytics[] = [
  {
    featureName: 'Health Metrics Dashboard',
    category: 'metrics',
    totalUses: 892,
    uniqueUsers: 1,
    avgDuration: 8.5,
    completionRate: 94,
    satisfactionScore: 96,
    trendDirection: 'stable',
    weekOverWeekGrowth: 2,
    retentionRate: 98,
    lastUsed: '2026-01-18T07:15:00Z'
  },
  {
    featureName: 'AI Health Insights',
    category: 'ai-insights',
    totalUses: 673,
    uniqueUsers: 1,
    avgDuration: 12.3,
    completionRate: 89,
    satisfactionScore: 98,
    trendDirection: 'increasing',
    weekOverWeekGrowth: 15,
    retentionRate: 94,
    lastUsed: '2026-01-18T07:25:00Z'
  },
  {
    featureName: 'Document Analysis',
    category: 'documents',
    totalUses: 456,
    uniqueUsers: 1,
    avgDuration: 15.7,
    completionRate: 92,
    satisfactionScore: 95,
    trendDirection: 'increasing',
    weekOverWeekGrowth: 22,
    retentionRate: 91,
    lastUsed: '2026-01-17T19:30:00Z'
  },
  {
    featureName: 'Pattern Recognition',
    category: 'ai-insights',
    totalUses: 542,
    uniqueUsers: 1,
    avgDuration: 10.2,
    completionRate: 87,
    satisfactionScore: 94,
    trendDirection: 'increasing',
    weekOverWeekGrowth: 18,
    retentionRate: 88,
    lastUsed: '2026-01-18T07:30:00Z'
  },
  {
    featureName: 'Provider Dashboard',
    category: 'providers',
    totalUses: 324,
    uniqueUsers: 1,
    avgDuration: 6.8,
    completionRate: 91,
    satisfactionScore: 92,
    trendDirection: 'stable',
    weekOverWeekGrowth: 5,
    retentionRate: 85,
    lastUsed: '2026-01-17T19:45:00Z'
  },
  {
    featureName: 'Smart Recommendations',
    category: 'ai-insights',
    totalUses: 289,
    uniqueUsers: 1,
    avgDuration: 9.4,
    completionRate: 85,
    satisfactionScore: 97,
    trendDirection: 'increasing',
    weekOverWeekGrowth: 25,
    retentionRate: 82,
    lastUsed: '2026-01-16T14:20:00Z'
  }
];

const engagementHistory: EngagementMetrics[] = [
  { period: 'Week 1', date: '2026-01-01', activeUsers: 1, sessions: 18, avgSessionDuration: 22, pageViewsPerSession: 11, bounceRate: 8, featureAdoptionRate: 72, dailyActiveUsers: 1, weeklyActiveUsers: 1, monthlyActiveUsers: 1, retentionRate: 100, churnRisk: 5 },
  { period: 'Week 2', date: '2026-01-08', activeUsers: 1, sessions: 21, avgSessionDuration: 25, pageViewsPerSession: 13, bounceRate: 6, featureAdoptionRate: 78, dailyActiveUsers: 1, weeklyActiveUsers: 1, monthlyActiveUsers: 1, retentionRate: 100, churnRisk: 3 },
  { period: 'Week 3', date: '2026-01-15', activeUsers: 1, sessions: 24, avgSessionDuration: 28, pageViewsPerSession: 15, bounceRate: 5, featureAdoptionRate: 85, dailyActiveUsers: 1, weeklyActiveUsers: 1, monthlyActiveUsers: 1, retentionRate: 100, churnRisk: 2 }
];

const healthGoals: HealthGoal[] = [
  {
    id: 'goal-1',
    name: 'Reduce HbA1c to <6.0%',
    category: 'chronic-condition',
    targetValue: 6.0,
    currentValue: 5.8,
    unit: '%',
    startDate: '2025-07-01T00:00:00Z',
    targetDate: '2026-07-01T00:00:00Z',
    status: 'ahead',
    progress: 110,
    milestones: [
      { id: 'm1', name: 'Reach 6.5%', targetDate: '2025-10-01', completedDate: '2025-09-15', status: 'completed', value: 6.5 },
      { id: 'm2', name: 'Reach 6.2%', targetDate: '2025-12-01', completedDate: '2025-10-12', status: 'completed', value: 6.2 },
      { id: 'm3', name: 'Reach 6.0%', targetDate: '2026-03-01', completedDate: '2026-01-15', status: 'completed', value: 6.0 }
    ],
    trackingFrequency: 'monthly',
    motivationLevel: 95,
    supportLevel: 88,
    confidenceScore: 98
  },
  {
    id: 'goal-2',
    name: 'Exercise 4x per week',
    category: 'fitness',
    targetValue: 4,
    currentValue: 3.5,
    unit: 'sessions/week',
    startDate: '2025-09-01T00:00:00Z',
    targetDate: '2026-09-01T00:00:00Z',
    status: 'on-track',
    progress: 87,
    milestones: [
      { id: 'm1', name: '2x per week', targetDate: '2025-10-01', completedDate: '2025-09-20', status: 'completed', value: 2 },
      { id: 'm2', name: '3x per week', targetDate: '2025-12-01', completedDate: '2025-11-10', status: 'completed', value: 3 },
      { id: 'm3', name: '4x per week', targetDate: '2026-03-01', status: 'pending', value: 4 }
    ],
    trackingFrequency: 'weekly',
    motivationLevel: 82,
    supportLevel: 75,
    confidenceScore: 85
  },
  {
    id: 'goal-3',
    name: 'Medication Adherence >95%',
    category: 'medication',
    targetValue: 95,
    currentValue: 96,
    unit: '%',
    startDate: '2025-06-15T00:00:00Z',
    targetDate: '2026-06-15T00:00:00Z',
    status: 'ahead',
    progress: 105,
    milestones: [
      { id: 'm1', name: 'Baseline tracking', targetDate: '2025-07-15', completedDate: '2025-07-10', status: 'completed', value: 85 },
      { id: 'm2', name: 'Reach 90%', targetDate: '2025-09-01', completedDate: '2025-08-20', status: 'completed', value: 90 },
      { id: 'm3', name: 'Reach 95%', targetDate: '2025-12-01', completedDate: '2025-10-05', status: 'completed', value: 95 }
    ],
    trackingFrequency: 'daily',
    motivationLevel: 91,
    supportLevel: 94,
    confidenceScore: 96
  }
];

const userJourney: UserJourney = {
  stage: 'retention',
  daysInStage: 45,
  completionRate: 89,
  keyActions: [
    { action: 'Upload first document', completed: true, completedDate: '2025-06-16' },
    { action: 'Set health goals', completed: true, completedDate: '2025-06-18' },
    { action: 'Complete profile', completed: true, completedDate: '2025-06-20' },
    { action: 'Connect provider', completed: true, completedDate: '2025-07-05' },
    { action: 'Use AI insights 10+ times', completed: true, completedDate: '2025-08-12' },
    { action: 'Share data with provider', completed: true, completedDate: '2025-09-20' },
    { action: 'Refer a friend', completed: false }
  ],
  nextRecommendedActions: [
    'Enable automated health reports',
    'Join community wellness programs',
    'Refer Sacred Vault to your network'
  ],
  stageHealth: 'excellent',
  predictedTimeToNextStage: 30
};

const behaviorCohorts: BehaviorCohort[] = [
  {
    name: 'Data-Driven Power Users',
    description: 'Highly engaged users who extensively use analytics and AI features',
    userCount: 1,
    avgEngagement: 94,
    avgRetention: 98,
    commonBehaviors: ['Daily dashboard checks', 'Extensive AI insights usage', 'Deep-dive weekend sessions'],
    keyMetrics: [
      { metric: 'Avg Session Duration', value: 28 },
      { metric: 'Features Used', value: 38 },
      { metric: 'Goal Completion Rate', value: 92 }
    ],
    color: '#ec4899'
  }
];

const predictiveModels: PredictiveModel[] = [
  {
    modelType: 'goal-success',
    confidence: 94,
    prediction: '96% probability of achieving HbA1c goal by target date',
    factors: [
      { factor: 'Consistent tracking behavior', impact: 32, importance: 95 },
      { factor: 'High medication adherence', impact: 28, importance: 90 },
      { factor: 'Regular exercise pattern', impact: 22, importance: 85 },
      { factor: 'Engagement with AI insights', impact: 18, importance: 75 }
    ],
    recommendations: [
      'Continue current exercise routine - showing strong correlation with glucose control',
      'Maintain medication adherence above 95%',
      'Monitor stress levels which may impact readings'
    ],
    accuracyRate: 89,
    lastUpdated: '2026-01-18T06:00:00Z'
  },
  {
    modelType: 'engagement-forecast',
    confidence: 91,
    prediction: 'Expected to maintain high engagement (85-95%) for next 3 months',
    factors: [
      { factor: 'Strong established habits', impact: 35, importance: 92 },
      { factor: 'High feature adoption', impact: 30, importance: 88 },
      { factor: 'Positive health outcomes', impact: 25, importance: 85 },
      { factor: 'Low churn risk indicators', impact: 10, importance: 70 }
    ],
    recommendations: [
      'Introduce advanced features to maintain interest',
      'Recognize and celebrate health milestones',
      'Consider beta testing new AI capabilities'
    ],
    accuracyRate: 87,
    lastUpdated: '2026-01-18T06:00:00Z'
  },
  {
    modelType: 'churn-prediction',
    confidence: 96,
    prediction: 'Very low churn risk (2%) - strong retention indicators',
    factors: [
      { factor: 'High daily engagement', impact: -40, importance: 95 },
      { factor: 'Positive health outcomes', impact: -35, importance: 90 },
      { factor: 'Strong feature adoption', impact: -15, importance: 80 },
      { factor: 'Active goal tracking', impact: -10, importance: 75 }
    ],
    recommendations: [
      'Perfect candidate for advanced features',
      'Consider for community leadership role',
      'Potential brand advocate'
    ],
    accuracyRate: 93,
    lastUpdated: '2026-01-18T06:00:00Z'
  }
];

const activityHeatmap = eachDayOfInterval({
  start: subDays(new Date(), 27),
  end: new Date()
}).map(date => ({
  date: format(date, 'yyyy-MM-dd'),
  dayOfWeek: format(date, 'EEEE'),
  sessions: Math.floor(Math.random() * 4) + 1,
  duration: Math.floor(Math.random() * 40) + 10,
  engagement: Math.floor(Math.random() * 30) + 70
}));

export default function BehavioralAnalyticsEngine() {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'goals' | 'journey' | 'predictions'>('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'metrics': return '#ec4899';
      case 'ai-insights': return '#8b5cf6';
      case 'documents': return '#06d6a0';
      case 'providers': return '#3b82f6';
      case 'goals': return '#ffd23f';
      case 'wellness': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'on-track': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'at-risk': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'behind': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'completed': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'abandoned': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      default: return '➡️';
    }
  };

  const getStageHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-400 bg-green-500/20';
      case 'good': return 'text-blue-400 bg-blue-500/20';
      case 'fair': return 'text-yellow-400 bg-yellow-500/20';
      case 'poor': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const totalEngagementScore = Math.round(recentSessions.reduce((acc, s) => acc + s.engagementScore, 0) / recentSessions.length);
  const totalProductivityScore = Math.round(recentSessions.reduce((acc, s) => acc + s.productivityScore, 0) / recentSessions.length);
  const avgSessionDuration = Math.round(recentSessions.reduce((acc, s) => acc + s.duration, 0) / recentSessions.length);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Behavioral Analytics Engine
              </h1>
              <p className="text-gray-400">
                Comprehensive usage analytics, engagement metrics, and predictive user modeling
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
              </select>
              <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition">
                Export Analytics
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Engagement Score</p>
                  <p className="text-2xl font-bold text-white">{totalEngagementScore}%</p>
                </div>
                <div className="text-2xl">⚡</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Productivity Score</p>
                  <p className="text-2xl font-bold text-white">{totalProductivityScore}%</p>
                </div>
                <div className="text-2xl">🎯</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Avg Session</p>
                  <p className="text-2xl font-bold text-white">{avgSessionDuration}m</p>
                </div>
                <div className="text-2xl">⏱️</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl border border-yellow-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-medium">Active Goals</p>
                  <p className="text-2xl font-bold text-white">{healthGoals.filter(g => g.status !== 'completed').length}</p>
                </div>
                <div className="text-2xl">🎯</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'overview', label: 'Usage Overview', icon: '📊' },
              { id: 'features', label: 'Feature Analytics', icon: '🔧' },
              { id: 'goals', label: 'Health Goals', icon: '🎯' },
              { id: 'journey', label: 'User Journey', icon: '🗺️' },
              { id: 'predictions', label: 'AI Predictions', icon: '🔮' }
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
          <div className="space-y-6">
            {/* Engagement Trend */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">📈 Engagement Trends</h3>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={engagementHistory}>
                    <defs>
                      <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="period" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="sessions" 
                      stroke="#ec4899" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#engagementGradient)" 
                      name="Sessions"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="avgSessionDuration" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      fillOpacity={0} 
                      name="Avg Duration (min)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-black/20 rounded">
                  <div className="text-lg font-bold text-pink-400">{engagementHistory[engagementHistory.length - 1].featureAdoptionRate}%</div>
                  <p className="text-xs text-gray-400">Feature Adoption</p>
                </div>
                <div className="text-center p-3 bg-black/20 rounded">
                  <div className="text-lg font-bold text-blue-400">{engagementHistory[engagementHistory.length - 1].retentionRate}%</div>
                  <p className="text-xs text-gray-400">Retention Rate</p>
                </div>
                <div className="text-center p-3 bg-black/20 rounded">
                  <div className="text-lg font-bold text-green-400">{engagementHistory[engagementHistory.length - 1].pageViewsPerSession}</div>
                  <p className="text-xs text-gray-400">Pages/Session</p>
                </div>
                <div className="text-center p-3 bg-black/20 rounded">
                  <div className="text-lg font-bold text-yellow-400">{engagementHistory[engagementHistory.length - 1].bounceRate}%</div>
                  <p className="text-xs text-gray-400">Bounce Rate</p>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">🕐 Recent Sessions</h3>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="p-4 bg-black/20 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-lg font-semibold text-white">
                            {format(parseISO(session.startTime), 'MMM dd, yyyy h:mm a')}
                          </span>
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
                            {session.deviceType}
                          </span>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-medium">
                            {session.primaryActivity.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          Duration: {session.duration} minutes • {session.actionsPerformed} actions • {session.pageViews} page views
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-pink-400">{session.engagementScore}%</div>
                        <p className="text-xs text-gray-400">Engagement</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-1">Features Used:</p>
                      <div className="flex flex-wrap gap-1">
                        {session.featuresUsed.map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Heatmap */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">🔥 Activity Heatmap (Last 4 Weeks)</h3>
              <div className="grid grid-cols-7 gap-2">
                {activityHeatmap.slice(-28).map((day, index) => (
                  <div key={index} className="aspect-square">
                    <div 
                      className={`w-full h-full rounded flex items-center justify-center text-xs font-medium transition-all hover:scale-110 cursor-pointer ${
                        day.engagement >= 90 ? 'bg-green-500/60 text-white' :
                        day.engagement >= 80 ? 'bg-green-500/40 text-white' :
                        day.engagement >= 70 ? 'bg-blue-500/40 text-white' :
                        day.engagement >= 60 ? 'bg-yellow-500/40 text-white' :
                        'bg-gray-700/40 text-gray-400'
                      }`}
                      title={`${day.dayOfWeek}, ${format(parseISO(day.date), 'MMM dd')}: ${day.sessions} sessions, ${day.duration}m, ${day.engagement}% engagement`}
                    >
                      {day.sessions}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
                <span>Lower engagement</span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 bg-gray-700/40 rounded"></div>
                  <div className="w-4 h-4 bg-yellow-500/40 rounded"></div>
                  <div className="w-4 h-4 bg-blue-500/40 rounded"></div>
                  <div className="w-4 h-4 bg-green-500/40 rounded"></div>
                  <div className="w-4 h-4 bg-green-500/60 rounded"></div>
                </div>
                <span>Higher engagement</span>
              </div>
            </div>

            {/* Behavior Cohorts */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">👥 Behavior Cohort Analysis</h3>
              {behaviorCohorts.map((cohort, index) => (
                <div key={index} className="p-4 bg-black/20 rounded-lg mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{cohort.name}</h4>
                      <p className="text-sm text-gray-400">{cohort.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: cohort.color }}>{cohort.userCount}</div>
                      <p className="text-xs text-gray-400">Users</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center p-2 bg-black/20 rounded">
                      <div className="text-lg font-bold text-pink-400">{cohort.avgEngagement}%</div>
                      <p className="text-xs text-gray-400">Avg Engagement</p>
                    </div>
                    <div className="text-center p-2 bg-black/20 rounded">
                      <div className="text-lg font-bold text-blue-400">{cohort.avgRetention}%</div>
                      <p className="text-xs text-gray-400">Avg Retention</p>
                    </div>
                    <div className="text-center p-2 bg-black/20 rounded">
                      <div className="text-lg font-bold text-green-400">{cohort.keyMetrics[0].value}</div>
                      <p className="text-xs text-gray-400">Avg Session (min)</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-2">Common Behaviors:</p>
                    <div className="flex flex-wrap gap-1">
                      {cohort.commonBehaviors.map((behavior, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                          {behavior}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">🔧 Feature Usage Analytics</h3>
              
              <div className="space-y-4">
                {featureAnalytics.map((feature, index) => (
                  <div key={index} className="p-4 bg-black/20 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-lg font-semibold text-white">{feature.featureName}</h4>
                          <span className="px-2 py-1 rounded text-xs font-medium" style={{ 
                            backgroundColor: `${getCategoryColor(feature.category)}20`,
                            color: getCategoryColor(feature.category)
                          }}>
                            {feature.category.toUpperCase()}
                          </span>
                          <span className="text-lg">{getTrendIcon(feature.trendDirection)}</span>
                        </div>
                        <p className="text-sm text-gray-400">
                          Last used: {format(parseISO(feature.lastUsed), 'MMM dd, yyyy h:mm a')}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-pink-400">{feature.totalUses}</div>
                        <p className="text-xs text-gray-400">Total Uses</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                      <div className="text-center p-2 bg-black/20 rounded">
                        <div className="text-sm font-bold text-blue-400">{feature.avgDuration.toFixed(1)}m</div>
                        <p className="text-xs text-gray-400">Avg Duration</p>
                      </div>
                      <div className="text-center p-2 bg-black/20 rounded">
                        <div className="text-sm font-bold text-green-400">{feature.completionRate}%</div>
                        <p className="text-xs text-gray-400">Completion</p>
                      </div>
                      <div className="text-center p-2 bg-black/20 rounded">
                        <div className="text-sm font-bold text-purple-400">{feature.satisfactionScore}%</div>
                        <p className="text-xs text-gray-400">Satisfaction</p>
                      </div>
                      <div className="text-center p-2 bg-black/20 rounded">
                        <div className="text-sm font-bold text-yellow-400">{feature.retentionRate}%</div>
                        <p className="text-xs text-gray-400">Retention</p>
                      </div>
                      <div className="text-center p-2 bg-black/20 rounded">
                        <div className="text-sm font-bold text-pink-400">+{feature.weekOverWeekGrowth}%</div>
                        <p className="text-xs text-gray-400">WoW Growth</p>
                      </div>
                      <div className="text-center p-2 bg-black/20 rounded">
                        <div className="text-sm font-bold text-cyan-400">{feature.uniqueUsers}</div>
                        <p className="text-xs text-gray-400">Users</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Category Distribution */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">📊 Usage by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="featureName" stroke="#9CA3AF" angle={-45} textAnchor="end" height={120} tick={{ fontSize: 11 }} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="totalUses" name="Total Uses">
                      {featureAnalytics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-4">
              <p className="text-gray-300">
                🎯 <strong>{healthGoals.length} active health goals</strong> being tracked
              </p>
            </div>

            {healthGoals.map((goal) => (
              <div key={goal.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{goal.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(goal.status)}`}>
                        {goal.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {format(parseISO(goal.startDate), 'MMM dd, yyyy')} → {format(parseISO(goal.targetDate), 'MMM dd, yyyy')} • {goal.trackingFrequency} tracking
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-pink-400">{goal.progress}%</div>
                    <p className="text-xs text-gray-400">Progress</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Current: {goal.currentValue} {goal.unit}</span>
                    <span className="text-sm text-gray-400">Target: {goal.targetValue} {goal.unit}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        goal.status === 'ahead' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        goal.status === 'on-track' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                        goal.status === 'at-risk' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-red-500 to-rose-500'
                      }`}
                      style={{ width: `${Math.min(goal.progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-black/20 rounded">
                    <div className="text-lg font-bold text-blue-400">{goal.motivationLevel}%</div>
                    <p className="text-xs text-gray-400">Motivation Level</p>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded">
                    <div className="text-lg font-bold text-green-400">{goal.supportLevel}%</div>
                    <p className="text-xs text-gray-400">Support Level</p>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded">
                    <div className="text-lg font-bold text-purple-400">{goal.confidenceScore}%</div>
                    <p className="text-xs text-gray-400">AI Success Prediction</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white mb-2">🏆 Milestones:</h4>
                  <div className="space-y-2">
                    {goal.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between p-2 bg-black/20 rounded">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {milestone.status === 'completed' ? '✅' :
                             milestone.status === 'missed' ? '❌' : '⏳'}
                          </span>
                          <span className="text-sm text-white">{milestone.name}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {milestone.completedDate ? 
                            `Completed ${format(parseISO(milestone.completedDate), 'MMM dd')}` :
                            `Target: ${format(parseISO(milestone.targetDate), 'MMM dd')}`
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'journey' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">User Journey Stage</h3>
                  <p className="text-gray-400">Tracking your progression through Sacred Vault experience</p>
                </div>
                <span className={`px-3 py-2 rounded-full text-sm font-medium ${getStageHealthColor(userJourney.stageHealth)}`}>
                  {userJourney.stageHealth.toUpperCase()}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-white capitalize">{userJourney.stage} Stage</span>
                  <span className="text-sm text-gray-400">{userJourney.daysInStage} days in stage</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-4 rounded-full transition-all"
                    style={{ width: `${userJourney.completionRate}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{userJourney.completionRate}% Complete</span>
                  <span className="text-blue-400">
                    Next stage in ~{userJourney.predictedTimeToNextStage} days
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">✓ Key Actions</h4>
                  <div className="space-y-2">
                    {userJourney.keyActions.map((action, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-black/20 rounded">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {action.completed ? '✅' : '⏳'}
                          </span>
                          <span className={`text-sm ${action.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                            {action.action}
                          </span>
                        </div>
                        {action.completedDate && (
                          <span className="text-xs text-green-400">
                            {format(parseISO(action.completedDate), 'MMM dd, yyyy')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">💡 Recommended Next Actions</h4>
                  <div className="space-y-2">
                    {userJourney.nextRecommendedActions.map((action, index) => (
                      <div key={index} className="p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">→</span>
                          <span className="text-sm text-white">{action}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Journey Timeline */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">🗺️ Journey Timeline</h3>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700"></div>
                
                {['discovery', 'activation', 'engagement', 'retention', 'advocacy'].map((stage, index) => (
                  <div key={stage} className="relative pl-20 pb-8 last:pb-0">
                    <div className={`absolute left-6 w-4 h-4 rounded-full border-2 ${
                      stage === userJourney.stage ? 'bg-pink-500 border-pink-500 animate-pulse' :
                      index < ['discovery', 'activation', 'engagement', 'retention', 'advocacy'].indexOf(userJourney.stage) ? 'bg-green-500 border-green-500' :
                      'bg-gray-700 border-gray-700'
                    }`}></div>
                    <div className={`p-4 rounded-lg ${
                      stage === userJourney.stage ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30' :
                      index < ['discovery', 'activation', 'engagement', 'retention', 'advocacy'].indexOf(userJourney.stage) ? 'bg-green-500/10 border border-green-500/20' :
                      'bg-gray-800/50 border border-gray-700/30'
                    }`}>
                      <h4 className="text-lg font-semibold text-white capitalize mb-1">{stage}</h4>
                      <p className="text-sm text-gray-400">
                        {stage === 'discovery' && 'Exploring Sacred Vault capabilities'}
                        {stage === 'activation' && 'Setting up profile and first actions'}
                        {stage === 'engagement' && 'Regular usage and feature adoption'}
                        {stage === 'retention' && 'Established habits and ongoing value'}
                        {stage === 'advocacy' && 'Promoting Sacred Vault to others'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'predictions' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-4">
              <p className="text-gray-300">
                🔮 <strong>{predictiveModels.length} AI prediction models</strong> analyzing your behavior and outcomes
              </p>
            </div>

            {predictiveModels.map((model, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white capitalize">{model.modelType.replace('-', ' ')}</h3>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
                        {model.accuracyRate}% Accurate
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Last updated: {format(parseISO(model.lastUpdated), 'MMM dd, yyyy h:mm a')}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-pink-400">{model.confidence}%</div>
                    <p className="text-xs text-gray-400">Confidence</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg mb-4">
                  <p className="text-lg text-white font-medium">{model.prediction}</p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-3">🎯 Key Factors & Impact:</h4>
                  <div className="space-y-2">
                    {model.factors.map((factor, idx) => (
                      <div key={idx} className="p-3 bg-black/20 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white">{factor.factor}</span>
                          <span className="text-xs font-medium text-purple-400">{factor.importance}% importance</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              factor.impact > 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                              'bg-gradient-to-r from-red-500 to-rose-500'
                            }`}
                            style={{ width: `${Math.abs(factor.impact)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white mb-2">💡 AI Recommendations:</h4>
                  <ul className="space-y-1">
                    {model.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-green-300 flex items-start gap-2">
                        <span className="text-green-400 mt-1">→</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}