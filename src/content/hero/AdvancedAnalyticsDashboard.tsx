"use client";

import React, { useState, useMemo } from 'react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Advanced Analytics Dashboard Types
type MetricType = 'health' | 'engagement' | 'goals' | 'habits' | 'insights';

type TimeRange = '7d' | '30d' | '90d' | '1y';

type AnalyticsData = {
  date: string;
  healthScore: number;
  steps: number;
  sleepHours: number;
  mood: number;
  energy: number;
  stress: number;
  engagement: number;
  goalsCompleted: number;
  habitsCompleted: number;
};

type Insight = {
  id: string;
  type: 'trend' | 'correlation' | 'prediction' | 'anomaly';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  data?: any;
};

type CohortAnalysis = {
  name: string;
  users: number;
  avgHealthScore: number;
  avgEngagement: number;
  retentionRate: number;
  conversionRate: number;
  color: string;
};

// Mock analytics data
const generateAnalyticsData = (days: number): AnalyticsData[] => {
  const data: AnalyticsData[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      healthScore: Math.floor(Math.random() * 20) + 75 + Math.sin(i * 0.1) * 5,
      steps: Math.floor(Math.random() * 3000) + 7000,
      sleepHours: Math.floor(Math.random() * 2) + 7 + Math.sin(i * 0.15) * 0.5,
      mood: Math.floor(Math.random() * 3) + 6,
      energy: Math.floor(Math.random() * 3) + 6,
      stress: Math.floor(Math.random() * 4) + 2,
      engagement: Math.floor(Math.random() * 30) + 70,
      goalsCompleted: Math.floor(Math.random() * 3),
      habitsCompleted: Math.floor(Math.random() * 5) + 3
    });
  }

  return data;
};

const mockInsights: Insight[] = [
  {
    id: '1',
    type: 'trend',
    title: 'Health Score Improving',
    description: 'Your overall health score has increased by 12% over the past 30 days, with consistent upward trajectory.',
    confidence: 94,
    impact: 'high',
    category: 'Health Trends'
  },
  {
    id: '2',
    type: 'correlation',
    title: 'Sleep-Energy Correlation',
    description: 'Days with 7+ hours of sleep show 23% higher energy levels and 18% lower stress.',
    confidence: 87,
    impact: 'high',
    category: 'Correlations'
  },
  {
    id: '3',
    type: 'prediction',
    title: 'Goal Achievement Forecast',
    description: 'Based on current patterns, 74% chance of completing all active goals within the next 6 weeks.',
    confidence: 78,
    impact: 'medium',
    category: 'Predictions'
  },
  {
    id: '4',
    type: 'anomaly',
    title: 'Stress Spike Detected',
    description: 'Unusual stress increase detected on workdays. Consider implementing stress management techniques.',
    confidence: 91,
    impact: 'high',
    category: 'Anomalies'
  }
];

const mockCohorts: CohortAnalysis[] = [
  { name: 'High Engagers', users: 1250, avgHealthScore: 87, avgEngagement: 92, retentionRate: 94, conversionRate: 78, color: '#10B981' },
  { name: 'Consistent Users', users: 2100, avgHealthScore: 82, avgEngagement: 78, retentionRate: 87, conversionRate: 65, color: '#3B82F6' },
  { name: 'Goal Focused', users: 890, avgHealthScore: 79, avgEngagement: 85, retentionRate: 91, conversionRate: 72, color: '#8B5CF6' },
  { name: 'New Users', users: 3200, avgHealthScore: 71, avgEngagement: 45, retentionRate: 62, conversionRate: 23, color: '#F59E0B' }
];

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

