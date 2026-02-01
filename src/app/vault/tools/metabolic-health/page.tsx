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
  FiTarget
} from 'react-icons/fi';

type MetabolicMarker = {
  name: string;
  value: number;
  unit: string;
  optimal: { min: number; max: number };
  score: number;
  description: string;
};

type MetabolicResult = {
  score: number;
  healthLevel: string;
  color: string;
  description: string;
  recommendations: string[];
  markers: MetabolicMarker[];
  riskFactors: string[];
};

export default function MetabolicHealthPage() {
  const [fastingGlucose, setFastingGlucose] = useState<string>('');
  const [insulin, setInsulin] = useState<string>('');
  const [homaIR, setHomaIR] = useState<string>('');
  const [triglycerides, setTriglycerides] = useState<string>('');
  const [hdl, setHdl] = useState<string>('');
  const [waistCircumference, setWaistCircumference] = useState<string>('');
  const [bloodPressure, setBloodPressure] = useState<string>('');
  const [result, setResult] = useState<MetabolicResult | null>(null);
  const [saved, setSaved] = useState(false);

  const calculateMetabolicScore = () => {
    const markers: MetabolicMarker[] = [];

    // Fasting Glucose (mg/dL)
    const glucose = parseFloat(fastingGlucose);
    if (!isNaN(glucose)) {
      let score = 0;
      if (glucose < 100) score = 10;
      else if (glucose < 126) score = 7;
      else if (glucose < 140) score = 4;
      else score = 1;

      markers.push({
        name: 'Fasting Glucose',
        value: glucose,
        unit: 'mg/dL',
        optimal: { min: 70, max: 99 },
        score,
        description: 'Blood sugar levels after overnight fast'
      });
    }

    // Insulin (µIU/mL)
    const insulinVal = parseFloat(insulin);
    if (!isNaN(insulinVal)) {
      let score = 0;
      if (insulinVal < 5) score = 10;
      else if (insulinVal < 10) score = 7;
      else if (insulinVal < 15) score = 4;
      else score = 1;

      markers.push({
        name: 'Fasting Insulin',
        value: insulinVal,
        unit: 'µIU/mL',
        optimal: { min: 2, max: 8 },
        score,
        description: 'Insulin resistance marker'
      });
    }

    // HOMA-IR
    const homa = parseFloat(homaIR);
    if (!isNaN(homa)) {
      let score = 0;
      if (homa < 1.0) score = 10;
      else if (homa < 1.9) score = 7;
      else if (homa < 2.9) score = 4;
      else score = 1;

      markers.push({
        name: 'HOMA-IR',
        value: homa,
        unit: '',
        optimal: { min: 0, max: 1.9 },
        score,
        description: 'Insulin resistance index'
      });
    }

    // Triglycerides (mg/dL)
    const trig = parseFloat(triglycerides);
    if (!isNaN(trig)) {
      let score = 0;
      if (trig < 100) score = 10;
      else if (trig < 150) score = 7;
      else if (trig < 200) score = 4;
      else score = 1;

      markers.push({
        name: 'Triglycerides',
        value: trig,
        unit: 'mg/dL',
        optimal: { min: 0, max: 149 },
        score,
        description: 'Blood fat levels'
      });
    }

    // HDL Cholesterol (mg/dL)
    const hdlVal = parseFloat(hdl);
    if (!isNaN(hdlVal)) {
      let score = 0;
      if (hdlVal >= 60) score = 10;
      else if (hdlVal >= 50) score = 7;
      else if (hdlVal >= 40) score = 4;
      else score = 1;

      markers.push({
        name: 'HDL Cholesterol',
        value: hdlVal,
        unit: 'mg/dL',
        optimal: { min: 60, max: 100 },
        score,
        description: 'Good cholesterol levels'
      });
    }

    // Waist Circumference (inches)
    const waist = parseFloat(waistCircumference);
    if (!isNaN(waist)) {
      let score = 0;
      if (waist < 35) score = 10;
      else if (waist < 40) score = 7;
      else if (waist < 45) score = 4;
      else score = 1;

      markers.push({
        name: 'Waist Circumference',
        value: waist,
        unit: 'inches',
        optimal: { min: 0, max: 35 },
        score,
        description: 'Central obesity measure'
      });
    }

    // Blood Pressure (systolic)
    const bp = parseFloat(bloodPressure);
    if (!isNaN(bp)) {
      let score = 0;
      if (bp < 120) score = 10;
      else if (bp < 130) score = 7;
      else if (bp < 140) score = 4;
      else score = 1;

      markers.push({
        name: 'Systolic BP',
        value: bp,
        unit: 'mmHg',
        optimal: { min: 0, max: 119 },
        score,
        description: 'Blood pressure reading'
      });
    }

    if (markers.length === 0) return;

    const totalScore = markers.reduce((sum, marker) => sum + marker.score, 0);
    const averageScore = totalScore / markers.length;

    let healthLevel: string;
    let color: string;
    let description: string;
    let recommendations: string[];

    if (averageScore >= 9) {
      healthLevel = 'Excellent';
      color = 'text-green-400';
      description = 'Your metabolic health markers are in excellent range. Continue your healthy lifestyle habits.';
      recommendations = [
        'Maintain current healthy diet and exercise routine',
        'Continue regular health screenings',
        'Monitor markers annually',
        'Share success with others'
      ];
    } else if (averageScore >= 7) {
      healthLevel = 'Good';
      color = 'text-blue-400';
      description = 'Your metabolic health is generally good, but there are areas for improvement.';
      recommendations = [
        'Focus on improving weaker markers',
        'Increase physical activity',
        'Optimize nutrition timing',
        'Consider advanced testing'
      ];
    } else if (averageScore >= 5) {
      healthLevel = 'Fair';
      color = 'text-yellow-400';
      description = 'Your metabolic health needs attention. Several markers are outside optimal ranges.';
      recommendations = [
        'Consult healthcare provider for comprehensive evaluation',
        'Implement dietary changes',
        'Start regular exercise program',
        'Monitor progress monthly'
      ];
    } else {
      healthLevel = 'Poor';
      color = 'text-red-400';
      description = 'Your metabolic health markers indicate significant concerns. Medical intervention may be necessary.';
      recommendations = [
        'Schedule appointment with endocrinologist',
        'Consider medication management',
        'Implement strict lifestyle changes',
        'Regular monitoring and follow-up'
      ];
    }

    const riskFactors = markers
      .filter(marker => marker.score <= 4)
      .map(marker => `${marker.name}: ${marker.value}${marker.unit} (${marker.score}/10)`);

    setResult({
      score: Math.round(averageScore * 10),
      healthLevel,
      color,
      description,
      recommendations,
      markers,
      riskFactors
    });
  };

  const saveToVault = async () => {
    if (!result) return;

    try {
      const response = await fetch('/api/vault/tools/metabolic-health-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: result.score,
          healthLevel: result.healthLevel,
          markers: result.markers.map(m => ({
            name: m.name,
            value: m.value,
            unit: m.unit,
            score: m.score
          })),
          calculatedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving metabolic health result:', error);
    }
  };

  useEffect(() => {
    calculateMetabolicScore();
  }, [fastingGlucose, insulin, homaIR, triglycerides, hdl, waistCircumference, bloodPressure]);

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
            <span className="text-gray-500">Metabolic Health</span>
          </nav>
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/vault/tools"
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Metabolic Health Score
              </h1>
              <p className="text-gray-400">Assess your metabolic health using key biomarkers and get personalized insights</p>
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <FiActivity className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Metabolic Markers</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Glucose & Insulin */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fasting Glucose (mg/dL)
                    <span className="text-xs text-gray-400 ml-2">Optimal: 70-99</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={fastingGlucose}
                    onChange={(e) => setFastingGlucose(e.target.value)}
                    placeholder="85"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fasting Insulin (µIU/mL)
                    <span className="text-xs text-gray-400 ml-2">Optimal: 2-8</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={insulin}
                    onChange={(e) => setInsulin(e.target.value)}
                    placeholder="5.2"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    HOMA-IR
                    <span className="text-xs text-gray-400 ml-2">Optimal: &lt;1.9</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={homaIR}
                    onChange={(e) => setHomaIR(e.target.value)}
                    placeholder="0.8"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Lipids & Measurements */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Triglycerides (mg/dL)
                    <span className="text-xs text-gray-400 ml-2">Optimal: &lt;150</span>
                  </label>
                  <input
                    type="number"
                    value={triglycerides}
                    onChange={(e) => setTriglycerides(e.target.value)}
                    placeholder="120"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    HDL Cholesterol (mg/dL)
                    <span className="text-xs text-gray-400 ml-2">Optimal: ≥60</span>
                  </label>
                  <input
                    type="number"
                    value={hdl}
                    onChange={(e) => setHdl(e.target.value)}
                    placeholder="65"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Waist Circumference (inches)
                    <span className="text-xs text-gray-400 ml-2">Optimal: &lt;35</span>
                  </label>
                  <input
                    type="number"
                    value={waistCircumference}
                    onChange={(e) => setWaistCircumference(e.target.value)}
                    placeholder="32"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Systolic Blood Pressure (mmHg)
                    <span className="text-xs text-gray-400 ml-2">Optimal: &lt;120</span>
                  </label>
                  <input
                    type="number"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    placeholder="115"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <FiInfo className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-400 mb-1">About Metabolic Health</h4>
                  <p className="text-sm text-gray-300">
                    Metabolic health is determined by multiple biomarkers. Enter your lab values above to get a comprehensive assessment.
                    If you don't have all values, enter what you have available.
                  </p>
                </div>
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
                {/* Health Score */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8">
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold mb-2">
                      <span className={result.color}>{result.score}</span>
                    </div>
                    <div className={`text-2xl font-semibold mb-2 ${result.color}`}>
                      {result.healthLevel}
                    </div>
                    <p className="text-gray-300 text-sm">{result.description}</p>
                  </div>

                  {/* Score Scale */}
                  <div className="space-y-3">
                    {[
                      { level: 'Excellent', range: '90-100', color: 'bg-green-500' },
                      { level: 'Good', range: '70-89', color: 'bg-blue-500' },
                      { level: 'Fair', range: '50-69', color: 'bg-yellow-500' },
                      { level: 'Poor', range: '0-49', color: 'bg-red-500' }
                    ].map((health, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${health.color} ${
                          result.healthLevel === health.level ? 'ring-2 ring-white' : ''
                        }`}></div>
                        <span className="text-sm text-gray-300 flex-1">{health.range} points</span>
                        <span className="text-sm font-medium text-gray-400">{health.level}</span>
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

                {/* Marker Breakdown */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiActivity className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-semibold">Marker Analysis</h3>
                  </div>
                  <div className="space-y-3">
                    {result.markers.map((marker, index) => (
                      <div key={index} className="p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">{marker.name}</span>
                          <span className={`text-sm font-semibold ${
                            marker.score >= 7 ? 'text-green-400' :
                            marker.score >= 5 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {marker.score}/10
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{marker.value}{marker.unit}</span>
                          <span>Optimal: {marker.optimal.min}-{marker.optimal.max}{marker.unit}</span>
                        </div>
                        <div className="mt-2 bg-gray-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              marker.score >= 7 ? 'bg-green-500' :
                              marker.score >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(marker.score / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                {result.riskFactors.length > 0 && (
                  <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FiAlertTriangle className="w-5 h-5 text-red-400" />
                      <h3 className="text-lg font-semibold">Areas of Concern</h3>
                    </div>
                    <ul className="space-y-2">
                      {result.riskFactors.map((factor, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></span>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

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
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Enter Your Markers</h3>
                <p className="text-gray-400 text-sm">Input your metabolic health biomarkers to calculate your comprehensive metabolic health score and get personalized recommendations.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}