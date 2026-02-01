"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiX, FiArrowRight, FiUsers, FiFile, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

interface OnboardingFlowProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

type OnboardingStep = 'welcome' | 'family' | 'lab' | 'blueprint' | 'complete';

export function OnboardingFlow({ isOpen, onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [hasEngaged, setHasEngaged] = useState(false);

  // Reset to welcome when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('welcome');
      setHasEngaged(false);
    }
  }, [isOpen]);

  const handleNext = () => {
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('family');
        break;
      case 'family':
        setCurrentStep('lab');
        break;
      case 'lab':
        setCurrentStep('blueprint');
        break;
      case 'blueprint':
        setCurrentStep('complete');
        break;
      case 'complete':
        onComplete();
        break;
    }
  };

  const handleSkip = () => {
    if (currentStep === 'welcome') {
      onSkip();
    } else {
      handleNext();
    }
  };

  const handleEngage = () => {
    setHasEngaged(true);
    handleNext();
  };

  if (!isOpen) return null;

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
          className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-gray-700/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BV</span>
              </div>
              <h2 className="text-xl font-semibold text-white">Welcome to Beau-Tox</h2>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <AnimatePresence mode="wait">
              {currentStep === 'welcome' && <WelcomeStep onNext={handleNext} onSkip={handleSkip} />}
              {currentStep === 'family' && <FamilyStep onNext={handleNext} onSkip={handleSkip} onEngage={handleEngage} />}
              {currentStep === 'lab' && <LabStep onNext={handleNext} onSkip={handleSkip} onEngage={handleEngage} />}
              {currentStep === 'blueprint' && <BlueprintStep onNext={handleNext} hasEngaged={hasEngaged} />}
              {currentStep === 'complete' && <CompleteStep onComplete={onComplete} />}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function WelcomeStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Image
            src="/mascots/FAMILYTREEMASCOT.PNG"
            alt="Beau-Tox Mascot"
            width={60}
            height={60}
            className="rounded-lg"
          />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">
          Welcome to your Sacred Vault
        </h3>
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          This is where everything about your health connects. We'll show you how it works in just a few minutes.
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={onNext}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center gap-2"
        >
          Get Started
          <FiArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={onSkip}
          className="px-8 py-3 border border-gray-600 text-gray-400 rounded-lg hover:text-white hover:border-gray-500 transition-all"
        >
          Skip for now
        </button>
      </div>
    </motion.div>
  );
}

function FamilyStep({ onNext, onSkip, onEngage }: { onNext: () => void; onSkip: () => void; onEngage: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <div className="mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiUsers className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-4">
          Family Health Patterns
        </h3>
        <p className="text-gray-300 leading-relaxed mb-6">
          Adding even one family member can help surface helpful patterns in your health data. This is completely optional.
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <Link
          href="/vault/family-tree"
          onClick={onEngage}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2"
        >
          Add Family Member
          <FiArrowRight className="w-4 h-4" />
        </Link>
        <button
          onClick={onSkip}
          className="px-6 py-3 border border-gray-600 text-gray-400 rounded-lg hover:text-white hover:border-gray-500 transition-all"
        >
          Skip for now
        </button>
      </div>
    </motion.div>
  );
}

function LabStep({ onNext, onSkip, onEngage }: { onNext: () => void; onSkip: () => void; onEngage: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <div className="mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiFile className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-4">
          Lab Results Intelligence
        </h3>
        <p className="text-gray-300 leading-relaxed mb-6">
          If you have lab results, we can help explain them in plain language and add them to your health insights.
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <Link
          href="/vault/labs"
          onClick={onEngage}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2"
        >
          Upload a Lab
          <FiArrowRight className="w-4 h-4" />
        </Link>
        <button
          onClick={onSkip}
          className="px-6 py-3 border border-gray-600 text-gray-400 rounded-lg hover:text-white hover:border-gray-500 transition-all"
        >
          Skip for now
        </button>
      </div>
    </motion.div>
  );
}

function BlueprintStep({ onNext, hasEngaged }: { onNext: () => void; hasEngaged: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <div className="mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiTrendingUp className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-4">
          Your Health Blueprint
        </h3>
        <p className="text-gray-300 leading-relaxed mb-6">
          As you add information, your Blueprint highlights what matters most. This is where your health intelligence comes together.
        </p>

        {hasEngaged && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <FiCheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-300 text-sm">Great! Your data is now part of your Blueprint.</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex gap-4 justify-center">
        <Link
          href="/vault/blueprint"
          onClick={onNext}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2"
        >
          View Blueprint
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

function CompleteStep({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">
          You're All Set!
        </h3>
        <p className="text-gray-300 leading-relaxed mb-6">
          You're in control. You can add or explore anything in your Vault at your pace. Your health data is secure and your insights are ready when you are.
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={onComplete}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2"
        >
          Go to Vault
          <FiArrowRight className="w-4 h-4" />
        </button>
        <Link
          href="/vault/blueprint"
          onClick={onComplete}
          className="px-8 py-3 border border-gray-600 text-gray-400 rounded-lg hover:text-white hover:border-gray-500 transition-all"
        >
          View Blueprint
        </Link>
      </div>
    </motion.div>
  );
}