"use client";

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Sample health data - in real app, this would come from API
const weightData = [
  { date: '2024-01', weight: 165, target: 160 },
  { date: '2024-02', weight: 163, target: 160 },
  { date: '2024-03', weight: 161, target: 160 },
  { date: '2024-04', weight: 159, target: 160 },
  { date: '2024-05', weight: 158, target: 160 },
  { date: '2024-06', weight: 160, target: 160 },
];

const bloodPressureData = [
  { date: '2024-01', systolic: 128, diastolic: 82 },
  { date: '2024-02', systolic: 125, diastolic: 80 },
  { date: '2024-03', systolic: 122, diastolic: 78 },
  { date: '2024-04', systolic: 120, diastolic: 76 },
  { date: '2024-05', systolic: 118, diastolic: 75 },
  { date: '2024-06', systolic: 116, diastolic: 74 },
];

const labTrendsData = [
  { test: 'Cholesterol', current: 180, target: 200, status: 'good' },
  { test: 'HbA1c', current: 5.8, target: 7.0, status: 'excellent' },
  { test: 'Vitamin D', current: 32, target: 30, status: 'good' },
  { test: 'B12', current: 450, target: 300, status: 'excellent' },
];

const activityData = [
  { month: 'Jan', appointments: 3, documents: 5, chats: 12 },
  { month: 'Feb', appointments: 2, documents: 8, chats: 15 },
  { month: 'Mar', appointments: 4, documents: 3, chats: 18 },
  { month: 'Apr', appointments: 1, documents: 6, chats: 22 },
  { month: 'May', appointments: 3, documents: 4, chats: 19 },
  { month: 'Jun', appointments: 2, documents: 7, chats: 25 },
];

const documentCategoryData = [
  { name: 'Lab Results', value: 35, color: '#10b981' },
  { name: 'Imaging', value: 20, color: '#3b82f6' },
  { name: 'Visit Notes', value: 25, color: '#8b5cf6' },
  { name: 'Discharge', value: 15, color: '#f59e0b' },
  { name: 'Other', value: 5, color: '#ef4444' },
];

const RADIAN = Math.PI / 180;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-pink-500/30 rounded-lg p-3 backdrop-blur-sm">
        <p className="text-white font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="12"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function HealthMetricsDashboard() {
  const [selectedMetric, setSelectedMetric] = React.useState('weight');
  const [timeRange, setTimeRange] = React.useState('6months');

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Health Metrics Dashboard
          </h1>
          <p className="text-gray-400">
            Interactive visualizations of your health journey and data trends
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select 
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="bg-black border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
          >
            <option value="weight">Weight Tracking</option>
            <option value="bp">Blood Pressure</option>
            <option value="labs">Lab Trends</option>
            <option value="activity">Vault Activity</option>
          </select>
          
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-black border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Weight Tracking Chart */}
          {selectedMetric === 'weight' && (
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-3 h-3 bg-pink-500 rounded-full mr-3"></span>
                Weight Progress
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#ec4899" 
                    strokeWidth={3}
                    dot={{ fill: '#ec4899', strokeWidth: 2, r: 6 }}
                    name="Current Weight"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#10b981" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    name="Target Weight"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Blood Pressure Chart */}
          {selectedMetric === 'bp' && (
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                Blood Pressure Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={bloodPressureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="systolic" 
                    stackId="1"
                    stroke="#3b82f6" 
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Systolic"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="diastolic" 
                    stackId="2"
                    stroke="#06b6d4" 
                    fill="#06b6d4"
                    fillOpacity={0.6}
                    name="Diastolic"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Lab Trends Chart */}
          {selectedMetric === 'labs' && (
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                Lab Results Overview
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={labTrendsData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="test" type="category" stroke="#9ca3af" width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="current" fill="#10b981" name="Current Value" />
                  <Bar dataKey="target" fill="#374151" name="Target Range" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Activity Chart */}
          {selectedMetric === 'activity' && (
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                Vault Activity Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="chats" 
                    stackId="1"
                    stroke="#8b5cf6" 
                    fill="#8b5cf6"
                    fillOpacity={0.8}
                    name="Chat Sessions"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="documents" 
                    stackId="1"
                    stroke="#ec4899" 
                    fill="#ec4899"
                    fillOpacity={0.8}
                    name="Documents Added"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="appointments" 
                    stackId="1"
                    stroke="#f59e0b" 
                    fill="#f59e0b"
                    fillOpacity={0.8}
                    name="Appointments"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Document Distribution */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
              Document Categories
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={documentCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {documentCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap gap-2">
              {documentCategoryData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm text-gray-300">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Health Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl p-6 border border-pink-500/30">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Weight Goal Progress</h4>
              <span className="text-2xl">📈</span>
            </div>
            <div className="text-2xl font-bold text-pink-400 mb-1">93%</div>
            <p className="text-sm text-gray-300">Only 2 lbs from your target!</p>
            <div className="w-full bg-black/30 rounded-full h-2 mt-3">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full" style={{width: '93%'}}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Health Trend</h4>
              <span className="text-2xl">💚</span>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">Improving</div>
            <p className="text-sm text-gray-300">BP down 12 points since January</p>
            <div className="flex items-center mt-2">
              <div className="text-green-400 text-sm">↗ +8% this month</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Vault Engagement</h4>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-1">High</div>
            <p className="text-sm text-gray-300">25 chats this month</p>
            <div className="flex items-center mt-2">
              <div className="text-blue-400 text-sm">↗ +31% vs last month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}