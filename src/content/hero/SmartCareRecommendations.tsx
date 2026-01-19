"use client";

import React, { useState } from 'react';
import { format, parseISO, addDays, addWeeks } from 'date-fns';

// Smart Care Recommendation Types
type CareRecommendation = {
  id: string;
  title: string;
  description: string;
  category: 'lifestyle' | 'medication' | 'monitoring' | 'prevention' | 'mental-health' | 'nutrition' | 'exercise' | 'sleep';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  urgency: 'routine' | 'timely' | 'immediate' | 'emergency';
  aiGenerated: boolean;
  providerApproved?: boolean;
  evidenceLevel: 'anecdotal' | 'observational' | 'clinical-study' | 'peer-reviewed' | 'medical-guidelines';
  personalizationScore: number; // 0-100 - how tailored to this specific patient
  confidenceScore: number; // 0-100 - AI confidence in recommendation
  expectedOutcome: string;
  timeToResult: string;
  effortLevel: 'minimal' | 'low' | 'moderate' | 'high' | 'significant';
  costEstimate: 'free' | '$' | '$$' | '$$$' | '$$$$';
  implementationSteps: string[];
  trackingMetrics: string[];
  contraindications?: string[];
  alternativeOptions?: string[];
  relatedGoalIds?: string[];
  supportingData: {
    metric: string;
    currentValue: any;
    targetValue?: any;
    trend: 'improving' | 'stable' | 'declining';
    relevance: number; // 0-100
  }[];
  generatedAt: string;
  lastReviewed?: string;
  status: 'new' | 'reviewing' | 'approved' | 'implementing' | 'completed' | 'declined' | 'paused';
  feedback?: {
    rating: 1 | 2 | 3 | 4 | 5;
    comments: string;
    effectiveness?: 'very-helpful' | 'helpful' | 'somewhat-helpful' | 'not-helpful';
    followedThrough: boolean;
  };
};

type RecommendationEngine = {
  analysisComplete: boolean;
  lastAnalysisRun: string;
  totalRecommendations: number;
  activeRecommendations: number;
  implementedRecommendations: number;
  averagePersonalizationScore: number;
  averageConfidenceScore: number;
  successRate: number; // percentage of implemented recommendations that were effective
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
  analysisDepth: 'surface' | 'standard' | 'deep' | 'comprehensive';
};

type SmartAlert = {
  id: string;
  type: 'medication-reminder' | 'health-milestone' | 'appointment-prep' | 'health-risk' | 'pattern-detected' | 'goal-achievement';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timing: 'immediate' | 'scheduled' | 'triggered';
  triggerCondition?: string;
  actionRequired: boolean;
  dismissible: boolean;
  smartDelivery: boolean; // AI-optimized timing
  personalizedContent: boolean;
  scheduledFor?: string;
  expiresAt?: string;
  relatedRecommendationId?: string;
  createdAt: string;
  acknowledged?: boolean;
  actedUpon?: boolean;
};

