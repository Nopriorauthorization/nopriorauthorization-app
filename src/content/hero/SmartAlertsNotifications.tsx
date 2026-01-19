"use client";

import React, { useState } from 'react';
import { format, parseISO, addHours, addDays, addMinutes, differenceInMinutes, isAfter, isBefore } from 'date-fns';

// Smart Alert Types
type SmartAlert = {
  id: string;
  type: 'medication' | 'appointment' | 'health-milestone' | 'risk-warning' | 'pattern-detected' | 'goal-progress' | 'lab-reminder' | 'preventive-care';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical' | 'emergency';
  urgency: 'routine' | 'timely' | 'immediate' | 'emergency';
  category: 'reminder' | 'warning' | 'achievement' | 'insight' | 'action-required';
  aiOptimized: boolean;
  personalizedTiming: boolean;
  smartDelivery: boolean;
  contextAware: boolean;
  status: 'pending' | 'delivered' | 'acknowledged' | 'dismissed' | 'snoozed' | 'expired';
  deliveryMethod: 'push' | 'email' | 'sms' | 'in-app' | 'all';
  scheduledFor: string;
  createdAt: string;
  deliveredAt?: string;
  acknowledgedAt?: string;
  expiresAt?: string;
  snoozeUntil?: string;
  repeatConfig?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    interval: number;
    endDate?: string;
    maxRepeats?: number;
    currentCount: number;
  };
  triggers: {
    timeBasedTrigger?: string;
    dataBasedTrigger?: {
      metric: string;
      condition: 'above' | 'below' | 'equals' | 'change';
      threshold: number;
      timeWindow: string;
    };
    patternBasedTrigger?: {
      patternId: string;
      confidence: number;
      detected: boolean;
    };
    goalBasedTrigger?: {
      goalId: string;
      progressThreshold: number;
      achieved: boolean;
    };
  };
  actions: {
    primary: {
      label: string;
      action: 'dismiss' | 'snooze' | 'complete' | 'view-details' | 'contact-provider' | 'update-data';
      data?: any;
    };
    secondary?: {
      label: string;
      action: string;
      data?: any;
    };
  };
  metadata: {
    relatedGoalId?: string;
    relatedPatternId?: string;
    relatedAppointmentId?: string;
    relatedMedicationId?: string;
    aiConfidence?: number;
    userPreferences: {
      preferredTime?: string;
      preferredMethod: string;
      frequency: 'minimal' | 'normal' | 'frequent';
    };
  };
};

type NotificationRule = {
  id: string;
  name: string;
  type: SmartAlert['type'];
  enabled: boolean;
  aiOptimization: boolean;
  smartTiming: boolean;
  conditions: {
    timeConditions?: {
      preferredTimes: string[];
      avoidTimes: string[];
      daysOfWeek: number[];
      timeZone: string;
    };
    healthConditions?: {
      metrics: string[];
      thresholds: { metric: string; min?: number; max?: number; }[];
    };
    behavioralConditions?: {
      patterns: string[];
      adherenceRate: number;
      lastEngagement: string;
    };
  };
  deliverySettings: {
    methods: string[];
    priority: SmartAlert['priority'];
    maxFrequency: number; // per day
    cooldownPeriod: number; // minutes between similar alerts
  };
  personalization: {
    contentPersonalization: boolean;
    timingPersonalization: boolean;
    methodPersonalization: boolean;
    adaptToFeedback: boolean;
  };
  effectiveness: {
    deliveryRate: number;
    acknowledgeRate: number;
    actionRate: number;
    userSatisfaction: number; // 1-5
  };
};

type AlertInsight = {
  id: string;
  title: string;
  description: string;
  metric: string;
  trend: 'improving' | 'stable' | 'concerning' | 'critical';
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  recommendation: string;
  generatedAt: string;
};