export default function AdvancedAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('health');
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'insights' | 'cohorts'>('overview');

  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
  const analyticsData = useMemo(() => generateAnalyticsData(days), [days]);

  const getMetricData = (metric: MetricType) => {
    return analyticsData.map(item => ({
      date: format(new Date(item.date), 'MMM dd'),
      value: item[metric === 'health' ? 'healthScore' :
                   metric === 'engagement' ? 'engagement' :
                   metric === 'goals' ? 'goalsCompleted' :
                   metric === 'habits' ? 'habitsCompleted' : 'healthScore']
    }));
  };

  const getMetricLabel = (metric: MetricType) => {
    const labels = {
      health: 'Health Score',
      engagement: 'Engagement %',
      goals: 'Goals Completed',
      habits: 'Habits Completed',
      insights: 'AI Insights'
    };
    return labels[metric];
  };

  const getLatestStats = () => {
    const latest = analyticsData[analyticsData.length - 1];
    const previous = analyticsData[analyticsData.length - 2];

    return {
      healthScore: { current: latest.healthScore, change: latest.healthScore - previous.healthScore },
      engagement: { current: latest.engagement, change: latest.engagement - previous.engagement },
      goalsCompleted: { current: latest.goalsCompleted, change: latest.goalsCompleted - previous.goalsCompleted },
      habitsCompleted: { current: latest.habitsCompleted, change: latest.habitsCompleted - previous.habitsCompleted }
    };
  };

  const stats = getLatestStats();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Video Section */}
        <div className="mb-8">
          <div className="relative rounded-xl overflow-hidden bg-gray-900">
            <video
              className="w-full h-auto max-h-96 object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/hero-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                No Prior Authorization
              </h1>
              <p className="text-gray-200 text-lg">
                Revolutionizing healthcare with instant toxicology expertise
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Advanced Analytics Dashboard
          </h1>
          <p className="text-gray-400">
            Deep insights into your health journey with AI-powered analytics and predictions
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex space-x-2">
            {(['7d', '30d', '90d', '1y'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex space-x-2">
            {(['health', 'engagement', 'goals', 'habits'] as MetricType[]).map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                  selectedMetric === metric
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {metric}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'trends', label: 'Trends', icon: '📈' },
            { id: 'insights', label: 'AI Insights', icon: '🧠' },
            { id: 'cohorts', label: 'Cohort Analysis', icon: '👥' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-400">Health Score</h3>
                  <span className={`text-sm ${stats.healthScore.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.healthScore.change >= 0 ? '+' : ''}{stats.healthScore.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stats.healthScore.current}</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                    style={{ width: `${stats.healthScore.current}%` }}
                  />
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-400">Engagement</h3>
                  <span className={`text-sm ${stats.engagement.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.engagement.change >= 0 ? '+' : ''}{stats.engagement.change}%
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stats.engagement.current}%</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    style={{ width: `${stats.engagement.current}%` }}
                  />
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-purple-400">Goals Completed</h3>
                  <span className={`text-sm ${stats.goalsCompleted.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.goalsCompleted.change >= 0 ? '+' : ''}{stats.goalsCompleted.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stats.goalsCompleted.current}</div>
                <div className="text-sm text-gray-400">This period</div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-orange-400">Habits Completed</h3>
                  <span className={`text-sm ${stats.habitsCompleted.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.habitsCompleted.change >= 0 ? '+' : ''}{stats.habitsCompleted.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stats.habitsCompleted.current}</div>
                <div className="text-sm text-gray-400">Daily average</div>
              </div>
            </div>

            {/* Main Chart */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                {getMetricLabel(selectedMetric)} Trend
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getMetricData(selectedMetric)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3B82F6"
                      fill="url(#colorGradient)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Health Metrics Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Health Metrics Overview</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Average Sleep', value: '7.3 hrs', change: '+0.2', color: 'text-blue-400' },
                    { label: 'Daily Steps', value: '8,450', change: '+320', color: 'text-green-400' },
                    { label: 'Average Mood', value: '7.2/10', change: '+0.3', color: 'text-yellow-400' },
                    { label: 'Stress Level', value: '3.1/10', change: '-0.4', color: 'text-red-400' }
                  ].map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                      <span className="text-gray-300">{metric.label}</span>
                      <div className="text-right">
                        <div className="text-white font-medium">{metric.value}</div>
                        <div className={`text-sm ${metric.color}`}>{metric.change}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Goal Achievement Rate</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Completed', value: 67, fill: '#10B981' },
                          { name: 'In Progress', value: 23, fill: '#F59E0B' },
                          { name: 'Not Started', value: 10, fill: '#EF4444' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          { name: 'Completed', value: 67, fill: '#10B981' },
                          { name: 'In Progress', value: 23, fill: '#F59E0B' },
                          { name: 'Not Started', value: 10, fill: '#EF4444' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-400">67% Completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-400">23% In Progress</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-400">10% Not Started</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-blue-400">📈 Detailed Trends Analysis</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Multi-metric Comparison */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Health Metrics Comparison</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.slice(-14)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} />
                      <YAxis stroke="#9CA3AF" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }}
                      />
                      <Line type="monotone" dataKey="healthScore" stroke="#10B981" strokeWidth={2} name="Health Score" />
                      <Line type="monotone" dataKey="energy" stroke="#3B82F6" strokeWidth={2} name="Energy" />
                      <Line type="monotone" dataKey="mood" stroke="#8B5CF6" strokeWidth={2} name="Mood" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Weekly Patterns */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Weekly Patterns</h3>
                <div className="space-y-4">
                  {[
                    { day: 'Monday', score: 82, trend: 'up' },
                    { day: 'Tuesday', score: 87, trend: 'up' },
                    { day: 'Wednesday', score: 79, trend: 'down' },
                    { day: 'Thursday', score: 85, trend: 'up' },
                    { day: 'Friday', score: 88, trend: 'up' },
                    { day: 'Saturday', score: 91, trend: 'up' },
                    { day: 'Sunday', score: 86, trend: 'down' }
                  ].map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                      <span className="text-gray-300">{day.day}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                            style={{ width: `${day.score}%` }}
                          />
                        </div>
                        <span className="text-white font-medium w-8">{day.score}</span>
                        <span className={`text-sm ${day.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                          {day.trend === 'up' ? '↗' : '↘'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Correlation Analysis */}
              <div className="bg-gray-900 rounded-xl p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">🔗 Key Correlations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <h4 className="font-medium text-green-400 mb-2">Sleep & Energy</h4>
                    <p className="text-sm text-gray-300 mb-2">Strong positive correlation (r = 0.78)</p>
                    <div className="text-xs text-green-400">94% confidence</div>
                  </div>

                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <h4 className="font-medium text-blue-400 mb-2">Exercise & Mood</h4>
                    <p className="text-sm text-gray-300 mb-2">Moderate positive correlation (r = 0.65)</p>
                    <div className="text-xs text-blue-400">87% confidence</div>
                  </div>

                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <h4 className="font-medium text-purple-400 mb-2">Stress & Sleep Quality</h4>
                    <p className="text-sm text-gray-300 mb-2">Negative correlation (r = -0.71)</p>
                    <div className="text-xs text-purple-400">91% confidence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-purple-400">🧠 AI-Powered Insights</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockInsights.map((insight) => (
                <div key={insight.id} className="bg-gray-900 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{insight.title}</h3>
                      <p className="text-sm text-gray-400">{insight.category}</p>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded text-xs ${
                        insight.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                        insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {insight.impact} impact
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{insight.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">AI Confidence:</span>
                      <span className="text-white font-medium">{insight.confidence}%</span>
                    </div>
                    <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm font-medium transition">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Predictive Analytics */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">🔮 30-Day Predictions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-400 mb-2">87%</div>
                  <div className="text-sm text-gray-300 mb-1">Health Score</div>
                  <div className="text-xs text-blue-400">+5% predicted</div>
                </div>

                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="text-2xl font-bold text-green-400 mb-2">74%</div>
                  <div className="text-sm text-gray-300 mb-1">Goal Completion</div>
                  <div className="text-xs text-green-400">All goals achieved</div>
                </div>

                <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-400 mb-2">91%</div>
                  <div className="text-sm text-gray-300 mb-1">Habit Consistency</div>
                  <div className="text-xs text-purple-400">+12% improvement</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cohorts' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-orange-400">👥 User Cohort Analysis</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cohort Performance */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Cohort Performance</h3>
                <div className="space-y-4">
                  {mockCohorts.map((cohort, index) => (
                    <div key={index} className="p-4 bg-black/40 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white">{cohort.name}</h4>
                        <span className="text-sm text-gray-400">{cohort.users.toLocaleString()} users</span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold" style={{ color: cohort.color }}>
                            {cohort.avgHealthScore}
                          </div>
                          <div className="text-xs text-gray-400">Health Score</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold" style={{ color: cohort.color }}>
                            {cohort.retentionRate}%
                          </div>
                          <div className="text-xs text-gray-400">Retention</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold" style={{ color: cohort.color }}>
                            {cohort.conversionRate}%
                          </div>
                          <div className="text-xs text-gray-400">Conversion</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cohort Distribution */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">User Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockCohorts}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="users"
                        nameKey="name"
                      >
                        {mockCohorts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [value.toLocaleString(), 'Users']}
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {mockCohorts.map((cohort, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cohort.color }}></div>
                      <span className="text-sm text-gray-400">{cohort.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cohort Trends */}
              <div className="bg-gray-900 rounded-xl p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">Cohort Trends Over Time</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockCohorts}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }}
                      />
                      <Bar dataKey="avgHealthScore" fill="#10B981" name="Avg Health Score" />
                      <Bar dataKey="retentionRate" fill="#3B82F6" name="Retention Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}