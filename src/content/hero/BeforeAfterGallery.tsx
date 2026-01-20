"use client";

import React, { useState, useEffect, useMemo } from 'react';

// Before/After Gallery Types
type GalleryEntry = {
  id: string;
  title: string;
  description: string;
  category: 'physical' | 'mental' | 'lifestyle' | 'medical' | 'wellness';
  beforeImage?: string;
  afterImage?: string;
  beforeMetrics: MetricEntry[];
  afterMetrics: MetricEntry[];
  dateCreated: string;
  lastUpdated: string;
  tags: string[];
  privacy: 'private' | 'shared' | 'public';
  aiInsights: string[];
};

type MetricEntry = {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  date: string;
};

type ProgressComparison = {
  metric: string;
  before: number;
  after: number;
  change: number;
  percentageChange: number;
  trend: 'improving' | 'declining' | 'stable';
};

type TimelineView = {
  id: string;
  title: string;
  entries: GalleryEntry[];
  startDate: string;
  endDate: string;
  overallProgress: ProgressComparison[];
};

// Mock data for demonstration
const mockGalleryEntries: GalleryEntry[] = [
  {
    id: 'entry-1',
    title: 'Weight Loss Journey',
    description: '6-month transformation focusing on sustainable lifestyle changes',
    category: 'physical',
    beforeImage: '/api/placeholder/400/300',
    afterImage: '/api/placeholder/400/300',
    beforeMetrics: [
      { id: 'weight-1', name: 'Weight', value: 185, unit: 'lbs', date: '2025-01-01' },
      { id: 'bmi-1', name: 'BMI', value: 28.5, unit: '', date: '2025-01-01' },
      { id: 'body-fat-1', name: 'Body Fat %', value: 32, unit: '%', date: '2025-01-01' }
    ],
    afterMetrics: [
      { id: 'weight-2', name: 'Weight', value: 165, unit: 'lbs', date: '2025-07-01' },
      { id: 'bmi-2', name: 'BMI', value: 25.2, unit: '', date: '2025-07-01' },
      { id: 'body-fat-2', name: 'Body Fat %', value: 24, unit: '%', date: '2025-07-01' }
    ],
    dateCreated: '2025-01-01T00:00:00Z',
    lastUpdated: '2025-07-01T00:00:00Z',
    tags: ['weight loss', 'fitness', 'nutrition', 'sustainable'],
    privacy: 'private',
    aiInsights: [
      'Consistent 2-3 lbs weekly loss indicates sustainable approach',
      'BMI improvement suggests reduced health risks',
      'Body fat reduction correlates with improved metabolic health'
    ]
  },
  {
    id: 'entry-2',
    title: 'Mental Health Recovery',
    description: 'Journey from anxiety and depression to mental wellness',
    category: 'mental',
    beforeMetrics: [
      { id: 'anxiety-1', name: 'Anxiety Score', value: 8, unit: '/10', date: '2025-02-01' },
      { id: 'depression-1', name: 'Depression Score', value: 7, unit: '/10', date: '2025-02-01' },
      { id: 'sleep-1', name: 'Sleep Quality', value: 3, unit: '/10', date: '2025-02-01' }
    ],
    afterMetrics: [
      { id: 'anxiety-2', name: 'Anxiety Score', value: 3, unit: '/10', date: '2025-08-01' },
      { id: 'depression-2', name: 'Depression Score', value: 2, unit: '/10', date: '2025-08-01' },
      { id: 'sleep-2', name: 'Sleep Quality', value: 8, unit: '/10', date: '2025-08-01' }
    ],
    dateCreated: '2025-02-01T00:00:00Z',
    lastUpdated: '2025-08-01T00:00:00Z',
    tags: ['mental health', 'anxiety', 'depression', 'recovery'],
    privacy: 'private',
    aiInsights: [
      'Significant improvement in mental health metrics',
      'Sleep quality strongly correlates with anxiety reduction',
      'Therapy combined with lifestyle changes shows positive results'
    ]
  },
  {
    id: 'entry-3',
    title: 'Blood Pressure Management',
    description: 'Controlling hypertension through diet and exercise',
    category: 'medical',
    beforeMetrics: [
      { id: 'systolic-1', name: 'Systolic BP', value: 160, unit: 'mmHg', date: '2025-03-01' },
      { id: 'diastolic-1', name: 'Diastolic BP', value: 95, unit: 'mmHg', date: '2025-03-01' },
      { id: 'cholesterol-1', name: 'Total Cholesterol', value: 245, unit: 'mg/dL', date: '2025-03-01' }
    ],
    afterMetrics: [
      { id: 'systolic-2', name: 'Systolic BP', value: 128, unit: 'mmHg', date: '2025-09-01' },
      { id: 'diastolic-2', name: 'Diastolic BP', value: 82, unit: 'mmHg', date: '2025-09-01' },
      { id: 'cholesterol-2', name: 'Total Cholesterol', value: 185, unit: 'mg/dL', date: '2025-09-01' }
    ],
    dateCreated: '2025-03-01T00:00:00Z',
    lastUpdated: '2025-09-01T00:00:00Z',
    tags: ['hypertension', 'cardiovascular', 'cholesterol', 'lifestyle'],
    privacy: 'shared',
    aiInsights: [
      'Blood pressure normalized to healthy range',
      'Cholesterol reduction indicates improved cardiovascular risk',
      'Lifestyle interventions highly effective for hypertension management'
    ]
  }
];

