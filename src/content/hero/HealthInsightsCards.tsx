"use client";

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

// Sample data for mini-charts
const weightTrendData = [
  { week: 'W1', weight: 165 },
  { week: 'W2', weight: 164 },
  { week: 'W3', weight: 163 },
  { week: 'W4', weight: 161 },
  { week: 'W5', weight: 160 },
  { week: 'W6', weight: 159 }
];

const appointmentFrequencyData = [
  { month: 'Jan', count: 2 },
  { month: 'Feb', count: 3 },
  { month: 'Mar', count: 1 },
  { month: 'Apr', count: 4 },
  { month: 'May', count: 2 },
  { month: 'Jun', count: 3 }
];

const documentActivityData = [
  { week: 'W1', docs: 2 },
  { week: 'W2', docs: 5 },
  { week: 'W3', docs: 1 },
  { week: 'W4', docs: 3 },
  { week: 'W5', docs: 7 },
  { week: 'W6', docs: 4 }
];

const bloodPressureTrendData = [
  { month: 'Jan', systolic: 135, diastolic: 88 },
  { month: 'Feb', systolic: 132, diastolic: 85 },
  { month: 'Mar', systolic: 128, diastolic: 82 },
  { month: 'Apr', systolic: 125, diastolic: 80 },
  { month: 'May', systolic: 122, diastolic: 78 },
  { month: 'Jun', systolic: 118, diastolic: 75 }
];

const healthScoreData = [
  { category: 'Nutrition', score: 78 },
  { category: 'Exercise', score: 65 },
  { category: 'Sleep', score: 82 },
  { category: 'Stress', score: 71 },
  { category: 'Medications', score: 95 }
];

const CustomMiniTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 text-white text-xs p-2 rounded border border-pink-500/30">
        <p>{`${label}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// Individual insight card components
const WeightTrendCard = () => (
  <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl p-6 border border-pink-500/30 hover:border-pink-500/50 transition-all duration-300 hover:scale-105">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-white">Weight Progress</h3>
        <p className="text-sm text-gray-300">6-week trend</p>
      </div>
      <div className="text-3xl">⚖️</div>
    </div>
    
    <div className="mb-4">
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={weightTrendData}>
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#ec4899" 
            strokeWidth={2}
            dot={{ fill: '#ec4899', strokeWidth: 2, r: 3 }}
          />
          <Tooltip content={<CustomMiniTooltip />} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    <div className="flex items-center justify-between">
      <div>
        <div className="text-2xl font-bold text-pink-400">-6 lbs</div>
        <p className="text-sm text-gray-400">Since start</p>
      </div>
      <div className="text-right">
        <div className="text-lg font-semibold text-green-400">159 lbs</div>
        <p className="text-sm text-gray-400">Current</p>
      </div>
    </div>

    <div className="mt-3 flex items-center text-sm">
      <span className="text-green-400">↗ 3.6%</span>
      <span className="text-gray-400 ml-2">toward goal</span>
    </div>
  </div>
);

const AppointmentInsightCard = () => (
  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-white">Healthcare Engagement</h3>
        <p className="text-sm text-gray-300">Monthly appointments</p>
      </div>
      <div className="text-3xl">🏥</div>
    </div>
    
    <div className="mb-4">
      <ResponsiveContainer width="100%" height={80}>
        <BarChart data={appointmentFrequencyData}>
          <Bar dataKey="count" fill="#3b82f6" radius={2} />
          <Tooltip content={<CustomMiniTooltip />} />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="flex items-center justify-between">
      <div>
        <div className="text-2xl font-bold text-blue-400">15</div>
        <p className="text-sm text-gray-400">Total visits</p>
      </div>
      <div className="text-right">
        <div className="text-lg font-semibold text-cyan-400">2.5</div>
        <p className="text-sm text-gray-400">Avg/month</p>
      </div>
    </div>

    <div className="mt-3 flex items-center text-sm">
      <span className="text-blue-400">📅</span>
      <span className="text-gray-400 ml-2">Next: Endocrinology follow-up</span>
    </div>
  </div>
);

const DocumentActivityCard = () => (
  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-white">Vault Activity</h3>
        <p className="text-sm text-gray-300">Weekly uploads</p>
      </div>
      <div className="text-3xl">📋</div>
    </div>
    
    <div className="mb-4">
      <ResponsiveContainer width="100%" height={80}>
        <AreaChart data={documentActivityData}>
          <Area 
            type="monotone" 
            dataKey="docs" 
            stroke="#10b981" 
            fill="#10b981" 
            fillOpacity={0.6}
          />
          <Tooltip content={<CustomMiniTooltip />} />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    <div className="flex items-center justify-between">
      <div>
        <div className="text-2xl font-bold text-green-400">22</div>
        <p className="text-sm text-gray-400">Total docs</p>
      </div>
      <div className="text-right">
        <div className="text-lg font-semibold text-emerald-400">91%</div>
        <p className="text-sm text-gray-400">AI categorized</p>
      </div>
    </div>

    <div className="mt-3 flex items-center text-sm">
      <span className="text-green-400">🤖</span>
      <span className="text-gray-400 ml-2">Smart tagging active</span>
    </div>
  </div>
);

const BloodPressureTrendCard = () => (
  <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl p-6 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-white">Blood Pressure</h3>
        <p className="text-sm text-gray-300">6-month improvement</p>
      </div>
      <div className="text-3xl">💓</div>
    </div>
    
    <div className="mb-4">
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={bloodPressureTrendData}>
          <Line 
            type="monotone" 
            dataKey="systolic" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="diastolic" 
            stroke="#a855f7" 
            strokeWidth={2}
            dot={false}
          />
          <Tooltip content={<CustomMiniTooltip />} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    <div className="flex items-center justify-between">
      <div>
        <div className="text-2xl font-bold text-purple-400">118/75</div>
        <p className="text-sm text-gray-400">Current</p>
      </div>
      <div className="text-right">
        <div className="text-lg font-semibold text-green-400">-17/-13</div>
        <p className="text-sm text-gray-400">Improvement</p>
      </div>
    </div>

    <div className="mt-3 flex items-center text-sm">
      <span className="text-green-400">📉</span>
      <span className="text-gray-400 ml-2">Excellent progress</span>
    </div>
  </div>
);

const HealthScoreCard = () => (
  <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-xl p-6 border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-white">Health Score</h3>
        <p className="text-sm text-gray-300">Overall wellness</p>
      </div>
      <div className="text-3xl">🎯</div>
    </div>
    
    <div className="mb-4">
      <ResponsiveContainer width="100%" height={80}>
        <BarChart data={healthScoreData} layout="horizontal">
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="category" hide />
          <Bar dataKey="score" fill="#f59e0b" radius={2} />
          <Tooltip content={<CustomMiniTooltip />} />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="flex items-center justify-between">
      <div>
        <div className="text-2xl font-bold text-orange-400">78</div>
        <p className="text-sm text-gray-400">Overall score</p>
      </div>
      <div className="text-right">
        <div className="text-lg font-semibold text-yellow-400">Good</div>
        <p className="text-sm text-gray-400">Rating</p>
      </div>
    </div>

    <div className="mt-3 flex items-center text-sm">
      <span className="text-orange-400">💪</span>
      <span className="text-gray-400 ml-2">Focus on exercise</span>
    </div>
  </div>
);

const AIInsightCard = () => (
  <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-xl p-6 border border-pink-500/30 hover:border-pink-500/50 transition-all duration-300 hover:scale-105">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-white">AI Health Insights</h3>
        <p className="text-sm text-gray-300">Pattern analysis</p>
      </div>
      <div className="text-3xl">🧠</div>
    </div>
    
    <div className="space-y-3">
      <div className="bg-black/20 rounded-lg p-3">
        <h4 className="text-sm font-medium text-pink-400 mb-1">🎯 Key Pattern</h4>
        <p className="text-xs text-gray-300">
          Weight loss correlates strongly with medication adherence and appointment frequency
        </p>
      </div>
      
      <div className="bg-black/20 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-400 mb-1">📊 Trend Alert</h4>
        <p className="text-xs text-gray-300">
          Blood pressure improvement accelerated after lifestyle changes in February
        </p>
      </div>

      <div className="bg-black/20 rounded-lg p-3">
        <h4 className="text-sm font-medium text-green-400 mb-1">💡 Recommendation</h4>
        <p className="text-xs text-gray-300">
          Continue current approach - all metrics trending positively
        </p>
      </div>
    </div>

    <div className="mt-3 flex items-center text-sm">
      <span className="text-pink-400">✨</span>
      <span className="text-gray-400 ml-2">Confidence: 94%</span>
    </div>
  </div>
);

export default function HealthInsightsCards() {
  const [selectedTimeframe, setSelectedTimeframe] = React.useState('6months');
  const [insightType, setInsightType] = React.useState('all');

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Health Insights Dashboard
          </h1>
          <p className="text-gray-400 mb-6">
            AI-powered insights and mini-visualizations of your health patterns and trends
          </p>

          {/* Controls */}
          <div className="flex flex-wrap gap-4">
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-black border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
            
            <select 
              value={insightType}
              onChange={(e) => setInsightType(e.target.value)}
              className="bg-black border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
            >
              <option value="all">All Insights</option>
              <option value="health-metrics">Health Metrics</option>
              <option value="activities">Activities</option>
              <option value="ai-insights">AI Analysis</option>
            </select>
          </div>
        </div>

        {/* Insights Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {(insightType === 'all' || insightType === 'health-metrics') && (
            <>
              <WeightTrendCard />
              <BloodPressureTrendCard />
              <HealthScoreCard />
            </>
          )}
          
          {(insightType === 'all' || insightType === 'activities') && (
            <>
              <AppointmentInsightCard />
              <DocumentActivityCard />
            </>
          )}
          
          {(insightType === 'all' || insightType === 'ai-insights') && (
            <AIInsightCard />
          )}
        </div>

        {/* Summary Statistics Row */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6 text-center">Health Journey Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-pink-400">93%</div>
              <p className="text-sm text-gray-400">Goal Progress</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-2xl font-bold text-green-400">+78</div>
              <p className="text-sm text-gray-400">Health Score</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💊</div>
              <div className="text-2xl font-bold text-blue-400">95%</div>
              <p className="text-sm text-gray-400">Medication Adherence</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🤖</div>
              <div className="text-2xl font-bold text-purple-400">89%</div>
              <p className="text-sm text-gray-400">AI Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-orange-400">187</div>
              <p className="text-sm text-gray-400">Days Tracked</p>
            </div>
          </div>
        </div>

        {/* Actionable Insights Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
            <h3 className="text-lg font-semibold mb-4 text-green-400">🎉 Celebrate Your Wins</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-gray-200">
                <span className="text-green-400 mr-2">✓</span>
                Weight loss goal 93% complete - only 2 lbs to go!
              </li>
              <li className="flex items-center text-gray-200">
                <span className="text-green-400 mr-2">✓</span>
                Blood pressure improved by 17/13 points in 6 months
              </li>
              <li className="flex items-center text-gray-200">
                <span className="text-green-400 mr-2">✓</span>
                Perfect medication adherence for diabetes management
              </li>
              <li className="flex items-center text-gray-200">
                <span className="text-green-400 mr-2">✓</span>
                Consistent healthcare engagement with regular check-ups
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">🎯 Focus Areas</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-gray-200">
                <span className="text-blue-400 mr-2">→</span>
                Increase exercise frequency to boost health score
              </li>
              <li className="flex items-center text-gray-200">
                <span className="text-blue-400 mr-2">→</span>
                Schedule quarterly lab work for continuous monitoring
              </li>
              <li className="flex items-center text-gray-200">
                <span className="text-blue-400 mr-2">→</span>
                Consider stress management techniques
              </li>
              <li className="flex items-center text-gray-200">
                <span className="text-blue-400 mr-2">→</span>
                Maintain current lifestyle changes for sustained progress
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}