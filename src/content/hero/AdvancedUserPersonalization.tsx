"use client";

import React, { useState } from 'react';
import { format, parseISO, differenceInDays, subMonths, subWeeks } from 'date-fns';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, Cell } from 'recharts';

// Personalization Types
type UserProfile = {
  id: string;
  createdAt: string;
  lastActive: string;
  totalSessions: number;
  totalTimeSpent: number; // minutes
  healthPersonality: HealthPersonality;
  preferences: UserPreferences;
  learningProfile: LearningProfile;
  engagementScore: number; // 0-100
  personalizationAccuracy: number; // 0-100
  profileCompleteness: number; // 0-100
};

type HealthPersonality = {
  type: 'data-driven' | 'goal-oriented' | 'social-motivated' | 'wellness-focused' | 'prevention-minded';
  traits: {
    analyticalThinking: number; // 0-100
    goalOrientation: number;
    socialEngagement: number;
    wellnessAdoption: number;
    preventiveMindset: number;
    detailOrientation: number;
    proactiveAction: number;
    emotionalAwareness: number;
  };
  confidence: number; // 0-100
  assessmentDate: string;
  description: string;
};

type UserPreferences = {
  communicationStyle: 'detailed' | 'concise' | 'visual' | 'conversational';
  notificationTiming: 'morning' | 'afternoon' | 'evening' | 'flexible';
  contentDepth: 'overview' | 'moderate' | 'comprehensive';
  visualStyle: 'minimalist' | 'data-rich' | 'balanced';
  dashboardLayout: 'metrics-first' | 'insights-first' | 'timeline-first' | 'custom';
  primaryGoals: string[];
  focusAreas: string[];
  privacyLevel: 'minimal' | 'moderate' | 'maximum';
  dataSharing: {
    providers: boolean;
    family: boolean;
    researchers: boolean;
  };
  learningSpeed: 'fast' | 'moderate' | 'gradual';
};

type LearningProfile = {
  featuresDiscovered: number;
  featuresUsed: number;
  expertiseLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  topFeatures: { feature: string; usageCount: number; lastUsed: string; }[];
  learningCurve: { date: string; competency: number; }[];
  strugglingAreas: string[];
  masteredAreas: string[];
  recommendedNextSteps: string[];
};

type BehavioralPattern = {
  id: string;
  pattern: string;
  frequency: number; // times per week
  consistency: number; // 0-100
  trend: 'increasing' | 'stable' | 'decreasing';
  significance: 'high' | 'medium' | 'low';
  detectedAt: string;
  examples: string[];
  recommendations: string[];
};

type PersonalizationRule = {
  id: string;
  name: string;
  type: 'content' | 'timing' | 'layout' | 'feature' | 'notification';
  condition: string;
  action: string;
  priority: number; // 1-10
  effectiveness: number; // 0-100
  timesApplied: number;
  lastApplied: string;
  userSatisfaction: number; // 0-100
  active: boolean;
};

type ContentRecommendation = {
  id: string;
  contentType: 'article' | 'video' | 'tool' | 'feature' | 'insight';
  title: string;
  description: string;
  relevanceScore: number; // 0-100
  personalizationFactors: string[];
  estimatedValue: 'high' | 'medium' | 'low';
  estimatedTime: number; // minutes
  category: string;
  priority: number;
  recommendedTiming: string;
};

