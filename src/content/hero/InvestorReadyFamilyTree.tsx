"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiUsers, FiTrendingUp, FiShield, FiZap, FiTarget } from 'react-icons/fi';

// Core Types
interface FamilyMember {
  id: string;
  name: string;
  relationship: 'self' | 'parent' | 'child' | 'sibling' | 'spouse';
  age: number;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  conditions: string[];
  position: { x: number; y: number };
  avatar?: string;
}

interface HealthInsight {
  id: string;
  type: 'risk' | 'pattern' | 'recommendation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
}

// Demo Data
const demoFamily: FamilyMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    relationship: 'self',
    age: 35,
    healthStatus: 'good',
    conditions: ['Hypertension'],
    position: { x: 400, y: 300 }
  },
  {
    id: '2',
    name: 'Michael Johnson',
    relationship: 'spouse',
    age: 38,
    healthStatus: 'excellent',
    conditions: [],
    position: { x: 550, y: 300 }
  },
  {
    id: '3',
    name: 'Emma Johnson',
    relationship: 'child',
    age: 8,
    healthStatus: 'excellent',
    conditions: [],
    position: { x: 475, y: 450 }
  },
  {
    id: '4',
    name: 'Robert Johnson Sr.',
    relationship: 'parent',
    age: 65,
    healthStatus: 'fair',
    conditions: ['Type 2 Diabetes', 'High Cholesterol'],
    position: { x: 325, y: 150 }
  },
  {
    id: '5',
    name: 'Mary Johnson',
    relationship: 'parent',
    age: 63,
    healthStatus: 'good',
    conditions: ['Osteoarthritis'],
    position: { x: 475, y: 150 }
  }
];

const demoInsights: HealthInsight[] = [
  {
    id: '1',
    type: 'risk',
    title: 'Cardiovascular Risk Pattern',
    description: 'Family history shows elevated cardiovascular risk. Paternal grandfather had heart attack at 62.',
    severity: 'high',
    confidence: 0.87
  },
  {
    id: '2',
    type: 'pattern',
    title: 'Diabetes Genetic Pattern',
    description: 'Two first-degree relatives with Type 2 Diabetes. Consider genetic screening.',
    severity: 'medium',
    confidence: 0.92
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'Preventive Screening',
    description: 'Annual cardiovascular screening recommended starting at age 40.',
    severity: 'medium',
    confidence: 0.95
  }
];

