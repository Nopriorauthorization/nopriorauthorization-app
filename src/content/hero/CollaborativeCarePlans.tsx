"use client";

import React, { useState } from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';

// Care plan types
type CarePlanGoal = {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedProviderId: string;
  progressNotes: ProgressNote[];
  measurements?: {
    metric: string;
    currentValue: number;
    targetValue: number;
    unit: string;
    lastUpdated: string;
  };
};

type ProgressNote = {
  id: string;
  authorId: string;
  authorName: string;
  authorType: 'patient' | 'provider';
  content: string;
  timestamp: string;
  attachments?: string[];
};

type CarePlan = {
  id: string;
  title: string;
  description: string;
  createdDate: string;
  lastModified: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  primaryProviderId: string;
  collaborators: string[];
  goals: CarePlanGoal[];
  tags: string[];
  version: number;
  versionHistory: CarePlanVersion[];
  patientApproved: boolean;
  approvedDate?: string;
  reviewDate: string;
  autoReminders: boolean;
};

type CarePlanVersion = {
  version: number;
  timestamp: string;
  authorId: string;
  authorName: string;
  changes: string[];
  approved: boolean;
};

type Comment = {
  id: string;
  carePlanId: string;
  goalId?: string;
  authorId: string;
  authorName: string;
  authorType: 'patient' | 'provider';
  content: string;
  timestamp: string;
  resolved: boolean;
  replies: Comment[];
};

// Sample providers lookup
const providers = {
  'provider-1': { name: 'Dr. Sarah Chen', specialty: 'Internal Medicine' },
  'provider-2': { name: 'Dr. Michael Torres', specialty: 'Endocrinology' },
  'provider-4': { name: 'Dr. Lisa Rodriguez', specialty: 'Cardiology' },
  'provider-5': { name: 'Care Coordinator Emma', specialty: 'Care Coordination' }
};

// Sample care plans
const carePlans: CarePlan[] = [
  {
    id: 'plan-1',
    title: 'Comprehensive Diabetes & Cardiovascular Health Management',
    description: 'Integrated care plan focusing on diabetes control, cardiovascular risk reduction, and overall metabolic health optimization.',
    createdDate: '2024-05-15',
    lastModified: '2024-06-18',
    status: 'active',
    primaryProviderId: 'provider-1',
    collaborators: ['provider-1', 'provider-2', 'provider-4'],
    patientApproved: true,
    approvedDate: '2024-05-20',
    reviewDate: '2024-09-15',
    autoReminders: true,
    version: 3,
    tags: ['diabetes', 'cardiovascular', 'lifestyle', 'medication'],
    versionHistory: [
      {
        version: 1,
        timestamp: '2024-05-15',
        authorId: 'provider-1',
        authorName: 'Dr. Sarah Chen',
        changes: ['Initial care plan created', 'Added diabetes management goals'],
        approved: false
      },
      {
        version: 2,
        timestamp: '2024-05-25',
        authorId: 'provider-2',
        authorName: 'Dr. Michael Torres',
        changes: ['Added endocrinology recommendations', 'Updated medication targets'],
        approved: true
      },
      {
        version: 3,
        timestamp: '2024-06-18',
        authorId: 'provider-4',
        authorName: 'Dr. Lisa Rodriguez',
        changes: ['Added cardiovascular goals', 'Updated blood pressure targets'],
        approved: false
      }
    ],
    goals: [
      {
        id: 'goal-1',
        title: 'Achieve Target HbA1c',
        description: 'Maintain HbA1c below 7.0% through medication adherence and lifestyle modifications',
        targetDate: '2024-09-01',
        status: 'in-progress',
        priority: 'high',
        assignedProviderId: 'provider-2',
        measurements: {
          metric: 'HbA1c',
          currentValue: 5.8,
          targetValue: 7.0,
          unit: '%',
          lastUpdated: '2024-06-10'
        },
        progressNotes: [
          {
            id: 'note-1',
            authorId: 'provider-2',
            authorName: 'Dr. Michael Torres',
            authorType: 'provider',
            content: 'Excellent progress! HbA1c has improved from 6.4% to 5.8%. Patient showing great medication adherence and lifestyle changes.',
            timestamp: '2024-06-10'
          },
          {
            id: 'note-2',
            authorId: 'patient-1',
            authorName: 'You',
            authorType: 'patient',
            content: 'I\'ve been really consistent with the Mediterranean diet and walking 30 minutes daily. Feeling much more energetic!',
            timestamp: '2024-06-12'
          }
        ]
      },
      {
        id: 'goal-2',
        title: 'Blood Pressure Control',
        description: 'Maintain blood pressure below 130/80 mmHg through lifestyle changes and medication if needed',
        targetDate: '2024-08-01',
        status: 'in-progress',
        priority: 'high',
        assignedProviderId: 'provider-4',
        measurements: {
          metric: 'Blood Pressure',
          currentValue: 118,
          targetValue: 130,
          unit: 'mmHg (systolic)',
          lastUpdated: '2024-06-15'
        },
        progressNotes: [
          {
            id: 'note-3',
            authorId: 'provider-4',
            authorName: 'Dr. Lisa Rodriguez',
            authorType: 'provider',
            content: 'Blood pressure has improved significantly to 118/75. Continue current lifestyle modifications. May not need medication.',
            timestamp: '2024-06-15'
          }
        ]
      },
      {
        id: 'goal-3',
        title: 'Weight Management',
        description: 'Achieve and maintain target weight of 160 lbs through sustainable lifestyle changes',
        targetDate: '2024-07-01',
        status: 'completed',
        priority: 'medium',
        assignedProviderId: 'provider-1',
        measurements: {
          metric: 'Weight',
          currentValue: 159,
          targetValue: 160,
          unit: 'lbs',
          lastUpdated: '2024-06-18'
        },
        progressNotes: [
          {
            id: 'note-4',
            authorId: 'provider-1',
            authorName: 'Dr. Sarah Chen',
            authorType: 'provider',
            content: 'Goal achieved! Patient has successfully reached target weight of 160 lbs and is maintaining it well.',
            timestamp: '2024-06-18'
          }
        ]
      },
      {
        id: 'goal-4',
        title: 'Increase Physical Activity',
        description: 'Build up to 150 minutes of moderate aerobic activity per week',
        targetDate: '2024-08-15',
        status: 'in-progress',
        priority: 'medium',
        assignedProviderId: 'provider-1',
        progressNotes: [
          {
            id: 'note-5',
            authorId: 'patient-1',
            authorName: 'You',
            authorType: 'patient',
            content: 'Currently doing 30 minutes of walking 5 days a week. Planning to add swimming twice a week starting next month.',
            timestamp: '2024-06-16'
          }
        ]
      }
    ]
  }
];

