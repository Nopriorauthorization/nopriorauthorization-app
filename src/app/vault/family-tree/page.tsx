"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import MascotDomainShell from "@/components/mascots/MascotDomainShell";
import { 
  FiUsers, 
  FiPlus, 
  FiChevronDown, 
  FiChevronUp, 
  FiCheck, 
  FiAlertTriangle,
  FiHeart,
  FiActivity,
  FiShield,
  FiArrowRight
} from "react-icons/fi";

// =============================================================================
// FAMILY HEALTH TREE - ROOT'S DOMAIN
// Interactive family health mapping with genetic pattern recognition
// =============================================================================

export default function FamilyTreePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Page Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/30 via-green-900/20 to-black" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-emerald-400 text-sm font-medium tracking-wider mb-4">
              FAMILY INTELLIGENCE
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Family Health Tree
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Discover generational health patterns. Map your family's medical history.{" "}
              <span className="text-white font-medium">Protect future generations with knowledge.</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Root Mascot Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MascotDomainShell
          mascotId="root"
          displayName="Root"
          tagline="Family Health Intelligence"
          description="Discover generational health patterns, genetic predispositions, and family medical history. Build a comprehensive family health map that reveals insights for prevention and early intervention."
          imageSrc="/mascots/FAMILYTREEMASCOT.PNG"
          videoSrc="/videos/mascots/roots.mp4"
          showVideo={true}
          features={[
            {
              icon: "🌳",
              title: "Generational Patterns",
              description: "Map your family's health journey across generations"
            },
            {
              icon: "🧬",
              title: "Genetic Insights",
              description: "Understand inherited health predispositions"
            },
            {
              icon: "🛡️",
              title: "Prevention Focus",
              description: "Stay ahead of hereditary health risks"
            },
            {
              icon: "🤖",
              title: "AI-Powered Analysis",
              description: "Smart pattern recognition across your family tree"
            }
          ]}
          ctaText="Build Your Family Tree"
          ctaHref="/vault/family-tree#builder"
          source="family-tree"
        />
      </div>

      {/* Interactive Family Tree Builder */}
      <FamilyTreeBuilder />

      {/* Genetic Pattern Analysis */}
      <GeneticPatternSection />

      {/* Common Hereditary Conditions */}
      <HereditaryConditionsSection />

      {/* Blueprint Integration */}
      <div className="bg-gradient-to-b from-emerald-900/10 to-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              How This Connects to Your Health
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Your family health tree feeds directly into your personalized health blueprint, helping identify risks before they become problems.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-2xl p-6"
            >
              <FiActivity className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Risk Prediction</h3>
              <p className="text-gray-400 text-sm">Identify hereditary conditions before symptoms appear</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/30 rounded-2xl p-6"
            >
              <FiHeart className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Personalized Prevention</h3>
              <p className="text-gray-400 text-sm">Get screening recommendations based on family history</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/30 rounded-2xl p-6"
            >
              <FiShield className="w-8 h-8 text-teal-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Future Protection</h3>
              <p className="text-gray-400 text-sm">Help your children understand their genetic heritage</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/blueprint"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 transition-all hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25"
            >
              View Your Health Blueprint
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// FAMILY TREE BUILDER - Interactive Tool
// =============================================================================