// Sample data
const activeAlerts: SmartAlert[] = [
  {
    id: 'alert-1',
    type: 'medication',
    title: 'Medication Reminder - Optimized Timing',
    message: 'Time for your diabetes medication! Based on your breakfast schedule, take it now for optimal absorption (15 minutes before eating).',
    priority: 'medium',
    urgency: 'timely',
    category: 'reminder',
    aiOptimized: true,
    personalizedTiming: true,
    smartDelivery: true,
    contextAware: true,
    status: 'pending',
    deliveryMethod: 'push',
    scheduledFor: '2026-01-19T07:45:00Z',
    createdAt: '2026-01-18T20:00:00Z',
    expiresAt: '2026-01-19T08:30:00Z',
    repeatConfig: {
      enabled: true,
      frequency: 'daily',
      interval: 1,
      currentCount: 0,
      maxRepeats: 365
    },
    triggers: {
      timeBasedTrigger: '2026-01-19T07:45:00Z',
      patternBasedTrigger: {
        patternId: 'breakfast-timing-pattern',
        confidence: 87,
        detected: true
      }
    },
    actions: {
      primary: {
        label: 'Taken',
        action: 'complete'
      },
      secondary: {
        label: 'Snooze 15 min',
        action: 'snooze',
        data: { duration: 15 }
      }
    },
    metadata: {
      relatedMedicationId: 'med-1',
      aiConfidence: 87,
      userPreferences: {
        preferredTime: '7:45 AM',
        preferredMethod: 'push',
        frequency: 'normal'
      }
    }
  },
  {
    id: 'alert-2',
    type: 'health-milestone',
    title: 'Congratulations! Sleep Goal Achievement',
    message: '🎉 Amazing progress! You\'ve maintained 7+ hours of sleep for 7 consecutive nights. Your morning glucose has improved by an average of 16 mg/dL!',
    priority: 'low',
    urgency: 'routine',
    category: 'achievement',
    aiOptimized: false,
    personalizedTiming: false,
    smartDelivery: false,
    contextAware: true,
    status: 'delivered',
    deliveryMethod: 'in-app',
    scheduledFor: '2026-01-18T08:00:00Z',
    createdAt: '2026-01-18T07:30:00Z',
    deliveredAt: '2026-01-18T08:00:00Z',
    triggers: {
      goalBasedTrigger: {
        goalId: 'sleep-goal-1',
        progressThreshold: 100,
        achieved: true
      }
    },
    actions: {
      primary: {
        label: 'View Progress',
        action: 'view-details'
      },
      secondary: {
        label: 'Share Achievement',
        action: 'complete'
      }
    },
    metadata: {
      relatedGoalId: 'sleep-goal-1',
      userPreferences: {
        preferredMethod: 'in-app',
        frequency: 'normal'
      }
    }
  },
  {
    id: 'alert-3',
    type: 'risk-warning',
    title: 'Blood Pressure Anomaly Detected',
    message: 'Your last BP reading (158/92) is significantly higher than your typical range. Consider re-measuring and review recent stress/diet factors.',
    priority: 'high',
    urgency: 'timely',
    category: 'warning',
    aiOptimized: true,
    personalizedTiming: false,
    smartDelivery: true,
    contextAware: true,
    status: 'delivered',
    deliveryMethod: 'push',
    scheduledFor: '2026-01-18T10:15:00Z',
    createdAt: '2026-01-18T10:10:00Z',
    deliveredAt: '2026-01-18T10:15:00Z',
    expiresAt: '2026-01-20T10:15:00Z',
    triggers: {
      dataBasedTrigger: {
        metric: 'blood_pressure_systolic',
        condition: 'above',
        threshold: 140,
        timeWindow: '1 hour'
      }
    },
    actions: {
      primary: {
        label: 'Re-measure BP',
        action: 'update-data'
      },
      secondary: {
        label: 'Contact Provider',
        action: 'contact-provider'
      }
    },
    metadata: {
      aiConfidence: 82,
      userPreferences: {
        preferredMethod: 'push',
        frequency: 'normal'
      }
    }
  },
  {
    id: 'alert-4',
    type: 'pattern-detected',
    title: 'New Health Pattern Discovered',
    message: 'AI detected a strong correlation between your morning walk timing and blood pressure improvements. Walking before 9 AM shows 23% better results.',
    priority: 'medium',
    urgency: 'routine',
    category: 'insight',
    aiOptimized: true,
    personalizedTiming: true,
    smartDelivery: true,
    contextAware: true,
    status: 'pending',
    deliveryMethod: 'in-app',
    scheduledFor: '2026-01-18T18:00:00Z',
    createdAt: '2026-01-18T12:00:00Z',
    triggers: {
      patternBasedTrigger: {
        patternId: 'exercise-timing-pattern',
        confidence: 91,
        detected: true
      }
    },
    actions: {
      primary: {
        label: 'View Pattern Details',
        action: 'view-details'
      },
      secondary: {
        label: 'Create Reminder',
        action: 'complete'
      }
    },
    metadata: {
      relatedPatternId: 'exercise-timing-pattern',
      aiConfidence: 91,
      userPreferences: {
        preferredTime: '6:00 PM',
        preferredMethod: 'in-app',
        frequency: 'normal'
      }
    }
  },
  {
    id: 'alert-5',
    type: 'appointment',
    title: 'Appointment Prep Reminder',
    message: 'Your cardiology appointment is tomorrow at 8:30 AM. Remember to bring: Recent EKG, Blood pressure log, and list of current medications.',
    priority: 'high',
    urgency: 'timely',
    category: 'reminder',
    aiOptimized: true,
    personalizedTiming: true,
    smartDelivery: true,
    contextAware: true,
    status: 'pending',
    deliveryMethod: 'push',
    scheduledFor: '2026-01-18T19:00:00Z',
    createdAt: '2026-01-17T09:00:00Z',
    triggers: {
      timeBasedTrigger: '2026-01-18T19:00:00Z'
    },
    actions: {
      primary: {
        label: 'Mark Prepared',
        action: 'complete'
      },
      secondary: {
        label: 'View Checklist',
        action: 'view-details'
      }
    },
    metadata: {
      relatedAppointmentId: 'appt-3',
      userPreferences: {
        preferredTime: '7:00 PM',
        preferredMethod: 'push',
        frequency: 'normal'
      }
    }
  }
];

