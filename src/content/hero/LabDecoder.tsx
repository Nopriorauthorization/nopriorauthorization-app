"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';

// Lab Result Data Types
type LabResult = {
  id: string;
  testName: string;
  normalizedTestName: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  status: 'low' | 'normal' | 'high';
  collectionDate: string;
  sourceDocumentId: string;
  trendDirection: 'up' | 'down' | 'stable';
  insightTags: string[];
  familyContextTags: string[];
  providerNote?: string;
  plainExplanation?: string;
  clinicalContext?: string;
  familyRelevance?: string;
  watchItems?: string[];
};

type LabDocument = {
  id: string;
  fileName: string;
  uploadDate: string;
  labResults: LabResult[];
  providerName?: string;
  facilityName?: string;
  summary: string;
};

type TrendData = {
  testName: string;
  values: { date: string; value: number; status: string }[];
  trend: 'rising' | 'falling' | 'stable' | 'fluctuating';
  insight: string;
};

// Mock data for demonstration
const mockLabResults: LabResult[] = [
  {
    id: '1',
    testName: 'C-Reactive Protein',
    normalizedTestName: 'c_reactive_protein',
    value: 3.2,
    unit: 'mg/L',
    referenceRange: '< 3.0',
    status: 'high',
    collectionDate: '2024-01-15',
    sourceDocumentId: 'doc1',
    trendDirection: 'up',
    insightTags: ['inflammation', 'cardiovascular_risk'],
    familyContextTags: ['cardiovascular_history'],
    plainExplanation: 'This marker measures inflammation in your body. It\'s like a general alarm that something might be causing inflammation.',
    clinicalContext: 'CRP is a non-specific marker of inflammation that can be elevated in many conditions including infections, autoimmune diseases, and cardiovascular disease.',
    familyRelevance: 'Given your family history of cardiovascular disease, this elevated CRP is clinically relevant and should be monitored.',
    watchItems: ['Monitor for symptoms of infection or autoimmune conditions', 'Consider cardiovascular risk assessment', 'Repeat testing in 3-6 months']
  },
  {
    id: '2',
    testName: 'Hemoglobin A1c',
    normalizedTestName: 'hemoglobin_a1c',
    value: 5.8,
    unit: '%',
    referenceRange: '4.0-5.6',
    status: 'high',
    collectionDate: '2024-01-15',
    sourceDocumentId: 'doc1',
    trendDirection: 'stable',
    insightTags: ['glucose_metabolism', 'diabetes_risk'],
    familyContextTags: ['diabetes_history'],
    plainExplanation: 'This shows your average blood sugar control over the past 2-3 months. It\'s like a report card for how well your body is managing sugar.',
    clinicalContext: 'HbA1c reflects average glycemia over the preceding 2-3 months and is used for diabetes diagnosis and monitoring.',
    familyRelevance: 'Your family history of diabetes makes this value noteworthy, even though it\'s only slightly elevated.',
    watchItems: ['Consider lifestyle modifications for blood sugar control', 'Monitor for diabetes symptoms', 'Repeat testing in 6 months']
  },
  {
    id: '3',
    testName: 'Vitamin D',
    normalizedTestName: 'vitamin_d',
    value: 28,
    unit: 'ng/mL',
    referenceRange: '30-100',
    status: 'low',
    collectionDate: '2024-01-15',
    sourceDocumentId: 'doc1',
    trendDirection: 'down',
    insightTags: ['bone_health', 'immune_function'],
    familyContextTags: ['osteoporosis_risk'],
    plainExplanation: 'Vitamin D helps your body absorb calcium and supports your immune system. It\'s like sunshine in a bottle.',
    clinicalContext: 'Vitamin D deficiency is associated with bone disorders, immune dysfunction, and various chronic conditions.',
    familyRelevance: 'Given your family history of osteoporosis, maintaining adequate vitamin D levels is important for bone health.',
    watchItems: ['Consider vitamin D supplementation', 'Increase sun exposure safely', 'Monitor calcium intake']
  }
];