function FamilyTreeBuilder() {
  const [familyMembers, setFamilyMembers] = useState([
    { id: "1", name: "You", relationship: "Self", conditions: [], isExpanded: true },
  ]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", relationship: "", conditions: [] as string[] });

  const relationships = [
    "Mother", "Father", "Sister", "Brother", 
    "Maternal Grandmother", "Maternal Grandfather",
    "Paternal Grandmother", "Paternal Grandfather",
    "Aunt", "Uncle", "Cousin", "Child"
  ];

  const commonConditions = [
    "Heart Disease", "Diabetes Type 2", "Hypertension", "Cancer",
    "Alzheimer's", "Stroke", "Asthma", "Arthritis", "Depression",
    "Thyroid Disorder", "Osteoporosis", "Kidney Disease"
  ];

  const addFamilyMember = () => {
    if (newMember.name && newMember.relationship) {
      setFamilyMembers([...familyMembers, {
        id: Date.now().toString(),
        name: newMember.name,
        relationship: newMember.relationship,
        conditions: newMember.conditions,
        isExpanded: false
      }]);
      setNewMember({ name: "", relationship: "", conditions: [] });
      setShowAddMember(false);
    }
  };

  const toggleCondition = (condition: string) => {
    setNewMember(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }));
  };

  return (
    <div id="builder" className="py-16 bg-gradient-to-b from-black to-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            🌳 Build Your Family Health Tree
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Add family members and their health conditions to discover patterns across generations.
          </p>
        </motion.div>

        {/* Family Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {familyMembers.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                  <FiUsers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{member.name}</h3>
                  <p className="text-emerald-400 text-sm">{member.relationship}</p>
                </div>
              </div>
              {member.conditions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {member.conditions.map((condition, idx) => (
                    <span key={idx} className="px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs">
                      {condition}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}

          {/* Add Member Button */}
          <motion.button
            onClick={() => setShowAddMember(true)}
            whileHover={{ scale: 1.02 }}
            className="border-2 border-dashed border-emerald-500/30 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all min-h-[140px]"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <FiPlus className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-emerald-400 font-medium">Add Family Member</span>
          </motion.button>
        </div>

        {/* Add Member Modal */}
        <AnimatePresence>
          {showAddMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAddMember(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gray-900 border border-emerald-500/30 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-white mb-6">Add Family Member</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    <input
                      type="text"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      placeholder="e.g., Mary Smith"
                      className="w-full px-4 py-3 bg-black/50 border border-emerald-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Relationship</label>
                    <select
                      value={newMember.relationship}
                      onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border border-emerald-500/30 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Select relationship...</option>
                      {relationships.map((rel) => (
                        <option key={rel} value={rel}>{rel}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Health Conditions</label>
                    <div className="flex flex-wrap gap-2">
                      {commonConditions.map((condition) => (
                        <button
                          key={condition}
                          onClick={() => toggleCondition(condition)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            newMember.conditions.includes(condition)
                              ? "bg-red-500 text-white"
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                          }`}
                        >
                          {condition}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setShowAddMember(false)}
                    className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addFamilyMember}
                    disabled={!newMember.name || !newMember.relationship}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition disabled:opacity-50"
                  >
                    Add Member
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// =============================================================================
// GENETIC PATTERN SECTION
// =============================================================================

function GeneticPatternSection() {
  const [activePattern, setActivePattern] = useState<string | null>(null);

  const patterns = [
    {
      id: "cardiovascular",
      name: "Cardiovascular Health",
      icon: "❤️",
      riskLevel: "moderate",
      description: "Heart disease, hypertension, and stroke patterns across generations.",
      markers: ["APOE-e4", "LDLR", "PCSK9"],
      prevention: [
        "Regular cardiovascular screenings starting at 40",
        "Mediterranean diet rich in omega-3s",
        "150 minutes of aerobic exercise weekly",
        "Blood pressure monitoring"
      ]
    },
    {
      id: "metabolic",
      name: "Metabolic Health",
      icon: "🧬",
      riskLevel: "low",
      description: "Diabetes, thyroid disorders, and metabolic syndrome patterns.",
      markers: ["TCF7L2", "PPARG", "FTO"],
      prevention: [
        "Annual A1C and fasting glucose tests",
        "Maintain healthy BMI",
        "Limit processed sugars",
        "Regular thyroid function tests"
      ]
    },
    {
      id: "cognitive",
      name: "Cognitive Health",
      icon: "🧠",
      riskLevel: "high",
      description: "Alzheimer's, dementia, and cognitive decline patterns.",
      markers: ["APOE-e4", "PSEN1", "APP"],
      prevention: [
        "Cognitive assessments starting at 50",
        "Brain-healthy diet (MIND diet)",
        "Regular mental stimulation",
        "Social engagement activities"
      ]
    },
    {
      id: "cancer",
      name: "Cancer Risk",
      icon: "🔬",
      riskLevel: "moderate",
      description: "Hereditary cancer syndromes and mutation patterns.",
      markers: ["BRCA1", "BRCA2", "MLH1", "TP53"],
      prevention: [
        "Genetic counseling for high-risk individuals",
        "Enhanced screening protocols",
        "Lifestyle modifications",
        "Consider preventive interventions"
      ]
    },
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "text-red-400 bg-red-500/20 border-red-500/30";
      case "moderate": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      default: return "text-green-400 bg-green-500/20 border-green-500/30";
    }
  };

  return (
    <div className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            🧬 Genetic Pattern Analysis
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Based on your family history, here are the genetic patterns Root has identified.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {patterns.map((pattern) => (
            <motion.div
              key={pattern.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => setActivePattern(activePattern === pattern.id ? null : pattern.id)}
                className={`w-full text-left p-6 rounded-2xl border transition-all ${
                  activePattern === pattern.id
                    ? "bg-emerald-500/20 border-emerald-500/50"
                    : "bg-black/40 border-emerald-500/20 hover:border-emerald-500/40"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{pattern.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{pattern.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getRiskColor(pattern.riskLevel)}`}>
                        {pattern.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                  </div>
                  {activePattern === pattern.id ? (
                    <FiChevronUp className="text-emerald-400" />
                  ) : (
                    <FiChevronDown className="text-gray-500" />
                  )}
                </div>
                
                <AnimatePresence>
                  {activePattern === pattern.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-emerald-500/20 space-y-4">
                        <p className="text-gray-400 text-sm">{pattern.description}</p>
                        
                        <div>
                          <p className="text-emerald-300 text-sm font-medium mb-2">Related Genetic Markers:</p>
                          <div className="flex flex-wrap gap-2">
                            {pattern.markers.map((marker) => (
                              <span key={marker} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                                {marker}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-emerald-300 text-sm font-medium mb-2">Prevention Strategies:</p>
                          <ul className="space-y-1">
                            {pattern.prevention.map((item, idx) => (
                              <li key={idx} className="text-gray-400 text-sm flex items-start gap-2">
                                <FiCheck className="text-emerald-400 mt-1 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// HEREDITARY CONDITIONS SECTION
// =============================================================================

function HereditaryConditionsSection() {
  const conditions = [
    { name: "Heart Disease", inheritance: "Multifactorial", screening: "Age 40+", icon: "❤️" },
    { name: "Type 2 Diabetes", inheritance: "Polygenic", screening: "Age 45+ or earlier if risk", icon: "💉" },
    { name: "Breast Cancer", inheritance: "BRCA1/BRCA2", screening: "Age 40+ or 10 years before earliest case", icon: "🎗️" },
    { name: "Colon Cancer", inheritance: "Lynch Syndrome", screening: "Age 45+ or 10 years before earliest case", icon: "🔬" },
    { name: "Alzheimer's", inheritance: "APOE-e4", screening: "Cognitive assessment at 50+", icon: "🧠" },
    { name: "Hypertension", inheritance: "Multifactorial", screening: "Annual from age 18", icon: "📊" },
  ];

  return (
    <div className="py-16 bg-gradient-to-b from-emerald-900/10 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            📋 Common Hereditary Conditions
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Understanding inheritance patterns helps you know when to start screening.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {conditions.map((condition, index) => (
            <motion.div
              key={condition.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-black/40 border border-emerald-500/20 rounded-xl p-5 hover:border-emerald-500/40 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{condition.icon}</span>
                <h3 className="text-white font-semibold">{condition.name}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Inheritance:</span>
                  <span className="text-emerald-400">{condition.inheritance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Screening:</span>
                  <span className="text-gray-300">{condition.screening}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
