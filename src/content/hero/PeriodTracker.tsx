"use client";

import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, differenceInDays } from 'date-fns';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Types for hormone tracking
type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
type SymptomType = 'cramps' | 'mood' | 'energy' | 'libido' | 'skin' | 'sleep' | 'appetite' | 'headache' | 'nausea' | 'bloating' | 'breast-tenderness' | 'spotting';
type FertilityWindow = 'low' | 'medium' | 'high' | 'peak';

interface CycleEntry {
  date: string;
  flow: 0 | 1 | 2 | 3 | 4; // 0=none, 1=light, 2=medium, 3=heavy, 4=very heavy
  symptoms: SymptomType[];
  temperature?: number;
  notes?: string;
  intercourse?: boolean;
  ovulationTest?: boolean;
  pregnancyTest?: boolean;
}

interface HormoneInsight {
  id: string;
  type: 'prediction' | 'insight' | 'alert' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  category: 'cycle' | 'fertility' | 'health' | 'wellness';
}

// Mock data for demonstration
const mockCycleData: CycleEntry[] = [
  { date: '2026-01-01', flow: 3, symptoms: ['cramps', 'mood', 'headache'], temperature: 97.2, notes: 'Heavy flow day 1' },
  { date: '2026-01-02', flow: 3, symptoms: ['cramps', 'bloating'], temperature: 97.1 },
  { date: '2026-01-03', flow: 2, symptoms: ['cramps'], temperature: 97.3 },
  { date: '2026-01-04', flow: 2, symptoms: ['mood'], temperature: 97.4 },
  { date: '2026-01-05', flow: 1, symptoms: [], temperature: 97.5 },
  { date: '2026-01-06', flow: 1, symptoms: [], temperature: 97.6 },
  { date: '2026-01-07', flow: 0, symptoms: [], temperature: 97.8 },
  { date: '2026-01-12', flow: 0, symptoms: ['energy'], temperature: 98.1, ovulationTest: true },
  { date: '2026-01-13', flow: 0, symptoms: ['libido'], temperature: 98.2 },
  { date: '2026-01-14', flow: 0, symptoms: ['libido', 'energy'], temperature: 98.3 },
  { date: '2026-01-15', flow: 0, symptoms: ['libido'], temperature: 98.1 },
  { date: '2026-01-20', flow: 0, symptoms: ['mood', 'bloating'], temperature: 97.9 },
  { date: '2026-01-21', flow: 0, symptoms: ['mood', 'breast-tenderness'], temperature: 97.8 },
];

const aiInsights: HormoneInsight[] = [
  {
    id: 'insight-1',
    type: 'prediction',
    title: 'Next Period Expected',
    description: 'Based on your 28-day average cycle, your next period should start on January 29th',
    confidence: 87,
    actionable: false,
    category: 'cycle'
  },
  {
    id: 'insight-2',
    type: 'insight',
    title: 'Fertility Window Opening',
    description: 'Your fertile window begins tomorrow. Optimal conception days: Jan 12-14',
    confidence: 92,
    actionable: true,
    category: 'fertility'
  },
  {
    id: 'insight-3',
    type: 'alert',
    title: 'PMS Pattern Detected',
    description: 'You experience mood changes 4-5 days before your period. Consider magnesium supplementation.',
    confidence: 78,
    actionable: true,
    category: 'health'
  },
  {
    id: 'insight-4',
    type: 'recommendation',
    title: 'Sleep-Hormone Connection',
    description: 'Your temperature data suggests better sleep quality during ovulation. Aim for 8+ hours.',
    confidence: 85,
    actionable: true,
    category: 'wellness'
  }
];

