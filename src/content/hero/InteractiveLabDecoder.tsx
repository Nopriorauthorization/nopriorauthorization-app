"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUpload,
  FiFileText,
  FiMessageSquare,
  FiSave,
  FiSearch,
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiX,
  FiDownload,
  FiShare2,
  FiUser,
  FiUsers,
  FiZap,
  FiTarget,
  FiCalendar,
  FiChevronRight,
  FiPlus,
  FiMinus,
  FiActivity,
  FiHeart,
  FiCpu,
  FiDroplet,
  FiThermometer,
  FiBarChart3,
  FiTrendingDown,
  FiTrendingUp as FiTrendingUpIcon,
  FiShield,
  FiAlertCircle,
  FiInfo,
  FiArrowUp,
  FiArrowDown,
  FiMinus as FiNeutral
} from 'react-icons/fi';
import Image from 'next/image';

// Enhanced types for comprehensive lab analysis
type LabValue = {
  name: string;
  value: number;
  unit: string;
  referenceRange: { min: number; max: number; optimal?: { min: number; max: number } };
  status: 'low' | 'normal' | 'high' | 'critical' | 'optimal';
  trend?: 'improving' | 'worsening' | 'stable';
  previousValue?: number;
};

type DocumentType = 'lab-results' | 'imaging' | 'prescription' | 'discharge-summary' | 'consultation-notes' | 'other';

type DecodedResult = {
  id: string;
  labValues: LabValue[];
  overallAssessment: {
    riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    summary: string;
    keyConcerns: string[];
    immediateActions: string[];
  };
  familyPredictions: {
    geneticRisk: number; // 0-100
    predictedConditions: Array<{
      condition: string;
      likelihood: number;
      timeframe: string;
      prevention: string[];
    }>;
    familyPatterns: string[];
  };
  clinicalInsights: {
    whatThisMeans: string;
    whyItMatters: string;
    comparisonToNormal: string;
    lifestyleImpact: string;
  };
  personalizedRecommendations: {
    immediate: string[];
    lifestyle: string[];
    monitoring: string[];
    specialist: string[];
  };
  followUpQuestions: string[];
  relatedConditions: string[];
  timestamp: string;
  confidence: number;
};

type ConversationMessage = {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  relatedResults?: string[];
  suggestions?: string[];
  labInsights?: LabValue[];
};

type SavedInsight = {
  id: string;
  title: string;
  content: string;
  category: 'lab-result' | 'health-pattern' | 'recommendation' | 'risk-factor' | 'family-prediction';
  savedTo: 'blueprint' | 'family-tree' | 'both';
  familyMember?: string;
  timestamp: string;
  tags: string[];
  labValues?: LabValue[];
};