// Sample data
const recommendations: CareRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Optimize Morning Exercise Timing for Blood Pressure Control',
    description: 'Based on your personal data patterns, exercising between 8:00-10:00 AM shows 23% better blood pressure improvements compared to evening workouts. Your body responds optimally to morning aerobic activity.',
    category: 'exercise',
    priority: 'high',
    urgency: 'timely',
    aiGenerated: true,
    providerApproved: true,
    evidenceLevel: 'clinical-study',
    personalizationScore: 94,
    confidenceScore: 87,
    expectedOutcome: 'Additional 5-8 mmHg systolic blood pressure reduction',
    timeToResult: '2-3 weeks',
    effortLevel: 'minimal',
    costEstimate: 'free',
    implementationSteps: [
      'Shift current exercise routine to morning hours (8-10 AM)',
      'Start with 3 days per week for adaptation period',
      'Monitor blood pressure before and after morning sessions',
      'Track energy levels throughout the day',
      'Gradually increase to 5 days per week'
    ],
    trackingMetrics: ['Morning BP readings', 'Exercise timing', 'Exercise duration', 'Energy levels', 'Sleep quality'],
    supportingData: [
      {
        metric: 'Post-Exercise BP Reduction',
        currentValue: '6 mmHg (evening)',
        targetValue: '12 mmHg (morning)',
        trend: 'stable',
        relevance: 95
      },
      {
        metric: 'Exercise Consistency',
        currentValue: '4.2 days/week',
        trend: 'improving',
        relevance: 78
      }
    ],
    generatedAt: '2026-01-18',
    status: 'approved',
    relatedGoalIds: ['goal-2']
  },
  {
    id: 'rec-2',
    title: 'Sleep Schedule Optimization for Glucose Control',
    description: 'Your glucose readings are 15-20 mg/dL higher on days following poor sleep (<6 hours). Implementing a consistent 7+ hour sleep schedule could significantly improve your morning glucose levels.',
    category: 'sleep',
    priority: 'high',
    urgency: 'timely',
    aiGenerated: true,
    evidenceLevel: 'peer-reviewed',
    personalizationScore: 91,
    confidenceScore: 82,
    expectedOutcome: 'Improve morning glucose readings by 12-18 mg/dL',
    timeToResult: '1-2 weeks',
    effortLevel: 'moderate',
    costEstimate: 'free',
    implementationSteps: [
      'Set consistent bedtime at 10:30 PM',
      'Create wind-down routine 30 minutes before bed',
      'Avoid screens 1 hour before bedtime',
      'Keep bedroom temperature at 65-68°F',
      'Track sleep quality using wearable device'
    ],
    trackingMetrics: ['Sleep duration', 'Sleep quality score', 'Morning glucose', 'Bedtime consistency', 'Wake time consistency'],
    supportingData: [
      {
        metric: 'Sleep Duration Average',
        currentValue: '6.2 hours',
        targetValue: '7.5 hours',
        trend: 'stable',
        relevance: 92
      },
      {
        metric: 'Morning Glucose (Poor Sleep)',
        currentValue: '142 mg/dL',
        targetValue: '125 mg/dL',
        trend: 'stable',
        relevance: 88
      }
    ],
    generatedAt: '2026-01-18',
    status: 'new',
    relatedGoalIds: ['goal-1']
  },
  {
    id: 'rec-3',
    title: 'Medication Timing Adjustment for Improved Efficacy',
    description: 'Clinical data suggests taking your diabetes medication 15 minutes earlier (7:45 AM instead of 8:00 AM) could improve absorption and reduce post-meal glucose spikes by 3-5%.',
    category: 'medication',
    priority: 'medium',
    urgency: 'routine',
    aiGenerated: true,
    providerApproved: false, // Requires provider approval
    evidenceLevel: 'medical-guidelines',
    personalizationScore: 88,
    confidenceScore: 94,
    expectedOutcome: '3-5% improvement in post-meal glucose control',
    timeToResult: '1 week',
    effortLevel: 'minimal',
    costEstimate: 'free',
    implementationSteps: [
      'Consult with prescribing physician about timing change',
      'If approved, gradually shift medication time by 5 minutes every 3 days',
      'Monitor post-meal glucose levels closely',
      'Track any changes in side effects',
      'Report results to healthcare provider after 2 weeks'
    ],
    trackingMetrics: ['Medication timing', 'Post-meal glucose (1hr, 2hr)', 'Side effects', 'HbA1c trend'],
    contraindications: ['Recent medication changes', 'Digestive issues', 'Irregular meal timing'],
    alternativeOptions: ['Discuss alternative medication formulations', 'Consider continuous glucose monitoring'],
    supportingData: [
      {
        metric: 'Post-Meal Glucose Spike',
        currentValue: '180 mg/dL peak',
        targetValue: '150 mg/dL peak',
        trend: 'stable',
        relevance: 96
      }
    ],
    generatedAt: '2026-01-18',
    status: 'reviewing',
    relatedGoalIds: ['goal-1']
  },
  {
    id: 'rec-4',
    title: 'Stress-Management Strategy for Appointment Adherence',
    description: 'AI analysis shows you\'re 47% more likely to cancel appointments during high-stress periods. Implementing proactive stress management could improve your care continuity.',
    category: 'mental-health',
    priority: 'medium',
    urgency: 'routine',
    aiGenerated: true,
    evidenceLevel: 'observational',
    personalizationScore: 76,
    confidenceScore: 73,
    expectedOutcome: 'Reduce appointment cancellation rate by 30-40%',
    timeToResult: '4-6 weeks',
    effortLevel: 'moderate',
    costEstimate: '$',
    implementationSteps: [
      'Download and use a meditation app (Headspace or Calm)',
      'Schedule 10-minute daily mindfulness sessions',
      'Practice deep breathing exercises during stressful moments',
      'Plan appointments during typically lower-stress periods (early in month)',
      'Consider stress management counseling if needed'
    ],
    trackingMetrics: ['Daily stress level (1-10)', 'Appointment adherence rate', 'Meditation consistency', 'Sleep quality'],
    alternativeOptions: ['Progressive muscle relaxation', 'Yoga classes', 'Talk therapy sessions'],
    supportingData: [
      {
        metric: 'Appointment Cancellation Rate',
        currentValue: '18% during high stress',
        targetValue: '8% target rate',
        trend: 'stable',
        relevance: 84
      }
    ],
    generatedAt: '2026-01-17',
    status: 'new',
    relatedGoalIds: []
  },
  {
    id: 'rec-5',
    title: 'Nutritional Timing for Enhanced Medication Absorption',
    description: 'Your medication shows 20% better absorption when taken with a small protein-rich snack (15-20g protein). This could enhance effectiveness without changing dosage.',
    category: 'nutrition',
    priority: 'low',
    urgency: 'routine',
    aiGenerated: true,
    evidenceLevel: 'clinical-study',
    personalizationScore: 82,
    confidenceScore: 79,
    expectedOutcome: 'Improve medication effectiveness by 15-20%',
    timeToResult: '2-3 weeks',
    effortLevel: 'low',
    costEstimate: '$',
    implementationSteps: [
      'Prepare small protein-rich snacks (Greek yogurt, nuts, cheese)',
      'Take medication with snack 30 minutes before main meals',
      'Monitor blood glucose response patterns',
      'Track any digestive changes',
      'Measure effectiveness through glucose readings'
    ],
    trackingMetrics: ['Medication timing', 'Protein intake timing', 'Post-meal glucose', 'Digestive comfort'],
    contraindications: ['Food allergies', 'Lactose intolerance', 'Specific dietary restrictions'],
    supportingData: [
      {
        metric: 'Medication Effectiveness',
        currentValue: '78% estimated',
        targetValue: '90% target',
        trend: 'stable',
        relevance: 71
      }
    ],
    generatedAt: '2026-01-17',
    status: 'new'
  }
];

