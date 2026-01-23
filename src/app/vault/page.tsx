"use client";
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiLock,
  FiUpload,
  FiFile,
  FiShare2,
  FiTrendingUp,
  FiUsers,
  FiShield,
  FiArrowRight,
  FiClock,
  FiCheckCircle
} from 'react-icons/fi';
import { getProgressiveFeatures, ProgressiveFeature } from '@/lib/progressive-disclosure';
import OnboardingFlow from '@/components/OnboardingFlow';
import { FeatureTooltip } from '@/components/Tooltip';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { ContextualHelp } from '@/components/ui/contextual-help';

export default function VaultPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userData, setUserData] = useState({
    hasDocuments: false,
    hasTimelineEntries: false,
    hasFamilyData: false,
    hasSharedWithProviders: false,
    hasAIInsights: false,
  });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Check real user progress from APIs
  useEffect(() => {
    const checkUserProgress = async () => {
      try {
        // Check if user has completed onboarding
        const onboardingCompleted = localStorage.getItem('vault-onboarding-completed');
        setHasCompletedOnboarding(onboardingCompleted === 'true');

        // Check for documents
        const documentsResponse = await fetch('/api/documents?limit=1');
        const documentsData = await documentsResponse.json();
        const hasDocuments = documentsData.documents && documentsData.documents.length > 0;

        // Check for family data (trusted circle)
        const familyResponse = await fetch('/api/vault/trusted-circle');
        const familyData = await familyResponse.json();
        const hasFamilyData = familyData.members && familyData.members.length > 0;

        // Check for provider sharing
        const providersResponse = await fetch('/api/vault/providers');
        const providersData = await providersResponse.json();
        const hasSharedWithProviders = providersData.providers && providersData.providers.some((p: any) => p.sharedData);

        // Check for AI insights (this would need a real API endpoint)
        // For now, we'll simulate based on other activity
        const hasAIInsights = hasDocuments && (hasFamilyData || hasSharedWithProviders);

        // Check for timeline entries (this would need a real API endpoint)
        // For now, we'll simulate based on documents and family data
        const hasTimelineEntries = hasDocuments || hasFamilyData;

        setUserData({
          hasDocuments,
          hasTimelineEntries,
          hasFamilyData,
          hasSharedWithProviders,
          hasAIInsights,
        });

        // Show onboarding for new users who haven't completed it
        if (!onboardingCompleted) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Error checking user progress:', error);
        // Fallback to default state
        setUserData({
          hasDocuments: false,
          hasTimelineEntries: false,
          hasFamilyData: false,
          hasSharedWithProviders: false,
          hasAIInsights: false,
        });
      }
    };

    checkUserProgress();
  }, []);

  // Function to refresh user progress after actions
  const refreshUserProgress = async () => {
    try {
      // Check for documents
      const documentsResponse = await fetch('/api/documents?limit=1');
      const documentsData = await documentsResponse.json();
      const hasDocuments = documentsData.documents && documentsData.documents.length > 0;

      // Check for family data (trusted circle)
      const familyResponse = await fetch('/api/vault/trusted-circle');
      const familyData = await familyResponse.json();
      const hasFamilyData = familyData.members && familyData.members.length > 0;

      // Check for provider sharing
      const providersResponse = await fetch('/api/vault/providers');
      const providersData = await providersResponse.json();
      const hasSharedWithProviders = providersData.providers && providersData.providers.some((p: any) => p.sharedData);

      // Check for AI insights (simulate based on other activity)
      const hasAIInsights = hasDocuments && (hasFamilyData || hasSharedWithProviders);

      // Check for timeline entries (simulate based on documents and family data)
      const hasTimelineEntries = hasDocuments || hasFamilyData;

      const newUserData = {
        hasDocuments,
        hasTimelineEntries,
        hasFamilyData,
        hasSharedWithProviders,
        hasAIInsights,
      };

      setUserData(newUserData);
      return newUserData;
    } catch (error) {
      console.error('Error refreshing user progress:', error);
      return userData;
    }
  };

  // Get intelligent next step based on user progress
  const getNextStep = () => {
    const progressItems = [
      { id: 'documents', completed: userData.hasDocuments, priority: 1, action: 'Upload Documents', path: '/vault/personal-documents' },
      { id: 'timeline', completed: userData.hasTimelineEntries, priority: 2, action: 'Build Timeline', path: '/vault/timeline' },
      { id: 'family', completed: userData.hasFamilyData, priority: 3, action: 'Add Family Data', path: '/vault/family-tree' },
      { id: 'providers', completed: userData.hasSharedWithProviders, priority: 4, action: 'Share with Providers', path: '/vault/provider-portal' },
      { id: 'insights', completed: userData.hasAIInsights, priority: 5, action: 'Get AI Insights', path: '/vault/ai-insights' }
    ];

    // Find the highest priority incomplete item
    const nextItem = progressItems
      .filter(item => !item.completed)
      .sort((a, b) => a.priority - b.priority)[0];

    return nextItem;
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setHasCompletedOnboarding(true);
    localStorage.setItem('vault-onboarding-completed', 'true');
  };

  const handleOnboardingDismiss = () => {
    setShowOnboarding(false);
    // Don't mark as completed if dismissed, so it can show again later
  };

  // Get progressive features based on user data
  const vaultFeatures = getProgressiveFeatures(userData);

  const filteredFeatures = selectedCategory === 'all'
    ? vaultFeatures
    : vaultFeatures.filter(f => f.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Features', count: vaultFeatures.length },
    { id: 'documents', name: 'Documents', count: vaultFeatures.filter(f => f.category === 'documents').length },
    { id: 'health', name: 'Health Tracking', count: vaultFeatures.filter(f => f.category === 'health').length },
    { id: 'collaboration', name: 'Collaboration', count: vaultFeatures.filter(f => f.category === 'collaboration').length },
    { id: 'analytics', name: 'Analytics', count: vaultFeatures.filter(f => f.category === 'analytics').length }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-12">
          <Breadcrumb className="mb-6" />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
                Sacred Vault
              </h1>
              <p className="text-gray-400 text-lg">
                Your complete healthcare intelligence platform - interactive, secure, and personalized
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <span className="text-green-400 text-sm font-medium">
                  🔒 HIPAA Compliant
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl border border-pink-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-400 text-sm font-medium">Available Now</p>
                  <p className="text-3xl font-bold text-white">{vaultFeatures.filter(f => f.state === 'available').length}</p>
                </div>
                <div className="text-3xl">🚀</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Coming Soon</p>
                  <p className="text-3xl font-bold text-white">{vaultFeatures.filter(f => f.state === 'coming-soon').length}</p>
                </div>
                <div className="text-3xl">⏳</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">AI Insights</p>
                  <p className="text-3xl font-bold text-white">94%</p>
                </div>
                <div className="text-3xl">🧠</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-xl border border-orange-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-400 text-sm font-medium">Data Security</p>
                  <p className="text-3xl font-bold text-white">256-bit</p>
                </div>
                <div className="text-3xl">🔐</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator
          title="Your Health Journey Progress"
          items={[
            {
              id: 'documents',
              label: 'Upload Health Documents',
              completed: userData.hasDocuments,
              description: 'Insurance cards, medical records, test results'
            },
            {
              id: 'timeline',
              label: 'Build Health Timeline',
              completed: userData.hasTimelineEntries,
              description: 'Track appointments, treatments, and milestones'
            },
            {
              id: 'family',
              label: 'Add Family Health Data',
              completed: userData.hasFamilyData,
              description: 'Connect family members and health history'
            },
            {
              id: 'providers',
              label: 'Share with Care Team',
              completed: userData.hasSharedWithProviders,
              description: 'Securely share data with healthcare providers'
            },
            {
              id: 'insights',
              label: 'Generate AI Insights',
              completed: userData.hasAIInsights,
              description: 'Get personalized health recommendations'
            }
          ]}
          className="mb-8"
        />

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature, index) => {
            const getStateIcon = () => {
              switch (feature.state) {
                case 'available':
                  return <FiCheckCircle className="w-4 h-4 text-green-400" />;
                case 'coming-soon':
                  return <FiClock className="w-4 h-4 text-yellow-400" />;
                case 'locked':
                  return <FiLock className="w-4 h-4 text-gray-400" />;
                default:
                  return null;
              }
            };

            const getStateColor = () => {
              switch (feature.state) {
                case 'available':
                  return 'border-green-500/30 bg-green-500/10';
                case 'coming-soon':
                  return 'border-yellow-500/30 bg-yellow-500/10';
                case 'locked':
                  return 'border-gray-500/30 bg-gray-500/10 opacity-60';
                default:
                  return 'border-gray-700';
              }
            };

            const getStateText = () => {
              switch (feature.state) {
                case 'available':
                  return 'AVAILABLE';
                case 'coming-soon':
                  return 'COMING SOON';
                case 'locked':
                  return 'LOCKED';
                default:
                  return '';
              }
            };

            const getIcon = () => {
              switch (feature.id) {
                case 'personal-documents':
                  return <FiLock className="w-8 h-8" />;
                case 'rich-health-timeline':
                  return <FiTrendingUp className="w-8 h-8" />;
                case 'lab-decoder':
                  return <FiFile className="w-8 h-8" />;
                case 'family-tree':
                  return <FiUsers className="w-8 h-8" />;
                case 'provider-portal':
                  return <FiShare2 className="w-8 h-8" />;
                case 'ai-insights':
                  return <FiShield className="w-8 h-8" />;
                default:
                  return <FiFile className="w-8 h-8" />;
              }
            };

            return (
              <FeatureTooltip key={feature.id} featureId={feature.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border p-6 transition-all hover:scale-105 cursor-pointer ${getStateColor()}`}
                >
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {getStateIcon()}
                  <span className={`px-2 py-1 border rounded-full text-xs font-medium ${
                    feature.state === 'available'
                      ? 'bg-green-500/20 border-green-500/30 text-green-400'
                      : feature.state === 'coming-soon'
                      ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
                      : 'bg-gray-500/20 border-gray-500/30 text-gray-400'
                  }`}>
                    {getStateText()}
                  </span>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white`}>
                    {getIcon()}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold mb-2 transition ${
                      feature.state === 'available'
                        ? 'text-white group-hover:text-pink-400'
                        : 'text-gray-300'
                    }`}>
                      {feature.name}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                    {feature.state === 'coming-soon' && feature.unlockCondition && (
                      <p className="text-xs text-yellow-400 mt-2 italic">
                        💡 {feature.unlockCondition}
                      </p>
                    )}
                  </div>
                </div>

                {feature.state === 'available' ? (
                  <Link
                    href={feature.path}
                    className="block w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-center px-4 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition group-hover:shadow-lg"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Launch Feature
                      <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </span>
                  </Link>
                ) : feature.state === 'coming-soon' ? (
                  <div className="w-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-400 text-center px-4 py-3 rounded-lg font-semibold cursor-not-allowed">
                    <span className="flex items-center justify-center gap-2">
                      <FiClock className="w-4 h-4" />
                      Coming Soon
                    </span>
                  </div>
                ) : (
                  <div className="w-full bg-gradient-to-r from-gray-500/20 to-gray-600/20 border border-gray-500/30 text-gray-400 text-center px-4 py-3 rounded-lg font-semibold cursor-not-allowed">
                    <span className="flex items-center justify-center gap-2">
                      <FiLock className="w-4 h-4" />
                      Feature Locked
                    </span>
                  </div>
                )}
              </motion.div>
              </FeatureTooltip>
            );
          })}
        </div>

        {/* Next Steps / Recommendations */}
        <div className="mt-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20 p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">🎯 Your Next Step</h2>
            <p className="text-gray-300">Complete this action to unlock more Sacred Vault features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(() => {
              const nextStep = getNextStep();
              if (nextStep) {
                return (
                  <Link
                    href={nextStep.path}
                    className="group bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6 hover:border-blue-400/50 transition hover:scale-105"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        <FiTrendingUp className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-blue-400 transition">
                          {nextStep.action}
                        </h3>
                        <p className="text-gray-300 text-sm mb-3">
                          {nextStep.id === 'documents' && "Upload your medical documents to get started with AI analysis"}
                          {nextStep.id === 'timeline' && "Build your health timeline to track your medical journey"}
                          {nextStep.id === 'family' && "Add family health data to unlock comprehensive insights"}
                          {nextStep.id === 'providers' && "Share your data securely with healthcare providers"}
                          {nextStep.id === 'insights' && "Generate personalized AI health recommendations"}
                        </p>
                        <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
                          <span>Start Now</span>
                          <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              }
              return null;
            })()}

            {/* Show available features if next step is completed */}
            {vaultFeatures
              .filter(f => f.state === 'available')
              .sort((a, b) => a.priority - b.priority)
              .slice(0, 1)
              .map((feature) => (
                <Link
                  key={feature.id}
                  href={feature.path}
                  className="group bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 hover:border-green-400/50 transition hover:scale-105"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white`}>
                      {(() => {
                        switch (feature.id) {
                          case 'personal-documents':
                            return <FiLock className="w-8 h-8" />;
                          case 'rich-health-timeline':
                            return <FiTrendingUp className="w-8 h-8" />;
                          case 'lab-decoder':
                            return <FiFile className="w-8 h-8" />;
                          case 'family-tree':
                            return <FiUsers className="w-8 h-8" />;
                          case 'provider-portal':
                            return <FiShare2 className="w-8 h-8" />;
                          case 'ai-insights':
                            return <FiShield className="w-8 h-8" />;
                          default:
                            return <FiFile className="w-8 h-8" />;
                        }
                      })()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-green-400 transition">
                        Explore {feature.name}
                      </h3>
                      <p className="text-gray-300 text-sm mb-3">
                        {feature.description}
                      </p>
                      <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                        <span>Launch Feature</span>
                        <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

            {vaultFeatures.filter(f => f.state === 'coming-soon').length > 0 && (
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                    <FiClock className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">More Features Coming</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      {vaultFeatures.filter(f => f.state === 'coming-soon').length} features unlock as you add more health data
                    </p>
                    <div className="text-yellow-400 text-sm font-medium">
                      Keep building your health foundation! 🚀
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Quick Start Your Health Journey</h2>
            <p className="text-gray-300">Begin with our most popular interactive features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/vault/personal-documents"
              className="group bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl p-6 hover:border-red-400/50 transition"
            >
              <div className="text-center">
                <FiUpload className="w-12 h-12 text-red-400 mx-auto mb-4 group-hover:scale-110 transition" />
                <h3 className="text-xl font-semibold text-white mb-2">Upload Documents</h3>
                <p className="text-gray-300 text-sm">Securely store your important personal documents</p>
              </div>
            </Link>

            <Link
              href="/chat"
              className="group bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6 hover:border-blue-400/50 transition"
            >
              <div className="text-center">
                <FiUsers className="w-12 h-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition" />
                <h3 className="text-xl font-semibold text-white mb-2">Chat with Experts</h3>
                <p className="text-gray-300 text-sm">Get personalized advice from AI healthcare specialists</p>
              </div>
            </Link>

            <Link
              href="/rich-health-timeline"
              className="group bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 hover:border-green-400/50 transition"
            >
              <div className="text-center">
                <FiTrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition" />
                <h3 className="text-xl font-semibold text-white mb-2">Track Your Health</h3>
                <p className="text-gray-300 text-sm">Build your comprehensive health timeline</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-3">
            <FiShield className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Your Data Security</h3>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            All data in your Sacred Vault is encrypted with 256-bit AES encryption, HIPAA compliant,
            and stored securely. You control who can access your information, and all sharing is
            logged and auditable. Your health data belongs to you - we just help you manage it.
          </p>
        </div>
      </div>

      {/* Onboarding Flow */}
      <OnboardingFlow
        isVisible={showOnboarding}
        onComplete={handleOnboardingComplete}
        onDismiss={handleOnboardingDismiss}
        userProgress={{
          hasDocuments: userData.hasDocuments,
          hasTimelineEntries: userData.hasTimelineEntries,
          hasFamilyData: userData.hasFamilyData,
        }}
      />

      {/* Contextual Help */}
      <ContextualHelp page="vault" />
    </div>
  );
}