const notificationRules: NotificationRule[] = [
  {
    id: 'rule-1',
    name: 'Medication Reminders',
    type: 'medication',
    enabled: true,
    aiOptimization: true,
    smartTiming: true,
    conditions: {
      timeConditions: {
        preferredTimes: ['07:45', '19:30'],
        avoidTimes: ['22:00-06:00'],
        daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
        timeZone: 'America/Los_Angeles'
      }
    },
    deliverySettings: {
      methods: ['push', 'in-app'],
      priority: 'medium',
      maxFrequency: 2,
      cooldownPeriod: 60
    },
    personalization: {
      contentPersonalization: true,
      timingPersonalization: true,
      methodPersonalization: true,
      adaptToFeedback: true
    },
    effectiveness: {
      deliveryRate: 98,
      acknowledgeRate: 94,
      actionRate: 91,
      userSatisfaction: 4.6
    }
  },
  {
    id: 'rule-2',
    name: 'Health Risk Warnings',
    type: 'risk-warning',
    enabled: true,
    aiOptimization: true,
    smartTiming: false, // Immediate delivery for safety
    conditions: {
      healthConditions: {
        metrics: ['blood_pressure', 'blood_glucose', 'heart_rate'],
        thresholds: [
          { metric: 'blood_pressure_systolic', max: 140 },
          { metric: 'blood_glucose', max: 200, min: 70 }
        ]
      }
    },
    deliverySettings: {
      methods: ['push', 'sms', 'email'],
      priority: 'high',
      maxFrequency: 5,
      cooldownPeriod: 15
    },
    personalization: {
      contentPersonalization: true,
      timingPersonalization: false,
      methodPersonalization: true,
      adaptToFeedback: true
    },
    effectiveness: {
      deliveryRate: 100,
      acknowledgeRate: 87,
      actionRate: 73,
      userSatisfaction: 4.2
    }
  }
];