const engineStatus: RecommendationEngine = {
  analysisComplete: true,
  lastAnalysisRun: '2026-01-18T08:30:00Z',
  totalRecommendations: recommendations.length,
  activeRecommendations: recommendations.filter(r => ['new', 'reviewing', 'approved', 'implementing'].includes(r.status)).length,
  implementedRecommendations: recommendations.filter(r => r.status === 'implementing').length,
  averagePersonalizationScore: 86,
  averageConfidenceScore: 83,
  successRate: 78,
  dataQuality: 'excellent',
  analysisDepth: 'comprehensive'
};

const smartAlerts: SmartAlert[] = [
  {
    id: 'alert-1',
    type: 'medication-reminder',
    title: 'Optimized Medication Timing',
    message: 'Based on your breakfast schedule, take your diabetes medication in 15 minutes (7:45 AM) for optimal absorption.',
    priority: 'medium',
    timing: 'scheduled',
    actionRequired: true,
    dismissible: true,
    smartDelivery: true,
    personalizedContent: true,
    scheduledFor: '2026-01-19T07:30:00Z',
    relatedRecommendationId: 'rec-3',
    createdAt: '2026-01-18T20:00:00Z'
  },
  {
    id: 'alert-2',
    type: 'pattern-detected',
    title: 'Exercise Pattern Achievement',
    message: 'Congratulations! You\'ve successfully maintained morning exercise routine for 2 weeks. Your blood pressure has improved by 8 mmHg on average.',
    priority: 'low',
    timing: 'immediate',
    actionRequired: false,
    dismissible: true,
    smartDelivery: false,
    personalizedContent: true,
    relatedRecommendationId: 'rec-1',
    createdAt: '2026-01-18T09:00:00Z'
  },
  {
    id: 'alert-3',
    type: 'health-milestone',
    title: 'Sleep Goal Achievement',
    message: 'You\'ve achieved 7+ hours of sleep for 5 consecutive nights! Your morning glucose readings have improved by an average of 14 mg/dL.',
    priority: 'low',
    timing: 'immediate',
    actionRequired: false,
    dismissible: true,
    smartDelivery: false,
    personalizedContent: true,
    relatedRecommendationId: 'rec-2',
    createdAt: '2026-01-18T07:00:00Z'
  }
];