// Sample Data
const userProfile: UserProfile = {
  id: 'user-123',
  createdAt: '2025-06-15T10:00:00Z',
  lastActive: '2026-01-18T14:30:00Z',
  totalSessions: 156,
  totalTimeSpent: 2840, // ~47 hours
  healthPersonality: {
    type: 'data-driven',
    traits: {
      analyticalThinking: 92,
      goalOrientation: 85,
      socialEngagement: 45,
      wellnessAdoption: 78,
      preventiveMindset: 88,
      detailOrientation: 95,
      proactiveAction: 82,
      emotionalAwareness: 65
    },
    confidence: 94,
    assessmentDate: '2026-01-15T00:00:00Z',
    description: 'Highly analytical and data-focused with strong preventive healthcare mindset. Prefers detailed metrics and comprehensive analysis over general summaries.'
  },
  preferences: {
    communicationStyle: 'detailed',
    notificationTiming: 'morning',
    contentDepth: 'comprehensive',
    visualStyle: 'data-rich',
    dashboardLayout: 'metrics-first',
    primaryGoals: ['diabetes-management', 'cardiovascular-health', 'weight-optimization'],
    focusAreas: ['lab-results', 'medication-adherence', 'exercise-tracking'],
    privacyLevel: 'moderate',
    dataSharing: {
      providers: true,
      family: false,
      researchers: true
    },
    learningSpeed: 'fast'
  },
  learningProfile: {
    featuresDiscovered: 42,
    featuresUsed: 38,
    expertiseLevel: 'advanced',
    topFeatures: [
      { feature: 'Health Metrics Dashboard', usageCount: 89, lastUsed: '2026-01-18T14:30:00Z' },
      { feature: 'AI Health Insights', usageCount: 67, lastUsed: '2026-01-18T14:15:00Z' },
      { feature: 'Pattern Recognition', usageCount: 54, lastUsed: '2026-01-18T13:45:00Z' },
      { feature: 'Document Analysis', usageCount: 45, lastUsed: '2026-01-17T16:20:00Z' },
      { feature: 'Provider Dashboard', usageCount: 32, lastUsed: '2026-01-16T11:00:00Z' }
    ],
    learningCurve: [
      { date: '2025-06-15', competency: 15 },
      { date: '2025-07-15', competency: 35 },
      { date: '2025-08-15', competency: 52 },
      { date: '2025-09-15', competency: 68 },
      { date: '2025-10-15', competency: 79 },
      { date: '2025-11-15', competency: 86 },
      { date: '2025-12-15', competency: 91 },
      { date: '2026-01-15', competency: 94 }
    ],
    strugglingAreas: ['Social Features', 'Mobile App Integration'],
    masteredAreas: ['Metrics Tracking', 'Document Upload', 'AI Insights', 'Provider Communication'],
    recommendedNextSteps: [
      'Explore Care Team Collaboration features',
      'Set up automated health reports',
      'Configure advanced notification rules',
      'Try AI Wellness Coach for goal optimization'
    ]
  },
  engagementScore: 87,
  personalizationAccuracy: 96,
  profileCompleteness: 91
};

const behavioralPatterns: BehavioralPattern[] = [
  {
    id: 'pattern-1',
    pattern: 'Morning Health Review Ritual',
    frequency: 6.5,
    consistency: 94,
    trend: 'stable',
    significance: 'high',
    detectedAt: '2025-07-20T00:00:00Z',
    examples: [
      'Checks metrics dashboard between 7:00-8:30 AM',
      'Reviews AI insights immediately after dashboard',
      'Updates health journal 4x per week in morning'
    ],
    recommendations: [
      'Schedule insights generation for 7:00 AM',
      'Enable morning digest notification',
      'Pre-load frequently viewed charts for faster access'
    ]
  },
  {
    id: 'pattern-2',
    pattern: 'Weekly Deep Dive Sessions',
    frequency: 1.2,
    consistency: 88,
    trend: 'increasing',
    significance: 'high',
    detectedAt: '2025-08-10T00:00:00Z',
    examples: [
      'Sunday evenings: 30-45 minute analysis sessions',
      'Reviews all new lab results in detail',
      'Exports data and creates personal annotations'
    ],
    recommendations: [
      'Prepare weekly summary reports on Sundays',
      'Highlight new patterns discovered during week',
      'Suggest correlation analyses based on recent data'
    ]
  },
  {
    id: 'pattern-3',
    pattern: 'Post-Appointment Documentation',
    frequency: 0.8,
    consistency: 96,
    trend: 'stable',
    significance: 'medium',
    detectedAt: '2025-09-05T00:00:00Z',
    examples: [
      'Uploads documents within 2 hours of appointments',
      'Adds detailed notes and context',
      'Cross-references with previous visits'
    ],
    recommendations: [
      'Auto-suggest document categories based on provider',
      'Prompt for visit summary immediately after upload',
      'Show related previous appointments automatically'
    ]
  },
  {
    id: 'pattern-4',
    pattern: 'Metric Correlation Exploration',
    frequency: 3.5,
    consistency: 76,
    trend: 'increasing',
    significance: 'high',
    detectedAt: '2025-11-12T00:00:00Z',
    examples: [
      'Frequently compares HbA1c with exercise data',
      'Analyzes blood pressure vs stress levels',
      'Explores medication timing vs glucose readings'
    ],
    recommendations: [
      'Proactively suggest correlation analyses',
      'Auto-generate correlation reports monthly',
      'Highlight statistically significant relationships'
    ]
  }
];