export default function PeriodTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'calendar' | 'insights' | 'analytics' | 'symptoms'>('calendar');
  const [cycleData, setCycleData] = useState<CycleEntry[]>(mockCycleData);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CycleEntry | null>(null);

  // Calculate cycle phase for a given date
  const getCyclePhase = (date: Date): CyclePhase => {
    const cycleStart = new Date('2026-01-01');
    const daysSinceStart = differenceInDays(date, cycleStart);
    const cycleDay = (daysSinceStart % 28) + 1;

    if (cycleDay <= 5) return 'menstrual';
    if (cycleDay <= 13) return 'follicular';
    if (cycleDay === 14) return 'ovulation';
    return 'luteal';
  };

  // Calculate fertility window
  const getFertilityWindow = (date: Date): FertilityWindow => {
    const cycleStart = new Date('2026-01-01');
    const daysSinceStart = differenceInDays(date, cycleStart);
    const cycleDay = (daysSinceStart % 28) + 1;

    if (cycleDay >= 10 && cycleDay <= 16) return 'high';
    if (cycleDay === 14) return 'peak';
    if (cycleDay >= 8 && cycleDay <= 18) return 'medium';
    return 'low';
  };

  // Get entry for specific date
  const getEntryForDate = (date: Date): CycleEntry | undefined => {
    return cycleData.find(entry => isSameDay(parseISO(entry.date), date));
  };

  // Handle adding/editing cycle entry
  const handleEntrySubmit = (entry: CycleEntry) => {
    if (editingEntry) {
      setCycleData(prev => prev.map(e => e.date === entry.date ? entry : e));
    } else {
      setCycleData(prev => [...prev, entry]);
    }
    setShowEntryModal(false);
    setEditingEntry(null);
  };

  // Generate calendar days for current month
  const calendarDays = eachDayOfInterval({
    start: startOfMonth(selectedDate),
    end: endOfMonth(selectedDate)
  });

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-2">
                Hormone Harmony Hub
              </h1>
              <p className="text-gray-400 text-lg">
                AI-Powered Cycle Tracking & Fertility Insights
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-pink-400">Day 21</div>
                <div className="text-sm text-gray-400">of 28-day cycle</div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌸</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl p-4 border border-pink-500/20">
              <div className="text-2xl font-bold text-pink-400">28 days</div>
              <div className="text-sm text-gray-400">Average Cycle</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-purple-500/20">
              <div className="text-2xl font-bold text-purple-400">5.2 days</div>
              <div className="text-sm text-gray-400">Period Length</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-400">Jan 29</div>
              <div className="text-sm text-gray-400">Next Period</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
              <div className="text-2xl font-bold text-green-400">High</div>
              <div className="text-sm text-gray-400">Fertility Today</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900 p-1 rounded-lg">
          {[
            { id: 'calendar', label: 'Calendar', icon: '📅' },
            { id: 'insights', label: 'AI Insights', icon: '🧠' },
            { id: 'analytics', label: 'Analytics', icon: '📊' },
            { id: 'symptoms', label: 'Symptoms', icon: '🌡️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition ${
                currentView === tab.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        {currentView === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{format(selectedDate, 'MMMM yyyy')}</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedDate(prev => subDays(startOfMonth(prev), 1))}
                      className="p-2 hover:bg-gray-800 rounded-lg"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setSelectedDate(prev => addDays(endOfMonth(prev), 1))}
                      className="p-2 hover:bg-gray-800 rounded-lg"
                    >
                      ›
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => {
                    const entry = getEntryForDate(day);
                    const phase = getCyclePhase(day);
                    const fertility = getFertilityWindow(day);
                    const isToday = isSameDay(day, new Date());

                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedDate(day);
                          const existingEntry = getEntryForDate(day);
                          if (existingEntry) {
                            setEditingEntry(existingEntry);
                          }
                          setShowEntryModal(true);
                        }}
                        className={`aspect-square rounded-lg border-2 transition-all ${
                          isToday
                            ? 'border-pink-500 bg-pink-500/20'
                            : entry
                              ? 'border-purple-500/50 bg-purple-500/10'
                              : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          <span className={`text-sm font-medium ${isToday ? 'text-pink-400' : 'text-white'}`}>
                            {format(day, 'd')}
                          </span>
                          {entry && (
                            <div className="flex flex-col items-center mt-1">
                              {entry.flow > 0 && (
                                <div className={`w-2 h-2 rounded-full ${
                                  entry.flow === 1 ? 'bg-red-400' :
                                  entry.flow === 2 ? 'bg-red-500' :
                                  entry.flow === 3 ? 'bg-red-600' : 'bg-red-700'
                                }`} />
                              )}
                              {entry.temperature && (
                                <span className="text-xs text-blue-400">{entry.temperature}°</span>
                              )}
                            </div>
                          )}
                          {/* Phase indicator */}
                          <div className={`w-1 h-1 rounded-full mt-1 ${
                            phase === 'menstrual' ? 'bg-red-500' :
                            phase === 'follicular' ? 'bg-yellow-500' :
                            phase === 'ovulation' ? 'bg-green-500' : 'bg-blue-500'
                          }`} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Menstrual</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Follicular</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Ovulation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Luteal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Summary */}
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Today's Status</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Cycle Phase</span>
                    <span className="font-medium text-purple-400">Luteal Phase</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Fertility</span>
                    <span className="font-medium text-green-400">High</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Days to Period</span>
                    <span className="font-medium text-pink-400">8 days</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <span className="mr-2">🤖</span>
                  Harmony AI
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  "Your luteal phase is progressing normally. Consider tracking your basal temperature for more accurate ovulation prediction."
                </p>
                <button className="w-full bg-purple-500 hover:bg-purple-600 rounded-lg py-2 text-sm font-medium transition">
                  Ask Harmony
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'insights' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiInsights.map((insight) => (
              <div key={insight.id} className={`rounded-xl p-6 border ${
                insight.type === 'alert' ? 'bg-red-500/10 border-red-500/20' :
                insight.type === 'prediction' ? 'bg-blue-500/10 border-blue-500/20' :
                insight.type === 'recommendation' ? 'bg-green-500/10 border-green-500/20' :
                'bg-purple-500/10 border-purple-500/20'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      insight.type === 'alert' ? 'bg-red-500/20' :
                      insight.type === 'prediction' ? 'bg-blue-500/20' :
                      insight.type === 'recommendation' ? 'bg-green-500/20' :
                      'bg-purple-500/20'
                    }`}>
                      {insight.type === 'alert' ? '🚨' :
                       insight.type === 'prediction' ? '🔮' :
                       insight.type === 'recommendation' ? '💡' : '🧠'}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{insight.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        insight.category === 'cycle' ? 'bg-pink-500/20 text-pink-400' :
                        insight.category === 'fertility' ? 'bg-purple-500/20 text-purple-400' :
                        insight.category === 'health' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {insight.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">{insight.confidence}%</div>
                    <div className="text-xs text-gray-400">confidence</div>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{insight.description}</p>
                {insight.actionable && (
                  <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-lg py-2 text-sm font-medium transition">
                    Take Action
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {currentView === 'analytics' && (
          <div className="space-y-8">
            {/* Cycle Length Trends */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6">Cycle Analytics</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { month: 'Oct', length: 29, periodLength: 5 },
                    { month: 'Nov', length: 28, periodLength: 5 },
                    { month: 'Dec', length: 27, periodLength: 6 },
                    { month: 'Jan', length: 28, periodLength: 5 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="length" stroke="#EC4899" strokeWidth={2} name="Cycle Length" />
                    <Line type="monotone" dataKey="periodLength" stroke="#8B5CF6" strokeWidth={2} name="Period Length" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Symptom Frequency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Common Symptoms</h3>
                <div className="space-y-3">
                  {[
                    { symptom: 'Cramps', frequency: 85, phase: 'Menstrual' },
                    { symptom: 'Mood Changes', frequency: 72, phase: 'Luteal' },
                    { symptom: 'Fatigue', frequency: 68, phase: 'Luteal' },
                    { symptom: 'Headaches', frequency: 45, phase: 'Menstrual' }
                  ].map((item) => (
                    <div key={item.symptom} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{item.symptom}</span>
                        <span className="text-sm text-gray-400 ml-2">({item.phase})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                            style={{ width: `${item.frequency}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400 w-8">{item.frequency}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Fertility Insights</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">87%</div>
                    <div className="text-sm text-gray-400">Ovulation Prediction Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">14.2</div>
                    <div className="text-sm text-gray-400">Average Ovulation Day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-400 mb-1">6 days</div>
                    <div className="text-sm text-gray-400">Average Fertile Window</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'symptoms' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Symptom Tracker */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6">Track Today's Symptoms</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'cramps', label: 'Cramps', emoji: '🤕' },
                  { id: 'mood', label: 'Mood Changes', emoji: '😢' },
                  { id: 'energy', label: 'Low Energy', emoji: '😴' },
                  { id: 'libido', label: 'Libido Changes', emoji: '💋' },
                  { id: 'skin', label: 'Skin Issues', emoji: '🧴' },
                  { id: 'sleep', label: 'Sleep Issues', emoji: '🌙' },
                  { id: 'appetite', label: 'Appetite Changes', emoji: '🍽️' },
                  { id: 'headache', label: 'Headache', emoji: '🤯' },
                  { id: 'nausea', label: 'Nausea', emoji: '🤢' },
                  { id: 'bloating', label: 'Bloating', emoji: '💨' },
                  { id: 'breast-tenderness', label: 'Breast Tenderness', emoji: '🤲' },
                  { id: 'spotting', label: 'Spotting', emoji: '🩸' }
                ].map((symptom) => (
                  <button
                    key={symptom.id}
                    className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition text-center"
                  >
                    <div className="text-2xl mb-2">{symptom.emoji}</div>
                    <div className="text-sm font-medium">{symptom.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Entries */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6">Recent Entries</h3>
              <div className="space-y-4">
                {cycleData.slice(-5).reverse().map((entry) => (
                  <div key={entry.date} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <div className="font-medium">{format(parseISO(entry.date), 'MMM d')}</div>
                      <div className="text-sm text-gray-400">
                        {entry.flow > 0 && `Flow: ${['None', 'Light', 'Medium', 'Heavy', 'Very Heavy'][entry.flow]}`}
                        {entry.temperature && ` • ${entry.temperature}°F`}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {entry.symptoms.slice(0, 3).map((symptom) => (
                        <span key={symptom} className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Entry Modal */}
        {showEntryModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">
                {editingEntry ? 'Edit Entry' : 'Add Entry'} - {format(selectedDate, 'MMM d, yyyy')}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Flow Intensity</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                    <option value="0">No Flow</option>
                    <option value="1">Light</option>
                    <option value="2">Medium</option>
                    <option value="3">Heavy</option>
                    <option value="4">Very Heavy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Basal Temperature (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                    placeholder="97.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Symptoms</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['cramps', 'mood', 'energy', 'libido', 'skin', 'sleep'].map((symptom) => (
                      <label key={symptom} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm capitalize">{symptom}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 h-20"
                    placeholder="Any additional notes..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEntryModal(false);
                    setEditingEntry(null);
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg py-2 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEntrySubmit({
                    date: format(selectedDate, 'yyyy-MM-dd'),
                    flow: 2,
                    symptoms: ['cramps'],
                    temperature: 97.5
                  })}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-lg py-2 font-medium transition"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