const alertInsights: AlertInsight[] = [
  {
    id: 'insight-1',
    title: 'Notification Timing Optimization',
    description: 'Your medication adherence increases by 23% when reminders are sent 15-20 minutes before your typical breakfast time.',
    metric: 'Medication Adherence',
    trend: 'improving',
    impact: 'high',
    confidence: 89,
    recommendation: 'Continue optimized timing for medication reminders',
    generatedAt: '2026-01-18'
  },
  {
    id: 'insight-2',
    title: 'Alert Fatigue Prevention',
    description: 'Your engagement with health alerts drops significantly after receiving more than 3 notifications per day.',
    metric: 'Alert Engagement Rate',
    trend: 'stable',
    impact: 'medium',
    confidence: 76,
    recommendation: 'Limit non-critical alerts to 3 per day maximum',
    generatedAt: '2026-01-17'
  },
  {
    id: 'insight-3',
    title: 'Achievement Celebration Impact',
    description: 'Milestone celebration alerts correlate with 34% better goal maintenance over the following week.',
    metric: 'Goal Maintenance Rate',
    trend: 'improving',
    impact: 'high',
    confidence: 82,
    recommendation: 'Increase frequency of achievement recognition alerts',
    generatedAt: '2026-01-16'
  }
];

export default function SmartAlertsNotifications() {
  const [activeTab, setActiveTab] = useState<'alerts' | 'rules' | 'insights' | 'settings'>('alerts');
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [showSnoozeOptions, setShowSnoozeOptions] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'text-red-500 bg-red-500/20 border-red-500/30 animate-pulse';
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'reminder': return 'text-blue-400 bg-blue-500/20';
      case 'warning': return 'text-red-400 bg-red-500/20';
      case 'achievement': return 'text-green-400 bg-green-500/20';
      case 'insight': return 'text-purple-400 bg-purple-500/20';
      case 'action-required': return 'text-orange-400 bg-orange-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return '💊';
      case 'appointment': return '📅';
      case 'health-milestone': return '🎉';
      case 'risk-warning': return '⚠️';
      case 'pattern-detected': return '🧩';
      case 'goal-progress': return '📈';
      case 'lab-reminder': return '🧪';
      case 'preventive-care': return '🛡️';
      default: return '🔔';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'delivered': return 'text-blue-400 bg-blue-500/20';
      case 'acknowledged': return 'text-green-400 bg-green-500/20';
      case 'dismissed': return 'text-gray-400 bg-gray-500/20';
      case 'snoozed': return 'text-orange-400 bg-orange-500/20';
      case 'expired': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'stable': return '➡️';
      case 'concerning': return '📉';
      case 'critical': return '🚨';
      default: return '📊';
    }
  };

  const filteredAlerts = activeAlerts.filter(alert => {
    const statusMatch = filterStatus === 'all' || 
      (filterStatus === 'active' && ['pending', 'delivered'].includes(alert.status)) ||
      alert.status === filterStatus;
    const typeMatch = filterType === 'all' || alert.type === filterType;
    return statusMatch && typeMatch;
  });

  const handleAlertAction = (alertId: string, action: string, data?: any) => {
    console.log(`Alert ${alertId}: ${action}`, data);
    // In a real app, this would update the alert status
  };

  const snoozeOptions = [
    { label: '5 minutes', value: 5 },
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
    { label: 'Until tomorrow', value: 1440 }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Smart Alerts & Notifications
              </h1>
              <p className="text-gray-400">
                AI-powered intelligent notification system with predictive alerts and personalized timing
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">AI Optimizing</span>
              </div>
              <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition">
                Notification Settings
              </button>
            </div>
          </div>

          {/* Alert Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Active Alerts</p>
                  <p className="text-2xl font-bold text-white">
                    {activeAlerts.filter(a => ['pending', 'delivered'].includes(a.status)).length}
                  </p>
                </div>
                <div className="text-2xl">🔔</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Response Rate</p>
                  <p className="text-2xl font-bold text-white">94%</p>
                </div>
                <div className="text-2xl">✅</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">AI Optimized</p>
                  <p className="text-2xl font-bold text-white">
                    {activeAlerts.filter(a => a.aiOptimized).length}
                  </p>
                </div>
                <div className="text-2xl">🤖</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl border border-yellow-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-medium">Avg Satisfaction</p>
                  <p className="text-2xl font-bold text-white">4.6/5</p>
                </div>
                <div className="text-2xl">⭐</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'alerts', label: 'Active Alerts', icon: '🔔' },
              { id: 'rules', label: 'Alert Rules', icon: '⚙️' },
              { id: 'insights', label: 'AI Insights', icon: '💡' },
              { id: 'settings', label: 'Settings', icon: '🔧' }
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
        {activeTab === 'alerts' && (
          <div>
            {/* Filters */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Status:</label>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                >
                  <option value="active">Active</option>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="delivered">Delivered</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Type:</label>
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="medication">Medication</option>
                  <option value="appointment">Appointment</option>
                  <option value="health-milestone">Milestones</option>
                  <option value="risk-warning">Risk Warnings</option>
                  <option value="pattern-detected">Pattern Insights</option>
                </select>
              </div>
              
              <div className="ml-auto text-sm text-gray-400">
                {filteredAlerts.length} alerts
              </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6 relative">
                  {/* Alert Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{getTypeIcon(alert.type)}</div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(alert.priority)}`}>
                            {alert.priority.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(alert.category)}`}>
                            {alert.category.replace('-', ' ').toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                            {alert.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-gray-300 mb-2">{alert.message}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>📅 {format(parseISO(alert.scheduledFor), 'MMM dd, h:mm a')}</span>
                          {alert.deliveredAt && (
                            <span>✓ Delivered: {format(parseISO(alert.deliveredAt), 'h:mm a')}</span>
                          )}
                          {alert.aiOptimized && (
                            <span className="flex items-center gap-1">
                              🤖 AI Optimized
                            </span>
                          )}
                          {alert.personalizedTiming && (
                            <span className="flex items-center gap-1">
                              🎯 Smart Timing
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {alert.status === 'pending' && (
                      <div className="text-right">
                        <div className="text-sm text-yellow-400 font-medium">
                          {differenceInMinutes(parseISO(alert.scheduledFor), new Date()) > 0 
                            ? `In ${differenceInMinutes(parseISO(alert.scheduledFor), new Date())} min`
                            : 'Due now'
                          }
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Smart Features Indicators */}
                  {(alert.aiOptimized || alert.personalizedTiming || alert.smartDelivery) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {alert.aiOptimized && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                          🧠 AI Optimized Content
                        </span>
                      )}
                      {alert.personalizedTiming && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                          ⏰ Personalized Timing
                        </span>
                      )}
                      {alert.smartDelivery && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                          📱 Smart Delivery
                        </span>
                      )}
                      {alert.contextAware && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs">
                          🎯 Context Aware
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => handleAlertAction(alert.id, alert.actions.primary.action)}
                      className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition"
                    >
                      {alert.actions.primary.label}
                    </button>
                    
                    {alert.actions.secondary && (
                      <button 
                        onClick={() => handleAlertAction(alert.id, alert.actions.secondary!.action)}
                        className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
                      >
                        {alert.actions.secondary.label}
                      </button>
                    )}
                    
                    {alert.status === 'pending' && (
                      <div className="relative">
                        <button 
                          onClick={() => setShowSnoozeOptions(showSnoozeOptions === alert.id ? null : alert.id)}
                          className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition"
                        >
                          Snooze ⏰
                        </button>
                        
                        {showSnoozeOptions === alert.id && (
                          <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-10 min-w-48">
                            <div className="p-2">
                              <p className="text-xs text-gray-400 mb-2">Snooze for:</p>
                              {snoozeOptions.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => {
                                    handleAlertAction(alert.id, 'snooze', { duration: option.value });
                                    setShowSnoozeOptions(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded"
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <button 
                      onClick={() => handleAlertAction(alert.id, 'dismiss')}
                      className="px-4 py-2 bg-gray-500/20 border border-gray-500/30 text-gray-400 rounded-lg hover:bg-gray-500/30 transition"
                    >
                      Dismiss
                    </button>
                  </div>

                  {/* Repeat Schedule */}
                  {alert.repeatConfig?.enabled && (
                    <div className="mt-4 p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                          🔄 Repeats {alert.repeatConfig.frequency}
                          {alert.repeatConfig.interval > 1 && ` (every ${alert.repeatConfig.interval})`}
                        </span>
                        <span className="text-gray-400">
                          {alert.repeatConfig.currentCount}
                          {alert.repeatConfig.maxRepeats && `/${alert.repeatConfig.maxRepeats}`} sent
                        </span>
                      </div>
                    </div>
                  )}

                  {/* AI Confidence */}
                  {alert.metadata.aiConfidence && (
                    <div className="absolute top-4 right-4">
                      <div className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                        AI: {alert.metadata.aiConfidence}%
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-white">Notification Rules</h3>
              <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition">
                + Create Rule
              </button>
            </div>

            <div className="space-y-4">
              {notificationRules.map((rule) => (
                <div key={rule.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getTypeIcon(rule.type)}</span>
                        <h4 className="text-xl font-semibold text-white">{rule.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rule.enabled ? 'text-green-400 bg-green-500/20' : 'text-gray-400 bg-gray-500/20'
                        }`}>
                          {rule.enabled ? 'ENABLED' : 'DISABLED'}
                        </span>
                        {rule.aiOptimization && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium text-purple-400 bg-purple-500/20">
                            AI OPTIMIZED
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-pink-400">{rule.effectiveness.userSatisfaction}</div>
                      <p className="text-xs text-gray-400">Satisfaction</p>
                    </div>
                  </div>

                  {/* Effectiveness Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-black/20 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{rule.effectiveness.deliveryRate}%</div>
                      <p className="text-xs text-gray-400">Delivery Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{rule.effectiveness.acknowledgeRate}%</div>
                      <p className="text-xs text-gray-400">Acknowledge Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{rule.effectiveness.actionRate}%</div>
                      <p className="text-xs text-gray-400">Action Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400">{rule.deliverySettings.maxFrequency}/day</div>
                      <p className="text-xs text-gray-400">Max Frequency</p>
                    </div>
                  </div>

                  {/* Rule Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="text-sm font-medium text-white mb-2">Delivery Methods:</h5>
                      <div className="flex flex-wrap gap-2">
                        {rule.deliverySettings.methods.map((method, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-white mb-2">Personalization:</h5>
                      <div className="flex flex-wrap gap-2">
                        {rule.personalization.contentPersonalization && (
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                            Content
                          </span>
                        )}
                        {rule.personalization.timingPersonalization && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                            Timing
                          </span>
                        )}
                        {rule.personalization.methodPersonalization && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                            Method
                          </span>
                        )}
                        {rule.personalization.adaptToFeedback && (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs">
                            Adaptive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition">
                      Edit Rule
                    </button>
                    <button className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition">
                      Test Rule
                    </button>
                    <button className={`px-4 py-2 rounded-lg border transition ${
                      rule.enabled 
                        ? 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30' 
                        : 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30'
                    }`}>
                      {rule.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">AI Notification Insights</h3>
            
            <div className="space-y-4">
              {alertInsights.map((insight) => (
                <div key={insight.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getTrendIcon(insight.trend)}</span>
                        <h4 className="text-xl font-semibold text-white">{insight.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          insight.impact === 'high' ? 'text-red-400 bg-red-500/20' :
                          insight.impact === 'medium' ? 'text-yellow-400 bg-yellow-500/20' :
                          'text-green-400 bg-green-500/20'
                        }`}>
                          {insight.impact.toUpperCase()} IMPACT
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          insight.trend === 'improving' ? 'text-green-400 bg-green-500/20' :
                          insight.trend === 'concerning' ? 'text-red-400 bg-red-500/20' :
                          insight.trend === 'critical' ? 'text-red-500 bg-red-500/30 animate-pulse' :
                          'text-blue-400 bg-blue-500/20'
                        }`}>
                          {insight.trend.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">{insight.description}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-400">{insight.confidence}%</div>
                      <p className="text-xs text-gray-400">AI Confidence</p>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h5 className="text-sm font-medium text-green-400 mb-1">🎯 Recommendation:</h5>
                    <p className="text-sm text-gray-300">{insight.recommendation}</p>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Metric: {insight.metric}</span>
                    <span>Generated: {format(parseISO(insight.generatedAt), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-6xl mb-4">🔧</div>
            <h3 className="text-2xl font-semibold text-white mb-2">Notification Settings</h3>
            <p className="text-gray-400">Advanced notification preferences and configuration settings coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}