const comments: Comment[] = [
  {
    id: 'comment-1',
    carePlanId: 'plan-1',
    goalId: 'goal-1',
    authorId: 'provider-1',
    authorName: 'Dr. Sarah Chen',
    authorType: 'provider',
    content: 'Outstanding diabetes management results! The collaborative approach between endocrinology and primary care is working very well.',
    timestamp: '2024-06-16',
    resolved: false,
    replies: [
      {
        id: 'reply-1',
        carePlanId: 'plan-1',
        authorId: 'provider-2',
        authorName: 'Dr. Michael Torres',
        authorType: 'provider',
        content: 'Agreed! Patient compliance has been excellent. I recommend continuing current approach.',
        timestamp: '2024-06-17',
        resolved: false,
        replies: []
      }
    ]
  }
];

export default function CollaborativeCarePlans() {
  const [selectedPlan, setSelectedPlan] = useState<CarePlan | null>(carePlans[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'progress' | 'comments' | 'history'>('overview');
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'in-progress': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'not-started': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      case 'on-hold': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'cancelled': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getProgressPercentage = (goal: CarePlanGoal) => {
    if (goal.status === 'completed') return 100;
    if (goal.status === 'not-started') return 0;
    
    if (goal.measurements) {
      const { currentValue, targetValue } = goal.measurements;
      // For metrics like HbA1c where lower is better
      if (goal.measurements.metric === 'HbA1c') {
        return Math.min(100, Math.max(0, (100 - ((currentValue - targetValue) / targetValue) * 100)));
      }
      // For metrics like weight where target is specific
      if (goal.measurements.metric === 'Weight') {
        const diff = Math.abs(currentValue - targetValue);
        return Math.max(0, 100 - (diff / targetValue) * 100);
      }
      // For BP where lower is better but has a target
      if (goal.measurements.metric === 'Blood Pressure') {
        if (currentValue <= targetValue) return 100;
        return Math.max(0, 100 - ((currentValue - targetValue) / targetValue) * 50);
      }
    }
    
    // Default progress estimation based on time
    const now = new Date();
    const target = parseISO(goal.targetDate);
    const daysPassed = differenceInDays(now, parseISO(selectedPlan?.createdDate || ''));
    const totalDays = differenceInDays(target, parseISO(selectedPlan?.createdDate || ''));
    return Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
  };

  const overallProgress = selectedPlan 
    ? Math.round(selectedPlan.goals.reduce((sum, goal) => sum + getProgressPercentage(goal), 0) / selectedPlan.goals.length)
    : 0;

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-semibold mb-2">No Care Plans</h2>
          <p className="text-gray-400">Your collaborative care plans will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Collaborative Care Plans
              </h1>
              <p className="text-gray-400">
                Work with your healthcare team to create and track comprehensive care plans
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${
                selectedPlan.patientApproved 
                  ? 'text-green-400 bg-green-500/20 border-green-500/30' 
                  : 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
              }`}>
                {selectedPlan.patientApproved ? '✓ Approved' : '⏳ Pending Approval'}
              </div>
              
              <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition">
                Export PDF
              </button>
            </div>
          </div>

          {/* Care Plan Header */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">{selectedPlan.title}</h2>
                <p className="text-gray-300 mb-3">{selectedPlan.description}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <span>📅 Created: {format(parseISO(selectedPlan.createdDate), 'MMM dd, yyyy')}</span>
                  <span>🔄 Last Modified: {format(parseISO(selectedPlan.lastModified), 'MMM dd, yyyy')}</span>
                  <span>👨‍⚕️ Primary: {providers[selectedPlan.primaryProviderId as keyof typeof providers]?.name}</span>
                  <span>📋 Version: {selectedPlan.version}</span>
                </div>
              </div>
              
              {/* Progress Ring */}
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="#374151"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="url(#gradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${(overallProgress / 100) * 220} 220`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#ec4899'}} />
                      <stop offset="100%" style={{stopColor: '#8b5cf6'}} />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">{overallProgress}%</span>
                </div>
              </div>
            </div>

            {/* Collaborators */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-gray-400">Care Team:</span>
              <div className="flex gap-2">
                {selectedPlan.collaborators.map((providerId) => {
                  const provider = providers[providerId as keyof typeof providers];
                  return provider ? (
                    <span
                      key={providerId}
                      className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full text-sm"
                    >
                      {provider.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {selectedPlan.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-pink-500/20 border border-pink-500/30 text-pink-300 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'overview', label: 'Overview', icon: '📋' },
              { id: 'goals', label: 'Goals', icon: '🎯' },
              { id: 'progress', label: 'Progress', icon: '📈' },
              { id: 'comments', label: 'Comments', icon: '💬' },
              { id: 'history', label: 'History', icon: '📜' }
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
            {/* Goals Summary */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold text-white mb-4">Goals Overview</h3>
              <div className="space-y-4">
                {selectedPlan.goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">{goal.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(goal.status)}`}>
                            {goal.status.replace('-', ' ').toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                            {goal.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{goal.description}</p>
                        <p className="text-gray-400 text-xs">
                          Assigned to: {providers[goal.assignedProviderId as keyof typeof providers]?.name} • 
                          Due: {format(parseISO(goal.targetDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-pink-400">{Math.round(getProgressPercentage(goal))}%</div>
                        <p className="text-xs text-gray-400">Progress</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercentage(goal)}%` }}
                      ></div>
                    </div>

                    {/* Measurements */}
                    {goal.measurements && (
                      <div className="grid grid-cols-3 gap-4 p-3 bg-black/20 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-white">
                            {goal.measurements.currentValue} {goal.measurements.unit}
                          </div>
                          <p className="text-xs text-gray-400">Current</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-400">
                            {goal.measurements.targetValue} {goal.measurements.unit}
                          </div>
                          <p className="text-xs text-gray-400">Target</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-400">
                            {format(parseISO(goal.measurements.lastUpdated), 'MMM dd')}
                          </div>
                          <p className="text-xs text-gray-400">Last Updated</p>
                        </div>
                      </div>
                    )}

                    {/* Latest Progress Note */}
                    {goal.progressNotes.length > 0 && (
                      <div className="mt-4 p-3 bg-black/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-white">Latest Update:</span>
                          <span className="text-xs text-gray-400">
                            {goal.progressNotes[goal.progressNotes.length - 1].authorName} • 
                            {format(parseISO(goal.progressNotes[goal.progressNotes.length - 1].timestamp), 'MMM dd')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">
                          {goal.progressNotes[goal.progressNotes.length - 1].content}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                <h4 className="font-semibold text-white mb-4">Plan Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Goals:</span>
                    <span className="text-white font-semibold">{selectedPlan.goals.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Completed:</span>
                    <span className="text-green-400 font-semibold">
                      {selectedPlan.goals.filter(g => g.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">In Progress:</span>
                    <span className="text-blue-400 font-semibold">
                      {selectedPlan.goals.filter(g => g.status === 'in-progress').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Overall Progress:</span>
                    <span className="text-pink-400 font-semibold">{overallProgress}%</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                <h4 className="font-semibold text-white mb-4">Recent Activity</h4>
                <div className="space-y-3">
                  {selectedPlan.versionHistory.slice().reverse().slice(0, 3).map((version) => (
                    <div key={version.version} className="p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">v{version.version}</span>
                        <span className="text-xs text-gray-400">
                          {format(parseISO(version.timestamp), 'MMM dd')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-1">{version.authorName}</p>
                      <ul className="text-xs text-gray-300 space-y-1">
                        {version.changes.slice(0, 2).map((change, index) => (
                          <li key={index}>• {change}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Review */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 p-6">
                <h4 className="font-semibold text-white mb-2">Next Review</h4>
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {format(parseISO(selectedPlan.reviewDate), 'MMM dd')}
                </div>
                <p className="text-sm text-gray-400">
                  {differenceInDays(parseISO(selectedPlan.reviewDate), new Date())} days remaining
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-white">Care Plan Goals</h3>
              <button
                onClick={() => setShowNewGoal(true)}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition"
              >
                + Add Goal
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedPlan.goals.map((goal) => (
                <div key={goal.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                  {/* Goal header and content similar to overview but more detailed */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-semibold text-white">{goal.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(goal.status)}`}>
                          {goal.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3">{goal.description}</p>
                    </div>
                  </div>

                  {/* Progress visualization and details */}
                  <div className="space-y-4">
                    {/* Progress bar and percentage */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Progress</span>
                        <span className="text-sm font-semibold text-pink-400">{Math.round(getProgressPercentage(goal))}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${getProgressPercentage(goal)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Goal details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Assigned to:</span>
                        <p className="text-white">{providers[goal.assignedProviderId as keyof typeof providers]?.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Target Date:</span>
                        <p className="text-white">{format(parseISO(goal.targetDate), 'MMM dd, yyyy')}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Priority:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                          {goal.priority.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Updates:</span>
                        <p className="text-white">{goal.progressNotes.length} notes</p>
                      </div>
                    </div>

                    {/* Measurements if available */}
                    {goal.measurements && (
                      <div className="bg-black/20 rounded-lg p-4">
                        <h5 className="text-sm font-medium text-white mb-3">Measurements</h5>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-white">
                              {goal.measurements.currentValue}
                            </div>
                            <p className="text-xs text-gray-400">Current {goal.measurements.unit}</p>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-400">
                              {goal.measurements.targetValue}
                            </div>
                            <p className="text-xs text-gray-400">Target {goal.measurements.unit}</p>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-blue-400">
                              {format(parseISO(goal.measurements.lastUpdated), 'MMM dd')}
                            </div>
                            <p className="text-xs text-gray-400">Last Updated</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition">
                        Add Progress Note
                      </button>
                      <button className="px-3 py-2 bg-gray-500/20 border border-gray-500/30 text-gray-400 rounded-lg text-sm hover:bg-gray-500/30 transition">
                        Edit Goal
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab === 'progress' && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-2xl font-semibold text-white mb-2">Detailed Progress Tracking</h3>
            <p className="text-gray-400">Advanced progress visualization and trend analysis coming soon!</p>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-2xl font-semibold text-white mb-2">Collaborative Comments</h3>
            <p className="text-gray-400">Real-time commenting and discussion features coming soon!</p>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">Version History</h3>
            {selectedPlan.versionHistory.slice().reverse().map((version) => (
              <div key={version.version} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">Version {version.version}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>👤 {version.authorName}</span>
                      <span>📅 {format(parseISO(version.timestamp), 'MMM dd, yyyy at h:mm a')}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        version.approved ? 'text-green-400 bg-green-500/20' : 'text-yellow-400 bg-yellow-500/20'
                      }`}>
                        {version.approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-white mb-2">Changes Made:</h5>
                  <ul className="space-y-1">
                    {version.changes.map((change, index) => (
                      <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-pink-400 mt-1">•</span>
                        {change}
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