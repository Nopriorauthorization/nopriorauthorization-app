"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiActivity,
  FiArrowLeft,
  FiSave,
  FiTrendingUp,
  FiTarget,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo
} from 'react-icons/fi';
import { Breadcrumb } from '@/components/ui/breadcrumb';

type BMIResult = {
  bmi: number;
  category: string;
  color: string;
  description: string;
  recommendations: string[];
  healthRisks: string[];
};

export default function BMICalculatorPage() {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [saved, setSaved] = useState(false);

  const calculateBMI = () => {
    if (!height || !weight) return;

    let bmi: number;
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (unit === 'metric') {
      // Height in cm, weight in kg
      bmi = w / Math.pow(h / 100, 2);
    } else {
      // Height in inches, weight in pounds
      bmi = (w / Math.pow(h, 2)) * 703;
    }

    let category: string;
    let color: string;
    let description: string;
    let recommendations: string[];
    let healthRisks: string[];

    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-blue-400';
      description = 'Your BMI indicates you may be underweight for your height.';
      recommendations = [
        'Focus on nutrient-dense foods',
        'Consider strength training to build muscle mass',
        'Consult with a healthcare provider for personalized advice'
      ];
      healthRisks = [
        'Nutrient deficiencies',
        'Weakened immune system',
        'Osteoporosis risk'
      ];
    } else if (bmi < 25) {
      category = 'Normal Weight';
      color = 'text-green-400';
      description = 'Your BMI is within the normal range for your height.';
      recommendations = [
        'Maintain current healthy habits',
        'Focus on balanced nutrition',
        'Regular physical activity'
      ];
      healthRisks = ['Generally low health risks'];
    } else if (bmi < 30) {
      category = 'Overweight';
      color = 'text-yellow-400';
      description = 'Your BMI indicates you may be overweight for your height.';
      recommendations = [
        'Gradual weight loss through diet and exercise',
        'Increase physical activity to 150 minutes/week',
        'Focus on whole foods and portion control'
      ];
      healthRisks = [
        'Increased risk of heart disease',
        'Type 2 diabetes risk',
        'Joint problems'
      ];
    } else {
      category = 'Obese';
      color = 'text-red-400';
      description = 'Your BMI indicates obesity. Consult healthcare providers for comprehensive care.';
      recommendations = [
        'Work with healthcare providers for weight management',
        'Consider comprehensive lifestyle changes',
        'Regular medical monitoring'
      ];
      healthRisks = [
        'High risk of heart disease',
        'Type 2 diabetes',
        'Certain cancers',
        'Sleep apnea'
      ];
    }

    setResult({
      bmi: Math.round(bmi * 10) / 10,
      category,
      color,
      description,
      recommendations,
      healthRisks
    });
  };

  const saveToVault = async () => {
    if (!result) return;

    try {
      // Save BMI result to vault
      const response = await fetch('/api/vault/tools/bmi-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bmi: result.bmi,
          category: result.category,
          height: parseFloat(height),
          weight: parseFloat(weight),
          unit,
          calculatedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving BMI result:', error);
    }
  };

  useEffect(() => {
    if (height && weight) {
      calculateBMI();
    } else {
      setResult(null);
    }
  }, [height, weight, unit]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumb className="mb-6" />
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/vault/tools"
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                BMI Calculator
              </h1>
              <p className="text-gray-400">Calculate your Body Mass Index and get personalized health insights</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <FiActivity className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">BMI Calculator</h2>
            </div>

            {/* Unit Toggle */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-800 rounded-lg">
              <button
                onClick={() => setUnit('metric')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                  unit === 'metric'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Metric (kg/cm)
              </button>
              <button
                onClick={() => setUnit('imperial')}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                  unit === 'imperial'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Imperial (lb/in)
              </button>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Height ({unit === 'metric' ? 'cm' : 'inches'})
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={unit === 'metric' ? '170' : '68'}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={unit === 'metric' ? '70' : '150'}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Save Button */}
            {result && (
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
            )}
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {result ? (
              <>
                {/* BMI Result */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8">
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold mb-2">
                      <span className={result.color}>{result.bmi}</span>
                    </div>
                    <div className={`text-2xl font-semibold mb-2 ${result.color}`}>
                      {result.category}
                    </div>
                    <p className="text-gray-300">{result.description}</p>
                  </div>

                  {/* BMI Scale Visualization */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">BMI Categories</h3>
                    <div className="space-y-2">
                      {[
                        { range: '< 18.5', label: 'Underweight', color: 'bg-blue-500' },
                        { range: '18.5 - 24.9', label: 'Normal', color: 'bg-green-500' },
                        { range: '25 - 29.9', label: 'Overweight', color: 'bg-yellow-500' },
                        { range: '≥ 30', label: 'Obese', color: 'bg-red-500' }
                      ].map((category, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded ${category.color} ${
                            result.category === category.label ? 'ring-2 ring-white' : ''
                          }`}></div>
                          <span className="text-sm text-gray-300 flex-1">{category.range}</span>
                          <span className="text-sm font-medium text-gray-400">{category.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiTarget className="w-5 h-5 text-blue-400" />
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

                {/* Health Risks */}
                <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiAlertTriangle className="w-5 h-5 text-red-400" />
                    <h3 className="text-lg font-semibold">Health Considerations</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.healthRisks.map((risk, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FiInfo className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{risk}</span>
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
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Enter Your Measurements</h3>
                <p className="text-gray-400">Fill in your height and weight to calculate your BMI and get personalized insights.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}