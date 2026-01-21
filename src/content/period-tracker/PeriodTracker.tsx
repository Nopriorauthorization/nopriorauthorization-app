"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { format, addDays, differenceInDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

// HIPAA Compliance Types
type ConsentStatus = 'pending' | 'granted' | 'revoked';
type DataSharingScope = 'none' | 'analytics' | 'providers' | 'research';

interface HIPAAConsent {
  id: string;
  userId: string;
  consentGiven: boolean;
  consentDate: Date;
  dataSharingScope: DataSharingScope;
  purpose: string;
  retentionPeriod: number; // days
  lastUpdated: Date;
}

// Cycle Data Types
interface CycleEntry {
  id: string;
  userId: string;
  date: Date;
  flowLevel: 1 | 2 | 3 | 4 | 5; // 1=spotting, 5=heavy
  symptoms: Symptom[];
  mood: number; // 1-10 scale
  energy: number; // 1-10 scale
  notes?: string;
  temperature?: number;
  medications: string[];
  activities: string[];
}

interface Symptom {
  id: string;
  name: string;
  severity: 1 | 2 | 3 | 4 | 5;
  category: 'physical' | 'emotional' | 'other';
}

interface CyclePrediction {
  nextPeriodStart: Date;
  nextPeriodEnd: Date;
  ovulationDate: Date;
  fertileWindow: { start: Date; end: Date };
  confidence: number; // 0-100
  factors: string[];
}

interface TreatmentCorrelation {
  treatmentId: string;
  treatmentDate: Date;
  cyclePhase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  outcome: string;
  notes: string;
}

interface GeneticInsight {
  id: string;
  trait: string;
  riskLevel: 'low' | 'moderate' | 'high';
  recommendation: string;
  source: 'family_history' | 'genetic_markers';
  confidence: number;
}

