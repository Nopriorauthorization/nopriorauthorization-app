"use client";

import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';

// Sample document analytics data
const documentCategoryData = [
  { category: 'Lab Results', count: 35, percentage: 35, aiAccuracy: 92, color: '#10b981' },
  { category: 'Imaging', count: 20, percentage: 20, aiAccuracy: 88, color: '#3b82f6' },
  { category: 'Visit Notes', count: 25, percentage: 25, aiAccuracy: 85, color: '#8b5cf6' },
  { category: 'Discharge', count: 15, percentage: 15, aiAccuracy: 94, color: '#f59e0b' },
  { category: 'Other', count: 5, percentage: 5, aiAccuracy: 76, color: '#ef4444' },
];

const uploadTrendsData = [
  { month: 'Jan', uploads: 8, aiCategorized: 6, manualCategorized: 2, accuracy: 87 },
  { month: 'Feb', uploads: 12, aiCategorized: 10, manualCategorized: 2, accuracy: 89 },
  { month: 'Mar', uploads: 6, aiCategorized: 5, manualCategorized: 1, accuracy: 91 },
  { month: 'Apr', uploads: 14, aiCategorized: 12, manualCategorized: 2, accuracy: 88 },
  { month: 'May', uploads: 10, aiCategorized: 9, manualCategorized: 1, accuracy: 93 },
  { month: 'Jun', uploads: 16, aiCategorized: 15, manualCategorized: 1, accuracy: 95 },
];

const aiPerformanceData = [
  { metric: 'Overall Accuracy', value: 89, maxValue: 100, color: '#10b981' },
  { metric: 'Confidence Score', value: 84, maxValue: 100, color: '#3b82f6' },
  { metric: 'Auto-categorization Rate', value: 91, maxValue: 100, color: '#8b5cf6' },
  { metric: 'User Satisfaction', value: 87, maxValue: 100, color: '#f59e0b' },
];

const documentTypesOverTime = [
  { date: '2024-01', labs: 5, imaging: 2, visits: 3, discharge: 1, other: 1 },
  { date: '2024-02', labs: 7, imaging: 3, visits: 4, discharge: 2, other: 0 },
  { date: '2024-03', labs: 3, imaging: 1, visits: 2, discharge: 1, other: 1 },
  { date: '2024-04', labs: 8, imaging: 4, visits: 5, discharge: 2, other: 1 },
  { date: '2024-05', labs: 6, imaging: 2, visits: 4, discharge: 3, other: 0 },
  { date: '2024-06', labs: 9, imaging: 5, visits: 6, discharge: 3, other: 2 },
];