export default function InvestorReadyFamilyTree() {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [currentView, setCurrentView] = useState<'tree' | 'insights' | 'sharing'>('tree');

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'from-green-400 to-green-600';
      case 'good': return 'from-blue-400 to-blue-600';
      case 'fair': return 'from-yellow-400 to-yellow-600';
      case 'poor': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/20 backdrop-blur-sm border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Family Health OS</h1>
                <p className="text-gray-400 text-sm">The operating system healthcare forgot</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Live Demo</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6 mt-4">
            {[
              { id: 'tree', label: 'Family Tree', icon: FiUsers },
              { id: 'insights', label: 'AI Insights', icon: FiZap },
              { id: 'sharing', label: 'Provider Sharing', icon: FiShield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  currentView === tab.id
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'tree' && (
            <motion.div
              key="tree"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Family Tree Canvas */}
              <div className="lg:col-span-2">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Your Family Health Tree</h2>

                  <div className="relative h-96 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl overflow-hidden">
                    {/* Connection Lines */}
                    <svg className="absolute inset-0 w-full h-full">
                      {demoFamily.map(member => {
                        if (member.relationship === 'parent') {
                          const child = demoFamily.find(m => m.relationship === 'self');
                          if (child) {
                            return (
                              <line
                                key={`line-${member.id}`}
                                x1={member.position.x}
                                y1={member.position.y}
                                x2={child.position.x}
                                y2={child.position.y}
                                stroke="rgba(168, 85, 247, 0.4)"
                                strokeWidth="2"
                              />
                            );
                          }
                        }
                        return null;
                      })}
                    </svg>

                    {/* Family Members */}
                    {demoFamily.map((member) => (
                      <motion.div
                        key={member.id}
                        className="absolute cursor-pointer"
                        style={{
                          left: member.position.x - 40,
                          top: member.position.y - 40
                        }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setSelectedMember(member)}
                      >
                        <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${getHealthColor(member.healthStatus)} border-4 border-white/20 flex items-center justify-center shadow-lg`}>
                          <span className="text-white font-bold text-lg">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="text-center mt-2">
                          <div className="text-white text-sm font-medium">{member.name.split(' ')[0]}</div>
                          <div className="text-gray-400 text-xs">{member.relationship}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                      <span className="text-gray-400">Excellent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                      <span className="text-gray-400">Good</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                      <span className="text-gray-400">Fair</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full"></div>
                      <span className="text-gray-400">Poor</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Member Details */}
              <div className="space-y-6">
                {selectedMember ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getHealthColor(selectedMember.healthStatus)} flex items-center justify-center`}>
                        <span className="text-white font-bold text-xl">
                          {selectedMember.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{selectedMember.name}</h3>
                        <p className="text-gray-400">{selectedMember.relationship} • Age {selectedMember.age}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Health Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedMember.healthStatus === 'excellent' ? 'bg-green-500/20 text-green-300' :
                          selectedMember.healthStatus === 'good' ? 'bg-blue-500/20 text-blue-300' :
                          selectedMember.healthStatus === 'fair' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {selectedMember.healthStatus}
                        </span>
                      </div>

                      {selectedMember.conditions.length > 0 && (
                        <div>
                          <span className="text-gray-400 block mb-2">Conditions</span>
                          <div className="flex flex-wrap gap-2">
                            {selectedMember.conditions.map((condition, idx) => (
                              <span key={idx} className="px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs">
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setShowInsights(true)}
                      className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition"
                    >
                      View AI Health Insights
                    </button>
                  </motion.div>
                ) : (
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 text-center">
                    <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Select a Family Member</h3>
                    <p className="text-gray-400 text-sm">Click on anyone in your family tree to see their health details and AI insights.</p>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Family Health Overview</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Family Members</span>
                      <span className="text-white font-medium">{demoFamily.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Health Records</span>
                      <span className="text-white font-medium">89% Complete</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">AI Insights</span>
                      <span className="text-white font-medium">{demoInsights.length} Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Risk Factors</span>
                      <span className="text-orange-400 font-medium">3 Identified</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FiZap className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">AI Health Insights</h2>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
                    94% Accuracy
                  </span>
                </div>

                <div className="space-y-4">
                  {demoInsights.map((insight) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border ${getSeverityColor(insight.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-medium">{insight.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            insight.severity === 'critical' ? 'bg-red-500/20 text-red-300' :
                            insight.severity === 'high' ? 'bg-orange-500/20 text-orange-300' :
                            insight.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-green-500/20 text-green-300'
                          }`}>
                            {insight.severity}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {Math.round(insight.confidence * 100)}% confidence
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">{insight.description}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <FiTarget className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-300 font-medium">Next Recommended Action</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Schedule cardiovascular screening for family members over 40. Early detection could prevent serious health issues.
                  </p>
                  <button className="mt-3 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition">
                    Schedule Screening
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'sharing' && (
            <motion.div
              key="sharing"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FiShield className="w-6 h-6 text-green-400" />
                  <h2 className="text-xl font-bold text-white">Secure Provider Sharing</h2>
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                    HIPAA Compliant
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-300 font-medium">Dr. Sarah Mitchell</span>
                      <span className="text-green-400 text-sm">Cardiologist</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">Mayo Clinic • Last shared: 2 days ago</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Shared:</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">Family History</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">Genetic Risks</span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-300 font-medium">Dr. Michael Chen</span>
                      <span className="text-blue-400 text-sm">Primary Care</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">Cleveland Clinic • Last shared: 1 week ago</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Shared:</span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">Complete Health</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition">
                    Share with New Provider
                  </button>
                </div>

                <div className="mt-4 p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg">
                  <p className="text-gray-400 text-sm text-center">
                    🔒 All data is end-to-end encrypted and shared only with your explicit permission
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Value Proposition Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-black/20 backdrop-blur-sm border-t border-white/10 mt-12"
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <FiHeart className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Solves $3.8T Problem</h3>
              <p className="text-gray-400 text-sm">Addresses fragmented healthcare data and missing family health context</p>
            </div>
            <div>
              <FiTrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">$50B Market Opportunity</h3>
              <p className="text-gray-400 text-sm">First mover in family health OS with network effects and AI moat</p>
            </div>
            <div>
              <FiZap className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">94% AI Accuracy</h3>
              <p className="text-gray-400 text-sm">Proprietary algorithms detect health patterns across generations</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Insights Modal */}
      <AnimatePresence>
        {showInsights && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowInsights(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-800 rounded-2xl border border-white/20 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">AI Health Insights</h3>
                <button
                  onClick={() => setShowInsights(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {demoInsights.map((insight) => (
                  <div key={insight.id} className={`p-4 rounded-xl border ${getSeverityColor(insight.severity)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium">{insight.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        insight.severity === 'critical' ? 'bg-red-500/20 text-red-300' :
                        insight.severity === 'high' ? 'bg-orange-500/20 text-orange-300' :
                        insight.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {insight.severity} risk
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">AI Confidence: {Math.round(insight.confidence * 100)}%</span>
                      <button className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded text-xs hover:bg-purple-500/30">
                        Learn More
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                <h4 className="text-purple-300 font-medium mb-2">💡 Key Takeaway</h4>
                <p className="text-gray-300 text-sm">
                  Your family's health patterns show elevated cardiovascular risk. Early screening and lifestyle changes could prevent serious issues.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}