// Main Component
export default function PeriodTracker() {
  const [consent, setConsent] = useState<HIPAAConsent | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'calendar' | 'insights' | 'settings'>('dashboard');
  const [cycleData, setCycleData] = useState<CycleEntry[]>([]);
  const [predictions, setPredictions] = useState<CyclePrediction | null>(null);
  const [geneticInsights, setGeneticInsights] = useState<GeneticInsight[]>([]);

  // HIPAA Consent Management
  const handleConsentUpdate = useCallback(async (newConsent: Partial<HIPAAConsent>) => {
    // Implementation for HIPAA consent management
    console.log('Updating HIPAA consent:', newConsent);
  }, []);

  // Cycle Data Management
  const addCycleEntry = useCallback(async (entry: Omit<CycleEntry, 'id' | 'userId'>) => {
    // HIPAA-compliant data storage
    console.log('Adding cycle entry:', entry);
  }, []);

  // AI Predictions with Genetic Integration
  const generatePredictions = useCallback(async () => {
    // Advanced AI predictions combining cycle data + genetics + treatments
    console.log('Generating AI predictions...');
  }, []);

  // Treatment Correlation Analysis
  const analyzeTreatmentCorrelations = useCallback(async () => {
    // Analyze how treatments affect cycles and vice versa
    console.log('Analyzing treatment correlations...');
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HIPAA Compliance Banner */}
      {!consent?.consentGiven && (
        <div className="bg-red-900 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-200">
                ⚕️ <strong>HIPAA Compliance Required</strong>
                <br />
                This feature handles sensitive health data. Please review and accept our HIPAA-compliant data usage policy.
              </p>
              <button
                onClick={() => setCurrentView('settings')}
                className="mt-2 bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
              >
                Review & Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-pink-400">Period Tracker</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 rounded ${currentView === 'dashboard' ? 'bg-pink-600' : 'bg-gray-800'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('calendar')}
              className={`px-4 py-2 rounded ${currentView === 'calendar' ? 'bg-pink-600' : 'bg-gray-800'}`}
            >
              Calendar
            </button>
            <button
              onClick={() => setCurrentView('insights')}
              className={`px-4 py-2 rounded ${currentView === 'insights' ? 'bg-pink-600' : 'bg-gray-800'}`}
            >
              AI Insights
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`px-4 py-2 rounded ${currentView === 'settings' ? 'bg-pink-600' : 'bg-gray-800'}`}
            >
              Settings
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {currentView === 'dashboard' && <PeriodDashboard />}
        {currentView === 'calendar' && <PeriodCalendar />}
        {currentView === 'insights' && <AIInsights />}
        {currentView === 'settings' && <PeriodSettings />}
      </main>
    </div>
  );
}

// Dashboard Component
function PeriodDashboard() {
  return (
    <div className="space-y-6">
      {/* Current Cycle Status */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-pink-400">Current Cycle</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-400">12</div>
            <div className="text-sm text-gray-400">Days In</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">18</div>
            <div className="text-sm text-gray-400">Days to Next</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">85%</div>
            <div className="text-sm text-gray-400">Prediction Accuracy</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Today's Entry</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-pink-600 hover:bg-pink-700 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">🩸</div>
            <div className="text-sm">Log Flow</div>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">😊</div>
            <div className="text-sm">Mood</div>
          </button>
          <button className="bg-green-600 hover:bg-green-700 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-sm">Energy</div>
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">📝</div>
            <div className="text-sm">Symptoms</div>
          </button>
        </div>
      </div>

      {/* AI Insights Preview */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-400">AI Health Insights</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <div>
              <div className="font-medium">Cycle Stability</div>
              <div className="text-sm text-gray-400">Your cycles are highly regular</div>
            </div>
            <div className="text-green-400 font-bold">92%</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <div>
              <div className="font-medium">Treatment Timing</div>
              <div className="text-sm text-gray-400">Optimal window approaching</div>
            </div>
            <div className="text-blue-400 font-bold">View</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Calendar Component
function PeriodCalendar() {
  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-6 text-pink-400">Cycle Calendar</h2>
      <div className="text-center text-gray-400">
        Interactive calendar component would go here
      </div>
    </div>
  );
}

// AI Insights Component
function AIInsights() {
  return (
    <div className="space-y-6">
      {/* Genetic Integration */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-purple-400">Genetic & Family Insights</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-800 rounded">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">PCOS Risk Assessment</h3>
              <span className="text-yellow-400">Moderate</span>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              Based on family history and genetic markers
            </p>
            <div className="text-sm text-blue-400">View Family Tree Connection →</div>
          </div>

          <div className="p-4 bg-gray-800 rounded">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Fertility Timeline</h3>
              <span className="text-green-400">Optimal</span>
            </div>
            <p className="text-sm text-gray-400 mb-2">
              Peak fertility window: Days 12-16
            </p>
            <div className="text-sm text-pink-400">Plan Around Treatments →</div>
          </div>
        </div>
      </div>

      {/* Treatment Correlations */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">Treatment Cycle Correlations</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-800 rounded">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Botox - March 15</h3>
              <span className="text-green-400 text-sm">Cycle Day 7</span>
            </div>
            <p className="text-sm text-gray-400">
              Treatment during follicular phase - optimal timing predicted
            </p>
          </div>

          <div className="p-4 bg-gray-800 rounded">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Filler - April 2</h3>
              <span className="text-yellow-400 text-sm">Cycle Day 14</span>
            </div>
            <p className="text-sm text-gray-400">
              Treatment near ovulation - monitor for potential swelling
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Component with HIPAA
function PeriodSettings() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6 text-red-400">HIPAA Compliance & Privacy</h2>

        <div className="space-y-4">
          <div className="p-4 bg-gray-800 rounded">
            <h3 className="font-medium mb-2">Data Usage Consent</h3>
            <p className="text-sm text-gray-400 mb-4">
              Your menstrual health data is protected under HIPAA. We use advanced encryption
              and never share without explicit consent.
            </p>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input type="radio" name="consent" className="mr-2" />
                <span className="text-sm">Allow anonymous analytics</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="consent" className="mr-2" />
                <span className="text-sm">Share with providers</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="consent" className="mr-2" />
                <span className="text-sm">Research only</span>
              </label>
            </div>
          </div>

          <div className="p-4 bg-gray-800 rounded">
            <h3 className="font-medium mb-2">Data Retention</h3>
            <p className="text-sm text-gray-400">
              Your data is retained for 7 years as required by HIPAA, then permanently deleted.
            </p>
          </div>

          <div className="p-4 bg-gray-800 rounded">
            <h3 className="font-medium mb-2">Emergency Access</h3>
            <p className="text-sm text-gray-400 mb-2">
              Grant emergency access to healthcare providers in crisis situations.
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm">
              Configure Emergency Contacts
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6 text-blue-400">Advanced Features</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded">
            <div>
              <h3 className="font-medium">Wearable Integration</h3>
              <p className="text-sm text-gray-400">Sync with Oura Ring, Fitbit, etc.</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
              Connect
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800 rounded">
            <div>
              <h3 className="font-medium">Provider Dashboard</h3>
              <p className="text-sm text-gray-400">Share insights with your healthcare team</p>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">
              Enable
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800 rounded">
            <div>
              <h3 className="font-medium">AI Predictions</h3>
              <p className="text-sm text-gray-400">Advanced cycle and fertility predictions</p>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}