const providerDistribution = [
  { provider: 'Dr. Sarah Chen', documents: 28, category: 'Primary Care', color: '#ec4899' },
  { provider: 'Dr. Michael Torres', documents: 15, category: 'Endocrinology', color: '#8b5cf6' },
  { provider: 'Regional Imaging', documents: 12, category: 'Imaging Center', color: '#3b82f6' },
  { provider: 'Quest Diagnostics', documents: 22, category: 'Laboratory', color: '#10b981' },
  { provider: 'City Hospital', documents: 8, category: 'Hospital', color: '#f59e0b' },
  { provider: 'Other Providers', documents: 15, category: 'Various', color: '#6b7280' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-pink-500/30 rounded-lg p-3 backdrop-blur-sm">
        <p className="text-white font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
            {entry.dataKey === 'accuracy' && '%'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DocumentAnalyticsVisualization() {
  const [selectedView, setSelectedView] = React.useState('overview');
  const [timeRange, setTimeRange] = React.useState('6months');

  const totalDocuments = documentCategoryData.reduce((sum, item) => sum + item.count, 0);
  const avgAIAccuracy = Math.round(documentCategoryData.reduce((sum, item) => sum + item.aiAccuracy, 0) / documentCategoryData.length);
  const totalUploadsThisMonth = uploadTrendsData[uploadTrendsData.length - 1]?.uploads || 0;
  const aiCategorizedThisMonth = uploadTrendsData[uploadTrendsData.length - 1]?.aiCategorized || 0;
  const autoCategorizeRate = Math.round((aiCategorizedThisMonth / totalUploadsThisMonth) * 100);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Document Analytics Dashboard
          </h1>
          <p className="text-gray-400 mb-6">
            Insights into your document organization patterns and AI categorization performance
          </p>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl p-4 border border-pink-500/20">
              <h3 className="text-sm text-gray-400 mb-1">Total Documents</h3>
              <div className="text-2xl font-bold text-pink-400">{totalDocuments}</div>
              <p className="text-xs text-gray-500">Across all categories</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
              <h3 className="text-sm text-gray-400 mb-1">AI Accuracy</h3>
              <div className="text-2xl font-bold text-green-400">{avgAIAccuracy}%</div>
              <p className="text-xs text-gray-500">Average categorization accuracy</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
              <h3 className="text-sm text-gray-400 mb-1">This Month</h3>
              <div className="text-2xl font-bold text-blue-400">{totalUploadsThisMonth}</div>
              <p className="text-xs text-gray-500">New documents added</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-xl p-4 border border-purple-500/20">
              <h3 className="text-sm text-gray-400 mb-1">Auto-Categorized</h3>
              <div className="text-2xl font-bold text-purple-400">{autoCategorizeRate}%</div>
              <p className="text-xs text-gray-500">Documents auto-tagged</p>
            </div>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select 
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className="bg-black border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
          >
            <option value="overview">Overview</option>
            <option value="categories">Categories</option>
            <option value="trends">Upload Trends</option>
            <option value="ai-performance">AI Performance</option>
            <option value="providers">Provider Analysis</option>
          </select>
          
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-black border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Document Categories Distribution */}
          {(selectedView === 'overview' || selectedView === 'categories') && (
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-3 h-3 bg-pink-500 rounded-full mr-3"></span>
                Document Categories
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={documentCategoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ category, percentage }) => `${category}: ${percentage}%`}
                    labelLine={false}
                  >
                    {documentCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {documentCategoryData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-black/20 rounded">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      <span>{item.category}</span>
                    </div>
                    <span className="text-gray-400">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Trends Over Time */}
          {(selectedView === 'overview' || selectedView === 'trends') && (
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                Upload Trends & AI Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={uploadTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis yAxisId="left" stroke="#9ca3af" />
                  <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="uploads"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Total Uploads"
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="aiCategorized"
                    stackId="2"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.8}
                    name="AI Categorized"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#ec4899"
                    strokeWidth={3}
                    dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
                    name="AI Accuracy %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* AI Performance Metrics */}
          {(selectedView === 'overview' || selectedView === 'ai-performance') && (
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                AI Performance Dashboard
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={aiPerformanceData}>
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill="#8884d8"
                    label={{ position: 'insideStart', fill: '#fff', fontSize: '12' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {aiPerformanceData.map((metric, index) => (
                  <div key={index} className="bg-black/20 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">{metric.metric}</span>
                      <span className="text-lg font-bold" style={{ color: metric.color }}>
                        {metric.value}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${metric.value}%`,
                          backgroundColor: metric.color 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document Types Over Time */}
          {(selectedView === 'overview' || selectedView === 'trends') && (
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                Document Types Timeline
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={documentTypesOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="labs" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.8} name="Lab Results" />
                  <Area type="monotone" dataKey="imaging" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.8} name="Imaging" />
                  <Area type="monotone" dataKey="visits" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.8} name="Visit Notes" />
                  <Area type="monotone" dataKey="discharge" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.8} name="Discharge" />
                  <Area type="monotone" dataKey="other" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.8} name="Other" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Provider Document Distribution */}
          {(selectedView === 'overview' || selectedView === 'providers') && (
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
                Documents by Provider
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={providerDistribution} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="provider" type="category" stroke="#9ca3af" width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="documents" fill="#f59e0b" name="Documents">
                    {providerDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* AI Categorization Insights */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-6">
          <h3 className="text-xl font-semibold mb-4">AI Categorization Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/20 rounded-lg p-4">
              <h4 className="font-medium text-green-400 mb-2">🎯 Top Performing Categories</h4>
              <div className="space-y-2">
                {documentCategoryData
                  .sort((a, b) => b.aiAccuracy - a.aiAccuracy)
                  .slice(0, 3)
                  .map((cat, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{cat.category}</span>
                      <span className="text-green-400 font-medium">{cat.aiAccuracy}%</span>
                    </div>
                  ))
                }
              </div>
            </div>

            <div className="bg-black/20 rounded-lg p-4">
              <h4 className="font-medium text-blue-400 mb-2">📈 Improvement Trends</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Monthly accuracy gain</span>
                  <span className="text-blue-400 font-medium">+2.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Auto-categorization rate</span>
                  <span className="text-blue-400 font-medium">91%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Manual corrections</span>
                  <span className="text-blue-400 font-medium">9%</span>
                </div>
              </div>
            </div>

            <div className="bg-black/20 rounded-lg p-4">
              <h4 className="font-medium text-purple-400 mb-2">💡 Recommendations</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• Focus on 'Other' category accuracy improvement</p>
                <p>• Consider sub-categories for Visit Notes</p>
                <p>• Excellent progress on automated tagging!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}