const personalizationRules: PersonalizationRule[] = [
  {
    id: 'rule-1',
    name: 'Morning Metrics Priority',
    type: 'layout',
    condition: 'Time between 7:00-9:00 AM',
    action: 'Show detailed metrics dashboard as landing page',
    priority: 9,
    effectiveness: 96,
    timesApplied: 124,
    lastApplied: '2026-01-18T07:15:00Z',
    userSatisfaction: 98,
    active: true
  },
  {
    id: 'rule-2',
    name: 'Data-Rich Visualization',
    type: 'content',
    condition: 'User personality: data-driven',
    action: 'Display comprehensive charts with statistical details',
    priority: 8,
    effectiveness: 94,
    timesApplied: 312,
    lastApplied: '2026-01-18T14:30:00Z',
    userSatisfaction: 96,
    active: true
  },
  {
    id: 'rule-3',
    name: 'Quiet Weekend Notifications',
    type: 'notification',
    condition: 'Weekend days',
    action: 'Reduce notification frequency by 60%',
    priority: 7,
    effectiveness: 89,
    timesApplied: 28,
    lastApplied: '2026-01-12T00:00:00Z',
    userSatisfaction: 92,
    active: true
  },
  {
    id: 'rule-4',
    name: 'Lab Results Deep Dive',
    type: 'feature',
    condition: 'New lab results uploaded',
    action: 'Auto-open detailed analysis with historical comparison',
    priority: 9,
    effectiveness: 97,
    timesApplied: 18,
    lastApplied: '2026-01-15T14:30:00Z',
    userSatisfaction: 99,
    active: true
  },
  {
    id: 'rule-5',
    name: 'Sunday Summary Preparation',
    type: 'content',
    condition: 'Sunday 6:00 PM',
    action: 'Generate comprehensive weekly health summary',
    priority: 8,
    effectiveness: 93,
    timesApplied: 22,
    lastApplied: '2026-01-14T18:00:00Z',
    userSatisfaction: 95,
    active: true
  }
];

const contentRecommendations: ContentRecommendation[] = [
  {
    id: 'rec-1',
    contentType: 'feature',
    title: 'AI Wellness Coach',
    description: 'Get personalized wellness coaching based on your health data and goals',
    relevanceScore: 96,
    personalizationFactors: ['High goal orientation', 'Advanced expertise level', 'Data-driven personality'],
    estimatedValue: 'high',
    estimatedTime: 15,
    category: 'AI Features',
    priority: 1,
    recommendedTiming: 'Sunday evening during deep dive session'
  },
  {
    id: 'rec-2',
    contentType: 'tool',
    title: 'Advanced Correlation Analytics',
    description: 'Discover hidden relationships between your health metrics with statistical rigor',
    relevanceScore: 94,
    personalizationFactors: ['Metric correlation exploration pattern', 'Analytical thinking: 92', 'Detail orientation: 95'],
    estimatedValue: 'high',
    estimatedTime: 20,
    category: 'Analytics Tools',
    priority: 2,
    recommendedTiming: 'During your morning health review'
  },
  {
    id: 'rec-3',
    contentType: 'article',
    title: 'Optimizing HbA1c Through Exercise Timing',
    description: 'Research-backed insights on exercise timing for better diabetes control',
    relevanceScore: 89,
    personalizationFactors: ['Primary goal: diabetes-management', 'Interest in correlation analyses'],
    estimatedValue: 'medium',
    estimatedTime: 8,
    category: 'Educational Content',
    priority: 3,
    recommendedTiming: 'After reviewing latest metrics'
  },
  {
    id: 'rec-4',
    contentType: 'feature',
    title: 'Automated Health Reports',
    description: 'Set up automated weekly/monthly health reports for you and your providers',
    relevanceScore: 87,
    personalizationFactors: ['Weekly deep dive pattern', 'Provider data sharing enabled', 'Advanced user'],
    estimatedValue: 'high',
    estimatedTime: 12,
    category: 'Automation',
    priority: 4,
    recommendedTiming: 'Next Sunday session'
  },
  {
    id: 'rec-5',
    contentType: 'insight',
    title: 'Your Health Personality Analysis',
    description: 'Deep dive into your unique health management style and optimization opportunities',
    relevanceScore: 85,
    personalizationFactors: ['High engagement score', 'Advanced expertise', 'Comprehensive content preference'],
    estimatedValue: 'medium',
    estimatedTime: 10,
    category: 'Personalization',
    priority: 5,
    recommendedTiming: 'Anytime you want deeper self-understanding'
  }
];

