"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiActivity,
  FiArrowLeft,
  FiSave,
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiTarget,
  FiUsers
} from 'react-icons/fi';

type FamilyMember = {
  relation: string;
  age: number;
  conditions: string[];
  notes: string;
};

type GeneticRisk = {
  condition: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
  score: number;
  factors: string[];
  prevention: string[];
  screening: string[];
  description: string;
};

type RiskAssessment = {
  overallRiskScore: number;
  riskLevel: string;
  color: string;
  summary: string;
  highRiskConditions: GeneticRisk[];
  recommendations: string[];
  screeningSchedule: string[];
  lifestyleFactors: string[];
};

const geneticConditions = [
  'Heart Disease',
  'Diabetes',
  'Cancer (General)',
  'Breast Cancer',
  'Colorectal Cancer',
  'Prostate Cancer',
  'Ovarian Cancer',
  'Alzheimer\'s Disease',
  'Parkinson\'s Disease',
  'Osteoporosis',
  'Autoimmune Diseases',
  'Mental Health Disorders'
];

export default function GeneticRiskPage() {
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [ethnicity, setEthnicity] = useState<string>('');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [saved, setSaved] = useState(false);

  const addFamilyMember = (member: FamilyMember) => {
    setFamilyMembers(prev => [...prev, member]);
  };

  const calculateGeneticRisk = () => {
    if (!age) return;

    const userAge = parseInt(age);
    const geneticRisks: GeneticRisk[] = [];

    // Calculate risk for each condition based on family history
    geneticConditions.forEach(condition => {
      let riskScore = 0;
      const factors = [];
      const prevention = [];
      const screening = [];

      // Base risk by age and gender
      if (condition === 'Breast Cancer' && gender === 'female') {
        riskScore += Math.min(userAge / 10, 5);
        factors.push('Female gender');
      }
      if (condition === 'Prostate Cancer' && gender === 'male') {
        riskScore += Math.min(userAge / 15, 4);
        factors.push('Male gender');
      }
      if (condition === 'Ovarian Cancer' && gender === 'female') {
        riskScore += Math.min(userAge / 20, 3);
        factors.push('Female gender');
      }

      // Family history analysis
      const relevantFamily = familyMembers.filter(member =>
        member.conditions.includes(condition) ||
        (condition === 'Cancer (General)' && member.conditions.some(c => c.includes('Cancer')))
      );

      if (relevantFamily.length > 0) {
        // First degree relatives have higher impact
        const firstDegree = relevantFamily.filter(m =>
          ['Parent', 'Sibling', 'Child'].includes(m.relation)
        );

        if (firstDegree.length > 0) {
          riskScore += firstDegree.length * 4;
          factors.push(`${firstDegree.length} first-degree relative(s) affected`);
        }

        // Second degree relatives
        const secondDegree = relevantFamily.filter(m =>
          ['Grandparent', 'Aunt', 'Uncle', 'Niece', 'Nephew'].includes(m.relation)
        );

        if (secondDegree.length > 0) {
          riskScore += secondDegree.length * 2;
          factors.push(`${secondDegree.length} second-degree relative(s) affected`);
        }

        // Early onset increases risk
        const earlyOnset = relevantFamily.filter(m => m.age < 50);
        if (earlyOnset.length > 0) {
          riskScore += earlyOnset.length * 2;
          factors.push('Early onset in family');
        }
      }

      // Ethnicity factors
      if (ethnicity) {
        if (condition === 'Breast Cancer' && ethnicity === 'Ashkenazi Jewish') {
          riskScore += 3;
          factors.push('Ashkenazi Jewish ancestry');
        }
        if (condition === 'Colorectal Cancer' && ['Ashkenazi Jewish', 'African American'].includes(ethnicity)) {
          riskScore += 2;
          factors.push(`${ethnicity} ancestry`);
        }
      }

      // Determine risk level
      let riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
      if (riskScore >= 8) riskLevel = 'very_high';
      else if (riskScore >= 5) riskLevel = 'high';
      else if (riskScore >= 2) riskLevel = 'moderate';
      else riskLevel = 'low';

      // Condition-specific recommendations
      const conditionData = getConditionData(condition, riskLevel);
      prevention.push(...conditionData.prevention);
      screening.push(...conditionData.screening);

      geneticRisks.push({
        condition,
        riskLevel,
        score: Math.round(riskScore * 10),
        factors,
        prevention,
        screening,
        description: conditionData.description
      });
    });

    // Calculate overall assessment
    const highRiskConditions = geneticRisks.filter(r => r.riskLevel === 'high' || r.riskLevel === 'very_high');
    const averageRiskScore = geneticRisks.reduce((sum, r) => sum + r.score, 0) / geneticRisks.length;

    let overallRiskLevel: string;
    let color: string;
    let summary: string;

    if (averageRiskScore >= 70) {
      overallRiskLevel = 'High Genetic Risk';
      color = 'text-red-400';
      summary = 'You have elevated genetic risk for multiple conditions. Regular screening and preventive measures are strongly recommended.';
    } else if (averageRiskScore >= 40) {
      overallRiskLevel = 'Moderate Genetic Risk';
      color = 'text-yellow-400';
      summary = 'You have moderate genetic risk factors. Stay vigilant with screening and maintain healthy lifestyle habits.';
    } else {
      overallRiskLevel = 'Low Genetic Risk';
      color = 'text-green-400';
      summary = 'Your genetic risk appears low based on family history. Continue general preventive health measures.';
    }

    // Generate recommendations
    const recommendations = generateRecommendations(geneticRisks, userAge);
    const screeningSchedule = generateScreeningSchedule(geneticRisks, userAge, gender);
    const lifestyleFactors = generateLifestyleFactors(geneticRisks);

    setAssessment({
      overallRiskScore: Math.round(averageRiskScore),
      riskLevel: overallRiskLevel,
      color,
      summary,
      highRiskConditions,
      recommendations,
      screeningSchedule,
      lifestyleFactors
    });
  };

  const saveToVault = async () => {
    if (!assessment) return;

    try {
      const response = await fetch('/api/vault/tools/genetic-risk-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          overallRiskScore: assessment.overallRiskScore,
          riskLevel: assessment.riskLevel,
          highRiskConditions: assessment.highRiskConditions.map(c => c.condition),
          familyMembers,
          age: parseInt(age),
          gender,
          ethnicity,
          calculatedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving genetic risk result:', error);
    }
  };

  useEffect(() => {
    calculateGeneticRisk();
  }, [age, gender, ethnicity, familyMembers]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
            <Link
              href="/vault"
              className="flex items-center hover:text-white transition-colors"
            >
              Vault
            </Link>
            <span>/</span>
            <Link
              href="/vault/tools"
              className="hover:text-white transition-colors"
            >
              Tools
            </Link>
            <span>/</span>
            <span className="text-gray-500">Genetic Risk</span>
          </nav>
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/vault/tools"
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Genetic Risk Calculator
              </h1>
              <p className="text-gray-400">Assess your genetic risk factors based on family history and get personalized prevention strategies</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal & Family Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                <FiActivity className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Genetic Assessment</h2>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="30"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setGender('female')}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                      gender === 'female'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Female
                  </button>
                  <button
                    onClick={() => setGender('male')}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                      gender === 'male'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Male
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ethnicity</label>
                <select
                  value={ethnicity}
                  onChange={(e) => setEthnicity(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select ethnicity</option>
                  <option value="Caucasian">Caucasian</option>
                  <option value="African American">African American</option>
                  <option value="Hispanic">Hispanic</option>
                  <option value="Asian">Asian</option>
                  <option value="Ashkenazi Jewish">Ashkenazi Jewish</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Family History */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold mb-4">Family History</h3>
              <FamilyHistoryForm onAddMember={addFamilyMember} />
            </div>

            {/* Family Members List */}
            {familyMembers.length > 0 && (
              <div className="border-t border-gray-700 pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Family Members</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {familyMembers.map((member, index) => (
                    <div key={index} className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{member.relation} (Age: {member.age})</span>
                      </div>
                      {member.conditions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {member.conditions.map((condition, i) => (
                            <span key={i} className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">
                              {condition}
                            </span>
                          ))}
                        </div>
                      )}
                      {member.notes && (
                        <p className="text-sm text-gray-400">{member.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <FiInfo className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-400 mb-1">About Genetic Risk</h4>
                  <p className="text-sm text-gray-300">
                    This assessment is based on family history patterns and population statistics. It provides general risk estimates and should not replace professional genetic counseling or testing.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Risk Assessment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {assessment ? (
              <>
                {/* Overall Risk Score */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8">
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold mb-2">
                      <span className={assessment.color}>{assessment.overallRiskScore}</span>
                    </div>
                    <div className={`text-2xl font-semibold mb-2 ${assessment.color}`}>
                      {assessment.riskLevel}
                    </div>
                    <p className="text-gray-300 text-sm">{assessment.summary}</p>
                  </div>

                  {/* Risk Scale */}
                  <div className="space-y-3">
                    {[
                      { level: 'Low Genetic Risk', range: '0-39', color: 'bg-green-500' },
                      { level: 'Moderate Genetic Risk', range: '40-69', color: 'bg-yellow-500' },
                      { level: 'High Genetic Risk', range: '70+', color: 'bg-red-500' }
                    ].map((risk, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${risk.color} ${
                          assessment.riskLevel === risk.level ? 'ring-2 ring-white' : ''
                        }`}></div>
                        <span className="text-sm text-gray-300 flex-1">{risk.range} points</span>
                        <span className="text-sm font-medium text-gray-400">{risk.level}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={saveToVault}
                    disabled={saved}
                    className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saved ? (
                      <>
                        <FiCheckCircle className="w-5 h-5" />
                        Saved to Vault!
                      </>
                    ) : (
                      <>
                        <FiSave className="w-5 h-5" />
                        Save to Vault
                      </>
                    )}
                  </button>
                </div>

                {/* High Risk Conditions */}
                {assessment.highRiskConditions.length > 0 && (
                  <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FiAlertTriangle className="w-5 h-5 text-red-400" />
                      <h3 className="text-lg font-semibold">High Risk Conditions</h3>
                    </div>
                    <div className="space-y-3">
                      {assessment.highRiskConditions.map((condition, index) => (
                        <div key={index} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-red-300">{condition.condition}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              condition.riskLevel === 'very_high' ? 'bg-red-500/20 text-red-400' :
                              'bg-orange-500/20 text-orange-400'
                            }`}>
                              {condition.riskLevel.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">{condition.description}</p>
                          <div className="text-xs text-gray-400">
                            <strong>Factors:</strong> {condition.factors.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Screening Schedule */}
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiTarget className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold">Recommended Screening</h3>
                  </div>
                  <ul className="space-y-2">
                    {assessment.screeningSchedule.map((screening, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FiCheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{screening}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lifestyle Factors */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiUsers className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold">Lifestyle Recommendations</h3>
                  </div>
                  <ul className="space-y-2">
                    {assessment.lifestyleFactors.map((factor, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FiCheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* General Recommendations */}
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiInfo className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold">General Recommendations</h3>
                  </div>
                  <ul className="space-y-2">
                    {assessment.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FiCheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Link
                    href="/vault/blueprint"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition flex items-center justify-center gap-2"
                  >
                    <FiTrendingUp className="w-4 h-4" />
                    View in Blueprint
                  </Link>
                  <Link
                    href="/vault/tools"
                    className="flex-1 bg-gray-700 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition flex items-center justify-center gap-2"
                  >
                    Try Another Tool
                  </Link>
                </div>
              </>
            ) : (
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8 text-center">
                <FiActivity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Complete Assessment</h3>
                <p className="text-gray-400 text-sm">Enter your personal information and family history to calculate your genetic risk assessment and get personalized recommendations.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Component for adding family members
function FamilyHistoryForm({ onAddMember }: { onAddMember: (member: FamilyMember) => void }) {
  const [relation, setRelation] = useState<string>('');
  const [memberAge, setMemberAge] = useState<string>('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');

  const relations = [
    'Parent', 'Sibling', 'Child', 'Grandparent', 'Aunt', 'Uncle', 'Niece', 'Nephew', 'Cousin'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!relation || !memberAge) return;

    onAddMember({
      relation,
      age: parseInt(memberAge),
      conditions: selectedConditions,
      notes
    });

    // Reset form
    setRelation('');
    setMemberAge('');
    setSelectedConditions([]);
    setNotes('');
  };

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Relation</label>
          <select
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            required
          >
            <option value="">Select relation</option>
            {relations.map(rel => (
              <option key={rel} value={rel}>{rel}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Age at Diagnosis/Death</label>
          <input
            type="number"
            value={memberAge}
            onChange={(e) => setMemberAge(e.target.value)}
            placeholder="65"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Health Conditions</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {geneticConditions.map((condition) => (
            <button
              key={condition}
              type="button"
              onClick={() => toggleCondition(condition)}
              className={`p-2 rounded-lg text-sm transition ${
                selectedConditions.includes(condition)
                  ? 'bg-purple-500/20 border border-purple-500 text-purple-300'
                  : 'bg-gray-700/50 border border-gray-600 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {condition}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional details..."
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition"
      >
        Add Family Member
      </button>
    </form>
  );
}

// Helper function to get condition data
function getConditionData(condition: string, riskLevel: string) {
  const conditionData: Record<string, any> = {
    'Heart Disease': {
      description: 'Cardiovascular disease including heart attack and stroke',
      prevention: ['Regular exercise', 'Heart-healthy diet', 'Blood pressure management', 'Cholesterol control'],
      screening: ['Annual physical exam', 'Blood pressure checks', 'Cholesterol testing every 5 years', 'EKG if symptoms']
    },
    'Diabetes': {
      description: 'Type 2 diabetes and insulin resistance',
      prevention: ['Weight management', 'Regular exercise', 'Balanced diet', 'Blood sugar monitoring'],
      screening: ['Fasting blood glucose every 3 years', 'HbA1c testing', 'Oral glucose tolerance test if indicated']
    },
    'Cancer (General)': {
      description: 'Various types of cancer based on family patterns',
      prevention: ['Healthy lifestyle', 'Avoid tobacco', 'Limit alcohol', 'Sun protection'],
      screening: ['Age-appropriate cancer screenings', 'Regular physical exams', 'Genetic counseling if indicated']
    },
    'Breast Cancer': {
      description: 'Breast cancer risk assessment',
      prevention: ['Regular exercise', 'Healthy weight', 'Limit alcohol', 'Consider risk-reducing medications'],
      screening: ['Monthly self-exams', 'Clinical breast exam yearly', 'Mammogram starting at age 40', 'MRI if high risk']
    },
    'Colorectal Cancer': {
      description: 'Colon and rectal cancer screening',
      prevention: ['High-fiber diet', 'Regular exercise', 'Healthy weight', 'Limit red meat'],
      screening: ['Colonoscopy every 10 years from age 45', 'Stool tests annually', 'Flexible sigmoidoscopy']
    },
    'Prostate Cancer': {
      description: 'Prostate cancer risk assessment',
      prevention: ['Healthy diet', 'Regular exercise', 'Tomato-rich foods', 'Maintain healthy weight'],
      screening: ['PSA testing discussion from age 50', 'Digital rectal exam', 'Biopsy if indicated']
    },
    'Ovarian Cancer': {
      description: 'Ovarian cancer risk assessment',
      prevention: ['Oral contraceptives', 'Pregnancy and breastfeeding', 'Healthy lifestyle', 'Tubal ligation'],
      screening: ['Pelvic exams', 'CA-125 blood test', 'Transvaginal ultrasound', 'Genetic testing if high risk']
    },
    'Alzheimer\'s Disease': {
      description: 'Dementia and cognitive decline',
      prevention: ['Mental stimulation', 'Regular exercise', 'Heart-healthy diet', 'Social engagement'],
      screening: ['Cognitive assessments', 'Regular mental health checkups', 'Genetic testing if indicated']
    },
    'Parkinson\'s Disease': {
      description: 'Movement disorder affecting coordination',
      prevention: ['Regular exercise', 'Antioxidant-rich diet', 'Adequate sleep', 'Stress management'],
      screening: ['Neurological exams', 'Movement assessments', 'Genetic counseling if indicated']
    },
    'Osteoporosis': {
      description: 'Bone density loss and fracture risk',
      prevention: ['Calcium-rich diet', 'Vitamin D supplementation', 'Weight-bearing exercise', 'Avoid smoking'],
      screening: ['Bone density scan from age 65', 'Calcium and vitamin D levels', 'FRAX score assessment']
    },
    'Autoimmune Diseases': {
      description: 'Conditions where immune system attacks healthy cells',
      prevention: ['Anti-inflammatory diet', 'Stress management', 'Adequate sleep', 'Regular exercise'],
      screening: ['Autoimmune panel testing', 'Regular symptom monitoring', 'Thyroid function tests']
    },
    'Mental Health Disorders': {
      description: 'Depression, anxiety, and other mental health conditions',
      prevention: ['Regular exercise', 'Healthy diet', 'Adequate sleep', 'Stress management techniques'],
      screening: ['Mental health screenings', 'Regular therapy check-ins', 'Substance use assessment']
    }
  };

  return conditionData[condition] || {
    description: 'Genetic risk condition',
    prevention: ['Maintain healthy lifestyle', 'Regular medical checkups'],
    screening: ['Age-appropriate screenings', 'Regular health monitoring']
  };
}

// Helper functions for recommendations
function generateRecommendations(risks: GeneticRisk[], age: number): string[] {
  const recommendations = [];

  if (risks.some(r => r.riskLevel === 'high' || r.riskLevel === 'very_high')) {
    recommendations.push('Consider genetic counseling for comprehensive risk assessment');
    recommendations.push('Discuss advanced screening options with healthcare provider');
  }

  recommendations.push('Share family history information with all healthcare providers');
  recommendations.push('Maintain detailed personal health records');
  recommendations.push('Stay informed about new genetic testing options');

  return recommendations;
}

function generateScreeningSchedule(risks: GeneticRisk[], age: number, gender: string): string[] {
  const screenings = new Set<string>();

  // Age and gender-based screenings
  if (gender === 'female') {
    if (age >= 40) screenings.add('Annual mammogram');
    if (age >= 21) screenings.add('Annual gynecological exam');
    if (age >= 30) screenings.add('Pap smear every 3-5 years');
  }

  if (gender === 'male') {
    if (age >= 50) screenings.add('Prostate cancer screening discussion');
  }

  if (age >= 45) screenings.add('Colon cancer screening');
  if (age >= 50) screenings.add('Annual physical exam with comprehensive blood work');

  // Risk-based screenings
  risks.forEach(risk => {
    if (risk.riskLevel === 'high' || risk.riskLevel === 'very_high') {
      risk.screening.forEach(screening => screenings.add(screening));
    }
  });

  return Array.from(screenings);
}

function generateLifestyleFactors(risks: GeneticRisk[]): string[] {
  const factors = new Set<string>();

  factors.add('Maintain healthy BMI (18.5-24.9)');
  factors.add('Regular exercise (150 minutes/week moderate activity)');
  factors.add('Balanced diet rich in fruits, vegetables, and whole grains');
  factors.add('Limit alcohol consumption');
  factors.add('Avoid tobacco products');
  factors.add('Adequate sleep (7-9 hours/night)');
  factors.add('Stress management techniques');

  // Add condition-specific factors
  risks.forEach(risk => {
    if (risk.riskLevel === 'high' || risk.riskLevel === 'very_high') {
      risk.prevention.forEach(prev => factors.add(prev));
    }
  });

  return Array.from(factors);
}