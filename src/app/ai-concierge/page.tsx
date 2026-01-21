"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { format, addDays, differenceInDays } from 'date-fns';

// AI Healthcare Concierge - The Ultimate "Aha Moment"
interface HealthProfile {
  id: string;
  userId: string;
  riskScore: number; // 0-100
  predictedConditions: PredictedCondition[];
  preventiveActions: PreventiveAction[];
  careCoordination: CareCoordination[];
  financialOptimization: FinancialOptimization;
  qualityOfLife: QualityOfLifeMetrics;
  lastUpdated: Date;
}

interface PredictedCondition {
  condition: string;
  probability: number; // 0-100
  timeline: 'immediate' | '3months' | '6months' | '1year' | '5years';
  contributingFactors: string[];
  preventionStrategy: string[];
  confidence: number;
}

interface PreventiveAction {
  id: string;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost: number;
  estimatedBenefit: number; // QALY (Quality Adjusted Life Years)
  timeline: Date;
  status: 'pending' | 'scheduled' | 'completed';
  provider?: string;
}

interface CareCoordination {
  id: string;
  type: 'appointment' | 'test' | 'treatment' | 'consultation';
  title: string;
  date: Date;
  provider: string;
  purpose: string;
  preparationStatus: 'not_started' | 'in_progress' | 'ready';
  packetId?: string;
}

interface FinancialOptimization {
  currentSpend: number;
  projectedAnnualSpend: number;
  optimizationOpportunities: OptimizationOpportunity[];
  insuranceUtilization: number; // percentage
  outOfPocketSavings: number;
}

interface OptimizationOpportunity {
  type: 'provider_choice' | 'timing' | 'bundling' | 'prevention';
  description: string;
  potentialSavings: number;
  implementationDifficulty: 'easy' | 'medium' | 'hard';
}

interface QualityOfLifeMetrics {
  currentScore: number; // 0-100
  projectedScore: number; // with interventions
  lifeExpectancy: number;
  healthyYears: number;
  riskFactors: string[];
  protectiveFactors: string[];
}

