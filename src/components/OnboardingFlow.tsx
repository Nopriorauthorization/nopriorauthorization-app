import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronRight, FiCheck, FiUpload, FiTrendingUp, FiUsers } from 'react-icons/fi';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    href: string;
  };
}

interface OnboardingFlowProps {
  isVisible: boolean;
  onComplete: () => void;
  onDismiss: () => void;
  userProgress: {
    hasDocuments: boolean;
    hasTimelineEntries: boolean;
    hasFamilyData: boolean;
  };
}

export default function OnboardingFlow({
  isVisible,
  onComplete,
  onDismiss,
  userProgress
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Your Sacred Vault! 🏰',
      description: 'Join 10,000+ health-conscious individuals who trust us with their data. Let\'s get you started in under 2 minutes.',
      icon: <div className="text-4xl">🏰</div>,
    },
    {
      id: 'quick-win',
      title: 'Your First AI Health Insight 🎯',
      description: 'Upload one document and get instant AI analysis. Most users see their first insight in under 30 seconds!',
      icon: <FiUpload className="w-12 h-12 text-red-400" />,
      action: {
        label: 'Upload & Get Insight',
        href: '/vault/personal-documents'
      }
    },
    {
      id: 'social-proof',
      title: 'Trusted by Healthcare Leaders',
      description: '"This platform transformed how I manage patient data. The AI insights are remarkably accurate." - Dr. Sarah Chen, MD',
      icon: <div className="text-4xl">🏆</div>,
    },
    {
      id: 'gamification',
      title: 'Unlock Your Health Superpowers! ⚡',
      description: 'Complete 3 simple steps to unlock advanced features. You\'re already 33% there!',
      icon: <div className="text-4xl">🚀</div>,
    },
    {
      id: 'complete',
      title: '🎉 Welcome to Your Health Revolution!',
      description: 'You\'ve earned your first achievements! Continue exploring to unlock advanced features and deeper insights.',
      icon: <FiCheck className="w-12 h-12 text-green-400" />,
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 max-w-md w-full mx-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{currentStep + 1}</span>
              </div>
              <div>
                <h2 className="text-white font-semibold">Getting Started</h2>
                <p className="text-gray-400 text-sm">Step {currentStep + 1} of {steps.length}</p>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-white transition"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-2">
            {/* Step Indicators */}
            <div className="flex justify-center gap-2 mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-pink-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Progress Text */}
            <div className="text-center text-sm text-gray-400 mb-2">
              Step {currentStep + 1} of {steps.length} • ~{Math.max(1, 5 - currentStep * 1.2)} min remaining
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 text-center">
            <div className="flex justify-center mb-6">
              {steps[currentStep].icon}
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">
              {steps[currentStep].title}
            </h3>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {steps[currentStep].description}
            </p>

            {/* Achievement Badges for Completion */}
            {steps[currentStep].id === 'complete' && (
              <div className="mb-8">
                <h4 className="text-white font-semibold mb-4">🏆 Achievements Unlocked:</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg px-4 py-2">
                    <div className="text-yellow-400 text-sm font-medium">First Steps</div>
                    <div className="text-yellow-300 text-xs">Completed onboarding</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg px-4 py-2">
                    <div className="text-blue-400 text-sm font-medium">Health Explorer</div>
                    <div className="text-blue-300 text-xs">Started health journey</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg px-4 py-2">
                    <div className="text-green-400 text-sm font-medium">Data Guardian</div>
                    <div className="text-green-300 text-xs">Understands privacy</div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            {steps[currentStep].action && (
              <a
                href={steps[currentStep].action.href}
                onClick={handleNext}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition mb-4"
              >
                {steps[currentStep].action.label}
                <FiChevronRight className="w-4 h-4" />
              </a>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleSkip}
                className="text-gray-400 hover:text-white transition text-sm"
              >
                Skip for now
              </button>

              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition ${
                      index === currentStep
                        ? 'bg-pink-500'
                        : index < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="text-pink-400 hover:text-pink-300 transition text-sm font-medium"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}