export default function InteractiveLabDecoder() {
  const [activeTab, setActiveTab] = useState<'upload' | 'decode' | 'chat' | 'save'>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [decodedResults, setDecodedResults] = useState<DecodedResult[]>([]);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [savedInsights, setSavedInsights] = useState<SavedInsight[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedResult, setSelectedResult] = useState<DecodedResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Enhanced sample data with comprehensive lab analysis and family predictions
  const sampleResults: DecodedResult[] = [
    {
      id: '1',
      labValues: [
        {
          name: 'Hemoglobin A1c',
          value: 7.2,
          unit: '%',
          referenceRange: { min: 4.0, max: 5.6, optimal: { min: 4.5, max: 5.0 } },
          status: 'high',
          trend: 'worsening',
          previousValue: 6.8
        },
        {
          name: 'Fasting Glucose',
          value: 128,
          unit: 'mg/dL',
          referenceRange: { min: 70, max: 99, optimal: { min: 80, max: 90 } },
          status: 'high',
          trend: 'stable',
          previousValue: 125
        },
        {
          name: 'Insulin',
          value: 18,
          unit: 'µIU/mL',
          referenceRange: { min: 2.6, max: 24.9, optimal: { min: 5, max: 15 } },
          status: 'normal',
          trend: 'stable'
        }
      ],
      originalText: 'Hemoglobin A1c: 7.2% (Reference: <5.7%), Fasting Glucose: 128 mg/dL (Reference: 70-99 mg/dL)',
      decodedMeaning: 'Your blood sugar control shows prediabetes with elevated average glucose levels over the past 2-3 months.',
      confidence: 95,
      category: 'Diabetes Risk Assessment',
      severity: 'high',
      clinicalContext: 'HbA1c of 7.2% means your average blood sugar is ~161-182 mg/dL. This indicates insulin resistance where your body needs extra insulin to manage blood sugar.',
      familyRelevance: 'Diabetes has strong genetic component. If parents/siblings have diabetes, your risk is 3-5x higher. Family patterns suggest possible MODY gene variants.',
      recommendations: [
        'Immediate: Schedule endocrinologist appointment within 1 week',
        'Diet: Reduce carbs to 100-150g/day, focus on vegetables and lean proteins',
        'Exercise: 30 minutes daily walking can reduce HbA1c by 0.5-1.0%',
        'Monitoring: Daily fasting glucose + 2-hour post-meal checks',
        'Medication: Consider metformin if lifestyle changes insufficient'
      ],
      summary: 'Prediabetes requiring urgent intervention. 70% of prediabetics develop diabetes within 10 years without changes.',
      keyConcerns: [
        'Progression to Type 2 Diabetes within 3-5 years',
        'Increased cardiovascular risk (2x higher heart attack risk)',
        'Kidney damage risk with sustained high glucose',
        'Neuropathy and vision problems if uncontrolled'
      ],
      immediateActions: [
        'Get HbA1c rechecked in 3 months to monitor progress',
        'Start daily blood sugar monitoring',
        'Calculate and track daily carbohydrate intake',
        'Schedule comprehensive eye exam for diabetic retinopathy screening'
      ],
      familyPredictions: {
        geneticRisk: 75,
        predictedConditions: [
          {
            condition: 'Type 2 Diabetes',
            likelihood: 70,
            timeframe: '3-5 years',
            prevention: ['Weight loss of 5-10%', 'Regular exercise', 'Low-carb diet', 'Metformin if needed']
          },
          {
            condition: 'Cardiovascular Disease',
            likelihood: 45,
            timeframe: '5-10 years',
            prevention: ['Statin therapy', 'Mediterranean diet', 'Regular exercise', 'Blood pressure control']
          },
          {
            condition: 'Metabolic Syndrome',
            likelihood: 80,
            timeframe: 'Current/Present',
            prevention: ['Weight management', 'Exercise', 'Dietary changes', 'Regular monitoring']
          }
        ],
        familyPatterns: [
          'Strong family history of diabetes increases your risk by 3x',
          'Cardiovascular disease in maternal line suggests genetic predisposition',
          'Similar metabolic patterns seen in siblings indicate shared genetic factors'
        ]
      },
      clinicalInsights: {
        whatThisMeans: 'Your HbA1c of 7.2% means your average blood sugar over the past 2-3 months has been 161-182 mg/dL, which is in the prediabetes range. This is NOT normal and requires immediate attention.',
        whyItMatters: 'Every 1% increase in HbA1c above 6% doubles your risk of heart disease and triples your risk of kidney damage. Early intervention can prevent progression to full diabetes.',
        comparisonToNormal: 'A normal HbA1c is below 5.7%. Your 7.2% means you\'re producing too much insulin to keep blood sugar in check, leading to insulin resistance.',
        lifestyleImpact: 'This pattern typically results from poor diet (high carbs/sugars), lack of exercise, stress, and inadequate sleep. Small changes in all these areas can reverse this completely.'
      },
      personalizedRecommendations: {
        immediate: [
          'Get HbA1c rechecked in 3 months to monitor progress',
          'Start daily blood sugar monitoring (fasting and 2 hours after meals)',
          'Calculate your daily carb intake and aim for 100-150g maximum'
        ],
        lifestyle: [
          'Walk 10,000 steps daily - this alone can drop HbA1c by 0.5%',
          'Replace refined carbs with vegetables and lean proteins',
          'Practice intermittent fasting (16:8 method) to improve insulin sensitivity',
          'Get 7-9 hours of quality sleep nightly'
        ],
        monitoring: [
          'Weekly weight and waist circumference measurements',
          'Monthly blood pressure checks',
          'Quarterly comprehensive metabolic panel',
          'Annual eye exam for diabetic retinopathy screening'
        ],
        specialist: [
          'Endocrinologist for diabetes management',
          'Registered Dietitian for meal planning',
          'Exercise Physiologist for personalized fitness plan',
          'Sleep specialist if sleep apnea suspected'
        ]
      },
      followUpQuestions: [
        'What medications are you currently taking for blood sugar?',
        'Have you noticed increased thirst, frequent urination, or fatigue?',
        'What does your family history show for diabetes or heart disease?',
        'Are you experiencing any symptoms of insulin resistance?',
        'What is your current diet like and exercise routine?'
      ],
      relatedConditions: ['Type 2 Diabetes', 'Insulin Resistance', 'Metabolic Syndrome', 'Cardiovascular Disease'],
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      labValues: [
        {
          name: 'LDL Cholesterol',
          value: 145,
          unit: 'mg/dL',
          referenceRange: { min: 0, max: 100, optimal: { min: 0, max: 70 } },
          status: 'high',
          trend: 'stable',
          previousValue: 142
        },
        {
          name: 'HDL Cholesterol',
          value: 38,
          unit: 'mg/dL',
          referenceRange: { min: 40, max: 100, optimal: { min: 60, max: 100 } },
          status: 'low',
          trend: 'stable'
        },
        {
          name: 'Triglycerides',
          value: 185,
          unit: 'mg/dL',
          referenceRange: { min: 0, max: 150, optimal: { min: 0, max: 100 } },
          status: 'high',
          trend: 'worsening',
          previousValue: 165
        }
      ],
      originalText: 'LDL: 145 mg/dL (Reference: <100), HDL: 38 mg/dL (Reference: >40), Triglycerides: 185 mg/dL (Reference: <150)',
      decodedMeaning: 'Your cholesterol profile shows elevated "bad" cholesterol and low "good" cholesterol, indicating increased cardiovascular risk.',
      confidence: 98,
      category: 'Cardiovascular Risk Assessment',
      severity: 'moderate',
      clinicalContext: 'LDL of 145 mg/dL means you have excess cholesterol building up in arteries. Combined with low HDL and high triglycerides, this creates metabolic syndrome pattern.',
      familyRelevance: 'Cholesterol issues often genetic. Family history of early heart disease (<55 men, <65 women) increases your risk significantly. Consider familial hypercholesterolemia testing.',
      recommendations: [
        'Immediate: Schedule cardiologist consultation for risk assessment',
        'Diet: Adopt Mediterranean diet - focus on olive oil, fish, nuts, vegetables',
        'Exercise: 150 minutes moderate cardio weekly + strength training',
        'Supplements: Consider omega-3 fish oil and CoQ10',
        'Monitoring: Repeat lipid panel in 3 months after lifestyle changes'
      ],
      summary: 'Moderate cardiovascular risk requiring lifestyle intervention. 10-year heart attack risk estimated at 15-20% based on lipid profile.',
      keyConcerns: [
        'Atherosclerosis progression in coronary arteries',
        'Increased risk of heart attack and stroke',
        'Plaque buildup leading to angina or heart failure',
        'Peripheral artery disease affecting legs'
      ],
      immediateActions: [
        'Calculate your 10-year cardiovascular risk using online calculators',
        'Start daily aspirin if approved by doctor (81mg)',
        'Measure blood pressure twice daily for one week',
        'Schedule stress test or coronary calcium scan if family history positive'
      ],
      familyPredictions: {
        geneticRisk: 65,
        predictedConditions: [
          {
            condition: 'Coronary Artery Disease',
            likelihood: 35,
            timeframe: '5-10 years',
            prevention: ['Statin therapy', 'Blood pressure control', 'Regular exercise', 'Healthy diet']
          },
          {
            condition: 'Stroke',
            likelihood: 20,
            timeframe: '10-15 years',
            prevention: ['Blood pressure management', 'Atrial fibrillation screening', 'Healthy lifestyle']
          },
          {
            condition: 'Peripheral Artery Disease',
            likelihood: 25,
            timeframe: '7-12 years',
            prevention: ['Exercise therapy', 'Smoking cessation', 'Cholesterol management']
          }
        ],
        familyPatterns: [
          'Familial hypercholesterolemia pattern suggests genetic LDL receptor issues',
          'Low HDL runs in families and indicates poor cholesterol metabolism',
          'Early heart disease in family members suggests aggressive treatment needed'
        ]
      },
      clinicalInsights: {
        whatThisMeans: 'Your LDL of 145 mg/dL means cholesterol is building up in your artery walls. HDL of 38 mg/dL is too low to protect against this buildup.',
        whyItMatters: 'Every 30 mg/dL increase in LDL doubles heart disease risk. Your pattern suggests metabolic syndrome - a cluster of conditions that increase heart disease risk 2-3x.',
        comparisonToNormal: 'Optimal LDL is <70 mg/dL for high-risk individuals. Your 145 mg/dL puts you in the high-risk category requiring aggressive management.',
        lifestyleImpact: 'This lipid pattern typically results from high saturated fat intake, low fiber diet, lack of exercise, and possibly insulin resistance. Diet and exercise can improve this by 20-30%.'
      },
      personalizedRecommendations: {
        immediate: [
          'Schedule cardiology consultation within 2 weeks',
          'Start daily low-dose aspirin if approved by doctor',
          'Begin home blood pressure monitoring',
          'Calculate 10-year cardiovascular risk'
        ],
        lifestyle: [
          'Mediterranean diet: olive oil, fish, nuts, vegetables, whole grains',
          '150 minutes moderate exercise weekly (brisk walking, cycling)',
          'Weight loss goal: 5-10% of body weight if overweight',
          'Limit alcohol to 1 drink/day for women, 2 for men'
        ],
        monitoring: [
          'Monthly blood pressure and weight checks',
          'Quarterly lipid panel to track progress',
          'Annual comprehensive cardiovascular evaluation',
          'Regular exercise stress testing if symptoms develop'
        ],
        specialist: [
          'Cardiologist for risk assessment and possible statin therapy',
          'Registered Dietitian for heart-healthy meal planning',
          'Exercise Physiologist for safe cardiovascular training',
          'Genetic counselor if strong family history of early heart disease'
        ]
      },
      followUpQuestions: [
        'What is your family history of heart disease or stroke?',
        'Do you have any symptoms like chest pain or shortness of breath?',
        'What medications are you currently taking?',
        'What is your diet like and exercise routine?',
        'Have you had previous cholesterol or heart-related tests?'
      ],
      relatedConditions: ['Atherosclerosis', 'Metabolic Syndrome', 'Hypertension', 'Diabetes'],
      timestamp: new Date().toISOString()
    }
  ];

  // File upload handler
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsProcessing(true);
    const newFiles = Array.from(files);
    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate AI processing
    setTimeout(() => {
      setDecodedResults(sampleResults);
      setIsProcessing(false);
      setActiveTab('decode');
    }, 3000);
  }, []);

  // Send question to AI
  const sendQuestion = useCallback(async () => {
    if (!currentQuestion.trim()) return;

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentQuestion,
      timestamp: new Date().toISOString()
    };

    setConversation(prev => [...prev, userMessage]);
    setCurrentQuestion('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Based on your lab results, ${currentQuestion.toLowerCase().includes('diabetes') ?
          'your HbA1c of 7.2% indicates prediabetes. This means your average blood sugar over the past 2-3 months has been elevated. The good news is that prediabetes is reversible with lifestyle changes. I recommend working with a registered dietitian to create a meal plan focused on complex carbohydrates, lean proteins, and healthy fats. Regular exercise (150 minutes per week) and weight loss of 5-10% can often bring your levels back to normal range.' :
          'your LDL cholesterol of 145 mg/dL is moderately elevated. This increases your risk for heart disease, but there are effective ways to manage this. Statins are often prescribed, but lifestyle changes can also make a significant difference. Focus on reducing saturated fats, increasing fiber intake, and regular exercise.'}`,
        timestamp: new Date().toISOString(),
        relatedResults: ['1', '2'],
        suggestions: ['Schedule follow-up appointment', 'Start lifestyle modifications', 'Consider medication adjustments']
      };
      setConversation(prev => [...prev, aiResponse]);
    }, 2000);
  }, [currentQuestion]);

  // Save insight to blueprint/family tree
  const saveInsight = useCallback((result: DecodedResult, saveTo: 'blueprint' | 'family-tree' | 'both', familyMember?: string) => {
    const insight: SavedInsight = {
      id: Date.now().toString(),
      title: result.category,
      content: result.decodedMeaning,
      category: result.category.toLowerCase().includes('diabetes') ? 'lab-result' : 'risk-factor',
      savedTo: saveTo,
      familyMember,
      timestamp: new Date().toISOString(),
      tags: result.relatedConditions
    };

    setSavedInsights(prev => [...prev, insight]);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'from-red-500 to-red-600';
      case 'high': return 'from-orange-500 to-red-500';
      case 'moderate': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-green-500 to-blue-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <FiAlertTriangle className="w-5 h-5 text-red-400" />;
      case 'high': return <FiAlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'moderate': return <FiTrendingUp className="w-5 h-5 text-yellow-400" />;
      case 'low': return <FiCheckCircle className="w-5 h-5 text-green-400" />;
      default: return <FiFileText className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Interactive Lab & Health Decoder
          </h1>
          <p className="text-gray-400 text-lg">
            Upload medical documents, get AI-powered expert analysis, ask questions, and save insights to your health blueprint
          </p>

          {/* Lab Decoder Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 mb-8"
          >
            <Image
              src="/laddecoder.png"
              alt="Lab Decoder Mascot"
              width={180}
              height={180}
              className="mx-auto rounded-full shadow-2xl"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1">
            {[
              { id: 'upload', label: 'Upload Documents', icon: FiUpload },
              { id: 'decode', label: 'AI Analysis', icon: FiCpu },
              { id: 'chat', label: 'Ask Expert', icon: FiMessageSquare },
              { id: 'save', label: 'Saved Insights', icon: FiSave }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-900'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Upload Area */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FiUpload className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Upload Medical Documents</h3>
                  <p className="text-gray-400">Lab results, imaging reports, prescriptions, and health summaries</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50"
                >
                  {isProcessing ? 'Processing Documents...' : 'Choose Files'}
                </button>

                {isProcessing && (
                  <div className="mt-6">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 2 }}
                      ></motion.div>
                    </div>
                    <p className="text-center text-sm text-gray-400 mt-2">
                      AI analyzing documents...
                    </p>
                  </div>
                )}

                {/* Supported Formats */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-400 mb-2">Supported formats:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['PDF', 'DOC', 'DOCX', 'TXT', 'JPG', 'PNG'].map(format => (
                      <span key={format} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white">
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Uploaded Files */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Uploaded Documents</h3>
                {uploadedFiles.length === 0 ? (
                  <div className="text-center text-gray-400">
                    <FiFileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No documents uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                        <FiFileText className="w-8 h-8 text-blue-400" />
                        <div className="flex-1">
                          <p className="text-white font-medium">{file.name}</p>
                          <p className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <FiCheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Decode Tab */}
          {activeTab === 'decode' && (
            <motion.div
              key="decode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {decodedResults.length === 0 ? (
                <div className="text-center py-12">
                  <FiCpu className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Results to Decode</h3>
                  <p className="text-gray-400">Upload medical documents first to get AI-powered analysis</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {decodedResults.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:border-blue-500/50 transition cursor-pointer"
                      onClick={() => setSelectedResult(result)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getSeverityIcon(result.severity)}
                          <div>
                            <h3 className="text-xl font-bold text-white">{result.category}</h3>
                            <p className="text-gray-400 text-sm">{result.originalText}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400 mb-1">Confidence</div>
                          <div className="text-white font-medium">{result.confidence}%</div>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4">{result.decodedMeaning}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {result.relatedConditions.slice(0, 3).map((condition, index) => (
                          <span key={index} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
                            {condition}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveInsight(result, 'blueprint');
                            }}
                            className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition text-sm"
                          >
                            Save to Blueprint
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveInsight(result, 'family-tree');
                            }}
                            className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition text-sm"
                          >
                            Save to Family Tree
                          </button>
                        </div>
                        <FiChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
            >
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto mb-4 space-y-4">
                {conversation.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <FiMessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Ask me anything about your lab results or health data</p>
                  </div>
                ) : (
                  conversation.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-lg p-4 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-white border border-white/20'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        {message.suggestions && (
                          <div className="mt-3 space-y-2">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentQuestion(suggestion)}
                                className="block w-full text-left px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition text-xs"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendQuestion()}
                  placeholder="Ask about your lab results, health conditions, or treatment options..."
                  className="flex-1 px-4 py-3 bg-black border border-gray-600 rounded-lg text-pink-400 placeholder-pink-300 focus:border-pink-500 focus:outline-none"
                />
                <button
                  onClick={sendQuestion}
                  disabled={!currentQuestion.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50"
                >
                  <FiMessageSquare className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Save Tab */}
          {activeTab === 'save' && (
            <motion.div
              key="save"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Saved Health Insights</h3>
                <div className="text-sm text-gray-400">
                  {savedInsights.length} insights saved
                </div>
              </div>

              {savedInsights.length === 0 ? (
                <div className="text-center py-12">
                  <FiSave className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Insights Saved Yet</h3>
                  <p className="text-gray-400">Save decoded results to your blueprint or family tree</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedInsights.map((insight) => (
                    <div key={insight.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">{insight.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <FiCalendar className="w-4 h-4" />
                            {new Date(insight.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          insight.savedTo === 'blueprint' ? 'bg-blue-500/20 text-blue-300' :
                          insight.savedTo === 'family-tree' ? 'bg-green-500/20 text-green-300' :
                          'bg-purple-500/20 text-purple-300'
                        }`}>
                          {insight.savedTo === 'both' ? 'Blueprint & Family' : insight.savedTo}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4">{insight.content}</p>

                      {insight.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {insight.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-white/10 text-white rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Detail Modal */}
        <AnimatePresence>
          {selectedResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedResult(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 border border-white/20 rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {getSeverityIcon(selectedResult.severity)}
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedResult.category}</h2>
                      <p className="text-gray-400">{selectedResult.originalText}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                {/* Lab Values Breakdown */}
                {selectedResult.labValues && selectedResult.labValues.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Lab Values Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedResult.labValues.map((lab, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">{lab.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              lab.status === 'high' ? 'bg-red-500/20 text-red-300' :
                              lab.status === 'low' ? 'bg-blue-500/20 text-blue-300' :
                              lab.status === 'optimal' ? 'bg-green-500/20 text-green-300' :
                              'bg-yellow-500/20 text-yellow-300'
                            }`}>
                              {lab.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-white mb-1">
                            {lab.value} {lab.unit}
                          </div>
                          <div className="text-sm text-gray-400 mb-2">
                            Reference: {lab.referenceRange.min}-{lab.referenceRange.max} {lab.unit}
                            {lab.referenceRange.optimal && ` (Optimal: ${lab.referenceRange.optimal.min}-${lab.referenceRange.optimal.max})`}
                          </div>
                          {lab.trend && (
                            <div className="flex items-center gap-1 text-sm">
                              {lab.trend === 'improving' ? <FiTrendingDown className="w-4 h-4 text-green-400" /> :
                               lab.trend === 'worsening' ? <FiTrendingUp className="w-4 h-4 text-red-400" /> :
                               <FiMinus className="w-4 h-4 text-gray-400" />}
                              <span className={`${
                                lab.trend === 'improving' ? 'text-green-400' :
                                lab.trend === 'worsening' ? 'text-red-400' : 'text-gray-400'
                              }`}>
                                {lab.trend === 'improving' ? 'Improving' :
                                 lab.trend === 'worsening' ? 'Worsening' : 'Stable'}
                                {lab.previousValue && ` from ${lab.previousValue} ${lab.unit}`}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary */}
                {selectedResult.summary && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Summary</h3>
                    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4">
                      <p className="text-purple-200 font-medium">{selectedResult.summary}</p>
                    </div>
                  </div>
                )}

                {/* Key Concerns */}
                {selectedResult.keyConcerns && selectedResult.keyConcerns.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Key Health Concerns</h3>
                    <div className="space-y-2">
                      {selectedResult.keyConcerns.map((concern, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <FiAlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                          <p className="text-red-200">{concern}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clinical Insights */}
                {selectedResult.clinicalInsights && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Clinical Insights</h3>
                    <div className="space-y-4">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-300 mb-2">What This Means</h4>
                        <p className="text-blue-200">{selectedResult.clinicalInsights.whatThisMeans}</p>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-300 mb-2">Why It Matters</h4>
                        <p className="text-yellow-200">{selectedResult.clinicalInsights.whyItMatters}</p>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <h4 className="font-semibold text-green-300 mb-2">Comparison to Normal</h4>
                        <p className="text-green-200">{selectedResult.clinicalInsights.comparisonToNormal}</p>
                      </div>
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                        <h4 className="font-semibold text-purple-300 mb-2">Lifestyle Impact</h4>
                        <p className="text-purple-200">{selectedResult.clinicalInsights.lifestyleImpact}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Family Predictions */}
                {selectedResult.familyPredictions && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Family Health Predictions</h3>
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-green-300 font-medium">Genetic Risk Score</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-400 to-red-400 rounded-full"
                              style={{ width: `${selectedResult.familyPredictions.geneticRisk}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-bold">{selectedResult.familyPredictions.geneticRisk}%</span>
                        </div>
                      </div>
                      <p className="text-green-200 text-sm">Based on your lab values and family history patterns</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {selectedResult.familyPredictions.predictedConditions.map((pred, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">{pred.condition}</h4>
                            <span className="text-yellow-400 font-bold">{pred.likelihood}%</span>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">Timeframe: {pred.timeframe}</p>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-300">Prevention Strategies:</p>
                            {pred.prevention.map((strat, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                                <FiCheckCircle className="w-3 h-3 text-green-400" />
                                {strat}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-2">Family Patterns Identified</h4>
                      <div className="space-y-2">
                        {selectedResult.familyPredictions.familyPatterns.map((pattern, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <FiUsers className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <p className="text-blue-200 text-sm">{pattern}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Immediate Actions */}
                {selectedResult.immediateActions && selectedResult.immediateActions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Immediate Actions Required</h3>
                    <div className="space-y-2">
                      {selectedResult.immediateActions.map((action, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                          <FiZap className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                          <p className="text-orange-200">{action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Personalized Recommendations */}
                {selectedResult.personalizedRecommendations && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Personalized Recommendations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-white">Immediate Steps</h4>
                        {selectedResult.personalizedRecommendations.immediate.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-white/5 rounded">
                            <FiCheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-300 text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-white">Lifestyle Changes</h4>
                        {selectedResult.personalizedRecommendations.lifestyle.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-white/5 rounded">
                            <FiActivity className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-300 text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-white">Monitoring Plan</h4>
                        {selectedResult.personalizedRecommendations.monitoring.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-white/5 rounded">
                            <FiCalendar className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-300 text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-white">Specialist Care</h4>
                        {selectedResult.personalizedRecommendations.specialist.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-white/5 rounded">
                            <FiUser className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-300 text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Decoded Meaning */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">What This Means</h3>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-blue-200">{selectedResult.decodedMeaning}</p>
                  </div>
                </div>

                {/* Clinical Context */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">Clinical Context</h3>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-300">{selectedResult.clinicalContext}</p>
                  </div>
                </div>

                {/* Family Relevance */}
                {selectedResult.familyRelevance && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Family Relevance</h3>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <p className="text-green-200">{selectedResult.familyRelevance}</p>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">Recommendations</h3>
                  <div className="space-y-2">
                    {selectedResult.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <FiCheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-300">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Conditions */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">Related Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedResult.relatedConditions.map((condition, index) => (
                      <span key={index} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Follow-up Questions */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">Questions to Ask Your Doctor</h3>
                  <div className="space-y-2">
                    {selectedResult.followUpQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentQuestion(question);
                          setActiveTab('chat');
                          setSelectedResult(null);
                        }}
                        className="block w-full text-left p-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-gray-300"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => saveInsight(selectedResult, 'blueprint')}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FiSave className="w-4 h-4" />
                      Save to Blueprint
                    </div>
                  </button>
                  <button
                    onClick={() => saveInsight(selectedResult, 'family-tree')}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FiUsers className="w-4 h-4" />
                      Save to Family Tree
                    </div>
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