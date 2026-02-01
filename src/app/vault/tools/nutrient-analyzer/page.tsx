"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiZap,
  FiArrowLeft,
  FiSave,
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiTarget
} from 'react-icons/fi';

type NutrientMarker = {
  name: string;
  value: number;
  unit: string;
  optimal: { min: number; max: number };
  status: 'deficient' | 'low' | 'optimal' | 'high';
  severity: number; // 0-10 scale
  description: string;
  symptoms: string[];
  foodSources: string[];
  supplements: string[];
};

type DeficiencyAnalysis = {
  overallScore: number;
  riskLevel: string;
  color: string;
  summary: string;
  criticalDeficiencies: NutrientMarker[];
  recommendations: string[];
  dietarySuggestions: string[];
  supplementRecommendations: string[];
};

const nutrientRanges = {
  vitaminD: { min: 30, max: 100, unit: 'ng/mL' },
  vitaminB12: { min: 200, max: 900, unit: 'pg/mL' },
  iron: { min: 30, max: 150, unit: 'µg/dL' },
  ferritin: { min: 30, max: 300, unit: 'ng/mL' },
  folate: { min: 4, max: 20, unit: 'ng/mL' },
  vitaminC: { min: 0.6, max: 2.0, unit: 'mg/dL' },
  magnesium: { min: 1.7, max: 2.3, unit: 'mg/dL' },
  zinc: { min: 60, max: 120, unit: 'µg/dL' },
  copper: { min: 70, max: 140, unit: 'µg/dL' },
  selenium: { min: 60, max: 120, unit: 'ng/mL' }
};