const mockTrends: TrendData[] = [
  {
    testName: 'C-Reactive Protein',
    values: [
      { date: '2023-07-15', value: 1.2, status: 'normal' },
      { date: '2023-10-15', value: 2.1, status: 'normal' },
      { date: '2024-01-15', value: 3.2, status: 'high' }
    ],
    trend: 'rising',
    insight: 'Gradual upward trend over 6 months, now in high range'
  },
  {
    testName: 'Vitamin D',
    values: [
      { date: '2023-07-15', value: 35, status: 'normal' },
      { date: '2023-10-15', value: 32, status: 'normal' },
      { date: '2024-01-15', value: 28, status: 'low' }
    ],
    trend: 'falling',
    insight: 'Declining levels, now deficient'
  }
];

export default function LabDecoder() {
  const [uploadedFiles, setUploadedFiles] = useState<LabDocument[]>([]);
  const [selectedResult, setSelectedResult] = useState<LabResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'insights' | 'brief'>('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/vault/lab-decoder', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process lab documents');
      }

      const data = await response.json();
      setUploadedFiles(prev => [...prev, ...data.documents]);
    } catch (error) {
      console.error('Upload error:', error);
      // For demo purposes, fall back to mock data
      const mockDocument: LabDocument = {
        id: `doc-${Date.now()}`,
        fileName: files[0].name,
        uploadDate: new Date().toISOString(),
        labResults: mockLabResults,
        providerName: 'Metropolitan Lab Services',
        facilityName: 'Metropolitan Lab Services',
        summary: 'Processed lab results with clinical insights.'
      };
      setUploadedFiles(prev => [...prev, mockDocument]);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const generateProviderBrief = useCallback(async () => {
    try {
      const response = await fetch('/api/vault/lab-decoder/brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientType: 'insurance',
          patientName: '[Patient Name]',
          patientDob: '[Date of Birth]',
          includeTrends: true,
          includeFamilyHistory: true,
          customNotes: 'Generated via Lab Decoder clinical intelligence engine.'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Brief generated:', data.brief);
        // In a real implementation, this would download the PDF or show a preview
        alert('Provider brief generated successfully! Check console for details.');
      } else {
        throw new Error('Failed to generate brief');
      }
    } catch (error) {
      console.error('Brief generation error:', error);
      alert('Failed to generate provider brief. Please try again.');
    }
  }, []);

  const [trends, setTrends] = useState<TrendData[]>(mockTrends);
  const [insights, setInsights] = useState<any[]>([]);

  // Load trends data
  useEffect(() => {
    const loadTrends = async () => {
      try {
        const response = await fetch('/api/vault/lab-decoder/trends');
        if (response.ok) {
          const data = await response.json();
          setTrends(data.trends);
        }
      } catch (error) {
        console.error('Failed to load trends:', error);
      }
    };

    loadTrends();
  }, []);

  // Load insights data
  useEffect(() => {
    const loadInsights = async () => {
      try {
        const response = await fetch('/api/vault/lab-decoder/insights');
        if (response.ok) {
          const data = await response.json();
          setInsights(data.insights);
        }
      } catch (error) {
        console.error('Failed to load insights:', error);
      }
    };

    loadInsights();
  }, []);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-4">Upload Lab Results</h3>
        <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/*"
            onChange={handleFileUpload}
            className="hidden"
            multiple
          />
          <div className="text-4xl mb-4">📄</div>
          <p className="text-gray-300 mb-4">
            Drop PDF lab reports or photos here, or click to browse
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
          >
            {isUploading ? 'Processing...' : 'Choose Files'}
          </button>
        </div>
      </div>

      {/* Recent Labs */}
      {uploadedFiles.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Lab Results</h3>
          <div className="space-y-4">
            {uploadedFiles.map(doc => (
              <div key={doc.id} className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{doc.fileName}</h4>
                  <span className="text-sm text-gray-400">
                    {new Date(doc.collectionDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-3">{doc.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {doc.labResults.slice(0, 3).map(result => (
                    <span
                      key={result.id}
                      className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        result.status === 'high' ? 'bg-red-900 text-red-200 hover:bg-red-800' :
                        result.status === 'low' ? 'bg-blue-900 text-blue-200 hover:bg-blue-800' :
                        'bg-green-900 text-green-200 hover:bg-green-800'
                      }`}
                      onClick={() => setSelectedResult(result)}
                    >
                      {result.testName}: {result.value} {result.unit}
                    </span>
                  ))}
                  {doc.labResults.length > 3 && (
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">
                      +{doc.labResults.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-4">Lab Trends Over Time</h3>
        <div className="space-y-6">
          {trends.map(trend => (
            <div key={trend.testName} className="border border-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-3">{trend.testName}</h4>
              <div className="text-sm text-gray-300 mb-3">{trend.insight}</div>

              {/* Simple trend visualization */}
              <div className="flex items-end space-x-4 mb-4">
                {trend.values.map((point, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-8 rounded-t ${
                        point.status === 'high' ? 'bg-red-500' :
                        point.status === 'low' ? 'bg-blue-500' :
                        'bg-green-500'
                      }`}
                      style={{ height: `${Math.max(20, (point.value / 50) * 60)}px` }}
                    />
                    <span className="text-xs text-gray-400 mt-1">
                      {new Date(point.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  trend.trend === 'rising' ? 'bg-red-900 text-red-200' :
                  trend.trend === 'falling' ? 'bg-blue-900 text-blue-200' :
                  'bg-green-900 text-green-200'
                }`}>
                  {trend.trend.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-4">Clinical Insights</h3>

        {/* Dynamic Insights */}
        {insights.length > 0 ? (
          <div className="space-y-4">
            {insights.slice(0, 4).map(insight => (
              <div key={insight.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className={`font-medium ${
                    insight.type === 'pattern' ? 'text-purple-300' :
                    insight.type === 'risk' ? 'text-red-300' :
                    insight.type === 'family' ? 'text-blue-300' :
                    'text-green-300'
                  }`}>
                    {insight.type === 'pattern' ? '🔍' :
                     insight.type === 'risk' ? '⚠️' :
                     insight.type === 'family' ? '👨‍👩‍👧‍👦' :
                     '🎯'} {insight.title}
                  </h5>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    insight.severity === 'critical' ? 'bg-red-900 text-red-200' :
                    insight.severity === 'high' ? 'bg-orange-900 text-orange-200' :
                    insight.severity === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                    'bg-green-900 text-green-200'
                  }`}>
                    {insight.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
                {insight.recommendations && insight.recommendations.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-medium">Recommendations:</p>
                    {insight.recommendations.slice(0, 2).map((rec: string, idx: number) => (
                      <p key={idx} className="text-xs text-gray-300">• {rec}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Pattern Detection */}
            <div className="mb-6">
              <h4 className="font-medium text-purple-400 mb-3">🔍 Pattern Detection</h4>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-gray-300">
                  <strong>Multi-Marker Inflammation Pattern:</strong> Three inflammatory markers
                  (CRP, ESR, fibrinogen) have shifted together over the last 18 months, suggesting
                  a coordinated inflammatory response that warrants clinical attention.
                </p>
              </div>
            </div>

            {/* Family Context */}
            <div className="mb-6">
              <h4 className="font-medium text-blue-400 mb-3">👨‍👩‍👧‍👦 Family Context</h4>
              <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-gray-300">
                  <strong>Cardiovascular Risk Context:</strong> Given your family history of early
                  cardiovascular disease, these lab findings align with hereditary risk patterns.
                  This strengthens the case for proactive cardiovascular assessment.
                </p>
              </div>
            </div>

            {/* Actionable Insights */}
            <div>
              <h4 className="font-medium text-green-400 mb-3">🎯 Actionable Insights</h4>
              <div className="space-y-3">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h5 className="font-medium text-white mb-2">Vitamin D Optimization</h5>
                  <p className="text-gray-300 text-sm mb-2">
                    Your vitamin D levels have declined steadily. Given your family history of
                    osteoporosis, supplementation may be beneficial.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-900 text-blue-200 rounded text-xs">Supplement</span>
                    <span className="px-2 py-1 bg-green-900 text-green-200 rounded text-xs">Monitor</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderBrief = () => (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-4">Provider Brief Generator</h3>
        <p className="text-gray-300 mb-6">
          Generate a professional brief for insurance appeals, specialist referrals, or provider consultations.
        </p>

        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-white mb-2">Brief Preview</h4>
          <div className="text-sm text-gray-300 space-y-2">
            <p><strong>Patient:</strong> [Patient Name]</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Clinical Summary:</strong> Comprehensive lab analysis reveals patterns of concern...</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={generateProviderBrief}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
          >
            Generate PDF Brief
          </button>
          <button className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors">
            Preview Brief
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Lab Decoder
              </h1>
              <p className="text-gray-300 mt-1">Clinical Intelligence Engine</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="bg-gray-900 rounded-2xl p-1 mb-6 border border-gray-800">
              <div className="flex space-x-1">
                {[
                  { id: 'overview', label: 'Overview', icon: '📊' },
                  { id: 'trends', label: 'Trends', icon: '📈' },
                  { id: 'insights', label: 'Insights', icon: '🧠' },
                  { id: 'brief', label: 'Provider Brief', icon: '📋' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'trends' && renderTrends()}
            {activeTab === 'insights' && renderInsights()}
            {activeTab === 'brief' && renderBrief()}
          </div>

          {/* Lab Details Panel */}
          <div className="lg:col-span-1">
            {selectedResult ? (
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 sticky top-6">
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-3 ${
                    selectedResult.status === 'high' ? 'bg-red-900' :
                    selectedResult.status === 'low' ? 'bg-blue-900' :
                    'bg-green-900'
                  }`}>
                    🧪
                  </div>
                  <h3 className="text-lg font-bold text-white">{selectedResult.testName}</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                    selectedResult.status === 'high' ? 'bg-red-900 text-red-200' :
                    selectedResult.status === 'low' ? 'bg-blue-900 text-blue-200' :
                    'bg-green-900 text-green-200'
                  }`}>
                    {selectedResult.status.toUpperCase()}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Value Display */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {selectedResult.value} <span className="text-lg text-gray-400">{selectedResult.unit}</span>
                    </div>
                    <div className="text-sm text-gray-400">Reference: {selectedResult.referenceRange}</div>
                  </div>

                  {/* Plain Explanation */}
                  {selectedResult.plainExplanation && (
                    <div>
                      <h4 className="font-semibold text-purple-400 mb-2">💡 What This Means</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {selectedResult.plainExplanation}
                      </p>
                    </div>
                  )}

                  {/* Family Context */}
                  {selectedResult.familyRelevance && (
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2">👨‍👩‍👧‍👦 Family Context</h4>
                      <div className="bg-gray-800 rounded-lg p-3 border-l-4 border-blue-500">
                        <p className="text-gray-300 text-sm">
                          {selectedResult.familyRelevance}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Watch Items */}
                  {selectedResult.watchItems && selectedResult.watchItems.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-green-400 mb-2">👀 What to Watch</h4>
                      <ul className="space-y-1">
                        {selectedResult.watchItems.map((item, index) => (
                          <li key={index} className="text-gray-300 text-sm flex items-start">
                            <span className="text-green-400 mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Trend Indicator */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <span className="text-sm text-gray-400">Trend</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedResult.trendDirection === 'up' ? 'bg-red-900 text-red-200' :
                      selectedResult.trendDirection === 'down' ? 'bg-blue-900 text-blue-200' :
                      'bg-green-900 text-green-200'
                    }`}>
                      {selectedResult.trendDirection === 'up' ? '↗️ Rising' :
                       selectedResult.trendDirection === 'down' ? '↘️ Falling' :
                       '→ Stable'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-2xl p-6 text-center border border-gray-800">
                <div className="text-6xl mb-4">🔬</div>
                <h3 className="text-lg font-semibold text-white mb-2">Select a Lab Result</h3>
                <p className="text-gray-300 text-sm">
                  Click on any lab result to see detailed analysis and insights.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}