/**
 * QUICK START EXAMPLE
 * ====================
 * Copy this file to your app directory to see all components in action
 * 
 * Example locations:
 * - app/vault/page.tsx (App Router)
 * - pages/vault.tsx (Pages Router)
 */

"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import components to reduce initial bundle size
const SacredVaultDashboard = dynamic(() => import('@/content/hero/SacredVaultDashboard'), {
  loading: () => <LoadingScreen />
});

const AIHealthInsightsEngine = dynamic(() => import('@/content/hero/AIHealthInsightsEngine'), {
  loading: () => <LoadingScreen />
});

const HealthPatternRecognition = dynamic(() => import('@/content/hero/HealthPatternRecognition'), {
  loading: () => <LoadingScreen />
});

const SmartCareRecommendations = dynamic(() => import('@/content/hero/SmartCareRecommendations'), {
  loading: () => <LoadingScreen />
});

const HealthMetricsDashboard = dynamic(() => import('@/content/hero/HealthMetricsDashboard'), {
  loading: () => <LoadingScreen />
});

const BehavioralAnalyticsEngine = dynamic(() => import('@/content/hero/BehavioralAnalyticsEngine'), {
  loading: () => <LoadingScreen />
});

const AdvancedUserPersonalization = dynamic(() => import('@/content/hero/AdvancedUserPersonalization'), {
  loading: () => <LoadingScreen />
});

const IntelligentDocumentAnalysis = dynamic(() => import('@/content/hero/IntelligentDocumentAnalysis'), {
  loading: () => <LoadingScreen />
});

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mb-4"></div>
        <p className="text-gray-400">Loading Sacred Vault...</p>
      </div>
    </div>
  );
}

type ViewMode = 'dashboard' | 'ai-insights' | 'patterns' | 'recommendations' | 'metrics' | 'analytics' | 'personalization' | 'documents';

export default function SacredVaultMain() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  // Quick navigation
  const views = [
    { id: 'dashboard' as ViewMode, name: 'Dashboard', icon: '🏠' },
    { id: 'ai-insights' as ViewMode, name: 'AI Insights', icon: '🧠' },
    { id: 'patterns' as ViewMode, name: 'Patterns', icon: '📈' },
    { id: 'recommendations' as ViewMode, name: 'Recommendations', icon: '💊' },
    { id: 'metrics' as ViewMode, name: 'Metrics', icon: '📊' },
    { id: 'analytics' as ViewMode, name: 'Analytics', icon: '📉' },
    { id: 'personalization' as ViewMode, name: 'Profile', icon: '👤' },
    { id: 'documents' as ViewMode, name: 'Documents', icon: '📄' }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏥</span>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Sacred Vault
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {views.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setCurrentView(view.id)}
                  className={`px-3 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                    currentView === view.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span>{view.icon}</span>
                  <span className="hidden md:inline">{view.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <main>
        {currentView === 'dashboard' && <SacredVaultDashboard />}
        {currentView === 'ai-insights' && <AIHealthInsightsEngine />}
        {currentView === 'patterns' && <HealthPatternRecognition />}
        {currentView === 'recommendations' && <SmartCareRecommendations />}
        {currentView === 'metrics' && <HealthMetricsDashboard />}
        {currentView === 'analytics' && <BehavioralAnalyticsEngine />}
        {currentView === 'personalization' && <AdvancedUserPersonalization />}
        {currentView === 'documents' && <IntelligentDocumentAnalysis />}
      </main>
    </div>
  );
}

/**
 * HOW TO USE THIS FILE
 * ====================
 * 
 * 1. Copy this file to: app/vault/page.tsx (for App Router)
 *    Or: pages/vault.tsx (for Pages Router)
 * 
 * 2. Update import paths if needed (depends on your tsconfig paths)
 * 
 * 3. Visit http://localhost:3000/vault to see all components!
 * 
 * 4. Click the top navigation to switch between features
 * 
 * CUSTOMIZATION
 * =============
 * 
 * - Add authentication checks before rendering
 * - Replace mock data with real API calls
 * - Add loading states and error boundaries
 * - Customize navigation and layout
 * - Add breadcrumbs and back buttons
 * 
 * PRODUCTION CHECKLIST
 * ====================
 * 
 * [ ] Add authentication/authorization
 * [ ] Connect to real databases
 * [ ] Implement API routes
 * [ ] Add error handling
 * [ ] Set up analytics tracking
 * [ ] Configure environment variables
 * [ ] Test on mobile devices
 * [ ] Optimize images and assets
 * [ ] Add SEO metadata
 * [ ] Deploy to hosting platform
 */
