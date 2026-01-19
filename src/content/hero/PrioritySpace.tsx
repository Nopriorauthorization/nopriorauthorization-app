"use client";

import React, { useState } from 'react';
import { format } from 'date-fns';

// Priority Space Types
type ScenarioId = 'pregnancy' | 'sti' | 'panic' | 'lump' | 'anxiety' | 'script';

type Scenario = {
  id: ScenarioId;
  icon: string;
  title: string;
  description: string;
  urgent: boolean;
};

type PriorityEntry = {
  id: string;
  scenarioId: ScenarioId;
  createdAt: string;
  timeline: {
    startDate: string;
    symptoms: string[];
    triggers: string[];
    notes: string;
  };
  providerScript: {
    opening: string;
    concerns: string[];
    questions: string[];
  };
  nextSteps: string[];
  includeInExport: boolean;
};

// Scenarios
const scenarios: Scenario[] = [
  {
    id: 'pregnancy',
    icon: '🤰',
    title: 'I think I\'m pregnant',
    description: 'Confirmation steps, options, confidential resources',
    urgent: true
  },
  {
    id: 'sti',
    icon: '🔬',
    title: 'STI scare / I found something',
    description: 'Testing checklist, symptom tracking, provider script',
    urgent: true
  },
  {
    id: 'panic',
    icon: '💓',
    title: 'Panic attack / chest symptoms',
    description: 'Emergency triage, calming steps, medical evaluation',
    urgent: true
  },
  {
    id: 'lump',
    icon: '🩺',
    title: 'I found a lump / scary result',
    description: 'Timeline builder, questions list, next steps',
    urgent: true
  },
  {
    id: 'anxiety',
    icon: '😰',
    title: 'Anxiety spiral / can\'t cope',
    description: 'Grounding techniques, crisis resources, support plan',
    urgent: false
  },
  {
    id: 'script',
    icon: '💬',
    title: 'I don\'t know how to say this',
    description: 'Universal script builder for any difficult conversation',
    urgent: false
  }
];

// Sample entries
const sampleEntries: PriorityEntry[] = [
  {
    id: 'entry-1',
    scenarioId: 'anxiety',
    createdAt: '2026-01-17T14:30:00Z',
    timeline: {
      startDate: '2026-01-15',
      symptoms: ['Racing thoughts', 'Can\'t sleep', 'Chest tightness'],
      triggers: ['Work deadline', 'Social event'],
      notes: 'Getting worse at night, affecting work performance'
    },
    providerScript: {
      opening: 'I\'ve been experiencing increased anxiety that\'s affecting my daily life and sleep.',
      concerns: [
        'Racing thoughts that won\'t stop, especially at night',
        'Physical symptoms: chest tightness and rapid heartbeat',
        'Unable to sleep more than 4 hours per night for the past week',
        'Struggling to focus at work'
      ],
      questions: [
        'Could this be an anxiety disorder or panic disorder?',
        'What treatment options are available (therapy, medication, both)?',
        'Are there any medical conditions I should rule out?',
        'How quickly can I expect to see improvement with treatment?',
        'What can I do right now to manage symptoms?'
      ]
    },
    nextSteps: [
      'Schedule appointment with primary care provider or psychiatrist',
      'Track symptoms daily (time, triggers, severity 1-10)',
      'Try grounding technique: 5-4-3-2-1 method when anxious',
      'Avoid caffeine and practice sleep hygiene',
      'If symptoms worsen or suicidal thoughts occur, call 988 Suicide & Crisis Lifeline'
    ],
    includeInExport: false
  }
];

