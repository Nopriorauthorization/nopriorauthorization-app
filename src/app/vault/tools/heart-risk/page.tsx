"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiHeart,
  FiArrowLeft,
  FiSave,
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiActivity
} from 'react-icons/fi';

type RiskFactor = {
  name: string;
  value: number;
  weight: number;
  description: string;
};

type HeartRiskResult = {
  score: number;
  riskLevel: string;
  color: string;
  description: string;
  recommendations: string[];
  riskFactors: RiskFactor[];
};

export default function HeartRiskPage() {
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [smoking, setSmoking] = useState<boolean>(false);
  const [diabetes, setDiabetes] = useState<boolean>(false);
  const [hypertension, setHypertension] = useState<boolean>(false);
  const [familyHistory, setFamilyHistory] = useState<boolean>(false);
  const [cholesterol, setCholesterol] = useState<string>('');
  const [hdl, setHdl] = useState<string>('');
  const [systolicBP, setSystolicBP] = useState<string>('');
  const [result, setResult] = useState<HeartRiskResult | null>(null);
  const [saved, setSaved] = useState(false);

  const calculateRisk = () => {
    if (!age) return;

    const ageNum = parseInt(age);
    let score = 0;

    // Age factor
    if (gender === 'male') {
      if (ageNum >= 45 && ageNum <= 54) score += 2;
      else if (ageNum >= 55 && ageNum <= 64) score += 3;
      else if (ageNum >= 65) score += 4;
    } else {
      if (ageNum >= 55 && ageNum <= 64) score += 2;
      else if (ageNum >= 65) score += 3;
    }

    // Smoking
    if (smoking) score += 2;

    // Diabetes
    if (diabetes) score += 2;

    // Hypertension
    if (hypertension) score += 1;

    // Family history
    if (familyHistory) score += 1;

    // Cholesterol factors
    const cholNum = parseFloat(cholesterol) || 0;
    const hdlNum = parseFloat(hdl) || 0;
    const bpNum = parseFloat(systolicBP) || 0;

    if (cholNum > 240) score += 1;
    if (hdlNum < 40) score += 1;
    if (bpNum >= 140) score += 1;

    let riskLevel: string;
    let color: string;
    let description: string;
    let recommendations: string[];

    if (score <= 1) {
      riskLevel = 'Low Risk';
      color = 'text-green-400';
      description = 'Your cardiovascular risk appears to be low. Continue healthy lifestyle habits.';
      recommendations = [
        'Maintain regular physical activity',
        'Follow a heart-healthy diet',
        'Regular health screenings',
        'Avoid smoking if applicable'
      ];
    } else if (score <= 3) {
      riskLevel = 'Moderate Risk';
      color = 'text-yellow-400';
      description = 'You have a moderate risk of cardiovascular disease. Lifestyle modifications may help reduce your risk.';
      recommendations = [
        'Increase physical activity to 150 minutes/week',
        'Adopt Mediterranean or DASH diet',
        'Weight management if needed',
        'Regular blood pressure monitoring',
        'Consider aspirin therapy with doctor consultation'
      ];
    } else {
      riskLevel = 'High Risk';
      color = 'text-red-400';
      description = 'You have an elevated risk of cardiovascular disease. Medical intervention may be necessary.';
      recommendations = [
        'Consult with cardiologist for comprehensive evaluation',
        'Consider cholesterol-lowering medications',
        'Blood pressure management',
        'Diabetes management if applicable',
        'Regular cardiac monitoring'
      ];
    }

    const riskFactors: RiskFactor[] = [
      { name: 'Age', value: ageNum, weight: gender === 'male' ? (ageNum >= 45 ? 2 : 0) : (ageNum >= 55 ? 2 : 0), description: 'Age is a major risk factor' },
      { name: 'Smoking', value: smoking ? 1 : 0, weight: 2, description: 'Smoking doubles heart disease risk' },
      { name: 'Diabetes', value: diabetes ? 1 : 0, weight: 2, description: 'Diabetes significantly increases risk' },
      { name: 'Hypertension', value: hypertension ? 1 : 0, weight: 1, description: 'High blood pressure damages arteries' },
      { name: 'Family History', value: familyHistory ? 1 : 0, weight: 1, description: 'Genetic predisposition' },
      { name: 'High Cholesterol', value: cholNum > 240 ? 1 : 0, weight: 1, description: 'Cholesterol > 240 mg/dL' },
      { name: 'Low HDL', value: hdlNum < 40 ? 1 : 0, weight: 1, description: 'HDL < 40 mg/dL' },
      { name: 'High Blood Pressure', value: bpNum >= 140 ? 1 : 0, weight: 1, description: 'Systolic BP ≥ 140 mmHg' }
    ];

    setResult({
      score,
      riskLevel,
      color,
      description,
      recommendations,
      riskFactors
    });
  };

  const saveToVault = async () => {
    if (!result) return;

    try {
      const response = await fetch('/api/vault/tools/heart-risk-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: result.score,
          riskLevel: result.riskLevel,
          factors: {
            age: parseInt(age),
            gender,
            smoking,
            diabetes,
            hypertension,
            familyHistory,
            cholesterol: parseFloat(cholesterol) || null,
            hdl: parseFloat(hdl) || null,
            systolicBP: parseFloat(systolicBP) || null
          },
          calculatedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving heart risk result:', error);
    }
  };

  useEffect(() => {
    calculateRisk();
  }, [age, gender, smoking, diabetes, hypertension, familyHistory, cholesterol, hdl, systolicBP]);

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
            <span className="text-gray-500">Heart Risk</span>
          </nav>
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/vault/tools"
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                Heart Risk Assessment
              </h1>
              <p className="text-gray-400">Evaluate your cardiovascular risk factors and get personalized recommendations</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assessment Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 text-white">
                <FiHeart className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Risk Assessment</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter your age"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setGender('male')}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                        gender === 'male'
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      onClick={() => setGender('female')}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                        gender === 'female'
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>
              </div>

              {/* Health Factors */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Cholesterol (mg/dL)</label>
                  <input
                    type="number"
                    value={cholesterol}
                    onChange={(e) => setCholesterol(e.target.value)}
                    placeholder="200"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">HDL Cholesterol (mg/dL)</label>
                  <input
                    type="number"
                    value={hdl}
                    onChange={(e) => setHdl(e.target.value)}
                    placeholder="50"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Systolic Blood Pressure (mmHg)</label>
                  <input
                    type="number"
                    value={systolicBP}
                    onChange={(e) => setSystolicBP(e.target.value)}
                    placeholder="120"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Risk Factors</h3>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition">
                  <input
                    type="checkbox"
                    checked={smoking}
                    onChange={(e) => setSmoking(e.target.checked)}
                    className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  />
                  <span className="text-sm">Current Smoker</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition">
                  <input
                    type="checkbox"
                    checked={diabetes}
                    onChange={(e) => setDiabetes(e.target.checked)}
                    className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  />
                  <span className="text-sm">Diabetes</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition">
                  <input
                    type="checkbox"
                    checked={hypertension}
                    onChange={(e) => setHypertension(e.target.checked)}
                    className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  />
                  <span className="text-sm">Hypertension</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition">
                  <input
                    type="checkbox"
                    checked={familyHistory}
                    onChange={(e) => setFamilyHistory(e.target.checked)}
                    className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  />
                  <span className="text-sm">Family History of Heart Disease</span>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {result ? (
              <>
                {/* Risk Score */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8">
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold mb-2">
                      <span className={result.color}>{result.score}</span>
                    </div>
                    <div className={`text-2xl font-semibold mb-2 ${result.color}`}>
                      {result.riskLevel}
                    </div>
                    <p className="text-gray-300 text-sm">{result.description}</p>
                  </div>

                  {/* Risk Scale */}
                  <div className="space-y-3">
                    {[
                      { level: 'Low Risk', range: '0-1', color: 'bg-green-500' },
                      { level: 'Moderate Risk', range: '2-3', color: 'bg-yellow-500' },
                      { level: 'High Risk', range: '4+', color: 'bg-red-500' }
                    ].map((risk, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${risk.color} ${
                          result.riskLevel === risk.level ? 'ring-2 ring-white' : ''
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

                {/* Recommendations */}
                <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiAlertTriangle className="w-5 h-5 text-red-400" />
                    <h3 className="text-lg font-semibold">Recommendations</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FiCheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risk Factors Breakdown */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiActivity className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold">Risk Factors</h3>
                  </div>
                  <div className="space-y-3">
                    {result.riskFactors.filter(factor => factor.value > 0).map((factor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-gray-300">{factor.name}</span>
                          <p className="text-xs text-gray-400">{factor.description}</p>
                        </div>
                        <span className="text-red-400 font-semibold">+{factor.weight}</span>
                      </div>
                    ))}
                  </div>
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
                <FiHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Complete Assessment</h3>
                <p className="text-gray-400 text-sm">Fill in your information to calculate your cardiovascular risk score and get personalized recommendations.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}