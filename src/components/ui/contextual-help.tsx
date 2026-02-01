"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHelpCircle, FiX, FiZap } from 'react-icons/fi';

interface ContextualHelpProps {
  page: string;
  className?: string;
}

const HELP_CONTENT = {
  vault: {
    title: "Welcome to Your Sacred Vault! 🏰",
    tips: [
      "Start by uploading your health documents - this unlocks AI analysis",
      "Your data is encrypted and HIPAA compliant",
      "Complete the progress steps to unlock advanced features",
      "Chat with mascots anytime for personalized health guidance"
    ]
  },
  chat: {
    title: "AI Mascot Chat 💬",
    tips: [
      "Choose different mascots for specialized expertise",
      "All conversations are saved to your health blueprint",
      "Mascots provide educational information, not medical advice",
      "Ask about treatments, symptoms, or general health questions"
    ]
  },
  'vault/personal-documents': {
    title: "Document Upload 📄",
    tips: [
      "Upload PDFs, images, or scanned documents",
      "Supported: lab results, imaging reports, prescriptions",
      "AI will automatically categorize and analyze your documents",
      "Your files are securely encrypted and private"
    ]
  },
  mascots: {
    title: "Meet Your AI Health Team 👥",
    tips: [
      "Each mascot specializes in different health areas",
      "Watch intro videos to learn about their expertise",
      "Click 'Chat' to start a conversation with any mascot",
      "All mascots provide educational information only"
    ]
  }
};

export function ContextualHelp({ page, className = "" }: ContextualHelpProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [hasSeenHelp, setHasSeenHelp] = useState(false);

  const helpData = HELP_CONTENT[page as keyof typeof HELP_CONTENT];

  useEffect(() => {
    if (!helpData) return;

    // Check if user has seen this help before
    const seenKey = `help-seen-${page}`;
    const hasSeen = localStorage.getItem(seenKey) === 'true';
    setHasSeenHelp(hasSeen);

    // Auto-rotate tips
    if (isVisible && helpData.tips.length > 1) {
      const interval = setInterval(() => {
        setCurrentTipIndex(prev => (prev + 1) % helpData.tips.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isVisible, page, helpData]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (helpData) {
      localStorage.setItem(`help-seen-${page}`, 'true');
      setHasSeenHelp(true);
    }
  };

  if (!helpData) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Help Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsVisible(true)}
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <FiHelpCircle className="w-6 h-6" />
      </motion.button>

      {/* Help Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 w-80 bg-black/95 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FiZap className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">{helpData.title}</h3>
              </div>
              <button
                onClick={handleDismiss}
                className="text-white/60 hover:text-white transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Tips */}
            <div className="space-y-3">
              {helpData.tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: currentTipIndex === index ? 1 : 0.5,
                    x: currentTipIndex === index ? 0 : -10
                  }}
                  className={`text-sm text-white/80 leading-relaxed ${
                    currentTipIndex === index ? 'font-medium' : ''
                  }`}
                >
                  {tip}
                </motion.div>
              ))}
            </div>

            {/* Tip Indicators */}
            {helpData.tips.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {helpData.tips.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentTipIndex ? 'bg-blue-400' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Don't show again option */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                onClick={handleDismiss}
                className="text-xs text-white/60 hover:text-white/80 transition-colors"
              >
                Don't show this help again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}