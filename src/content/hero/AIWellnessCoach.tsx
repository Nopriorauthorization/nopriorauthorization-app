"use client";

import React, { useState } from 'react';
import { format } from 'date-fns';

// AI Wellness Coach with personalized guidance and habit formation
export default function AIWellnessCoach() {
  const [activeTab, setActiveTab] = useState<'overview' | 'coaching' | 'habits' | 'goals' | 'insights'>('overview');
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);

  // Mock coaching sessions
  const coachingSessions = [
    {
      id: 'session-1',
      date: new Date('2026-01-18T09:00:00'),
      type: 'morning-checkin',
      topic: 'Morning Wellness Check-in',
      duration: '5 min',
      completed: true,
      insights: [
        'Hydration levels optimal',
        'Sleep quality improved by 23%',
        'Energy levels aligned with circadian rhythm'
      ],
      recommendations: [
        'Continue morning meditation routine',
        'Consider adding 10-minute walk after breakfast',
        'Maintain consistent wake-up time'
      ],
      aiConfidence: 94
    },
    {
      id: 'session-2',
      date: new Date('2026-01-17T15:30:00'),
      type: 'motivation-boost',
      topic: 'Afternoon Motivation Session',
      duration: '8 min',
      completed: true,
      insights: [
        'Detected afternoon energy dip pattern',
        'Stress levels elevated during work hours',
        'Movement goals 67% complete for day'
      ],
      recommendations: [
        'Take 5-minute breathing exercise break',
        'Schedule short walk to boost energy',
        'Practice progressive muscle relaxation'
      ],
      aiConfidence: 91
    },
    {
      id: 'session-3',
      date: new Date('2026-01-18T14:00:00'),
      type: 'scheduled',
      topic: 'Weekly Progress Review',
      duration: '15 min',
      completed: false,
      insights: [],
      recommendations: [],
      aiConfidence: 0
    }
  ];

  // Mock habit tracking
  const habits = [
    {
      id: 'habit-1',
      name: 'Morning Meditation',
      category: 'Mindfulness',
      frequency: 'Daily',
      currentStreak: 23,
      longestStreak: 45,
      completionRate: 87,
      weeklyProgress: [true, true, true, false, true, true, true],
      healthImpact: {
        stressReduction: 34,
        sleepQuality: 28,
        mentalClarity: 41
      },
      aiInsights: [
        'Consistent morning practice correlates with 28% better sleep quality',
        'Optimal timing: 6:30-7:00 AM based on your circadian rhythm',
        'Consider extending to 15 minutes for enhanced benefits'
      ],
      nextMilestone: 'Reach 30-day streak',
      daysToMilestone: 7
    },
    {
      id: 'habit-2',
      name: 'Hydration Tracking',
      category: 'Physical Health',
      frequency: 'Daily',
      currentStreak: 12,
      longestStreak: 18,
      completionRate: 92,
      weeklyProgress: [true, true, true, true, true, false, true],
      healthImpact: {
        energyLevels: 29,
        skinHealth: 22,
        cognitiveFunction: 18
      },
      aiInsights: [
        'Achieving 8+ glasses daily improves energy by 29%',
        'Peak hydration times: 7 AM, 11 AM, 3 PM, 7 PM',
        'Consider adding electrolytes during workout days'
      ],
      nextMilestone: 'Reach 14-day streak',
      daysToMilestone: 2
    },
    {
      id: 'habit-3',
      name: 'Evening Skincare Routine',
      category: 'Self-Care',
      frequency: 'Daily',
      currentStreak: 8,
      longestStreak: 15,
      completionRate: 78,
      weeklyProgress: [true, false, true, true, true, false, true],
      healthImpact: {
        skinQuality: 45,
        selfEsteem: 31,
        sleepRoutine: 19
      },
      aiInsights: [
        'Consistency improves skin quality by 45%',
        'Evening routine primes better sleep habits',
        'Consider setting 9 PM reminder for optimal timing'
      ],
      nextMilestone: 'Reach 10-day streak',
      daysToMilestone: 2
    }
  ];

  // Mock wellness goals
  const wellnessGoals = [
    {
      id: 'goal-1',
      title: 'Improve Sleep Quality',
      category: 'Rest & Recovery',
      priority: 'high',
      status: 'on-track',
      progress: 67,
      startDate: new Date('2026-01-01'),
      targetDate: new Date('2026-03-01'),
      milestones: [
        { name: 'Establish bedtime routine', status: 'completed', date: new Date('2026-01-10') },
        { name: 'Achieve 7+ hours consistently', status: 'in-progress', progress: 67 },
        { name: 'Reduce wake-ups to <2 per night', status: 'pending', progress: 0 }
      ],
      aiCoaching: {
        currentFocus: 'Maintain consistent sleep schedule',
        nextStep: 'Optimize bedroom environment (temperature, darkness)',
        predictedCompletion: new Date('2026-02-24'),
        successProbability: 84
      },
      metrics: {
        baseline: 5.2,
        current: 6.8,
        target: 8.0,
        unit: 'hours'
      }
    },
    {
      id: 'goal-2',
      title: 'Build Consistent Exercise Habit',
      category: 'Physical Fitness',
      priority: 'high',
      status: 'needs-attention',
      progress: 42,
      startDate: new Date('2025-12-15'),
      targetDate: new Date('2026-03-15'),
      milestones: [
        { name: 'Exercise 2x per week', status: 'completed', date: new Date('2025-12-28') },
        { name: 'Exercise 4x per week', status: 'in-progress', progress: 42 },
        { name: 'Exercise 5x per week', status: 'pending', progress: 0 }
      ],
      aiCoaching: {
        currentFocus: 'Overcome afternoon motivation barrier',
        nextStep: 'Schedule workouts in morning when energy is highest',
        predictedCompletion: new Date('2026-04-10'),
        successProbability: 71
      },
      metrics: {
        baseline: 1.5,
        current: 3.2,
        target: 5.0,
        unit: 'days/week'
      }
    },
    {
      id: 'goal-3',
      title: 'Reduce Stress Levels',
      category: 'Mental Wellness',
      priority: 'medium',
      status: 'on-track',
      progress: 58,
      startDate: new Date('2025-12-01'),
      targetDate: new Date('2026-02-28'),
      milestones: [
        { name: 'Daily mindfulness practice', status: 'completed', date: new Date('2025-12-20') },
        { name: 'Reduce perceived stress by 30%', status: 'in-progress', progress: 58 },
        { name: 'Achieve stress resilience rating >7/10', status: 'pending', progress: 0 }
      ],
      aiCoaching: {
        currentFocus: 'Integrate stress-relief techniques into daily routine',
        nextStep: 'Practice 4-7-8 breathing during high-stress moments',
        predictedCompletion: new Date('2026-02-22'),
        successProbability: 88
      },
      metrics: {
        baseline: 7.8,
        current: 5.2,
        target: 3.5,
        unit: 'stress score'
      }
    }
  ];

  // Mock personalized insights
  const personalizedInsights = [
    {
      id: 'insight-1',
      type: 'pattern',
      title: 'Your Peak Performance Window',
      description: 'AI analysis shows you perform best between 9 AM - 12 PM',
      icon: '🎯',
      confidence: 93,
      actionable: true,
      actions: [
        'Schedule important tasks during peak hours',
        'Protect this time block from interruptions',
        'Use afternoon for lighter, creative work'
      ],
      impact: 'high',
      evidence: '23 days of activity data analysis'
    },
    {
      id: 'insight-2',
      type: 'correlation',
      title: 'Sleep-Exercise Connection',
      description: 'Morning exercise increases sleep quality by 31% on average',
      icon: '💤',
      confidence: 89,
      actionable: true,
      actions: [
        'Prioritize morning workouts 3-4x per week',
        'Avoid intense exercise after 7 PM',
        'Consider yoga or stretching for evening sessions'
      ],
      impact: 'high',
      evidence: '6 weeks of correlated data'
    },
    {
      id: 'insight-3',
      type: 'recommendation',
      title: 'Hydration Timing Optimization',
      description: 'Strategic hydration at specific times boosts energy 29%',
      icon: '💧',
      confidence: 87,
      actionable: true,
      actions: [
        'Drink 16oz water upon waking',
        'Hydrate 30 minutes before meals',
        'Sip water every hour during work'
      ],
      impact: 'medium',
      evidence: '4 weeks of hydration tracking'
    }
  ];

  // Mock coaching messages
  const aiMessages = [
    {
      id: 'msg-1',
      time: new Date('2026-01-18T09:15:00'),
      type: 'encouragement',
      message: "Great job maintaining your meditation streak! You're building real neural pathways. 🧠",
      actionable: false
    },
    {
      id: 'msg-2',
      time: new Date('2026-01-18T14:00:00'),
      type: 'reminder',
      message: "Time for your weekly progress review. I've prepared insights from your last 7 days. 📊",
      actionable: true,
      action: 'Start Review'
    },
    {
      id: 'msg-3',
      time: new Date('2026-01-17T16:30:00'),
      type: 'insight',
      message: "I noticed your energy dips around 3 PM. A 5-minute walk could boost your energy by 40%. 🚶",
      actionable: true,
      action: 'Set Reminder'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Coaching Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-6">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-2xl font-bold text-blue-400">{wellnessGoals.length}</div>
          <div className="text-sm text-gray-400">Active Goals</div>
          <div className="mt-2 text-xs text-blue-400">
            {wellnessGoals.filter(g => g.status === 'on-track').length} on track
          </div>
        </div>

        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-green-400">{Math.max(...habits.map(h => h.currentStreak))}</div>
          <div className="text-sm text-gray-400">Longest Current Streak</div>
          <div className="mt-2 text-xs text-green-400">
            {habits.filter(h => h.currentStreak > 7).length} habits strong
          </div>
        </div>

        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-6">
          <div className="text-3xl mb-2">🤖</div>
          <div className="text-2xl font-bold text-purple-400">94%</div>
          <div className="text-sm text-gray-400">AI Confidence</div>
          <div className="mt-2 text-xs text-purple-400">
            Based on {coachingSessions.length} sessions
          </div>
        </div>
      </div>

      {/* AI Messages */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>💬</span>
          Recent Coaching Messages
        </h3>
        <div className="space-y-3">
          {aiMessages.map(msg => (
            <div key={msg.id} className="flex gap-4 rounded-lg bg-white/5 p-4">
              <div className="text-2xl">🤖</div>
              <div className="flex-1">
                <p className="text-sm text-gray-300">{msg.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(msg.time, 'MMM d, h:mm a')}
                </p>
              </div>
              {msg.actionable && (
                <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-sm">
                  {msg.action}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Today's Focus */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold mb-4">Today's Wellness Focus</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🧘</span>
              <span className="font-semibold">Morning Ritual</span>
            </div>
            <p className="text-sm text-gray-400">
              Complete your meditation and hydration routine
            </p>
            <div className="mt-3 flex gap-2">
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '50%' }} />
              </div>
              <span className="text-xs text-gray-400">1/2</span>
            </div>
          </div>

          <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">💪</span>
              <span className="font-semibold">Movement Goal</span>
            </div>
            <p className="text-sm text-gray-400">
              30 minutes of intentional movement
            </p>
            <div className="mt-3 flex gap-2">
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '0%' }} />
              </div>
              <span className="text-xs text-gray-400">0/30 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCoaching = () => (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold mb-4">Coaching Sessions</h3>
        <div className="space-y-4">
          {coachingSessions.map(session => (
            <div
              key={session.id}
              className={`rounded-lg border p-4 ${
                session.completed
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-blue-500/10 border-blue-500/30'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold">{session.topic}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    {format(session.date, 'MMM d, yyyy · h:mm a')} · {session.duration}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  session.completed ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {session.completed ? 'Completed' : 'Scheduled'}
                </div>
              </div>

              {session.completed && (
                <>
                  <div className="mb-3">
                    <div className="text-sm font-semibold mb-2">Key Insights:</div>
                    <ul className="space-y-1">
                      {session.insights.map((insight, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-green-400">✓</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-sm font-semibold mb-2">AI Recommendations:</div>
                    <ul className="space-y-1">
                      {session.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-blue-400">→</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                    <span>AI Confidence:</span>
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[100px]">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${session.aiConfidence}%` }}
                      />
                    </div>
                    <span>{session.aiConfidence}%</span>
                  </div>
                </>
              )}

              {!session.completed && (
                <button className="w-full mt-3 px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition">
                  Start Session
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHabits = () => (
    <div className="space-y-6">
      {habits.map(habit => (
        <div
          key={habit.id}
          className="rounded-xl border border-white/10 bg-white/5 p-6 hover:border-blue-500/30 transition cursor-pointer"
          onClick={() => setSelectedHabit(selectedHabit === habit.id ? null : habit.id)}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-lg font-semibold">{habit.name}</div>
              <div className="text-sm text-gray-400">{habit.category} · {habit.frequency}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-400">{habit.currentStreak}</div>
              <div className="text-xs text-gray-400">day streak</div>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="mb-4">
            <div className="text-sm font-semibold mb-2">This Week:</div>
            <div className="flex gap-2">
              {habit.weeklyProgress.map((completed, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                    completed
                      ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                      : 'bg-red-500/20 border border-red-500/30 text-red-400'
                  }`}
                >
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}
                </div>
              ))}
            </div>
          </div>

          {/* Completion Rate */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Completion Rate</span>
              <span className="font-semibold text-blue-400">{habit.completionRate}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${habit.completionRate}%` }}
              />
            </div>
          </div>

          {selectedHabit === habit.id && (
            <>
              {/* Health Impact */}
              <div className="mb-4 p-4 rounded-lg bg-white/5">
                <div className="text-sm font-semibold mb-3">Health Impact:</div>
                <div className="space-y-2">
                  {Object.entries(habit.healthImpact).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                        <span className="text-green-400 font-semibold w-12 text-right">+{value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <div className="mb-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <span>🤖</span>
                  AI Insights
                </div>
                <ul className="space-y-2">
                  {habit.aiInsights.map((insight, idx) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Milestone */}
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Next Milestone</div>
                    <div className="text-sm text-gray-400 mt-1">{habit.nextMilestone}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">{habit.daysToMilestone}</div>
                    <div className="text-xs text-gray-400">days away</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      {wellnessGoals.map(goal => (
        <div
          key={goal.id}
          className="rounded-xl border border-white/10 bg-white/5 p-6 hover:border-purple-500/30 transition cursor-pointer"
          onClick={() => setSelectedGoal(selectedGoal === goal.id ? null : goal.id)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-lg font-semibold">{goal.title}</div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  goal.status === 'on-track'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-orange-500/20 text-orange-400'
                }`}>
                  {goal.status === 'on-track' ? 'On Track' : 'Needs Attention'}
                </div>
              </div>
              <div className="text-sm text-gray-400">{goal.category}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">{goal.progress}%</div>
              <div className="text-xs text-gray-400">complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-4 p-4 rounded-lg bg-white/5">
            <div>
              <div className="text-xs text-gray-400">Baseline</div>
              <div className="text-lg font-semibold">{goal.metrics.baseline} <span className="text-sm text-gray-400">{goal.metrics.unit}</span></div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Current</div>
              <div className="text-lg font-semibold text-blue-400">{goal.metrics.current} <span className="text-sm text-gray-400">{goal.metrics.unit}</span></div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Target</div>
              <div className="text-lg font-semibold text-green-400">{goal.metrics.target} <span className="text-sm text-gray-400">{goal.metrics.unit}</span></div>
            </div>
          </div>

          {selectedGoal === goal.id && (
            <>
              {/* Milestones */}
              <div className="mb-4">
                <div className="text-sm font-semibold mb-3">Milestones:</div>
                <div className="space-y-2">
                  {goal.milestones.map((milestone, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        milestone.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : milestone.status === 'in-progress'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {milestone.status === 'completed' ? '✓' : idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{milestone.name}</div>
                        {milestone.status === 'in-progress' && (
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[200px]">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${milestone.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400">{milestone.progress}%</span>
                          </div>
                        )}
                      </div>
                      {milestone.date && (
                        <div className="text-xs text-gray-400">
                          {format(milestone.date, 'MMM d')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Coaching */}
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span>🤖</span>
                  AI Coaching Guidance
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Current Focus:</span>
                    <span className="ml-2 text-white">{goal.aiCoaching.currentFocus}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Next Step:</span>
                    <span className="ml-2 text-white">{goal.aiCoaching.nextStep}</span>
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <div>
                      <span className="text-gray-400">Predicted Completion:</span>
                      <span className="ml-2 text-blue-400 font-semibold">
                        {format(goal.aiCoaching.predictedCompletion, 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Success Probability:</span>
                      <span className="ml-2 text-green-400 font-semibold">
                        {goal.aiCoaching.successProbability}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      {personalizedInsights.map(insight => (
        <div
          key={insight.id}
          className={`rounded-xl border p-6 ${
            insight.impact === 'high'
              ? 'bg-purple-500/10 border-purple-500/30'
              : 'bg-blue-500/10 border-blue-500/30'
          }`}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="text-4xl">{insight.icon}</div>
            <div className="flex-1">
              <div className="text-lg font-semibold mb-1">{insight.title}</div>
              <div className="text-sm text-gray-300 mb-2">{insight.description}</div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <span>Confidence:</span>
                  <span className="text-purple-400 font-semibold">{insight.confidence}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Impact:</span>
                  <span className={`font-semibold ${
                    insight.impact === 'high' ? 'text-purple-400' : 'text-blue-400'
                  }`}>
                    {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)}
                  </span>
                </div>
                <div>{insight.evidence}</div>
              </div>
            </div>
          </div>

          {insight.actionable && (
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-sm font-semibold mb-2">Actionable Steps:</div>
              <ul className="space-y-2">
                {insight.actions.map((action, idx) => (
                  <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-blue-400">→</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🤖</span>
            <div>
              <h1 className="text-3xl font-bold">AI Wellness Coach</h1>
              <p className="text-gray-400">Your personal AI guide to optimal health and wellbeing</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'coaching', label: 'Coaching', icon: '💬' },
            { id: 'habits', label: 'Habits', icon: '🔥' },
            { id: 'goals', label: 'Goals', icon: '🎯' },
            { id: 'insights', label: 'Insights', icon: '💡' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'coaching' && renderCoaching()}
        {activeTab === 'habits' && renderHabits()}
        {activeTab === 'goals' && renderGoals()}
        {activeTab === 'insights' && renderInsights()}
      </div>
    </div>
  );
}
