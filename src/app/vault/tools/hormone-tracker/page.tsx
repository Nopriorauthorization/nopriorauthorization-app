"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiArrowLeft,
  FiSave,
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiTarget,
  FiClock
} from 'react-icons/fi';

type CycleEntry = {
  date: string;
  flow: 'light' | 'medium' | 'heavy';
  symptoms: string[];
  notes: string;
};

type CycleAnalysis = {
  averageLength: number;
  regularity: string;
  predictedNextPeriod: string;
  ovulationWindow: { start: string; end: string };
  fertileWindow: { start: string; end: string };
  cycleHealth: string;
  insights: string[];
  recommendations: string[];
};

export default function HormoneTrackerPage() {
  const [lastPeriodStart, setLastPeriodStart] = useState<string>('');
  const [cycleLength, setCycleLength] = useState<string>('28');
  const [periodLength, setPeriodLength] = useState<string>('5');
  const [currentCycleDay, setCurrentCycleDay] = useState<number>(0);
  const [entries, setEntries] = useState<CycleEntry[]>([]);
  const [analysis, setAnalysis] = useState<CycleAnalysis | null>(null);
  const [saved, setSaved] = useState(false);

  const symptoms = [
    'Cramps', 'Headache', 'Fatigue', 'Mood Swings', 'Bloating',
    'Breast Tenderness', 'Acne', 'Back Pain', 'Nausea', 'Insomnia'
  ];

  const addCycleEntry = (entry: CycleEntry) => {
    setEntries(prev => [...prev, entry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };

  const analyzeCycle = () => {
    if (!lastPeriodStart) return;

    const lastPeriod = new Date(lastPeriodStart);
    const today = new Date();
    const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    const cycleLen = parseInt(cycleLength) || 28;
    const periodLen = parseInt(periodLength) || 5;

    setCurrentCycleDay(daysSinceLastPeriod + 1);

    // Calculate next period
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(nextPeriod.getDate() + cycleLen);
    const predictedNextPeriod = nextPeriod.toISOString().split('T')[0];

    // Calculate ovulation window (around day 14 for 28-day cycle)
    const ovulationDay = Math.round(cycleLen / 2);
    const ovulationStart = new Date(lastPeriod);
    ovulationStart.setDate(ovulationStart.getDate() + ovulationDay - 2);
    const ovulationEnd = new Date(lastPeriod);
    ovulationEnd.setDate(ovulationEnd.getDate() + ovulationDay + 2);

    // Fertile window (5 days before ovulation to 1 day after)
    const fertileStart = new Date(ovulationStart);
    fertileStart.setDate(fertileStart.getDate() - 5);
    const fertileEnd = new Date(ovulationEnd);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    // Determine cycle regularity based on entries
    let regularity = 'Unknown';
    let cycleHealth = 'Tracking';
    const insights: string[] = [];
    const recommendations: string[] = [];

    if (entries.length >= 3) {
      const cycleLengths = [];
      for (let i = 1; i < entries.length; i++) {
        const prevDate = new Date(entries[i-1].date);
        const currDate = new Date(entries[i].date);
        const diff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        cycleLengths.push(diff);
      }

      const avgLength = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
      const variance = cycleLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / cycleLengths.length;
      const stdDev = Math.sqrt(variance);

      if (stdDev <= 2) regularity = 'Very Regular';
      else if (stdDev <= 5) regularity = 'Regular';
      else if (stdDev <= 10) regularity = 'Irregular';
      else regularity = 'Very Irregular';

      if (regularity === 'Very Regular' || regularity === 'Regular') {
        cycleHealth = 'Healthy';
        insights.push('Your cycle appears regular and healthy');
        recommendations.push('Continue tracking to maintain patterns');
      } else {
        cycleHealth = 'Needs Attention';
        insights.push('Your cycle shows irregularity that may need medical attention');
        recommendations.push('Consult healthcare provider for irregular cycles');
      }
    } else {
      insights.push('Continue tracking for at least 3 cycles for better analysis');
      recommendations.push('Track symptoms and flow intensity daily');
    }

    // Phase-based insights
    if (currentCycleDay <= periodLen) {
      insights.push('You are in your menstrual phase');
      recommendations.push('Focus on iron-rich foods and rest');
    } else if (currentCycleDay <= ovulationDay - 5) {
      insights.push('You are in your follicular phase');
      recommendations.push('Energy levels typically increase during this phase');
    } else if (currentCycleDay >= ovulationDay - 2 && currentCycleDay <= ovulationDay + 2) {
      insights.push('You are in your ovulation window');
      recommendations.push('Peak fertility period - track cervical mucus changes');
    } else if (currentCycleDay > ovulationDay + 2) {
      insights.push('You are in your luteal phase');
      recommendations.push('Monitor for PMS symptoms and prepare for next cycle');
    }

    setAnalysis({
      averageLength: parseInt(cycleLength),
      regularity,
      predictedNextPeriod,
      ovulationWindow: {
        start: ovulationStart.toISOString().split('T')[0],
        end: ovulationEnd.toISOString().split('T')[0]
      },
      fertileWindow: {
        start: fertileStart.toISOString().split('T')[0],
        end: fertileEnd.toISOString().split('T')[0]
      },
      cycleHealth,
      insights,
      recommendations
    });
  };

  const saveToVault = async () => {
    if (!analysis) return;

    try {
      const response = await fetch('/api/vault/tools/hormone-tracker-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastPeriodStart,
          cycleLength: parseInt(cycleLength),
          periodLength: parseInt(periodLength),
          currentCycleDay,
          regularity: analysis.regularity,
          cycleHealth: analysis.cycleHealth,
          entries,
          calculatedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving hormone tracker result:', error);
    }
  };

  useEffect(() => {
    analyzeCycle();
  }, [lastPeriodStart, cycleLength, periodLength, entries]);

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
            <span className="text-gray-500">Hormone Tracker</span>
          </nav>
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/vault/tools"
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Hormone Cycle Tracker
              </h1>
              <p className="text-gray-400">Track your menstrual cycle, predict ovulation, and understand your hormonal patterns</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cycle Setup & Entry */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                <FiCalendar className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Cycle Tracking</h2>
            </div>

            {/* Cycle Setup */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Period Start</label>
                <input
                  type="date"
                  value={lastPeriodStart}
                  onChange={(e) => setLastPeriodStart(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Average Cycle Length (days)</label>
                <input
                  type="number"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                  placeholder="28"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Period Length (days)</label>
                <input
                  type="number"
                  value={periodLength}
                  onChange={(e) => setPeriodLength(e.target.value)}
                  placeholder="5"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            {/* Current Cycle Status */}
            {currentCycleDay > 0 && (
              <div className="mb-8 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-pink-400">Current Cycle Status</h3>
                    <p className="text-sm text-gray-300">Day {currentCycleDay} of your cycle</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-pink-400">{currentCycleDay}</div>
                    <div className="text-xs text-gray-400">Cycle Day</div>
                  </div>
                </div>
              </div>
            )}

            {/* Add Cycle Entry */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold mb-4">Add Cycle Entry</h3>
              <CycleEntryForm onAddEntry={addCycleEntry} />
            </div>

            {/* Recent Entries */}
            {entries.length > 0 && (
              <div className="border-t border-gray-700 pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Recent Entries</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {entries.slice(-5).reverse().map((entry, index) => (
                    <div key={index} className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{new Date(entry.date).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          entry.flow === 'heavy' ? 'bg-red-500/20 text-red-400' :
                          entry.flow === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {entry.flow} flow
                        </span>
                      </div>
                      {entry.symptoms.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {entry.symptoms.map((symptom, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                              {symptom}
                            </span>
                          ))}
                        </div>
                      )}
                      {entry.notes && (
                        <p className="text-sm text-gray-400">{entry.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Analysis & Predictions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {analysis ? (
              <>
                {/* Cycle Health Overview */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold mb-2">
                      <span className={
                        analysis.cycleHealth === 'Healthy' ? 'text-green-400' :
                        analysis.cycleHealth === 'Needs Attention' ? 'text-yellow-400' :
                        'text-blue-400'
                      }>
                        {analysis.cycleHealth}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">Cycle Health Status</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Regularity:</span>
                      <span className={`font-medium ${
                        analysis.regularity === 'Very Regular' ? 'text-green-400' :
                        analysis.regularity === 'Regular' ? 'text-blue-400' :
                        analysis.regularity === 'Irregular' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {analysis.regularity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Avg Length:</span>
                      <span className="font-medium text-gray-300">{analysis.averageLength} days</span>
                    </div>
                  </div>

                  <button
                    onClick={saveToVault}
                    disabled={saved}
                    className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {saved ? (
                      <>
                        <FiCheckCircle className="w-4 h-4" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        Save to Vault
                      </>
                    )}
                  </button>
                </div>

                {/* Predictions */}
                <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiClock className="w-5 h-5 text-pink-400" />
                    <h3 className="text-lg font-semibold">Predictions</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Next Period</div>
                      <div className="font-medium text-pink-400">
                        {new Date(analysis.predictedNextPeriod).toLocaleDateString()}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400 mb-1">Fertile Window</div>
                      <div className="font-medium text-purple-400">
                        {new Date(analysis.fertileWindow.start).toLocaleDateString()} - {new Date(analysis.fertileWindow.end).toLocaleDateString()}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400 mb-1">Ovulation Window</div>
                      <div className="font-medium text-purple-400">
                        {new Date(analysis.ovulationWindow.start).toLocaleDateString()} - {new Date(analysis.ovulationWindow.end).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insights */}
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiInfo className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold">Insights</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysis.insights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FiCheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiTarget className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold">Recommendations</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <FiCheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
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
                <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Set Up Your Cycle</h3>
                <p className="text-gray-400 text-sm">Enter your last period start date and cycle information to begin tracking and get personalized predictions.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Component for adding cycle entries
function CycleEntryForm({ onAddEntry }: { onAddEntry: (entry: CycleEntry) => void }) {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [flow, setFlow] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');

  const symptoms = [
    'Cramps', 'Headache', 'Fatigue', 'Mood Swings', 'Bloating',
    'Breast Tenderness', 'Acne', 'Back Pain', 'Nausea', 'Insomnia'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    onAddEntry({
      date,
      flow,
      symptoms: selectedSymptoms,
      notes
    });

    // Reset form
    setDate(new Date().toISOString().split('T')[0]);
    setFlow('medium');
    setSelectedSymptoms([]);
    setNotes('');
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Flow Intensity</label>
          <div className="flex gap-2">
            {(['light', 'medium', 'heavy'] as const).map((flowOption) => (
              <button
                key={flowOption}
                type="button"
                onClick={() => setFlow(flowOption)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition capitalize ${
                  flow === flowOption
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {flowOption}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Symptoms</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {symptoms.map((symptom) => (
            <button
              key={symptom}
              type="button"
              onClick={() => toggleSymptom(symptom)}
              className={`p-2 rounded-lg text-sm transition ${
                selectedSymptoms.includes(symptom)
                  ? 'bg-pink-500/20 border border-pink-500 text-pink-300'
                  : 'bg-gray-700/50 border border-gray-600 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes about this day..."
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 resize-none"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition"
      >
        Add Entry
      </button>
    </form>
  );
}