export default function PrioritySpace() {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'providers' | 'resources'>('scenarios');
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId | null>(null);
  const [activeEntry, setActiveEntry] = useState<string | null>(null);
  const [userZip, setUserZip] = useState('');

  const renderScenarioBuilder = () => {
    if (!selectedScenario) return null;

    const scenario = scenarios.find(s => s.id === selectedScenario)!;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedScenario(null)}
          className="text-blue-400 hover:text-blue-300 transition flex items-center gap-2"
        >
          ← Back to scenarios
        </button>

        <div className="rounded-xl border border-white/10 bg-white/5 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-5xl">{scenario.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{scenario.title}</h2>
              <p className="text-gray-400">{scenario.description}</p>
            </div>
          </div>

          {/* Safety First for urgent scenarios */}
          {scenario.urgent && (
            <div className="mb-6 p-6 rounded-xl bg-red-500/10 border-2 border-red-500/30">
              <div className="flex items-start gap-3">
                <div className="text-3xl">⚠️</div>
                <div>
                  <h3 className="text-lg font-bold text-red-400 mb-2">Safety First</h3>
                  {scenario.id === 'panic' && (
                    <div className="text-gray-300 space-y-2">
                      <p><strong>If you have any of these symptoms, call 911 immediately:</strong></p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Severe chest pain or pressure (especially squeezing sensation)</li>
                        <li>Pain spreading to jaw, neck, back, or arms</li>
                        <li>Shortness of breath with chest pain</li>
                        <li>Sudden severe symptoms or loss of consciousness</li>
                      </ul>
                      <p className="text-xs text-gray-400 mt-3">
                        Heart attack and panic attack symptoms can overlap. When in doubt, seek emergency evaluation.
                      </p>
                    </div>
                  )}
                  {(scenario.id === 'pregnancy' || scenario.id === 'sti') && (
                    <p className="text-gray-300">
                      Get evaluated by a healthcare provider. Many clinics offer confidential services.
                      {scenario.id === 'pregnancy' && ' Title X clinics provide confidential pregnancy services for minors.'}
                    </p>
                  )}
                  {scenario.id === 'lump' && (
                    <p className="text-gray-300">
                      If you found a lump or received concerning results, schedule an evaluation promptly. Early detection improves outcomes.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Crisis Resources for anxiety scenario */}
          {scenario.id === 'anxiety' && (
            <div className="mb-6 p-6 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <h3 className="text-lg font-bold text-purple-400 mb-3">Immediate Support</h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">☎️</span>
                  <div>
                    <div className="font-semibold">988 Suicide & Crisis Lifeline</div>
                    <div className="text-sm text-gray-400">Call or text 988 - Available 24/7</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <div className="font-semibold">Crisis Text Line</div>
                    <div className="text-sm text-gray-400">Text HOME to 741741</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Builder */}
          <div className="mb-6 p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">📝 What to Record</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">When did this start?</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Symptoms (one per line)</label>
                <textarea
                  rows={4}
                  placeholder="e.g., nausea, missed period, fatigue..."
                  className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">What makes it better/worse?</label>
                <textarea
                  rows={3}
                  placeholder="Triggers, patterns, what helps..."
                  className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Additional notes</label>
                <textarea
                  rows={3}
                  placeholder="Anything else your provider should know..."
                  className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>
          </div>

          {/* AI-Generated Provider Script */}
          <div className="mb-6 p-6 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <h3 className="text-lg font-semibold text-blue-400 mb-4">💬 What to Say to Your Provider</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-400 mb-2">Opening statement:</div>
                <div className="p-3 bg-black/40 rounded-lg text-white">
                  {scenario.id === 'pregnancy' && '"I need confidential pregnancy confirmation and counseling to discuss my options."'}
                  {scenario.id === 'sti' && '"I have genital symptoms and want comprehensive STI testing. I\'m concerned about herpes and want to discuss treatment and prevention."'}
                  {scenario.id === 'panic' && '"I had a sudden episode of chest tightness, racing heart, and shortness of breath. I want to rule out medical causes and discuss panic/anxiety support."'}
                  {scenario.id === 'lump' && '"I found a lump in [location] and I\'m concerned. I need an evaluation and want to understand next steps."'}
                  {scenario.id === 'anxiety' && '"I\'ve been experiencing increased anxiety that\'s affecting my daily life, sleep, and work performance."'}
                  {scenario.id === 'script' && '"I have something difficult to discuss and I need your help understanding my options."'}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-400 mb-2">Key points to mention:</div>
                <ul className="space-y-2">
                  {scenario.id === 'pregnancy' && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span className="text-gray-300">Last menstrual period date and symptoms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span className="text-gray-300">Need for confidential care (if minor)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span className="text-gray-300">Want to understand all options available</span>
                      </li>
                    </>
                  )}
                  {scenario.id === 'sti' && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span className="text-gray-300">Symptom onset, location, and severity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span className="text-gray-300">Request comprehensive STI panel (not just one test)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span className="text-gray-300">Discuss treatment options and partner notification</span>
                      </li>
                    </>
                  )}
                  {scenario.id === 'panic' && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span className="text-gray-300">Describe symptoms: chest pain, heart racing, shortness of breath</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span className="text-gray-300">Duration, frequency, and triggers if known</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span className="text-gray-300">Request cardiac evaluation if not done recently</span>
                      </li>
                    </>
                  )}
                  {scenario.id === 'lump' && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span className="text-gray-300">Exact location, size, when discovered</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span className="text-gray-300">Any changes in size, pain, or associated symptoms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span className="text-gray-300">Family history of cancer or concerning conditions</span>
                      </li>
                    </>
                  )}
                  {scenario.id === 'anxiety' && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span className="text-gray-300">Physical symptoms: chest tightness, racing thoughts, sleep issues</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span className="text-gray-300">Impact on daily life, work, and relationships</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span className="text-gray-300">Duration and whether symptoms are worsening</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-400 mb-2">Questions to ask:</div>
                <ol className="space-y-2">
                  {scenario.id === 'pregnancy' && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">1.</span>
                        <span className="text-gray-300">What are all my options and what resources are available?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">2.</span>
                        <span className="text-gray-300">Will my visit remain confidential?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">3.</span>
                        <span className="text-gray-300">What tests do I need and when?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">4.</span>
                        <span className="text-gray-300">Can you refer me to counseling services?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">5.</span>
                        <span className="text-gray-300">What support services are available in my area?</span>
                      </li>
                    </>
                  )}
                  {scenario.id === 'sti' && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">1.</span>
                        <span className="text-gray-300">What specific tests should I get based on my symptoms?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">2.</span>
                        <span className="text-gray-300">If positive, what are my treatment options?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">3.</span>
                        <span className="text-gray-300">How do I reduce transmission risk to partners?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">4.</span>
                        <span className="text-gray-300">When will I get results and how will I be notified?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">5.</span>
                        <span className="text-gray-300">Is partner notification required and how does that work?</span>
                      </li>
                    </>
                  )}
                  {scenario.id === 'panic' && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">1.</span>
                        <span className="text-gray-300">Could this be a panic disorder or is there a cardiac issue?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">2.</span>
                        <span className="text-gray-300">What tests should I have to rule out medical causes?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">3.</span>
                        <span className="text-gray-300">What treatment options are available (therapy, medication)?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">4.</span>
                        <span className="text-gray-300">What can I do immediately when symptoms start?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">5.</span>
                        <span className="text-gray-300">Should I see a specialist (cardiologist or psychiatrist)?</span>
                      </li>
                    </>
                  )}
                  {scenario.id === 'lump' && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">1.</span>
                        <span className="text-gray-300">What imaging or biopsy do I need?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">2.</span>
                        <span className="text-gray-300">How quickly should this be evaluated?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">3.</span>
                        <span className="text-gray-300">What are the possible causes (benign vs concerning)?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">4.</span>
                        <span className="text-gray-300">What should I watch for while waiting for results?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">5.</span>
                        <span className="text-gray-300">Should I see a specialist or can you manage this?</span>
                      </li>
                    </>
                  )}
                  {scenario.id === 'anxiety' && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">1.</span>
                        <span className="text-gray-300">Could this be an anxiety disorder or panic disorder?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">2.</span>
                        <span className="text-gray-300">What treatment options are available (therapy, medication, both)?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">3.</span>
                        <span className="text-gray-300">Are there medical conditions I should rule out first?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">4.</span>
                        <span className="text-gray-300">How quickly can I expect to see improvement?</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">5.</span>
                        <span className="text-gray-300">What can I do right now to manage symptoms?</span>
                      </li>
                    </>
                  )}
                </ol>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-6 p-6 rounded-xl bg-green-500/10 border border-green-500/30">
            <h3 className="text-lg font-semibold text-green-400 mb-4">⚡ Your Next 3 Steps</h3>
            <ol className="space-y-3">
              {scenario.id === 'pregnancy' && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 font-bold text-sm flex-shrink-0">1</span>
                    <span className="text-gray-300">Schedule appointment at Title X clinic, Planned Parenthood, or your provider for confidential pregnancy test</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 font-bold text-sm flex-shrink-0">2</span>
                    <span className="text-gray-300">Write down last menstrual period date, symptoms, and questions to bring to appointment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 font-bold text-sm flex-shrink-0">3</span>
                    <span className="text-gray-300">Research local resources: pregnancy counseling, adoption services, abortion providers, prenatal care options</span>
                  </li>
                </>
              )}
              {scenario.id === 'sti' && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 font-bold text-sm flex-shrink-0">1</span>
                    <span className="text-gray-300">Schedule appointment with provider, urgent care, or STI clinic for comprehensive testing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 font-bold text-sm flex-shrink-0">2</span>
                    <span className="text-gray-300">Document symptoms: location, appearance, pain level, onset date - take photos if comfortable</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 font-bold text-sm flex-shrink-0">3</span>
                    <span className="text-gray-300">Avoid sexual contact until evaluated; prepare list of recent partners if needed for notification</span>
                  </li>
                </>
              )}
              {scenario.id === 'panic' && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 font-bold text-sm flex-shrink-0">1</span>
                    <span className="text-gray-300">If symptoms felt like heart attack, schedule evaluation with primary care or cardiologist to rule out cardiac issues</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 font-bold text-sm flex-shrink-0">2</span>
                    <span className="text-gray-300">Track episodes: date, time, duration, triggers, symptoms (rate 1-10) - pattern helps diagnosis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 font-bold text-sm flex-shrink-0">3</span>
                    <span className="text-gray-300">Practice grounding technique: 5 things you see, 4 things you touch, 3 things you hear, 2 things you smell, 1 thing you taste</span>
                  </li>
                </>
              )}
              {scenario.id === 'lump' && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 font-bold text-sm flex-shrink-0">1</span>
                    <span className="text-gray-300">Schedule appointment with primary care or specialist within 1-2 weeks (don't wait months)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 font-bold text-sm flex-shrink-0">2</span>
                    <span className="text-gray-300">Document: exact location, size (measure), when discovered, any changes, associated symptoms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 font-bold text-sm flex-shrink-0">3</span>
                    <span className="text-gray-300">Gather family health history: any relatives with cancer (what type, age at diagnosis)</span>
                  </li>
                </>
              )}
              {scenario.id === 'anxiety' && (
                <>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 font-bold text-sm flex-shrink-0">1</span>
                    <span className="text-gray-300">Schedule appointment with primary care provider or psychiatrist for evaluation and treatment options</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 font-bold text-sm flex-shrink-0">2</span>
                    <span className="text-gray-300">Track symptoms daily: time, triggers, severity (1-10), duration - helps identify patterns</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 font-bold text-sm flex-shrink-0">3</span>
                    <span className="text-gray-300">Practice immediate relief: deep breathing (4 count in, 7 hold, 8 out), avoid caffeine, maintain sleep routine</span>
                  </li>
                </>
              )}
            </ol>
          </div>

          {/* Save and Export */}
          <div className="flex gap-4">
            <button className="flex-1 px-6 py-4 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition font-semibold">
              💾 Save Entry
            </button>
            <button className="px-6 py-4 bg-gray-500/20 border border-gray-500/30 text-gray-400 rounded-lg hover:bg-gray-500/30 transition font-semibold">
              📤 Add to Provider Packet
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEntryDetail = () => {
    const entry = sampleEntries.find(e => e.id === activeEntry);
    if (!entry) return null;

    const scenario = scenarios.find(s => s.id === entry.scenarioId)!;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setActiveEntry(null)}
          className="text-blue-400 hover:text-blue-300 transition flex items-center gap-2"
        >
          ← Back to entries
        </button>

        <div className="rounded-xl border border-white/10 bg-white/5 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">{scenario.icon}</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1">{scenario.title}</h2>
              <div className="text-sm text-gray-400">
                Created {format(new Date(entry.createdAt), 'MMM d, yyyy · h:mm a')}
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              entry.includeInExport
                ? 'bg-green-500/20 text-green-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {entry.includeInExport ? 'Included in exports' : 'Private'}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-6 p-4 rounded-lg bg-white/5">
            <h3 className="font-semibold mb-3">Timeline</h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-400">Started:</span> <span className="text-white">{entry.timeline.startDate}</span></div>
              <div><span className="text-gray-400">Symptoms:</span> <span className="text-white">{entry.timeline.symptoms.join(', ')}</span></div>
              <div><span className="text-gray-400">Triggers:</span> <span className="text-white">{entry.timeline.triggers.join(', ')}</span></div>
              <div><span className="text-gray-400">Notes:</span> <span className="text-white">{entry.timeline.notes}</span></div>
            </div>
          </div>

          {/* Provider Script */}
          <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <h3 className="font-semibold text-blue-400 mb-3">Provider Script</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-400 mb-1">Opening:</div>
                <div className="text-white">{entry.providerScript.opening}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Key Concerns:</div>
                <ul className="space-y-1">
                  {entry.providerScript.concerns.map((concern, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span className="text-white">{concern}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Questions to Ask:</div>
                <ol className="space-y-1">
                  {entry.providerScript.questions.map((question, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-400">{idx + 1}.</span>
                      <span className="text-white">{question}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <h3 className="font-semibold text-green-400 mb-3">Next Steps</h3>
            <ol className="space-y-2 text-sm">
              {entry.nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-400">{idx + 1}.</span>
                  <span className="text-white">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button className="flex-1 px-4 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition">
              ✏️ Edit Entry
            </button>
            <button
              onClick={() => {
                if (confirm('Toggle export inclusion?')) {
                  // Toggle logic here
                }
              }}
              className="px-4 py-3 bg-gray-500/20 border border-gray-500/30 text-gray-400 rounded-lg hover:bg-gray-500/30 transition"
            >
              {entry.includeInExport ? '🔒 Make Private' : '📤 Include in Export'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderMain = () => {
    if (activeEntry) return renderEntryDetail();
    if (selectedScenario) return renderScenarioBuilder();

    return (
      <div className="space-y-6">
        {/* Tabs Navigation */}
        <div className="flex gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'scenarios'
                ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            🛡️ Crisis Scenarios
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'providers'
                ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            📍 Find Local Provider
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'resources'
                ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            📚 Resources & Rights
          </button>
        </div>

        {activeTab === 'scenarios' && renderScenariosTab()}
        {activeTab === 'providers' && renderProvidersTab()}
        {activeTab === 'resources' && renderResourcesTab()}
      </div>
    );
  };

  const renderScenariosTab = () => (
    <div className="space-y-6">{/* Crisis Center Header */}
        <div className="rounded-xl border border-red-500/30 bg-gradient-to-br from-red-900/20 via-gray-900/50 to-black p-8">
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🛡️</span>
              <h2 className="text-3xl font-bold text-white">Life Changing Diagnosis</h2>
            </div>
            <p className="text-gray-300 text-lg mb-4">
              Your private crisis center. When something feels urgent, scary, or life-changing—everything you need is here.
            </p>
          </div>
          
          {/* Quick Crisis Resources */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-lg bg-black/40 border border-white/10">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <span className="text-2xl">🚨</span>
              <div>
                <div className="font-semibold text-red-400 text-sm">Emergency</div>
                <div className="text-xs text-gray-400">Call 911</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <span className="text-2xl">💬</span>
              <div>
                <div className="font-semibold text-purple-400 text-sm">Crisis Line</div>
                <div className="text-xs text-gray-400">988 or Text 741741</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <span className="text-2xl">🤖</span>
              <div>
                <div className="font-semibold text-blue-400 text-sm">AI Support</div>
                <div className="text-xs text-gray-400">Chat with Beau-Tox</div>
              </div>
            </div>
          </div>
        </div>

        {/* What's Happening - Scenarios */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>⚡</span>
            What's happening right now?
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {scenarios.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 transition text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{scenario.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{scenario.title}</h3>
                      {scenario.urgent && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{scenario.description}</p>
                  </div>
                  <div className="text-blue-400">→</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* NPA Tools Available Here */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>🧰</span>
            Tools to help you right now
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <a href="/vault/decoder" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-green-500/30 transition">
              <div className="text-3xl mb-2">🔍</div>
              <div className="font-semibold text-white mb-1">Treatment Decoder</div>
              <p className="text-sm text-gray-400">Decode scary lab results, prescriptions, or medical bills into plain English</p>
            </a>
            
            <a href="/vault/ai-insights" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 transition">
              <div className="text-3xl mb-2">🧠</div>
              <div className="font-semibold text-white mb-1">AI Health Insights</div>
              <p className="text-sm text-gray-400">Understand patterns, risks, and what your health data means</p>
            </a>

            <a href="/vault/documents" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 transition">
              <div className="text-3xl mb-2">📄</div>
              <div className="font-semibold text-white mb-1">Upload Documents</div>
              <p className="text-sm text-gray-400">Upload test results, images, or records for AI analysis</p>
            </a>

            <a href="/chat" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-pink-500/30 transition">
              <div className="text-3xl mb-2">💬</div>
              <div className="font-semibold text-white mb-1">Ask Beau-Tox</div>
              <p className="text-sm text-gray-400">Get AI-powered guidance and answers to your questions</p>
            </a>

            <a href="/vault/care-team" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-orange-500/30 transition">
              <div className="text-3xl mb-2">👥</div>
              <div className="font-semibold text-white mb-1">Find Providers</div>
              <p className="text-sm text-gray-400">Connect with specialists who can help with your situation</p>
            </a>

            <a href="/vault/appointments" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-yellow-500/30 transition">
              <div className="text-3xl mb-2">📅</div>
              <div className="font-semibold text-white mb-1">Book Appointment</div>
              <p className="text-sm text-gray-400">Schedule urgent or routine care with available providers</p>
            </a>
          </div>
        </div>

        {/* Learn & Understand */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span>📚</span>
          Learn and understand
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-6 rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
            <h4 className="font-semibold text-white mb-3">Common Concerns</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-blue-400 hover:text-blue-300 transition">→ What does a positive STI test mean?</a>
              <a href="#" className="block text-blue-400 hover:text-blue-300 transition">→ Understanding pregnancy options</a>
              <a href="#" className="block text-blue-400 hover:text-blue-300 transition">→ Panic attacks vs. heart attacks</a>
              <a href="#" className="block text-blue-400 hover:text-blue-300 transition">→ What to do if you find a lump</a>
              <a href="#" className="block text-blue-400 hover:text-blue-300 transition">→ Anxiety treatment options</a>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-gradient-to-br from-green-500/10 to-blue-500/10">
            <h4 className="font-semibold text-white mb-3">Your Rights</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-green-400 hover:text-green-300 transition">→ Confidential care for minors</a>
              <a href="#" className="block text-green-400 hover:text-green-300 transition">→ Getting care without insurance</a>
              <a href="#" className="block text-green-400 hover:text-green-300 transition">→ Privacy and medical records</a>
              <a href="#" className="block text-green-400 hover:text-green-300 transition">→ Second opinions and advocacy</a>
              <a href="#" className="block text-green-400 hover:text-green-300 transition">→ What to do if dismissed by doctors</a>
            </div>
          </div>
        </div>
      </div>

      {/* NPA Tools */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span>🧰</span>
          NPA Tools to help you
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <a href="/vault/decoder" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-green-500/30 transition">
            <div className="text-3xl mb-2">🔍</div>
            <div className="font-semibold text-white mb-1">Treatment Decoder</div>
            <p className="text-sm text-gray-400">Decode scary lab results, prescriptions, or medical bills into plain English</p>
          </a>
          
          <a href="/vault/ai-insights" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 transition">
            <div className="text-3xl mb-2">🧠</div>
            <div className="font-semibold text-white mb-1">AI Health Insights</div>
            <p className="text-sm text-gray-400">Understand patterns, risks, and what your health data means</p>
          </a>

          <a href="/vault/documents" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 transition">
            <div className="text-3xl mb-2">📄</div>
            <div className="font-semibold text-white mb-1">Upload Documents</div>
            <p className="text-sm text-gray-400">Upload test results, images, or records for AI analysis</p>
          </a>

          <a href="/chat" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-pink-500/30 transition">
            <div className="text-3xl mb-2">💬</div>
            <div className="font-semibold text-white mb-1">Ask Beau-Tox</div>
            <p className="text-sm text-gray-400">Get AI-powered guidance and answers to your questions</p>
          </a>

          <a href="/vault/care-team" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-orange-500/30 transition">
            <div className="text-3xl mb-2">👥</div>
            <div className="font-semibold text-white mb-1">Find Providers</div>
            <p className="text-sm text-gray-400">Connect with specialists who can help with your situation</p>
          </a>

          <a href="/vault/appointments" className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-yellow-500/30 transition">
            <div className="text-3xl mb-2">📅</div>
            <div className="font-semibold text-white mb-1">Book Appointment</div>
            <p className="text-sm text-gray-400">Schedule urgent or routine care with available providers</p>
          </a>
        </div>
      </div>

      {/* Support Message */}
      <div className="p-6 rounded-xl border border-purple-500/30 bg-purple-500/10">
        <div className="flex items-start gap-4">
          <div className="text-3xl">💙</div>
          <div>
            <h4 className="font-semibold text-white mb-2">You're not alone</h4>
            <p className="text-gray-300 text-sm">
              Millions of people face scary health moments every year. Having information, support, and a plan makes all the difference. 
              Everything here is private by default—nothing is shared unless you choose to export it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProvidersTab = () => (
    <div className="space-y-6">
      {/* Provider Search Header */}
      <div className="rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-900/20 via-gray-900/50 to-black p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">📍</span>
          <h2 className="text-3xl font-bold text-white">Find Local Crisis Support</h2>
        </div>
        <p className="text-gray-300 mb-6">
          Find providers near you who can help with urgent situations, mental health crises, pregnancy support, STI testing, and more.
        </p>

        {/* Zip Code Search */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Enter ZIP code"
            value={userZip}
            onChange={(e) => setUserZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
            className="flex-1 px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
          />
          <button className="px-6 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition font-semibold">
            🔍 Search
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 transition text-sm">
            Crisis Centers
          </button>
          <button className="px-4 py-2 bg-pink-500/20 border border-pink-500/30 text-pink-400 rounded-lg hover:bg-pink-500/30 transition text-sm">
            Mental Health
          </button>
          <button className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition text-sm">
            Pregnancy Support
          </button>
          <button className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition text-sm">
            STI Testing
          </button>
          <button className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm">
            Emergency Care
          </button>
        </div>
      </div>

      {/* Google Maps Embed */}
      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="relative w-full" style={{ height: '500px' }}>
          {userZip.length === 5 ? (
            <iframe
              width="100%"
              height="500"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/search?key=YOUR_API_KEY&q=crisis+center+near+${userZip}&zoom=12`}
              className="rounded-xl"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 to-black">
              <div className="text-center">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-gray-400 text-lg">Enter your ZIP code to find local providers</p>
                <p className="text-gray-500 text-sm mt-2">Crisis centers, mental health services, urgent care</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Provider Categories */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-6 rounded-xl border border-white/10 bg-white/5">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>🆘</span>
            24/7 Crisis Support
          </h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <div className="font-semibold text-red-400 mb-1">988 Suicide & Crisis Lifeline</div>
              <div className="text-sm text-gray-400">24/7 phone & chat support</div>
              <a href="tel:988" className="text-sm text-blue-400 hover:text-blue-300 transition">Call 988</a>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <div className="font-semibold text-purple-400 mb-1">Crisis Text Line</div>
              <div className="text-sm text-gray-400">Text support 24/7</div>
              <a href="sms:741741" className="text-sm text-blue-400 hover:text-blue-300 transition">Text HOME to 741741</a>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-white/10 bg-white/5">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>🏥</span>
            Find Specific Care
          </h3>
          <div className="space-y-2 text-sm">
            <a href={`https://www.google.com/maps/search/planned+parenthood+near+${userZip || 'me'}`} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 transition">
              → Planned Parenthood locations
            </a>
            <a href={`https://www.google.com/maps/search/mental+health+clinic+near+${userZip || 'me'}`} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition">
              → Mental health clinics
            </a>
            <a href={`https://www.google.com/maps/search/STI+testing+near+${userZip || 'me'}`} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition">
              → STI testing centers
            </a>
            <a href={`https://www.google.com/maps/search/urgent+care+near+${userZip || 'me'}`} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 transition">
              → Urgent care facilities
            </a>
          </div>
        </div>
      </div>

      {/* Important Note */}
      <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
        <p className="text-sm text-yellow-400">
          <strong>Note:</strong> Google Maps integration requires an API key. The search links above will open Google Maps in a new tab to show nearby providers.
        </p>
      </div>
    </div>
  );

  const renderResourcesTab = () => (
    <div className="space-y-6">
      {/* Resources Header */}
      <div className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 via-gray-900/50 to-black p-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">📚</span>
          <h2 className="text-3xl font-bold text-white">Resources & Your Rights</h2>
        </div>
        <p className="text-gray-300">
          Educational resources and information about your healthcare rights in crisis situations.
        </p>
      </div>
      
      {/* Content from earlier replace - Learn, NPA Tools, Support */}
    </div>
  );

  return (
    <div className="text-white">
      <div className="max-w-6xl mx-auto">
        {/* Navigation breadcrumb */}
        <div className="mb-6 text-sm text-gray-400">
          <span className="hover:text-blue-400 cursor-pointer transition">Sacred Vault</span>
          <span className="mx-2">/</span>
          <span className="text-white">Life Changing Diagnosis</span>
        </div>

        {renderMain()}
      </div>
    </div>
  );
}