const personalityTypes = {
  'data-driven': { color: '#ec4899', icon: '📊', label: 'Data-Driven Analyst' },
  'goal-oriented': { color: '#8b5cf6', icon: '🎯', label: 'Goal-Oriented Achiever' },
  'social-motivated': { color: '#06d6a0', icon: '👥', label: 'Social Motivator' },
  'wellness-focused': { color: '#ffd23f', icon: '🌟', label: 'Wellness Enthusiast' },
  'prevention-minded': { color: '#3b82f6', icon: '🛡️', label: 'Prevention Advocate' }
};

export default function AdvancedUserPersonalization() {
  const [activeTab, setActiveTab] = useState<'profile' | 'personality' | 'patterns' | 'rules' | 'recommendations'>('profile');
  const [showEditMode, setShowEditMode] = useState(false);

  const personalityData = Object.entries(userProfile.healthPersonality.traits).map(([name, value]) => ({
    trait: name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    value,
    fullMark: 100
  }));

  const getPersonalityTypeInfo = (type: string) => personalityTypes[type as keyof typeof personalityTypes];

  const getExpertiseLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'text-purple-400 bg-purple-500/20';
      case 'advanced': return 'text-blue-400 bg-blue-500/20';
      case 'intermediate': return 'text-green-400 bg-green-500/20';
      default: return 'text-yellow-400 bg-yellow-500/20';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      default: return '➡️';
    }
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-green-400 bg-green-500/20';
    }
  };

  const getValueColor = (value: string) => {
    switch (value) {
      case 'high': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const daysSinceCreation = differenceInDays(new Date(), parseISO(userProfile.createdAt));
  const avgSessionDuration = userProfile.totalTimeSpent / userProfile.totalSessions;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Advanced User Personalization
              </h1>
              <p className="text-gray-400">
                AI-powered profile with behavioral analytics, personality assessment, and intelligent recommendations
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-bold text-pink-400">{userProfile.personalizationAccuracy}%</div>
                <p className="text-xs text-gray-400">Personalization Accuracy</p>
              </div>
              <button 
                onClick={() => setShowEditMode(!showEditMode)}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition"
              >
                {showEditMode ? 'Save Preferences' : 'Edit Preferences'}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Engagement Score</p>
                  <p className="text-2xl font-bold text-white">{userProfile.engagementScore}%</p>
                </div>
                <div className="text-2xl">⚡</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Profile Complete</p>
                  <p className="text-2xl font-bold text-white">{userProfile.profileCompleteness}%</p>
                </div>
                <div className="text-2xl">✓</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Total Sessions</p>
                  <p className="text-2xl font-bold text-white">{userProfile.totalSessions}</p>
                </div>
                <div className="text-2xl">🔢</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl border border-yellow-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-medium">Avg Session</p>
                  <p className="text-2xl font-bold text-white">{avgSessionDuration.toFixed(0)}m</p>
                </div>
                <div className="text-2xl">⏱️</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 rounded-xl border border-pink-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-400 text-sm font-medium">Member Since</p>
                  <p className="text-2xl font-bold text-white">{daysSinceCreation}d</p>
                </div>
                <div className="text-2xl">📅</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'profile', label: 'Profile Overview', icon: '👤' },
              { id: 'personality', label: 'Health Personality', icon: '🧠' },
              { id: 'patterns', label: 'Behavioral Patterns', icon: '📊' },
              { id: 'rules', label: 'Personalization Rules', icon: '⚙️' },
              { id: 'recommendations', label: 'Smart Recommendations', icon: '💡' }
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
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Preferences */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">📋 User Preferences</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-black/20 rounded-lg">
                    <h4 className="text-sm font-medium text-white mb-2">Communication Style</h4>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-pink-500/20 border border-pink-500/30 text-pink-300 rounded-full text-sm font-medium">
                        {userProfile.preferences.communicationStyle}
                      </span>
                      <span className="text-xs text-gray-400">Comprehensive, data-rich content</span>
                    </div>
                  </div>

                  <div className="p-4 bg-black/20 rounded-lg">
                    <h4 className="text-sm font-medium text-white mb-2">Notification Timing</h4>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-sm font-medium">
                        {userProfile.preferences.notificationTiming}
                      </span>
                      <span className="text-xs text-gray-400">7:00-9:00 AM preferred</span>
                    </div>
                  </div>

                  <div className="p-4 bg-black/20 rounded-lg">
                    <h4 className="text-sm font-medium text-white mb-2">Dashboard Layout</h4>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full text-sm font-medium">
                        {userProfile.preferences.dashboardLayout}
                      </span>
                      <span className="text-xs text-gray-400">Metrics prioritized</span>
                    </div>
                  </div>

                  <div className="p-4 bg-black/20 rounded-lg">
                    <h4 className="text-sm font-medium text-white mb-3">Primary Health Goals</h4>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.preferences.primaryGoals.map((goal, index) => (
                        <span key={index} className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-medium">
                          {goal.replace('-', ' ').toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-black/20 rounded-lg">
                    <h4 className="text-sm font-medium text-white mb-3">Focus Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.preferences.focusAreas.map((area, index) => (
                        <span key={index} className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs font-medium">
                          {area.replace('-', ' ').toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Profile */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">🎓 Learning Profile</h3>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Expertise Level</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getExpertiseLevelColor(userProfile.learningProfile.expertiseLevel)}`}>
                      {userProfile.learningProfile.expertiseLevel.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center mt-4">
                    <div className="p-3 bg-black/20 rounded">
                      <div className="text-2xl font-bold text-blue-400">{userProfile.learningProfile.featuresDiscovered}</div>
                      <p className="text-xs text-gray-400">Features Discovered</p>
                    </div>
                    <div className="p-3 bg-black/20 rounded">
                      <div className="text-2xl font-bold text-green-400">{userProfile.learningProfile.featuresUsed}</div>
                      <p className="text-xs text-gray-400">Features Used</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-white mb-3">Top Features Used</h4>
                  <div className="space-y-2">
                    {userProfile.learningProfile.topFeatures.slice(0, 5).map((feature, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-black/20 rounded">
                        <div>
                          <p className="text-sm text-white font-medium">{feature.feature}</p>
                          <p className="text-xs text-gray-400">{feature.usageCount} times used</p>
                        </div>
                        <span className="text-xs text-pink-400">
                          {format(parseISO(feature.lastUsed), 'MMM dd')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h5 className="text-sm font-medium text-green-400 mb-2">✓ Mastered Areas</h5>
                    <div className="flex flex-wrap gap-1">
                      {userProfile.learningProfile.masteredAreas.map((area, index) => (
                        <span key={index} className="text-xs text-green-300">{area}{index < userProfile.learningProfile.masteredAreas.length - 1 ? ',' : ''}</span>
                      ))}
                    </div>
                  </div>

                  {userProfile.learningProfile.strugglingAreas.length > 0 && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <h5 className="text-sm font-medium text-yellow-400 mb-2">⚠ Learning Opportunities</h5>
                      <div className="flex flex-wrap gap-1">
                        {userProfile.learningProfile.strugglingAreas.map((area, index) => (
                          <span key={index} className="text-xs text-yellow-300">{area}{index < userProfile.learningProfile.strugglingAreas.length - 1 ? ',' : ''}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Learning Curve */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">📈 Learning Curve & Competency Growth</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userProfile.learningProfile.learningCurve}>
                    <defs>
                      <linearGradient id="competencyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      tickFormatter={(date) => format(parseISO(date), 'MMM')}
                    />
                    <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      labelFormatter={(date) => format(parseISO(date), 'MMMM yyyy')}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="competency" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#competencyGradient)" 
                      name="Competency Score"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommended Next Steps */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">🎯 Recommended Next Steps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userProfile.learningProfile.recommendedNextSteps.map((step, index) => (
                  <div key={index} className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{index + 1}</span>
                      <div>
                        <p className="text-white font-medium">{step}</p>
                        <button className="mt-2 text-xs text-blue-400 hover:text-blue-300">Learn more →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'personality' && (
          <div className="space-y-6">
            {/* Personality Type */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Your Health Personality</h3>
                  <p className="text-gray-400">AI-assessed profile based on {userProfile.totalSessions} sessions of behavioral data</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-pink-400">{userProfile.healthPersonality.confidence}%</div>
                  <p className="text-xs text-gray-400">Assessment Confidence</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="p-6 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl">{getPersonalityTypeInfo(userProfile.healthPersonality.type).icon}</span>
                    <div>
                      <h4 className="text-2xl font-bold text-white">{getPersonalityTypeInfo(userProfile.healthPersonality.type).label}</h4>
                      <p className="text-sm text-gray-400">Primary Health Personality Type</p>
                    </div>
                  </div>
                  <p className="text-gray-300">{userProfile.healthPersonality.description}</p>
                </div>

                <div className="p-6 bg-black/20 rounded-xl">
                  <h4 className="text-lg font-semibold text-white mb-4">Personality Trait Breakdown</h4>
                  <div className="space-y-3">
                    {Object.entries(userProfile.healthPersonality.traits).slice(0, 4).map(([trait, value]) => (
                      <div key={trait}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-300 capitalize">{trait.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-sm font-bold text-white">{value}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Personality Radar Chart */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">🎯 Comprehensive Trait Analysis</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={personalityData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="trait" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <PolarRadiusAxis stroke="#9CA3AF" domain={[0, 100]} />
                    <Radar 
                      name="Your Profile" 
                      dataKey="value" 
                      stroke="#ec4899" 
                      fill="#ec4899" 
                      fillOpacity={0.6} 
                      strokeWidth={2}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trait Details */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">📊 Trait Details & Implications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(userProfile.healthPersonality.traits).map(([trait, value]) => (
                  <div key={trait} className="p-4 bg-black/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-white capitalize">
                        {trait.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        value >= 80 ? 'text-green-400 bg-green-500/20' :
                        value >= 60 ? 'text-blue-400 bg-blue-500/20' :
                        value >= 40 ? 'text-yellow-400 bg-yellow-500/20' :
                        'text-gray-400 bg-gray-500/20'
                      }`}>
                        {value}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {value >= 80 ? 'Dominant trait - Strongly influences your health journey' :
                       value >= 60 ? 'Moderate strength - Notable influence on behavior' :
                       value >= 40 ? 'Developing trait - Emerging pattern' :
                       'Lower priority - Less influential currently'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-4">
              <p className="text-gray-300">
                💡 <strong>{behavioralPatterns.length} behavioral patterns</strong> detected from your {userProfile.totalSessions} sessions
              </p>
            </div>

            {behavioralPatterns.map((pattern) => (
              <div key={pattern.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{pattern.pattern}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSignificanceColor(pattern.significance)}`}>
                        {pattern.significance.toUpperCase()}
                      </span>
                      <span className="text-xl">{getTrendIcon(pattern.trend)}</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Detected {format(parseISO(pattern.detectedAt), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-pink-400">{pattern.frequency.toFixed(1)}x</div>
                    <p className="text-xs text-gray-400">per week</p>
                    <div className="text-sm font-medium text-blue-400 mt-1">{pattern.consistency}% consistent</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">📋 Pattern Examples:</h4>
                    <ul className="space-y-1">
                      {pattern.examples.map((example, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">💡 AI Recommendations:</h4>
                    <ul className="space-y-1">
                      {pattern.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-green-300 flex items-start gap-2">
                          <span className="text-green-400 mt-1">→</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-300">
                  ⚙️ <strong>{personalizationRules.filter(r => r.active).length} active rules</strong> personalizing your experience
                </p>
                <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-sm">
                  + Create Custom Rule
                </button>
              </div>
            </div>

            {personalizationRules.map((rule) => (
              <div key={rule.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{rule.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rule.type === 'layout' ? 'text-purple-400 bg-purple-500/20' :
                        rule.type === 'content' ? 'text-blue-400 bg-blue-500/20' :
                        rule.type === 'notification' ? 'text-yellow-400 bg-yellow-500/20' :
                        rule.type === 'feature' ? 'text-green-400 bg-green-500/20' :
                        'text-pink-400 bg-pink-500/20'
                      }`}>
                        {rule.type.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rule.active ? 'text-green-400 bg-green-500/20' : 'text-gray-400 bg-gray-500/20'
                      }`}>
                        {rule.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="p-3 bg-black/20 rounded">
                        <p className="text-xs text-gray-400 mb-1">Condition:</p>
                        <p className="text-sm text-white">{rule.condition}</p>
                      </div>
                      <div className="p-3 bg-black/20 rounded">
                        <p className="text-xs text-gray-400 mb-1">Action:</p>
                        <p className="text-sm text-white">{rule.action}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-xl font-bold text-pink-400">Priority {rule.priority}</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-black/20 rounded">
                    <div className="text-lg font-bold text-green-400">{rule.effectiveness}%</div>
                    <p className="text-xs text-gray-400">Effectiveness</p>
                  </div>
                  <div className="p-3 bg-black/20 rounded">
                    <div className="text-lg font-bold text-blue-400">{rule.userSatisfaction}%</div>
                    <p className="text-xs text-gray-400">Satisfaction</p>
                  </div>
                  <div className="p-3 bg-black/20 rounded">
                    <div className="text-lg font-bold text-purple-400">{rule.timesApplied}</div>
                    <p className="text-xs text-gray-400">Times Applied</p>
                  </div>
                  <div className="p-3 bg-black/20 rounded">
                    <div className="text-xs font-medium text-yellow-400">
                      {format(parseISO(rule.lastApplied), 'MMM dd')}
                    </div>
                    <p className="text-xs text-gray-400">Last Applied</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-4">
              <p className="text-gray-300">
                💡 <strong>{contentRecommendations.length} personalized recommendations</strong> based on your profile and behavior
              </p>
            </div>

            {contentRecommendations.map((rec) => (
              <div key={rec.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {rec.contentType === 'feature' ? '🎯' :
                         rec.contentType === 'article' ? '📄' :
                         rec.contentType === 'video' ? '🎥' :
                         rec.contentType === 'tool' ? '🔧' : '💡'}
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{rec.title}</h3>
                        <p className="text-sm text-gray-400">{rec.category}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-3">{rec.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {rec.personalizationFactors.map((factor, index) => (
                        <span key={index} className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-xs">
                          {factor}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-xs text-blue-300">
                      💡 Best time: {rec.recommendedTiming}
                    </p>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-pink-400 mb-1">{rec.relevanceScore}%</div>
                    <p className="text-xs text-gray-400 mb-2">Relevance</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getValueColor(rec.estimatedValue)}`}>
                      {rec.estimatedValue.toUpperCase()} VALUE
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>⏱️ {rec.estimatedTime} minutes</span>
                    <span>🎯 Priority #{rec.priority}</span>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition">
                    Explore Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}