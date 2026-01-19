"use client";

import React, { useState } from 'react';
import { format, parseISO, subDays, subWeeks, subMonths } from 'date-fns';
import { PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Document Analysis Types
type AnalyzedDocument = {
  id: string;
  fileName: string;
  uploadDate: string;
  fileType: 'pdf' | 'image' | 'doc' | 'txt' | 'dicom' | 'xml' | 'json';
  fileSize: number; // in bytes
  category: 'lab-results' | 'imaging' | 'prescription' | 'visit-notes' | 'insurance' | 'referral' | 'discharge-summary' | 'test-results' | 'other';
  subcategory?: string;
  aiClassification: {
    confidence: number; // 0-100
    alternativeCategories: { category: string; confidence: number; }[];
    classificationMethod: 'content-analysis' | 'filename-pattern' | 'metadata' | 'hybrid';
  };
  extractedData: {
    keyMetrics: { name: string; value: any; unit?: string; range?: string; status: 'normal' | 'abnormal' | 'borderline' | 'critical'; }[];
    dates: { type: string; date: string; }[];
    providers: { name: string; role: string; npi?: string; }[];
    medications: { name: string; dosage?: string; frequency?: string; startDate?: string; }[];
    procedures: { name: string; date?: string; location?: string; }[];
    diagnoses: { code?: string; description: string; type: 'primary' | 'secondary' | 'differential'; }[];
  };
  textContent: string;
  aiAnalysis: {
    summary: string;
    keyFindings: string[];
    anomalies: string[];
    trends: string[];
    followUpNeeded: boolean;
    urgency: 'routine' | 'timely' | 'urgent' | 'emergency';
    confidenceScore: number;
    analysisMethod: 'nlp' | 'ocr' | 'structured-data' | 'hybrid';
  };
  qualityScore: number; // 0-100 document quality/readability
  processingTime: number; // milliseconds
  tags: string[];
  relatedDocuments: string[];
  insights: DocumentInsight[];
  status: 'processing' | 'analyzed' | 'reviewed' | 'error';
};

type DocumentInsight = {
  id: string;
  type: 'trend-detected' | 'anomaly-found' | 'correlation-discovered' | 'recommendation-generated' | 'risk-identified';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  generatedAt: string;
  relatedMetrics: string[];
  actionable: boolean;
  recommendation?: string;
};

type AnalysisEngine = {
  totalDocuments: number;
  processedToday: number;
  averageProcessingTime: number; // milliseconds
  accuracyRate: number; // 0-100
  autoClassificationRate: number; // 0-100
  keyMetricsExtracted: number;
  insightsGenerated: number;
  anomaliesDetected: number;
  lastEngineUpdate: string;
  modelVersion: string;
  processingCapacity: {
    current: number;
    maximum: number;
    queueLength: number;
  };
  qualityMetrics: {
    ocrAccuracy: number;
    nlpAccuracy: number;
    classificationAccuracy: number;
    dataExtractionAccuracy: number;
  };
};

type TrendAnalysis = {
  metric: string;
  trend: 'improving' | 'stable' | 'declining' | 'volatile';
  dataPoints: { date: string; value: number; source: string; }[];
  correlation: number; // -1 to 1
  significance: 'low' | 'medium' | 'high';
  timespan: string;
  prediction?: {
    nextValue: number;
    confidence: number;
    timeframe: string;
  };
};

// Sample data
const documents: AnalyzedDocument[] = [
  {
    id: 'doc-1',
    fileName: 'Lab_Results_HbA1c_2026-01-15.pdf',
    uploadDate: '2026-01-15T14:30:00Z',
    fileType: 'pdf',
    fileSize: 245678,
    category: 'lab-results',
    subcategory: 'Blood Chemistry',
    aiClassification: {
      confidence: 97,
      alternativeCategories: [
        { category: 'test-results', confidence: 12 },
        { category: 'other', confidence: 3 }
      ],
      classificationMethod: 'hybrid'
    },
    extractedData: {
      keyMetrics: [
        { name: 'HbA1c', value: 5.8, unit: '%', range: '<7.0', status: 'normal' },
        { name: 'Glucose (Fasting)', value: 98, unit: 'mg/dL', range: '70-100', status: 'normal' },
        { name: 'Total Cholesterol', value: 185, unit: 'mg/dL', range: '<200', status: 'normal' },
        { name: 'LDL Cholesterol', value: 105, unit: 'mg/dL', range: '<100', status: 'borderline' },
        { name: 'HDL Cholesterol', value: 58, unit: 'mg/dL', range: '>40', status: 'normal' }
      ],
      dates: [
        { type: 'collection', date: '2026-01-15T08:00:00Z' },
        { type: 'reported', date: '2026-01-15T14:30:00Z' }
      ],
      providers: [
        { name: 'Dr. Sarah Chen', role: 'Ordering Physician', npi: '1234567890' },
        { name: 'LabCorp', role: 'Laboratory', npi: '9876543210' }
      ],
      medications: [],
      procedures: [
        { name: 'Comprehensive Metabolic Panel', date: '2026-01-15', location: 'LabCorp Downtown' }
      ],
      diagnoses: [
        { description: 'Type 2 Diabetes Mellitus - Well Controlled', type: 'primary' }
      ]
    },
    textContent: 'COMPREHENSIVE METABOLIC PANEL\nPatient: John Doe\nDOB: 1980-05-15\nDate of Service: 01/15/2026\n\nHbA1c: 5.8% (Reference: <7.0%)\nGlucose, Fasting: 98 mg/dL (Reference: 70-100 mg/dL)\nTotal Cholesterol: 185 mg/dL (Reference: <200 mg/dL)\nLDL Cholesterol: 105 mg/dL (Reference: <100 mg/dL)\nHDL Cholesterol: 58 mg/dL (Reference: >40 mg/dL)',
    aiAnalysis: {
      summary: 'Excellent diabetes control with HbA1c at 5.8%. Overall metabolic panel shows good control with slight elevation in LDL cholesterol.',
      keyFindings: [
        'HbA1c improved from previous 6.2% to 5.8%',
        'Fasting glucose within optimal range',
        'LDL cholesterol slightly elevated at 105 mg/dL'
      ],
      anomalies: ['LDL cholesterol above target of <100 mg/dL'],
      trends: ['Improving diabetes control', 'Stable lipid profile'],
      followUpNeeded: true,
      urgency: 'routine',
      confidenceScore: 94,
      analysisMethod: 'hybrid'
    },
    qualityScore: 96,
    processingTime: 2340,
    tags: ['diabetes', 'lab-results', 'excellent-control', 'lipid-monitoring'],
    relatedDocuments: ['doc-3', 'doc-7'],
    insights: [
      {
        id: 'insight-1',
        type: 'trend-detected',
        title: 'Significant HbA1c Improvement',
        description: 'HbA1c has improved from 6.2% to 5.8% over the past 3 months, indicating excellent diabetes management.',
        severity: 'low',
        confidence: 96,
        generatedAt: '2026-01-15T14:45:00Z',
        relatedMetrics: ['HbA1c', 'Fasting Glucose'],
        actionable: false,
        recommendation: 'Continue current diabetes management plan'
      },
      {
        id: 'insight-2',
        type: 'recommendation-generated',
        title: 'LDL Cholesterol Management',
        description: 'LDL cholesterol at 105 mg/dL is slightly above optimal target. Consider dietary modifications or medication review.',
        severity: 'low',
        confidence: 78,
        generatedAt: '2026-01-15T14:45:00Z',
        relatedMetrics: ['LDL Cholesterol'],
        actionable: true,
        recommendation: 'Discuss LDL management with primary care provider'
      }
    ],
    status: 'analyzed'
  },
  {
    id: 'doc-2',
    fileName: 'Cardiology_Echo_Report_2026-01-10.pdf',
    uploadDate: '2026-01-10T16:20:00Z',
    fileType: 'pdf',
    fileSize: 1245890,
    category: 'imaging',
    subcategory: 'Echocardiogram',
    aiClassification: {
      confidence: 89,
      alternativeCategories: [
        { category: 'test-results', confidence: 18 },
        { category: 'visit-notes', confidence: 5 }
      ],
      classificationMethod: 'content-analysis'
    },
    extractedData: {
      keyMetrics: [
        { name: 'Ejection Fraction', value: 58, unit: '%', range: '>50%', status: 'normal' },
        { name: 'Left Atrial Size', value: 3.8, unit: 'cm', range: '<4.0', status: 'normal' },
        { name: 'Interventricular Septal Thickness', value: 1.1, unit: 'cm', range: '0.6-1.1', status: 'normal' },
        { name: 'LV Mass Index', value: 95, unit: 'g/m²', range: '<95', status: 'borderline' }
      ],
      dates: [
        { type: 'procedure', date: '2026-01-10T09:30:00Z' }
      ],
      providers: [
        { name: 'Dr. Lisa Rodriguez', role: 'Cardiologist' },
        { name: 'Heart Center Imaging', role: 'Imaging Center' }
      ],
      medications: [],
      procedures: [
        { name: 'Transthoracic Echocardiogram', date: '2026-01-10', location: 'Heart Center Imaging' }
      ],
      diagnoses: [
        { description: 'Normal left ventricular function', type: 'primary' },
        { description: 'Mild left ventricular hypertrophy', type: 'secondary' }
      ]
    },
    textContent: 'TRANSTHORACIC ECHOCARDIOGRAM\nStudy Date: 01/10/2026\nIndication: Hypertension, routine cardiac screening\n\nFINDINGS:\nLeft Ventricle: Normal size and function. EF 58%.\nLeft Atrium: Normal size (3.8 cm)\nRight Heart: Normal\nValves: No significant abnormalities\nPericardium: Normal\n\nIMPRESSION:\n1. Normal left ventricular systolic function (EF 58%)\n2. Mild concentric left ventricular hypertrophy',
    aiAnalysis: {
      summary: 'Normal cardiac function with mild left ventricular hypertrophy likely related to hypertension history.',
      keyFindings: [
        'Normal ejection fraction at 58%',
        'Mild left ventricular hypertrophy present',
        'All cardiac valves appear normal'
      ],
      anomalies: ['Mild LV hypertrophy'],
      trends: ['Stable cardiac function'],
      followUpNeeded: false,
      urgency: 'routine',
      confidenceScore: 91,
      analysisMethod: 'nlp'
    },
    qualityScore: 93,
    processingTime: 3240,
    tags: ['cardiology', 'echocardiogram', 'normal-function', 'mild-hypertrophy'],
    relatedDocuments: ['doc-5'],
    insights: [
      {
        id: 'insight-3',
        type: 'correlation-discovered',
        title: 'BP Control and Cardiac Function',
        description: 'Improved blood pressure control over past 6 months correlates with stable cardiac function and no progression of LV hypertrophy.',
        severity: 'low',
        confidence: 84,
        generatedAt: '2026-01-10T16:35:00Z',
        relatedMetrics: ['Ejection Fraction', 'LV Mass Index', 'Blood Pressure'],
        actionable: false,
        recommendation: 'Continue current blood pressure management'
      }
    ],
    status: 'analyzed'
  },
  {
    id: 'doc-3',
    fileName: 'Prescription_Metformin_Renewal_2026-01-08.pdf',
    uploadDate: '2026-01-08T11:15:00Z',
    fileType: 'pdf',
    fileSize: 89456,
    category: 'prescription',
    subcategory: 'Medication Renewal',
    aiClassification: {
      confidence: 94,
      alternativeCategories: [
        { category: 'visit-notes', confidence: 8 },
        { category: 'other', confidence: 2 }
      ],
      classificationMethod: 'content-analysis'
    },
    extractedData: {
      keyMetrics: [],
      dates: [
        { type: 'prescribed', date: '2026-01-08T11:00:00Z' },
        { type: 'valid_until', date: '2026-04-08T11:00:00Z' }
      ],
      providers: [
        { name: 'Dr. Sarah Chen', role: 'Prescribing Physician', npi: '1234567890' }
      ],
      medications: [
        { name: 'Metformin', dosage: '1000mg', frequency: 'twice daily', startDate: '2026-01-08' },
        { name: 'Lisinopril', dosage: '10mg', frequency: 'once daily', startDate: '2026-01-08' }
      ],
      procedures: [],
      diagnoses: [
        { description: 'Type 2 Diabetes Mellitus', type: 'primary' },
        { description: 'Hypertension', type: 'secondary' }
      ]
    },
    textContent: 'PRESCRIPTION\nPatient: John Doe\nDOB: 1980-05-15\nDate: 01/08/2026\n\nRx 1: Metformin 1000mg\nSig: Take one tablet by mouth twice daily with meals\nDispense: 180 tablets\nRefills: 5\n\nRx 2: Lisinopril 10mg\nSig: Take one tablet by mouth once daily\nDispense: 90 tablets\nRefills: 5\n\nPrescriber: Dr. Sarah Chen, MD\nNPI: 1234567890',
    aiAnalysis: {
      summary: 'Prescription renewal for diabetes and hypertension management with standard dosing.',
      keyFindings: [
        'Metformin dosage maintained at 1000mg twice daily',
        'Lisinopril continued at 10mg once daily',
        '3-month supply with adequate refills'
      ],
      anomalies: [],
      trends: ['Stable medication regimen'],
      followUpNeeded: false,
      urgency: 'routine',
      confidenceScore: 88,
      analysisMethod: 'nlp'
    },
    qualityScore: 95,
    processingTime: 1890,
    tags: ['prescription', 'metformin', 'lisinopril', 'renewal'],
    relatedDocuments: ['doc-1'],
    insights: [
      {
        id: 'insight-4',
        type: 'trend-detected',
        title: 'Medication Adherence Consistency',
        description: 'Consistent prescription renewals indicate good medication adherence over the past year.',
        severity: 'low',
        confidence: 91,
        generatedAt: '2026-01-08T11:30:00Z',
        relatedMetrics: ['Medication Adherence'],
        actionable: false,
        recommendation: 'Continue current medication schedule'
      }
    ],
    status: 'analyzed'
  }
];

const engineStatus: AnalysisEngine = {
  totalDocuments: 247,
  processedToday: 12,
  averageProcessingTime: 2850,
  accuracyRate: 94,
  autoClassificationRate: 91,
  keyMetricsExtracted: 1456,
  insightsGenerated: 89,
  anomaliesDetected: 23,
  lastEngineUpdate: '2026-01-18T06:00:00Z',
  modelVersion: '2.1.4',
  processingCapacity: {
    current: 3,
    maximum: 50,
    queueLength: 0
  },
  qualityMetrics: {
    ocrAccuracy: 96,
    nlpAccuracy: 92,
    classificationAccuracy: 94,
    dataExtractionAccuracy: 89
  }
};

const categoryDistribution = [
  { name: 'Lab Results', value: 89, color: '#ec4899' },
  { name: 'Imaging', value: 45, color: '#8b5cf6' },
  { name: 'Prescriptions', value: 67, color: '#06d6a0' },
  { name: 'Visit Notes', value: 34, color: '#ffd23f' },
  { name: 'Other', value: 12, color: '#6c757d' }
];

const processingTrends = [
  { date: '2026-01-12', processed: 8, accuracy: 92, avgTime: 3200 },
  { date: '2026-01-13', processed: 15, accuracy: 94, avgTime: 2950 },
  { date: '2026-01-14', processed: 11, accuracy: 93, avgTime: 3100 },
  { date: '2026-01-15', processed: 18, accuracy: 95, avgTime: 2800 },
  { date: '2026-01-16', processed: 9, accuracy: 94, avgTime: 2900 },
  { date: '2026-01-17', processed: 14, accuracy: 96, avgTime: 2700 },
  { date: '2026-01-18', processed: 12, accuracy: 94, avgTime: 2850 }
];

const keyMetricsTrends: TrendAnalysis[] = [
  {
    metric: 'HbA1c',
    trend: 'improving',
    dataPoints: [
      { date: '2025-07-15', value: 6.8, source: 'Lab Results' },
      { date: '2025-10-12', value: 6.2, source: 'Lab Results' },
      { date: '2026-01-15', value: 5.8, source: 'Lab Results' }
    ],
    correlation: -0.94,
    significance: 'high',
    timespan: '6 months',
    prediction: {
      nextValue: 5.6,
      confidence: 78,
      timeframe: '3 months'
    }
  },
  {
    metric: 'Blood Pressure (Systolic)',
    trend: 'stable',
    dataPoints: [
      { date: '2025-12-01', value: 125, source: 'Home Monitoring' },
      { date: '2025-12-15', value: 122, source: 'Provider Visit' },
      { date: '2026-01-08', value: 118, source: 'Home Monitoring' },
      { date: '2026-01-18', value: 121, source: 'Home Monitoring' }
    ],
    correlation: -0.23,
    significance: 'medium',
    timespan: '2 months'
  }
];

export default function IntelligentDocumentAnalysis() {
  const [activeTab, setActiveTab] = useState<'documents' | 'insights' | 'trends' | 'engine'>('documents');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'confidence' | 'quality'>('date');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'lab-results': return 'text-pink-400 bg-pink-500/20';
      case 'imaging': return 'text-purple-400 bg-purple-500/20';
      case 'prescription': return 'text-green-400 bg-green-500/20';
      case 'visit-notes': return 'text-blue-400 bg-blue-500/20';
      case 'insurance': return 'text-yellow-400 bg-yellow-500/20';
      case 'referral': return 'text-orange-400 bg-orange-500/20';
      case 'test-results': return 'text-cyan-400 bg-cyan-500/20';
      case 'discharge-summary': return 'text-indigo-400 bg-indigo-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'borderline': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'abnormal': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30 animate-pulse';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return '📄';
      case 'image': return '🖼️';
      case 'doc': return '📝';
      case 'dicom': return '🏥';
      case 'xml': return '🔢';
      default: return '📁';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend-detected': return '📈';
      case 'anomaly-found': return '⚠️';
      case 'correlation-discovered': return '🔗';
      case 'recommendation-generated': return '💡';
      case 'risk-identified': return '🚨';
      default: return '📊';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const categoryMatch = filterCategory === 'all' || doc.category === filterCategory;
    const statusMatch = filterStatus === 'all' || doc.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      case 'confidence':
        return b.aiClassification.confidence - a.aiClassification.confidence;
      case 'quality':
        return b.qualityScore - a.qualityScore;
      default:
        return 0;
    }
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Intelligent Document Analysis
              </h1>
              <p className="text-gray-400">
                AI-powered document processing with automatic categorization, data extraction, and insights generation
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Processing Ready</span>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition">
                + Upload Document
              </button>
            </div>
          </div>

          {/* Engine Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Total Documents</p>
                  <p className="text-2xl font-bold text-white">{engineStatus.totalDocuments}</p>
                </div>
                <div className="text-2xl">📄</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">AI Accuracy</p>
                  <p className="text-2xl font-bold text-white">{engineStatus.accuracyRate}%</p>
                </div>
                <div className="text-2xl">🎯</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Insights Generated</p>
                  <p className="text-2xl font-bold text-white">{engineStatus.insightsGenerated}</p>
                </div>
                <div className="text-2xl">💡</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl border border-yellow-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-medium">Processing Time</p>
                  <p className="text-2xl font-bold text-white">{(engineStatus.averageProcessingTime / 1000).toFixed(1)}s</p>
                </div>
                <div className="text-2xl">⚡</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'documents', label: 'Documents', icon: '📄' },
              { id: 'insights', label: 'AI Insights', icon: '💡' },
              { id: 'trends', label: 'Health Trends', icon: '📈' },
              { id: 'engine', label: 'AI Engine', icon: '🤖' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'documents' && (
          <div>
            {/* Filters and Controls */}
            <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Category:</label>
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="lab-results">Lab Results</option>
                  <option value="imaging">Imaging</option>
                  <option value="prescription">Prescriptions</option>
                  <option value="visit-notes">Visit Notes</option>
                  <option value="test-results">Test Results</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Sort by:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                >
                  <option value="date">Upload Date</option>
                  <option value="confidence">AI Confidence</option>
                  <option value="quality">Quality Score</option>
                </select>
              </div>
              
              <div className="ml-auto text-sm text-gray-400">
                {filteredDocuments.length} documents
              </div>
            </div>

            {/* Documents List */}
            <div className="space-y-4">
              {sortedDocuments.map((doc) => (
                <div key={doc.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{getFileIcon(doc.fileType)}</div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{doc.fileName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(doc.category)}`}>
                            {doc.category.replace('-', ' ').toUpperCase()}
                          </span>
                          {doc.subcategory && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium text-gray-400 bg-gray-500/20">
                              {doc.subcategory}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-400 mb-2">
                          <span>📅 {format(parseISO(doc.uploadDate), 'MMM dd, yyyy h:mm a')}</span>
                          <span>📁 {formatFileSize(doc.fileSize)}</span>
                          <span>⚡ {(doc.processingTime / 1000).toFixed(1)}s processing</span>
                        </div>
                        
                        <p className="text-gray-300 text-sm">{doc.aiAnalysis.summary}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div className="text-center">
                          <div className="text-lg font-bold text-pink-400">{doc.aiClassification.confidence}%</div>
                          <p className="text-xs text-gray-400">AI Confidence</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">{doc.qualityScore}%</div>
                          <p className="text-xs text-gray-400">Quality Score</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  {doc.extractedData.keyMetrics.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-white mb-2">📊 Extracted Key Metrics:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {doc.extractedData.keyMetrics.slice(0, 6).map((metric, index) => (
                          <div key={index} className="p-3 bg-black/20 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-white">{metric.name}</span>
                              <span className={`px-1 py-0.5 rounded text-xs font-medium border ${getStatusColor(metric.status)}`}>
                                {metric.status}
                              </span>
                            </div>
                            <div className="text-lg font-bold text-blue-400">
                              {metric.value} {metric.unit}
                            </div>
                            {metric.range && (
                              <div className="text-xs text-gray-400">Range: {metric.range}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Analysis */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-white mb-2">🧠 AI Analysis:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h6 className="text-xs font-medium text-green-400 mb-1">Key Findings:</h6>
                        <ul className="space-y-1">
                          {doc.aiAnalysis.keyFindings.slice(0, 3).map((finding, index) => (
                            <li key={index} className="text-xs text-gray-300 flex items-start gap-2">
                              <span className="text-green-400 mt-1">✓</span>
                              {finding}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {doc.aiAnalysis.anomalies.length > 0 && (
                        <div>
                          <h6 className="text-xs font-medium text-yellow-400 mb-1">Anomalies Detected:</h6>
                          <ul className="space-y-1">
                            {doc.aiAnalysis.anomalies.slice(0, 2).map((anomaly, index) => (
                              <li key={index} className="text-xs text-gray-300 flex items-start gap-2">
                                <span className="text-yellow-400 mt-1">⚠</span>
                                {anomaly}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generated Insights */}
                  {doc.insights.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-white mb-2">💡 Generated Insights:</h5>
                      <div className="space-y-2">
                        {doc.insights.slice(0, 2).map((insight) => (
                          <div key={insight.id} className="p-3 bg-black/20 rounded-lg">
                            <div className="flex items-start gap-2 mb-1">
                              <span className="text-lg">{getInsightIcon(insight.type)}</span>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium text-white">{insight.title}</span>
                                  <span className={`px-1 py-0.5 rounded text-xs font-medium ${getSeverityColor(insight.severity)}`}>
                                    {insight.severity}
                                  </span>
                                  <span className="text-xs text-purple-400">{insight.confidence}% confident</span>
                                </div>
                                <p className="text-xs text-gray-300">{insight.description}</p>
                                {insight.recommendation && (
                                  <p className="text-xs text-blue-300 mt-1">→ {insight.recommendation}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setSelectedDoc(selectedDoc === doc.id ? null : doc.id)}
                      className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
                    >
                      {selectedDoc === doc.id ? 'Hide Details' : 'View Full Analysis'}
                    </button>
                    
                    <button className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition">
                      Export Data
                    </button>
                    
                    <button className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 transition">
                      Share with Provider
                    </button>
                    
                    <button className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition">
                      Add to Timeline
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {selectedDoc === doc.id && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Extracted Data */}
                        <div>
                          <h5 className="text-lg font-semibold text-white mb-4">📋 Extracted Data</h5>
                          
                          {doc.extractedData.providers.length > 0 && (
                            <div className="mb-4">
                              <h6 className="text-sm font-medium text-blue-400 mb-2">Healthcare Providers:</h6>
                              {doc.extractedData.providers.map((provider, index) => (
                                <div key={index} className="text-sm text-gray-300 mb-1">
                                  {provider.name} - {provider.role}
                                  {provider.npi && <span className="text-gray-400 ml-2">NPI: {provider.npi}</span>}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {doc.extractedData.medications.length > 0 && (
                            <div className="mb-4">
                              <h6 className="text-sm font-medium text-green-400 mb-2">Medications:</h6>
                              {doc.extractedData.medications.map((med, index) => (
                                <div key={index} className="text-sm text-gray-300 mb-1">
                                  {med.name} {med.dosage && `- ${med.dosage}`} {med.frequency && `(${med.frequency})`}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {doc.extractedData.diagnoses.length > 0 && (
                            <div className="mb-4">
                              <h6 className="text-sm font-medium text-purple-400 mb-2">Diagnoses:</h6>
                              {doc.extractedData.diagnoses.map((diag, index) => (
                                <div key={index} className="text-sm text-gray-300 mb-1">
                                  <span className={`px-1 py-0.5 rounded text-xs mr-2 ${
                                    diag.type === 'primary' ? 'bg-purple-500/20 text-purple-300' :
                                    diag.type === 'secondary' ? 'bg-blue-500/20 text-blue-300' :
                                    'bg-gray-500/20 text-gray-300'
                                  }`}>
                                    {diag.type}
                                  </span>
                                  {diag.description}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Technical Details */}
                        <div>
                          <h5 className="text-lg font-semibold text-white mb-4">⚙️ Technical Analysis</h5>
                          
                          <div className="space-y-3">
                            <div className="p-3 bg-black/20 rounded">
                              <div className="text-sm font-medium text-white mb-1">Classification Method:</div>
                              <div className="text-sm text-gray-300">{doc.aiClassification.classificationMethod}</div>
                            </div>
                            
                            <div className="p-3 bg-black/20 rounded">
                              <div className="text-sm font-medium text-white mb-1">Analysis Method:</div>
                              <div className="text-sm text-gray-300">{doc.aiAnalysis.analysisMethod}</div>
                            </div>
                            
                            <div className="p-3 bg-black/20 rounded">
                              <div className="text-sm font-medium text-white mb-1">Alternative Classifications:</div>
                              {doc.aiClassification.alternativeCategories.map((alt, index) => (
                                <div key={index} className="text-sm text-gray-300">
                                  {alt.category}: {alt.confidence}%
                                </div>
                              ))}
                            </div>
                            
                            <div className="p-3 bg-black/20 rounded">
                              <div className="text-sm font-medium text-white mb-1">Tags:</div>
                              <div className="flex flex-wrap gap-1">
                                {doc.tags.map((tag, index) => (
                                  <span key={index} className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-xs">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">AI-Generated Document Insights</h3>
            
            <div className="space-y-4">
              {documents.flatMap(doc => doc.insights).map((insight) => (
                <div key={insight.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getInsightIcon(insight.type)}</span>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">{insight.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(insight.severity)}`}>
                            {insight.severity.toUpperCase()}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium text-purple-400 bg-purple-500/20">
                            {insight.type.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-2">{insight.description}</p>
                        {insight.recommendation && (
                          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <p className="text-sm text-green-300">💡 {insight.recommendation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-pink-400">{insight.confidence}%</div>
                      <p className="text-xs text-gray-400">AI Confidence</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex gap-4">
                      <span>Generated: {format(parseISO(insight.generatedAt), 'MMM dd, yyyy')}</span>
                      <span>Metrics: {insight.relatedMetrics.join(', ')}</span>
                    </div>
                    {insight.actionable && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                        ACTIONABLE
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibent text-white">Health Trends from Documents</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {keyMetricsTrends.map((trend, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">{trend.metric}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trend.trend === 'improving' ? 'text-green-400 bg-green-500/20' :
                      trend.trend === 'declining' ? 'text-red-400 bg-red-500/20' :
                      trend.trend === 'volatile' ? 'text-orange-400 bg-orange-500/20' :
                      'text-blue-400 bg-blue-500/20'
                    }`}>
                      {trend.trend.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="h-48 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trend.dataPoints}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#9CA3AF"
                          tickFormatter={(date) => format(parseISO(date), 'MMM dd')}
                        />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                          labelFormatter={(date) => format(parseISO(date), 'MMM dd, yyyy')} 
                        />
                        <Line type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Correlation:</span>
                      <div className="text-white font-semibold">{trend.correlation.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Significance:</span>
                      <div className="text-white font-semibold capitalize">{trend.significance}</div>
                    </div>
                  </div>
                  
                  {trend.prediction && (
                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="text-sm font-medium text-blue-400">🔮 Prediction:</div>
                      <div className="text-sm text-gray-300">
                        Next value: {trend.prediction.nextValue} ({trend.prediction.confidence}% confidence)
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'engine' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">AI Document Analysis Engine</h3>
            
            {/* Engine Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Document Category Distribution</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Processing Performance</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={processingTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9CA3AF"
                        tickFormatter={(date) => format(parseISO(date), 'MMM dd')}
                      />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        labelFormatter={(date) => format(parseISO(date), 'MMM dd, yyyy')} 
                      />
                      <Line type="monotone" dataKey="accuracy" stroke="#22c55e" strokeWidth={2} name="Accuracy %" />
                      <Line type="monotone" dataKey="processed" stroke="#3b82f6" strokeWidth={2} name="Documents Processed" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Quality Metrics */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
              <h4 className="text-lg font-semibold text-white mb-4">AI Engine Quality Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-black/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-1">{engineStatus.qualityMetrics.ocrAccuracy}%</div>
                  <p className="text-sm text-gray-400">OCR Accuracy</p>
                </div>
                <div className="text-center p-4 bg-black/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{engineStatus.qualityMetrics.nlpAccuracy}%</div>
                  <p className="text-sm text-gray-400">NLP Accuracy</p>
                </div>
                <div className="text-center p-4 bg-black/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{engineStatus.qualityMetrics.classificationAccuracy}%</div>
                  <p className="text-sm text-gray-400">Classification</p>
                </div>
                <div className="text-center p-4 bg-black/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">{engineStatus.qualityMetrics.dataExtractionAccuracy}%</div>
                  <p className="text-sm text-gray-400">Data Extraction</p>
                </div>
              </div>
            </div>
            
            {/* Engine Status */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-white/10 p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Engine Status & Capacity</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-white mb-2">Processing Capacity:</h5>
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {engineStatus.processingCapacity.current}/{engineStatus.processingCapacity.maximum}
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ 
                        width: `${(engineStatus.processingCapacity.current / engineStatus.processingCapacity.maximum) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-white mb-2">Model Version:</h5>
                  <div className="text-lg font-bold text-purple-400">{engineStatus.modelVersion}</div>
                  <div className="text-sm text-gray-400">
                    Updated: {format(parseISO(engineStatus.lastEngineUpdate), 'MMM dd, yyyy')}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-white mb-2">Queue Status:</h5>
                  <div className="text-lg font-bold text-green-400">
                    {engineStatus.processingCapacity.queueLength} in queue
                  </div>
                  <div className="text-sm text-gray-400">Processing ready</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}