export default function AIHealthcareConcierge() {
  const [healthProfile, setHealthProfile] = useState<HealthProfile | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'predictions' | 'prevention' | 'coordination' | 'finance'>('overview');
  const [loading, setLoading] = useState(true);

  // Generate comprehensive health profile using all available data
  const generateHealthProfile = useCallback(async () => {
    setLoading(true);
    try {
      // In a real implementation, this would analyze:
      // - Genetic data from Family Tree
      // - Cycle data from Period Tracker
      // - Treatment history
      // - Lab results
      // - Insurance data
      // - Provider interactions

      const mockProfile: HealthProfile = {
        id: crypto.randomUUID(),
        userId: 'user123',
        riskScore: 23, // Low risk overall
        predictedConditions: [
          {
            condition: 'Vitamin D Deficiency',
            probability: 75,
            timeline: '3months',
            contributingFactors: ['Limited sun exposure', 'Dietary intake', 'Seasonal changes'],
            preventionStrategy: ['Daily supplementation', 'UV lamp therapy', 'Dietary changes'],
            confidence: 85
          },
          {
            condition: 'PCOS-related fertility concerns',
            probability: 45,
            timeline: '1year',
            contributingFactors: ['Genetic predisposition', 'Irregular cycles', 'Hormonal patterns'],
            preventionStrategy: ['Regular monitoring', 'Lifestyle optimization', 'Early intervention'],
            confidence: 78
          }
        ],
        preventiveActions: [
          {
            id: 'vitamin-d-test',
            title: 'Vitamin D Blood Test',
            description: 'Comprehensive vitamin D panel to establish baseline',
            urgency: 'medium',
            estimatedCost: 75,
            estimatedBenefit: 2.5, // QALY impact
            timeline: addDays(new Date(), 14),
            status: 'pending'
          },
          {
            id: 'hormone-panel',
            title: 'Comprehensive Hormone Panel',
            description: 'Thyroid, reproductive hormones, and metabolic markers',
            urgency: 'high',
            estimatedCost: 350,
            estimatedBenefit: 5.2,
            timeline: addDays(new Date(), 7),
            status: 'scheduled',
            provider: 'Dr. Sarah Johnson - Endocrinology'
          }
        ],
        careCoordination: [
          {
            id: 'followup-botox',
            type: 'appointment',
            title: 'Botox Treatment Follow-up',
            date: addDays(new Date(), 30),
            provider: 'Dr. Emily Chen - Aesthetics',
            purpose: 'Evaluate treatment results and plan next session',
            preparationStatus: 'ready',
            packetId: 'packet-123'
          }
        ],
        financialOptimization: {
          currentSpend: 2840,
          projectedAnnualSpend: 15200,
          optimizationOpportunities: [
            {
              type: 'prevention',
              description: 'Vitamin D supplementation prevents bone density issues',
              potentialSavings: 2500,
              implementationDifficulty: 'easy'
            },
            {
              type: 'provider_choice',
              description: 'Switch to in-network endocrinologist',
              potentialSavings: 1200,
              implementationDifficulty: 'medium'
            }
          ],
          insuranceUtilization: 68,
          outOfPocketSavings: 1850
        },
        qualityOfLife: {
          currentScore: 82,
          projectedScore: 91,
          lifeExpectancy: 84.5,
          healthyYears: 72.3,
          riskFactors: ['Vitamin D deficiency', 'Hormonal imbalance'],
          protectiveFactors: ['Regular exercise', 'Genetic advantages', 'Preventive care']
        },
        lastUpdated: new Date()
      };

      setHealthProfile(mockProfile);
    } catch (error) {
      console.error('Failed to generate health profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    generateHealthProfile();
  }, [generateHealthProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-400">AI analyzing your complete health profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-pink-400">AI Healthcare Concierge</h1>
            <p className="text-sm text-gray-400">Your personal health optimization system</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Risk Score</div>
              <div className={`text-lg font-bold ${
                healthProfile!.riskScore < 30 ? 'text-green-400' :
                healthProfile!.riskScore < 60 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {healthProfile!.riskScore}/100
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">QoL Score</div>
              <div className="text-lg font-bold text-blue-400">
                {healthProfile!.qualityOfLife.currentScore}/100
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-gray-800 px-6 py-3">
        <div className="flex space-x-6">
          {[
            { id: 'overview', label: 'Overview', icon: '🏠' },
            { id: 'predictions', label: 'Predictions', icon: '🔮' },
            { id: 'prevention', label: 'Prevention', icon: '🛡️' },
            { id: 'coordination', label: 'Care Coordination', icon: '🤝' },
            { id: 'finance', label: 'Financial Optimization', icon: '💰' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                activeView === tab.id
                  ? 'bg-pink-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activeView === 'overview' && <ConciergeOverview profile={healthProfile!} />}
        {activeView === 'predictions' && <PredictionsView predictions={healthProfile!.predictedConditions} />}
        {activeView === 'prevention' && <PreventionView actions={healthProfile!.preventiveActions} />}
        {activeView === 'coordination' && <CoordinationView coordination={healthProfile!.careCoordination} />}
        {activeView === 'finance' && <FinanceView finance={healthProfile!.financialOptimization} />}
      </main>
    </div>
  );
}

// Overview Dashboard
function ConciergeOverview({ profile }: { profile: HealthProfile }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Health Risk</h3>
          <div className="text-2xl font-bold text-green-400">{profile.riskScore}/100</div>
          <p className="text-xs text-gray-500 mt-1">Lower is better</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Quality of Life</h3>
          <div className="text-2xl font-bold text-blue-400">{profile.qualityOfLife.currentScore}/100</div>
          <p className="text-xs text-gray-500 mt-1">Projected: {profile.qualityOfLife.projectedScore}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Life Expectancy</h3>
          <div className="text-2xl font-bold text-purple-400">{profile.qualityOfLife.lifeExpectancy} years</div>
          <p className="text-xs text-gray-500 mt-1">{profile.qualityOfLife.healthyYears} healthy years</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Annual Savings</h3>
          <div className="text-2xl font-bold text-green-400">${profile.financialOptimization.outOfPocketSavings.toLocaleString()}</div>
          <p className="text-xs text-gray-500 mt-1">Optimization potential</p>
        </div>
      </div>

      {/* Priority Actions */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-pink-400">🚨 Priority Actions Required</h2>
        <div className="space-y-3">
          {profile.preventiveActions
            .filter(action => action.urgency === 'high' || action.urgency === 'critical')
            .map((action) => (
            <div key={action.id} className="flex items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-500/30">
              <div>
                <h3 className="font-medium text-red-300">{action.title}</h3>
                <p className="text-sm text-gray-400">{action.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Due: {format(action.timeline, 'MMM d, yyyy')} • Est. cost: ${action.estimatedCost}
                </p>
              </div>
              <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium">
                Schedule Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Care */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">📅 Upcoming Care Coordination</h2>
        <div className="space-y-3">
          {profile.careCoordination.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.provider}</p>
                <p className="text-xs text-gray-500">{format(item.date, 'MMM d, yyyy')}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  item.preparationStatus === 'ready' ? 'bg-green-900 text-green-300' :
                  item.preparationStatus === 'in_progress' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-gray-900 text-gray-300'
                }`}>
                  {item.preparationStatus.replace('_', ' ').toUpperCase()}
                </span>
                <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                  View Packet
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Predictions View
function PredictionsView({ predictions }: { predictions: PredictedCondition[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-purple-400">🔮 AI Health Predictions</h2>
        <p className="text-gray-400 mb-6">
          Based on your genetic profile, health history, and current biomarkers
        </p>

        <div className="space-y-4">
          {predictions.map((prediction, idx) => (
            <div key={idx} className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{prediction.condition}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`px-2 py-1 rounded text-xs ${
                      prediction.probability > 70 ? 'bg-red-900 text-red-300' :
                      prediction.probability > 40 ? 'bg-yellow-900 text-yellow-300' :
                      'bg-green-900 text-green-300'
                    }`}>
                      {prediction.probability}% probability
                    </span>
                    <span className="text-sm text-gray-400">
                      Timeline: {prediction.timeline.replace(/(\d+)/, '$1 ').trim()}
                    </span>
                    <span className="text-sm text-gray-400">
                      Confidence: {prediction.confidence}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-medium text-red-400 mb-2">Contributing Factors</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {prediction.contributingFactors.map((factor, i) => (
                      <li key={i} className="flex items-center">
                        <span className="text-red-500 mr-2">•</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-green-400 mb-2">Prevention Strategy</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {prediction.preventionStrategy.map((strategy, i) => (
                      <li key={i} className="flex items-center">
                        <span className="text-green-500 mr-2">•</span>
                        {strategy}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Prevention View
function PreventionView({ actions }: { actions: PreventiveAction[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-green-400">🛡️ Preventive Action Plan</h2>
        <p className="text-gray-400 mb-6">
          Personalized interventions to optimize your health and prevent future issues
        </p>

        <div className="space-y-4">
          {actions.map((action) => (
            <div key={action.id} className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-lg">{action.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      action.urgency === 'critical' ? 'bg-red-900 text-red-300' :
                      action.urgency === 'high' ? 'bg-orange-900 text-orange-300' :
                      action.urgency === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-green-900 text-green-300'
                    }`}>
                      {action.urgency.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      action.status === 'completed' ? 'bg-green-900 text-green-300' :
                      action.status === 'scheduled' ? 'bg-blue-900 text-blue-300' :
                      'bg-gray-900 text-gray-300'
                    }`}>
                      {action.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-2">{action.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Due: {format(action.timeline, 'MMM d, yyyy')}</span>
                    <span>Est. Cost: ${action.estimatedCost}</span>
                    <span>Benefit: {action.estimatedBenefit} QALY</span>
                    {action.provider && <span>Provider: {action.provider}</span>}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  {action.status === 'pending' && (
                    <>
                      <button className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded text-sm">
                        Schedule
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm">
                        Dismiss
                      </button>
                    </>
                  )}
                  {action.status === 'scheduled' && (
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Coordination View
function CoordinationView({ coordination }: { coordination: CareCoordination[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">🤝 Care Coordination</h2>
        <p className="text-gray-400 mb-6">
          Seamlessly coordinated healthcare appointments and follow-ups
        </p>

        <div className="space-y-4">
          {coordination.map((item) => (
            <div key={item.id} className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-gray-300">{item.provider}</p>
                  <p className="text-sm text-gray-400">{item.purpose}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-pink-400">
                    {format(item.date, 'MMM d')}
                  </div>
                  <div className="text-sm text-gray-400">
                    {format(item.date, 'yyyy')}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded text-sm ${
                    item.type === 'appointment' ? 'bg-blue-900 text-blue-300' :
                    item.type === 'test' ? 'bg-green-900 text-green-300' :
                    item.type === 'treatment' ? 'bg-purple-900 text-purple-300' :
                    'bg-orange-900 text-orange-300'
                  }`}>
                    {item.type.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded text-sm ${
                    item.preparationStatus === 'ready' ? 'bg-green-900 text-green-300' :
                    item.preparationStatus === 'in_progress' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-red-900 text-red-300'
                  }`}>
                    Prep: {item.preparationStatus.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex space-x-2">
                  {item.packetId && (
                    <button className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded text-sm">
                      View Packet
                    </button>
                  )}
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Finance View
function FinanceView({ finance }: { finance: FinancialOptimization }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Current Annual Spend</h3>
          <div className="text-2xl font-bold text-red-400">
            ${finance.currentSpend.toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Projected Spend</h3>
          <div className="text-2xl font-bold text-yellow-400">
            ${finance.projectedAnnualSpend.toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Potential Savings</h3>
          <div className="text-2xl font-bold text-green-400">
            ${finance.outOfPocketSavings.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-green-400">💰 Optimization Opportunities</h2>
        <div className="space-y-4">
          {finance.optimizationOpportunities.map((opportunity, idx) => (
            <div key={idx} className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{opportunity.description}</h3>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">
                    ${opportunity.potentialSavings.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">potential savings</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded text-xs ${
                  opportunity.type === 'prevention' ? 'bg-green-900 text-green-300' :
                  opportunity.type === 'provider_choice' ? 'bg-blue-900 text-blue-300' :
                  opportunity.type === 'timing' ? 'bg-purple-900 text-purple-300' :
                  'bg-orange-900 text-orange-300'
                }`}>
                  {opportunity.type.replace('_', ' ').toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  opportunity.implementationDifficulty === 'easy' ? 'bg-green-900 text-green-300' :
                  opportunity.implementationDifficulty === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-red-900 text-red-300'
                }`}>
                  {opportunity.implementationDifficulty.toUpperCase()}
                </span>
                <button className="bg-pink-600 hover:bg-pink-700 px-3 py-1 rounded text-xs ml-auto">
                  Implement
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}