export default function NutrientAnalyzerPage() {
  const [markers, setMarkers] = useState<Record<string, string>>({});
  const [analysis, setAnalysis] = useState<DeficiencyAnalysis | null>(null);
  const [saved, setSaved] = useState(false);

  const analyzeNutrients = () => {
    const nutrientMarkers: NutrientMarker[] = [];
    let totalScore = 0;
    let markerCount = 0;

    Object.entries(nutrientRanges).forEach(([nutrient, range]) => {
      const value = parseFloat(markers[nutrient] || '');
      if (isNaN(value)) return;

      markerCount++;
      let status: 'deficient' | 'low' | 'optimal' | 'high';
      let severity = 0;

      if (value < range.min) {
        if (value < range.min * 0.5) {
          status = 'deficient';
          severity = 10;
        } else {
          status = 'low';
          severity = 6;
        }
      } else if (value > range.max) {
        status = 'high';
        severity = 4;
      } else {
        status = 'optimal';
        severity = 0;
      }

      totalScore += severity;

      const nutrientData = getNutrientData(nutrient, status);
      nutrientMarkers.push({
        name: nutrientData.name,
        value,
        unit: range.unit,
        optimal: { min: range.min, max: range.max },
        status,
        severity,
        description: nutrientData.description,
        symptoms: nutrientData.symptoms,
        foodSources: nutrientData.foodSources,
        supplements: nutrientData.supplements
      });
    });

    if (markerCount === 0) return;

    const averageSeverity = totalScore / markerCount;
    const overallScore = Math.max(0, 100 - (averageSeverity * 10));

    let riskLevel: string;
    let color: string;
    let summary: string;

    if (overallScore >= 90) {
      riskLevel = 'Excellent';
      color = 'text-green-400';
      summary = 'Your nutrient levels are excellent. Continue your current healthy diet and lifestyle.';
    } else if (overallScore >= 75) {
      riskLevel = 'Good';
      color = 'text-blue-400';
      summary = 'Your nutrient levels are generally good, but some optimization may be beneficial.';
    } else if (overallScore >= 60) {
      riskLevel = 'Fair';
      color = 'text-yellow-400';
      summary = 'You have some nutrient deficiencies that should be addressed through diet and possibly supplementation.';
    } else {
      riskLevel = 'Poor';
      color = 'text-red-400';
      summary = 'You have significant nutrient deficiencies that require immediate attention. Consult a healthcare provider.';
    }

    const criticalDeficiencies = nutrientMarkers.filter(m => m.status === 'deficient' || m.severity >= 8);
    const recommendations = generateRecommendations(nutrientMarkers);
    const dietarySuggestions = generateDietarySuggestions(nutrientMarkers);
    const supplementRecommendations = generateSupplementRecommendations(nutrientMarkers);

    setAnalysis({
      overallScore: Math.round(overallScore),
      riskLevel,
      color,
      summary,
      criticalDeficiencies,
      recommendations,
      dietarySuggestions,
      supplementRecommendations
    });
  };

  const saveToVault = async () => {
    if (!analysis) return;

    try {
      const response = await fetch('/api/vault/tools/nutrient-analyzer-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          overallScore: analysis.overallScore,
          riskLevel: analysis.riskLevel,
          markers: Object.entries(markers).map(([key, value]) => ({
            nutrient: key,
            value: parseFloat(value),
            unit: nutrientRanges[key as keyof typeof nutrientRanges].unit
          })),
          criticalDeficiencies: analysis.criticalDeficiencies.map(d => d.name),
          calculatedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving nutrient analysis result:', error);
    }
  };

  useEffect(() => {
    analyzeNutrients();
  }, [markers]);

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
            <span className="text-gray-500">Nutrient Analyzer</span>
          </nav>
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/vault/tools"
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Nutrient Deficiency Analyzer
              </h1>
              <p className="text-gray-400">Analyze your lab results for nutrient deficiencies and get personalized dietary recommendations</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lab Results Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <FiZap className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Lab Results</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(nutrientRanges).map(([nutrient, range]) => {
                const nutrientData = getNutrientData(nutrient, 'optimal');
                return (
                  <div key={nutrient} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      {nutrientData.name}
                      <span className="text-xs text-gray-400 ml-2">
                        Optimal: {range.min}-{range.max} {range.unit}
                      </span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={markers[nutrient] || ''}
                      onChange={(e) => setMarkers(prev => ({ ...prev, [nutrient]: e.target.value }))}
                      placeholder={`Enter ${nutrientData.name.toLowerCase()} level`}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <FiInfo className="w-5 h-5 text-orange-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-400 mb-1">About Lab Values</h4>
                  <p className="text-sm text-gray-300">
                    Enter your recent lab results above. Reference ranges may vary by lab, but we've provided typical optimal ranges.
                    If you don't have all values, enter what you have available for analysis.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {analysis ? (
              <>
                {/* Overall Score */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8">
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold mb-2">
                      <span className={analysis.color}>{analysis.overallScore}</span>
                    </div>
                    <div className={`text-2xl font-semibold mb-2 ${analysis.color}`}>
                      {analysis.riskLevel}
                    </div>
                    <p className="text-gray-300 text-sm">{analysis.summary}</p>
                  </div>

                  {/* Score Scale */}
                  <div className="space-y-3">
                    {[
                      { level: 'Excellent', range: '90-100', color: 'bg-green-500' },
                      { level: 'Good', range: '75-89', color: 'bg-blue-500' },
                      { level: 'Fair', range: '60-74', color: 'bg-yellow-500' },
                      { level: 'Poor', range: '0-59', color: 'bg-red-500' }
                    ].map((level, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${level.color} ${
                          analysis.riskLevel === level.level ? 'ring-2 ring-white' : ''
                        }`}></div>
                        <span className="text-sm text-gray-300 flex-1">{level.range} points</span>
                        <span className="text-sm font-medium text-gray-400">{level.level}</span>
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

                {/* Critical Deficiencies */}
                {analysis.criticalDeficiencies.length > 0 && (
                  <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FiAlertTriangle className="w-5 h-5 text-red-400" />
                      <h3 className="text-lg font-semibold">Critical Deficiencies</h3>
                    </div>
                    <div className="space-y-3">
                      {analysis.criticalDeficiencies.map((def, index) => (
                        <div key={index} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-red-300">{def.name}</span>
                            <span className="text-red-400 font-semibold">
                              {def.value}{def.unit} ({def.status})
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">{def.description}</p>
                          <div className="text-xs text-gray-400">
                            <strong>Symptoms:</strong> {def.symptoms.slice(0, 3).join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dietary Suggestions */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiTarget className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold">Dietary Suggestions</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysis.dietarySuggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FiCheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Supplement Recommendations */}
                {analysis.supplementRecommendations.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FiTarget className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold">Supplement Recommendations</h3>
                    </div>
                    <ul className="space-y-2">
                      {analysis.supplementRecommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <FiCheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-300">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* General Recommendations */}
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiInfo className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold">General Recommendations</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
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
                <FiZap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Enter Lab Results</h3>
                <p className="text-gray-400 text-sm">Input your nutrient lab values to get a comprehensive deficiency analysis and personalized dietary recommendations.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get nutrient data
function getNutrientData(nutrient: string, status: string) {
  const nutrientData: Record<string, any> = {
    vitaminD: {
      name: 'Vitamin D',
      description: 'Essential for bone health, immune function, and calcium absorption',
      symptoms: ['Fatigue', 'Muscle weakness', 'Bone pain', 'Increased infection risk'],
      foodSources: ['Fatty fish', 'Egg yolks', 'Fortified milk', 'Sun exposure'],
      supplements: ['Vitamin D3 1000-2000 IU daily']
    },
    vitaminB12: {
      name: 'Vitamin B12',
      description: 'Important for red blood cell formation and neurological function',
      symptoms: ['Fatigue', 'Weakness', 'Tingling', 'Memory problems'],
      foodSources: ['Meat', 'Fish', 'Eggs', 'Dairy products'],
      supplements: ['Vitamin B12 1000 mcg daily']
    },
    iron: {
      name: 'Iron',
      description: 'Critical for oxygen transport and energy production',
      symptoms: ['Fatigue', 'Weakness', 'Pale skin', 'Shortness of breath'],
      foodSources: ['Red meat', 'Spinach', 'Lentils', 'Quinoa'],
      supplements: ['Iron bisglycinate 18-65 mg daily']
    },
    ferritin: {
      name: 'Ferritin',
      description: 'Storage form of iron, indicates iron reserves',
      symptoms: ['Fatigue', 'Hair loss', 'Weakness', 'Brittle nails'],
      foodSources: ['Red meat', 'Liver', 'Beans', 'Nuts'],
      supplements: ['Iron supplements if deficient']
    },
    folate: {
      name: 'Folate',
      description: 'Essential for DNA synthesis and cell division',
      symptoms: ['Fatigue', 'Weakness', 'Mouth sores', 'Neural tube defects risk'],
      foodSources: ['Leafy greens', 'Citrus fruits', 'Beans', 'Avocado'],
      supplements: ['Folic acid 400-800 mcg daily']
    },
    vitaminC: {
      name: 'Vitamin C',
      description: 'Powerful antioxidant and immune system support',
      symptoms: ['Frequent colds', 'Slow wound healing', 'Bleeding gums', 'Fatigue'],
      foodSources: ['Citrus fruits', 'Bell peppers', 'Strawberries', 'Broccoli'],
      supplements: ['Vitamin C 500-1000 mg daily']
    },
    magnesium: {
      name: 'Magnesium',
      description: 'Involved in hundreds of biochemical reactions',
      symptoms: ['Muscle cramps', 'Fatigue', 'Insomnia', 'Anxiety'],
      foodSources: ['Nuts', 'Seeds', 'Leafy greens', 'Whole grains'],
      supplements: ['Magnesium glycinate 200-400 mg daily']
    },
    zinc: {
      name: 'Zinc',
      description: 'Essential for immune function and wound healing',
      symptoms: ['Frequent infections', 'Slow wound healing', 'Hair loss', 'Loss of taste'],
      foodSources: ['Oysters', 'Beef', 'Pumpkin seeds', 'Chickpeas'],
      supplements: ['Zinc picolinate 15-30 mg daily']
    },
    copper: {
      name: 'Copper',
      description: 'Important for connective tissue and energy production',
      symptoms: ['Fatigue', 'Weakness', 'Anemia', 'Osteoporosis'],
      foodSources: ['Shellfish', 'Nuts', 'Seeds', 'Organ meats'],
      supplements: ['Copper bisglycinate 1-2 mg daily']
    },
    selenium: {
      name: 'Selenium',
      description: 'Antioxidant mineral important for thyroid function',
      symptoms: ['Fatigue', 'Muscle weakness', 'Hair loss', 'Thyroid issues'],
      foodSources: ['Brazil nuts', 'Seafood', 'Meat', 'Eggs'],
      supplements: ['Selenium 100-200 mcg daily']
    }
  };

  return nutrientData[nutrient] || { name: nutrient, description: '', symptoms: [], foodSources: [], supplements: [] };
}

// Helper functions for recommendations
function generateRecommendations(markers: NutrientMarker[]): string[] {
  const recommendations = [];
  const deficientCount = markers.filter(m => m.status === 'deficient').length;

  if (deficientCount > 0) {
    recommendations.push('Consult healthcare provider for severe deficiencies');
    recommendations.push('Consider comprehensive nutrient testing');
  }

  recommendations.push('Focus on whole foods over supplements when possible');
  recommendations.push('Maintain consistent meal timing and quality');
  recommendations.push('Stay hydrated and manage stress levels');

  return recommendations;
}

function generateDietarySuggestions(markers: NutrientMarker[]): string[] {
  const suggestions = new Set<string>();

  markers.forEach(marker => {
    if (marker.status === 'deficient' || marker.status === 'low') {
      marker.foodSources.slice(0, 2).forEach(food => {
        suggestions.add(`Include more ${food.toLowerCase()} in your diet`);
      });
    }
  });

  if (suggestions.size === 0) {
    suggestions.add('Continue eating a balanced diet with variety');
    suggestions.add('Include colorful fruits and vegetables daily');
    suggestions.add('Choose grass-fed and organic sources when possible');
  }

  return Array.from(suggestions);
}

function generateSupplementRecommendations(markers: NutrientMarker[]): string[] {
  const recommendations = [];

  markers.forEach(marker => {
    if (marker.status === 'deficient') {
      recommendations.push(...marker.supplements);
    }
  });

  if (recommendations.length === 0) {
    recommendations.push('No specific supplements needed at this time');
  } else {
    recommendations.unshift('Consult healthcare provider before starting supplements');
  }

  return recommendations;
}