export default function SmartCareRecommendations() {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'engine-status' | 'alerts' | 'feedback'>('recommendations');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [selectedRec, setSelectedRec] = useState<string | null>(null);
  const [showImplementationDetails, setShowImplementationDetails] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'lifestyle': return 'text-blue-400 bg-blue-500/20';
      case 'medication': return 'text-purple-400 bg-purple-500/20';
      case 'monitoring': return 'text-green-400 bg-green-500/20';
      case 'prevention': return 'text-yellow-400 bg-yellow-500/20';
      case 'mental-health': return 'text-pink-400 bg-pink-500/20';
      case 'nutrition': return 'text-orange-400 bg-orange-500/20';
      case 'exercise': return 'text-cyan-400 bg-cyan-500/20';
      case 'sleep': return 'text-indigo-400 bg-indigo-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'reviewing': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'approved': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'implementing': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'completed': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      case 'declined': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'paused': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'lifestyle': return '🏃';
      case 'medication': return '💊';
      case 'monitoring': return '📊';
      case 'prevention': return '🛡️';
      case 'mental-health': return '🧠';
      case 'nutrition': return '🥗';
      case 'exercise': return '💪';
      case 'sleep': return '😴';
      default: return '📋';
    }
  };

  const getEffortIcon = (effort: string) => {
    switch (effort) {
      case 'minimal': return '🟢';
      case 'low': return '🟡';
      case 'moderate': return '🟠';
      case 'high': return '🔴';
      case 'significant': return '⭕';
      default: return '⚪';
    }
  };

  const getEvidenceIcon = (evidence: string) => {
    switch (evidence) {
      case 'medical-guidelines': return '⭐⭐⭐⭐⭐';
      case 'peer-reviewed': return '⭐⭐⭐⭐';
      case 'clinical-study': return '⭐⭐⭐';
      case 'observational': return '⭐⭐';
      case 'anecdotal': return '⭐';
      default: return '?';
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const categoryMatch = filterCategory === 'all' || rec.category === filterCategory;
    const priorityMatch = filterPriority === 'all' || rec.priority === filterPriority;
    const statusMatch = filterStatus === 'all' || 
      (filterStatus === 'active' && ['new', 'reviewing', 'approved', 'implementing'].includes(rec.status)) ||
      rec.status === filterStatus;
    
    return categoryMatch && priorityMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Smart Care Recommendations
              </h1>
              <p className="text-gray-400">
                AI-powered personalized healthcare recommendations based on your unique health patterns
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">AI Active</span>
              </div>
              <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition">
                Run Analysis
              </button>
            </div>
          </div>

          {/* Engine Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Active Recommendations</p>
                  <p className="text-2xl font-bold text-white">{engineStatus.activeRecommendations}</p>
                </div>
                <div className="text-2xl">🎯</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Personalization Score</p>
                  <p className="text-2xl font-bold text-white">{engineStatus.averagePersonalizationScore}%</p>
                </div>
                <div className="text-2xl">🧬</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Success Rate</p>
                  <p className="text-2xl font-bold text-white">{engineStatus.successRate}%</p>
                </div>
                <div className="text-2xl">✅</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl border border-yellow-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-medium">AI Confidence</p>
                  <p className="text-2xl font-bold text-white">{engineStatus.averageConfidenceScore}%</p>
                </div>
                <div className="text-2xl">🤖</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'recommendations', label: 'Recommendations', icon: '🎯' },
              { id: 'engine-status', label: 'AI Engine', icon: '🤖' },
              { id: 'alerts', label: 'Smart Alerts', icon: '🔔' },
              { id: 'feedback', label: 'Feedback', icon: '📝' }
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
        {activeTab === 'recommendations' && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Category:</label>
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="exercise">Exercise</option>
                  <option value="sleep">Sleep</option>
                  <option value="medication">Medication</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="mental-health">Mental Health</option>
                  <option value="lifestyle">Lifestyle</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Priority:</label>
                <select 
                  value={filterPriority} 
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Status:</label>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                >
                  <option value="active">Active</option>
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="approved">Approved</option>
                  <option value="implementing">Implementing</option>
                </select>
              </div>
              
              <div className="ml-auto text-sm text-gray-400">
                {filteredRecommendations.length} of {recommendations.length} recommendations
              </div>
            </div>

            {/* Recommendations List */}
            <div className="space-y-6">
              {filteredRecommendations.map((rec) => (
                <div key={rec.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getCategoryIcon(rec.category)}</span>
                        <h3 className="text-xl font-semibold text-white">{rec.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                          {rec.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(rec.category)}`}>
                          {rec.category.replace('-', ' ').toUpperCase()}
                        </span>
                        {rec.aiGenerated && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium text-purple-400 bg-purple-500/20">
                            AI GENERATED
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 mb-3">{rec.description}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-pink-400 mb-1">{rec.personalizationScore}%</div>
                      <p className="text-xs text-gray-400">Personalized</p>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-black/20 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{rec.confidenceScore}%</div>
                      <p className="text-xs text-gray-400">AI Confidence</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{rec.timeToResult}</div>
                      <p className="text-xs text-gray-400">Time to Result</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400 flex items-center justify-center gap-1">
                        {getEffortIcon(rec.effortLevel)}
                        <span className="text-sm">{rec.effortLevel}</span>
                      </div>
                      <p className="text-xs text-gray-400">Effort Level</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400">{rec.costEstimate}</div>
                      <p className="text-xs text-gray-400">Cost</p>
                    </div>
                  </div>

                  {/* Expected Outcome */}
                  <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h5 className="text-sm font-medium text-green-400 mb-1">🎯 Expected Outcome:</h5>
                    <p className="text-sm text-gray-300">{rec.expectedOutcome}</p>
                  </div>

                  {/* Evidence Level & Supporting Data */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-white">Evidence Level:</span>
                        <span className="text-sm">{getEvidenceIcon(rec.evidenceLevel)}</span>
                        <span className="text-sm text-gray-300 capitalize">{rec.evidenceLevel.replace('-', ' ')}</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-white">Status: </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(rec.status)}`}>
                        {rec.status.replace('-', ' ').toUpperCase()}
                      </span>
                      {rec.providerApproved !== undefined && (
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          rec.providerApproved 
                            ? 'text-green-400 bg-green-500/20' 
                            : 'text-yellow-400 bg-yellow-500/20'
                        }`}>
                          {rec.providerApproved ? '✓ Provider Approved' : '⏳ Needs Approval'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Supporting Data Preview */}
                  {rec.supportingData.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-white mb-2">📊 Supporting Data:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {rec.supportingData.slice(0, 2).map((data, index) => (
                          <div key={index} className="p-2 bg-black/20 rounded">
                            <div className="text-sm font-medium text-white">{data.metric}</div>
                            <div className="text-xs text-gray-300">
                              Current: {data.currentValue} 
                              {data.targetValue && ` → Target: ${data.targetValue}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setShowImplementationDetails(
                        showImplementationDetails === rec.id ? null : rec.id
                      )}
                      className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
                    >
                      {showImplementationDetails === rec.id ? 'Hide' : 'View'} Implementation Steps
                    </button>
                    
                    {rec.status === 'new' && (
                      <>
                        <button className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition">
                          Accept Recommendation
                        </button>
                        <button className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition">
                          Decline
                        </button>
                      </>
                    )}
                    
                    {rec.status === 'approved' && (
                      <button className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 transition">
                        Start Implementation
                      </button>
                    )}
                    
                    {rec.status === 'implementing' && (
                      <button className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition">
                        Track Progress
                      </button>
                    )}
                    
                    <button className="px-4 py-2 bg-gray-500/20 border border-gray-500/30 text-gray-400 rounded-lg hover:bg-gray-500/30 transition">
                      Share with Provider
                    </button>
                  </div>

                  {/* Implementation Details */}
                  {showImplementationDetails === rec.id && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h5 className="text-lg font-semibold text-white mb-4">📋 Implementation Plan</h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h6 className="text-sm font-medium text-white mb-2">Step-by-Step Guide:</h6>
                          <ol className="space-y-2">
                            {rec.implementationSteps.map((step, index) => (
                              <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                                <span className="text-pink-400 font-semibold">{index + 1}.</span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                        
                        <div>
                          <h6 className="text-sm font-medium text-white mb-2">Tracking Metrics:</h6>
                          <ul className="space-y-1">
                            {rec.trackingMetrics.map((metric, index) => (
                              <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                                <span className="text-blue-400">📊</span>
                                {metric}
                              </li>
                            ))}
                          </ul>
                          
                          {rec.contraindications && rec.contraindications.length > 0 && (
                            <div className="mt-4">
                              <h6 className="text-sm font-medium text-red-400 mb-2">⚠️ Contraindications:</h6>
                              <ul className="space-y-1">
                                {rec.contraindications.map((contra, index) => (
                                  <li key={index} className="text-xs text-gray-400 flex items-start gap-1">
                                    <span className="text-red-400">•</span>
                                    {contra}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab === 'engine-status' && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-2xl font-semibold text-white mb-2">AI Engine Status</h3>
            <p className="text-gray-400">Detailed AI engine performance metrics and analysis coming soon!</p>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-2xl font-semibold text-white mb-2">Smart Alerts & Notifications</h3>
            <p className="text-gray-400">Intelligent alert system with predictive notifications coming soon!</p>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-white mb-2">Recommendation Feedback</h3>
            <p className="text-gray-400">Feedback system for improving AI recommendations coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}