const mockTimelines: TimelineView[] = [
  {
    id: 'timeline-1',
    title: '2025 Health Transformation',
    entries: mockGalleryEntries,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    overallProgress: [
      { metric: 'Weight', before: 185, after: 165, change: -20, percentageChange: -10.8, trend: 'improving' },
      { metric: 'BMI', before: 28.5, after: 25.2, change: -3.3, percentageChange: -11.6, trend: 'improving' },
      { metric: 'Mental Health Score', before: 7.5, after: 2.5, change: -5, percentageChange: -66.7, trend: 'improving' },
      { metric: 'Blood Pressure', before: 127.5, after: 105, change: -22.5, percentageChange: -17.6, trend: 'improving' }
    ]
  }
];

export default function BeforeAfterGallery() {
  const [activeTab, setActiveTab] = useState<'gallery' | 'timelines' | 'analytics' | 'insights'>('gallery');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<GalleryEntry | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'comparison' | 'timeline'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📸', color: 'from-gray-500 to-gray-600' },
    { id: 'physical', name: 'Physical Health', icon: '💪', color: 'from-red-500 to-red-600' },
    { id: 'mental', name: 'Mental Health', icon: '🧠', color: 'from-purple-500 to-purple-600' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '🏃‍♀️', color: 'from-green-500 to-green-600' },
    { id: 'medical', name: 'Medical', icon: '🏥', color: 'from-blue-500 to-blue-600' },
    { id: 'wellness', name: 'Wellness', icon: '🌱', color: 'from-orange-500 to-orange-600' }
  ];

  const filteredEntries = useMemo(() => {
    if (selectedCategory === 'all') return mockGalleryEntries;
    return mockGalleryEntries.filter(entry => entry.category === selectedCategory);
  }, [selectedCategory]);

  const getCategoryColor = (category: GalleryEntry['category']) => {
    const colors = {
      physical: 'from-red-500 to-red-600',
      mental: 'from-purple-500 to-purple-600',
      lifestyle: 'from-green-500 to-green-600',
      medical: 'from-blue-500 to-blue-600',
      wellness: 'from-orange-500 to-orange-600'
    };
    return colors[category];
  };

  const getPrivacyColor = (privacy: GalleryEntry['privacy']) => {
    const colors = {
      private: 'text-gray-400',
      shared: 'text-blue-400',
      public: 'text-green-400'
    };
    return colors[privacy];
  };

  const calculateProgress = (before: MetricEntry[], after: MetricEntry[]): ProgressComparison[] => {
    return before.map((beforeMetric, index) => {
      const afterMetric = after[index];
      if (!afterMetric || typeof beforeMetric.value !== 'number' || typeof afterMetric.value !== 'number') {
        return {
          metric: beforeMetric.name,
          before: beforeMetric.value as number,
          after: afterMetric?.value as number || 0,
          change: 0,
          percentageChange: 0,
          trend: 'stable' as const
        };
      }

      const change = afterMetric.value - beforeMetric.value;
      const percentageChange = beforeMetric.value !== 0 ? (change / beforeMetric.value) * 100 : 0;
      const trend = change > 0 ? 'improving' : change < 0 ? 'declining' : 'stable';

      return {
        metric: beforeMetric.name,
        before: beforeMetric.value,
        after: afterMetric.value,
        change,
        percentageChange,
        trend
      };
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
            Before/After Gallery
          </h1>
          <p className="text-gray-400">
            Visual health journey tracking with AI-powered progress analysis
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900 p-1 rounded-lg">
          {[
            { id: 'gallery', label: 'Gallery', icon: '📸' },
            { id: 'timelines', label: 'Timelines', icon: '📅' },
            { id: 'analytics', label: 'Analytics', icon: '📊' },
            { id: 'insights', label: 'AI Insights', icon: '🧠' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  {['grid', 'comparison', 'timeline'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode as any)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        viewMode === mode
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-medium transition"
              >
                + New Entry
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-800 transition"
                    onClick={() => setSelectedEntry(entry)}
                  >
                    {/* Image Comparison */}
                    <div className="relative h-48 bg-gray-800">
                      {entry.beforeImage && entry.afterImage ? (
                        <div className="flex h-full">
                          <div className="flex-1 relative">
                            <img
                              src={entry.beforeImage}
                              alt="Before"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                              BEFORE
                            </div>
                          </div>
                          <div className="flex-1 relative">
                            <img
                              src={entry.afterImage}
                              alt="After"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-green-500/70 text-white px-2 py-1 rounded text-xs">
                              AFTER
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📊</div>
                            <div className="text-sm">Metrics Only</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${getCategoryColor(entry.category)} text-white`}>
                          {entry.category}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{entry.description}</p>

                      {/* Metrics Preview */}
                      <div className="space-y-2">
                        {entry.beforeMetrics.slice(0, 2).map((metric, idx) => {
                          const afterMetric = entry.afterMetrics[idx];
                          const progress = calculateProgress([metric], [afterMetric])[0];
                          return (
                            <div key={metric.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">{metric.name}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-red-400">{metric.value}{metric.unit}</span>
                                <span className="text-gray-400">→</span>
                                <span className={`font-medium ${
                                  progress.trend === 'improving' ? 'text-green-400' :
                                  progress.trend === 'declining' ? 'text-red-400' : 'text-gray-400'
                                }`}>
                                  {afterMetric?.value}{afterMetric?.unit}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs ${getPrivacyColor(entry.privacy)}`}>
                            {entry.privacy}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(entry.lastUpdated).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          {entry.tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comparison View */}
            {viewMode === 'comparison' && (
              <div className="space-y-6">
                {filteredEntries.map((entry) => (
                  <div key={entry.id} className="bg-gray-900 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-semibold text-white mb-2">{entry.title}</h3>
                        <p className="text-gray-400">{entry.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded text-sm font-medium bg-gradient-to-r ${getCategoryColor(entry.category)} text-white`}>
                        {entry.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Before Column */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-red-400">Before</h4>
                        {entry.beforeImage && (
                          <img
                            src={entry.beforeImage}
                            alt="Before"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        )}
                        <div className="space-y-2">
                          {entry.beforeMetrics.map((metric) => (
                            <div key={metric.id} className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                              <span className="text-gray-300">{metric.name}</span>
                              <span className="text-red-400 font-medium">{metric.value} {metric.unit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* After Column */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-green-400">After</h4>
                        {entry.afterImage && (
                          <img
                            src={entry.afterImage}
                            alt="After"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        )}
                        <div className="space-y-2">
                          {entry.afterMetrics.map((metric) => (
                            <div key={metric.id} className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                              <span className="text-gray-300">{metric.name}</span>
                              <span className="text-green-400 font-medium">{metric.value} {metric.unit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Progress Summary */}
                    <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                      <h4 className="text-lg font-semibold text-white mb-4">Progress Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {calculateProgress(entry.beforeMetrics, entry.afterMetrics).map((progress, idx) => (
                          <div key={idx} className="text-center">
                            <div className="text-2xl font-bold text-white mb-1">{progress.metric}</div>
                            <div className="text-sm text-gray-400 mb-2">
                              {progress.before} → {progress.after} {entry.beforeMetrics[idx]?.unit}
                            </div>
                            <div className={`text-lg font-semibold ${
                              progress.trend === 'improving' ? 'text-green-400' :
                              progress.trend === 'declining' ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              {progress.change > 0 ? '+' : ''}{progress.change.toFixed(1)}
                              ({progress.percentageChange > 0 ? '+' : ''}{progress.percentageChange.toFixed(1)}%)
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Timelines Tab */}
        {activeTab === 'timelines' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-blue-400">📅 Health Timelines</h2>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition">
                + New Timeline
              </button>
            </div>

            {mockTimelines.map((timeline) => (
              <div key={timeline.id} className="bg-gray-900 rounded-xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">{timeline.title}</h3>
                    <p className="text-gray-400">
                      {new Date(timeline.startDate).toLocaleDateString()} - {new Date(timeline.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400">{timeline.entries.length}</div>
                    <div className="text-sm text-gray-400">Entries</div>
                  </div>
                </div>

                {/* Timeline Progress */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Overall Progress</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {timeline.overallProgress.map((progress, idx) => (
                      <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">{progress.metric}</div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-red-400">{progress.before}</span>
                          <span className="text-gray-400">→</span>
                          <span className={`font-semibold ${
                            progress.trend === 'improving' ? 'text-green-400' :
                            progress.trend === 'declining' ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {progress.after}
                          </span>
                        </div>
                        <div className={`text-sm font-medium ${
                          progress.trend === 'improving' ? 'text-green-400' :
                          progress.trend === 'declining' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {progress.change > 0 ? '+' : ''}{progress.change.toFixed(1)}
                          ({progress.percentageChange > 0 ? '+' : ''}{progress.percentageChange.toFixed(1)}%)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Entries */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Timeline Entries</h4>
                  {timeline.entries.map((entry, idx) => (
                    <div key={entry.id} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        {idx < timeline.entries.length - 1 && (
                          <div className="w-0.5 h-16 bg-gray-700 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="text-lg font-semibold text-white">{entry.title}</h5>
                            <span className="text-sm text-gray-400">
                              {new Date(entry.dateCreated).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{entry.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.map((tag, tagIdx) => (
                              <span key={tagIdx} className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-orange-400">📊 Progress Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Category Distribution</h3>
                <div className="space-y-4">
                  {categories.slice(1).map((category) => {
                    const count = mockGalleryEntries.filter(e => e.category === category.id).length;
                    const percentage = (count / mockGalleryEntries.length) * 100;
                    return (
                      <div key={category.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{category.icon}</span>
                          <span className="text-white">{category.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${category.color} h-2 rounded-full`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-gray-400 text-sm w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress Trends */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Progress Trends</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <h4 className="font-medium text-green-400 mb-2">Most Improved Metrics</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Mental Health Score: -66.7% improvement</li>
                      <li>• Body Fat Percentage: -25% reduction</li>
                      <li>• Blood Pressure: -17.6% improvement</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <h4 className="font-medium text-blue-400 mb-2">Consistent Progress Areas</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Weight management: Steady 2-3 lbs/week loss</li>
                      <li>• Sleep quality: Gradual improvement</li>
                      <li>• Cardiovascular metrics: Stable improvement</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Success Metrics */}
              <div className="bg-gray-900 rounded-xl p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">Success Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">📈</div>
                    <div className="text-lg font-bold text-green-400">87%</div>
                    <div className="text-sm text-gray-400">Goals Achieved</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-lg font-bold text-blue-400">23</div>
                    <div className="text-sm text-gray-400">Total Metrics Tracked</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">📅</div>
                    <div className="text-lg font-bold text-purple-400">8.5</div>
                    <div className="text-sm text-gray-400">Avg Months Tracked</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">🏆</div>
                    <div className="text-lg font-bold text-orange-400">94%</div>
                    <div className="text-sm text-gray-400">User Engagement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-green-400">🧠 AI-Powered Insights</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pattern Recognition */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🔍 Pattern Recognition</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <h4 className="font-medium text-purple-400 mb-2">Lifestyle Correlations</h4>
                    <p className="text-sm text-gray-300">
                      Weight loss progress strongly correlates with consistent exercise patterns.
                      Maintaining 4-5 workout sessions per week shows 2.3x better results.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <h4 className="font-medium text-blue-400 mb-2">Mental Health Trends</h4>
                    <p className="text-sm text-gray-300">
                      Mental health improvements follow sleep quality enhancements by 2-3 weeks.
                      Prioritizing sleep hygiene may accelerate overall recovery.
                    </p>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <h4 className="font-medium text-green-400 mb-2">Medical Progress</h4>
                    <p className="text-sm text-gray-300">
                      Blood pressure improvements correlate with reduced sodium intake and increased potassium-rich foods.
                      DASH diet principles show measurable cardiovascular benefits.
                    </p>
                  </div>
                </div>
              </div>

              {/* Predictive Insights */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🔮 Predictive Insights</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <h4 className="font-medium text-orange-400 mb-2">6-Month Projection</h4>
                    <p className="text-sm text-gray-300">
                      Based on current trends, projected BMI reduction to 23.8 with continued lifestyle adherence.
                      78% confidence in achieving target weight goal.
                    </p>
                  </div>
                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                    <h4 className="font-medium text-red-400 mb-2">Risk Assessment</h4>
                    <p className="text-sm text-gray-300">
                      Cardiovascular risk reduced by 34% based on current trajectory.
                      Continued monitoring recommended for optimal risk reduction.
                    </p>
                  </div>
                  <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                    <h4 className="font-medium text-cyan-400 mb-2">Optimization Suggestions</h4>
                    <p className="text-sm text-gray-300">
                      Adding strength training 2x/week could accelerate metabolism by 15%.
                      Consider tracking macronutrient distribution for better results.
                    </p>
                  </div>
                </div>
              </div>

              {/* Personalized Recommendations */}
              <div className="bg-gray-900 rounded-xl p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">💡 Personalized Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                    <h4 className="font-medium text-green-400 mb-2">Next Milestone</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Target BMI of 24 achievable in 8 weeks with current progress rate.
                    </p>
                    <button className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 rounded text-sm font-medium transition">
                      Set Goal
                    </button>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                    <h4 className="font-medium text-blue-400 mb-2">Intervention Opportunity</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Sleep quality plateau detected. Consider sleep tracking for optimization.
                    </p>
                    <button className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded text-sm font-medium transition">
                      Start Tracking
                    </button>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                    <h4 className="font-medium text-purple-400 mb-2">Celebration Moment</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      20 lb weight loss milestone achieved! Time to celebrate progress.
                    </p>
                    <button className="w-full px-3 py-2 bg-purple-500 hover:bg-purple-600 rounded text-sm font-medium transition">
                      Celebrate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Entry Detail Modal */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">{selectedEntry.title}</h2>
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <p className="text-gray-400">{selectedEntry.description}</p>

                  {/* Image Comparison */}
                  {selectedEntry.beforeImage && selectedEntry.afterImage && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-red-400 mb-4">Before</h3>
                        <img
                          src={selectedEntry.beforeImage}
                          alt="Before"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-400 mb-4">After</h3>
                        <img
                          src={selectedEntry.afterImage}
                          alt="After"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  {/* Metrics Comparison */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Progress Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {calculateProgress(selectedEntry.beforeMetrics, selectedEntry.afterMetrics).map((progress, idx) => (
                        <div key={idx} className="p-4 bg-gray-800 rounded-lg">
                          <h4 className="font-medium text-white mb-2">{progress.metric}</h4>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-red-400">Before: {progress.before}</span>
                            <span className="text-green-400">After: {progress.after}</span>
                          </div>
                          <div className={`text-sm font-medium ${
                            progress.trend === 'improving' ? 'text-green-400' :
                            progress.trend === 'declining' ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            Change: {progress.change > 0 ? '+' : ''}{progress.change.toFixed(1)}
                            ({progress.percentageChange > 0 ? '+' : ''}{progress.percentageChange.toFixed(1)}%)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400 mb-4">AI Insights</h3>
                    <div className="space-y-3">
                      {selectedEntry.aiInsights.map((insight, idx) => (
                        <div key={idx} className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <p className="text-gray-300">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Entry Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">Create New Entry</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-center py-8">
                  <p className="text-gray-400">Entry creation form would be implemented here</p>
                  <p className="text-sm text-gray-500 mt-2">Including image upload, metric input, and categorization</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}