"use client";

import React, { useState, useEffect, useMemo } from 'react';

// Questions I Should Ask Types
type QuestionCategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  questions: Question[];
};

type Question = {
  id: string;
  question: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  context: string;
  aiRationale: string;
  followUpQuestions?: string[];
  relatedTopics: string[];
};

type UserResponse = {
  questionId: string;
  response: string;
  timestamp: string;
  context: string;
  followUpNeeded: boolean;
};

type ConversationFlow = {
  id: string;
  title: string;
  description: string;
  questions: string[];
  currentIndex: number;
  completed: boolean;
  insights: string[];
};

// Mock data for demonstration
const questionCategories: QuestionCategory[] = [
  {
    id: 'symptoms',
    name: 'Symptoms & Changes',
    icon: '🤒',
    description: 'Questions about physical symptoms and health changes',
    color: 'from-red-500 to-red-600',
    questions: [
      {
        id: 'symptom-onset',
        question: 'When did you first notice these symptoms?',
        category: 'symptoms',
        priority: 'high',
        context: 'Understanding symptom timeline helps identify patterns and urgency',
        aiRationale: 'Early detection of symptom progression is crucial for timely intervention',
        followUpQuestions: ['How have the symptoms changed since then?', 'What makes them better or worse?'],
        relatedTopics: ['chronic conditions', 'acute illness', 'preventive care']
      },
      {
        id: 'symptom-severity',
        question: 'On a scale of 1-10, how severe are your symptoms?',
        category: 'symptoms',
        priority: 'high',
        context: 'Quantifying symptom severity helps prioritize care needs',
        aiRationale: 'Severity assessment guides urgency and treatment approach',
        relatedTopics: ['pain management', 'quality of life', 'treatment planning']
      },
      {
        id: 'symptom-pattern',
        question: 'Do your symptoms follow any pattern (time of day, activities, food)?',
        category: 'symptoms',
        priority: 'medium',
        context: 'Identifying patterns can reveal triggers and management strategies',
        aiRationale: 'Pattern recognition enables personalized lifestyle modifications',
        relatedTopics: ['triggers', 'lifestyle medicine', 'preventive care']
      }
    ]
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle & Habits',
    icon: '🏃‍♀️',
    description: 'Questions about daily habits and lifestyle factors',
    color: 'from-green-500 to-green-600',
    questions: [
      {
        id: 'sleep-quality',
        question: 'How would you describe your sleep quality over the past week?',
        category: 'lifestyle',
        priority: 'high',
        context: 'Sleep is fundamental to health and affects all other systems',
        aiRationale: 'Sleep disturbances often indicate underlying health issues',
        followUpQuestions: ['How many hours do you sleep?', 'Do you wake up feeling rested?'],
        relatedTopics: ['sleep disorders', 'stress management', 'hormonal health']
      },
      {
        id: 'stress-levels',
        question: 'How would you rate your stress levels on a typical day?',
        category: 'lifestyle',
        priority: 'high',
        context: 'Chronic stress impacts immune function and overall health',
        aiRationale: 'Stress assessment helps identify need for stress management interventions',
        relatedTopics: ['mental health', 'immune system', 'cardiovascular health']
      },
      {
        id: 'exercise-routine',
        question: 'What does your exercise routine look like?',
        category: 'lifestyle',
        priority: 'medium',
        context: 'Physical activity patterns affect metabolism and mental health',
        aiRationale: 'Exercise habits correlate with numerous health outcomes',
        relatedTopics: ['cardiovascular fitness', 'mental health', 'metabolic health']
      }
    ]
  },
  {
    id: 'medical-history',
    name: 'Medical History',
    icon: '📋',
    description: 'Questions about past medical experiences and family history',
    color: 'from-blue-500 to-blue-600',
    questions: [
      {
        id: 'family-history',
        question: 'Are there any health conditions that run in your family?',
        category: 'medical-history',
        priority: 'high',
        context: 'Family history reveals genetic predispositions and risk factors',
        aiRationale: 'Genetic factors significantly influence disease risk and screening needs',
        followUpQuestions: ['Which family members?', 'At what ages were they diagnosed?'],
        relatedTopics: ['genetics', 'preventive screening', 'risk assessment']
      },
      {
        id: 'past-conditions',
        question: 'Have you been diagnosed with any chronic conditions?',
        category: 'medical-history',
        priority: 'high',
        context: 'Understanding existing conditions helps coordinate comprehensive care',
        aiRationale: 'Chronic conditions require ongoing management and monitoring',
        relatedTopics: ['chronic disease management', 'medication interactions', 'holistic care']
      },
      {
        id: 'medications',
        question: 'What medications or supplements are you currently taking?',
        category: 'medical-history',
        priority: 'high',
        context: 'Medication review is essential for safety and effectiveness',
        aiRationale: 'Medication interactions can cause serious health complications',
        relatedTopics: ['pharmacology', 'drug interactions', 'supplement safety']
      }
    ]
  },
  {
    id: 'goals',
    name: 'Goals & Priorities',
    icon: '🎯',
    description: 'Questions about health goals and what matters most',
    color: 'from-purple-500 to-purple-600',
    questions: [
      {
        id: 'health-goals',
        question: 'What are your top 3 health goals for the next 6 months?',
        category: 'goals',
        priority: 'high',
        context: 'Clear goals guide personalized care planning and motivation',
        aiRationale: 'Goal-oriented care improves adherence and outcomes',
        followUpQuestions: ['Why are these goals important to you?', 'What barriers do you anticipate?'],
        relatedTopics: ['motivation', 'behavior change', 'personalized medicine']
      },
      {
        id: 'quality-of-life',
        question: 'What aspects of your health are most important to your quality of life?',
        category: 'goals',
        priority: 'medium',
        context: 'Quality of life priorities shape treatment decisions and care focus',
        aiRationale: 'Patient-centered care considers individual values and preferences',
        relatedTopics: ['patient-centered care', 'quality of life', 'shared decision making']
      },
      {
        id: 'support-system',
        question: 'Who in your life provides support for your health journey?',
        category: 'goals',
        priority: 'medium',
        context: 'Social support is crucial for health behavior change and recovery',
        aiRationale: 'Strong support systems improve health outcomes and adherence',
        relatedTopics: ['social support', 'caregiving', 'community health']
      }
    ]
  }
];

const mockConversationFlows: ConversationFlow[] = [
  {
    id: 'initial-assessment',
    title: 'Initial Health Assessment',
    description: 'Comprehensive baseline health evaluation',
    questions: ['symptom-onset', 'sleep-quality', 'family-history', 'health-goals'],
    currentIndex: 0,
    completed: false,
    insights: []
  },
  {
    id: 'symptom-investigation',
    title: 'Symptom Investigation',
    description: 'Deep dive into current symptoms and patterns',
    questions: ['symptom-severity', 'symptom-pattern', 'stress-levels'],
    currentIndex: 0,
    completed: false,
    insights: []
  },
  {
    id: 'lifestyle-review',
    title: 'Lifestyle & Wellness Review',
    description: 'Assessment of daily habits and wellness practices',
    questions: ['exercise-routine', 'sleep-quality', 'stress-levels'],
    currentIndex: 0,
    completed: false,
    insights: []
  }
];

export default function QuestionsIShouldAsk() {
  const [activeTab, setActiveTab] = useState<'categories' | 'conversations' | 'insights' | 'analytics'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [activeConversation, setActiveConversation] = useState<ConversationFlow | null>(null);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');

  const getPriorityColor = (priority: Question['priority']) => {
    const colors = {
      high: 'text-red-400 bg-red-500/20',
      medium: 'text-orange-400 bg-orange-500/20',
      low: 'text-green-400 bg-green-500/20'
    };
    return colors[priority];
  };

  const getCategoryStats = useMemo(() => {
    return questionCategories.map(cat => ({
      ...cat,
      totalQuestions: cat.questions.length,
      highPriority: cat.questions.filter(q => q.priority === 'high').length,
      answered: responses.filter(r => cat.questions.some(q => q.id === r.questionId)).length
    }));
  }, [responses]);

  const handleQuestionResponse = (questionId: string, response: string) => {
    const newResponse: UserResponse = {
      questionId,
      response,
      timestamp: new Date().toISOString(),
      context: 'User provided response via questionnaire',
      followUpNeeded: Math.random() > 0.7 // Simulate AI decision for follow-up
    };
    setResponses(prev => [...prev, newResponse]);
    setShowResponseModal(false);
    setCurrentResponse('');
  };

  const getQuestionInsights = (questionId: string) => {
    // Mock AI insights based on question type
    const insights = {
      'symptom-onset': [
        'Early symptom recognition can lead to better outcomes',
        'Consider keeping a symptom journal for patterns',
        'Share this timeline with your healthcare provider'
      ],
      'sleep-quality': [
        'Sleep quality affects immune function and cognitive performance',
        'Consider sleep hygiene improvements if quality is poor',
        'Track sleep patterns for 2 weeks to identify trends'
      ],
      'family-history': [
        'Genetic factors may influence screening recommendations',
        'Family history suggests increased monitoring needs',
        'Consider genetic counseling for comprehensive assessment'
      ]
    };
    return insights[questionId as keyof typeof insights] || ['AI analysis in progress...'];
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
            Questions I Should Ask
          </h1>
          <p className="text-gray-400">
            AI-powered health questionnaire system that asks the right questions at the right time
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900 p-1 rounded-lg">
          {[
            { id: 'categories', label: 'Question Categories', icon: '📋' },
            { id: 'conversations', label: 'Conversation Flows', icon: '💬' },
            { id: 'insights', label: 'AI Insights', icon: '🧠' },
            { id: 'analytics', label: 'Response Analytics', icon: '📊' }
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

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-purple-400">📋 Question Categories</h2>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-400">
                  {responses.length} responses recorded
                </div>
                <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-medium transition">
                  Start Assessment
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getCategoryStats.map((category) => (
                <div
                  key={category.id}
                  className="bg-gray-900 rounded-xl p-6 cursor-pointer hover:bg-gray-800 transition"
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{category.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                        <p className="text-sm text-gray-400">{category.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">{category.answered}/{category.totalQuestions}</div>
                      <div className="text-xs text-gray-400">Answered</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Priority:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor('high')}`}>
                        {category.highPriority} High
                      </span>
                    </div>
                    <div className={`w-24 bg-gray-700 rounded-full h-2`}>
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                        style={{ width: `${(category.answered / category.totalQuestions) * 100}%` }}
                      />
                    </div>
                  </div>

                  {selectedCategory === category.id && (
                    <div className="space-y-3 mt-4 pt-4 border-t border-gray-700">
                      {category.questions.map((question) => (
                        <div key={question.id} className="bg-black/40 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(question.priority)}`}>
                                  {question.priority}
                                </span>
                                {responses.some(r => r.questionId === question.id) && (
                                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                                    Answered
                                  </span>
                                )}
                              </div>
                              <h4 className="text-white font-medium mb-2">{question.question}</h4>
                              <p className="text-sm text-gray-400 mb-2">{question.context}</p>
                              <div className="flex flex-wrap gap-1">
                                {question.relatedTopics.map((topic, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedQuestion(question);
                              }}
                              className="px-3 py-1 bg-purple-500 hover:bg-purple-600 rounded text-sm font-medium transition"
                            >
                              Answer
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conversations Tab */}
        {activeTab === 'conversations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-blue-400">💬 Conversation Flows</h2>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition">
                + New Conversation
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockConversationFlows.map((flow) => (
                <div key={flow.id} className="bg-gray-900 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{flow.title}</h3>
                      <p className="text-sm text-gray-400">{flow.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">{flow.currentIndex}/{flow.questions.length}</div>
                      <div className="text-xs text-gray-400">Progress</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        style={{ width: `${(flow.currentIndex / flow.questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {flow.completed ? (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">
                          ✅ Completed
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-sm">
                          🔄 In Progress
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setActiveConversation(flow)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition"
                    >
                      {flow.completed ? 'Review' : 'Continue'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-green-400">🧠 AI Insights</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Response Patterns */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📈 Response Patterns</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <h4 className="font-medium text-blue-400 mb-2">Symptom Timeline Analysis</h4>
                    <p className="text-sm text-gray-300">
                      Your symptom onset patterns suggest potential environmental triggers.
                      Consider tracking daily activities alongside symptoms.
                    </p>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <h4 className="font-medium text-green-400 mb-2">Sleep Quality Insights</h4>
                    <p className="text-sm text-gray-300">
                      Sleep patterns correlate with reported stress levels.
                      Improving sleep hygiene may reduce overall stress burden.
                    </p>
                  </div>
                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <h4 className="font-medium text-purple-400 mb-2">Family History Correlations</h4>
                    <p className="text-sm text-gray-300">
                      Family history suggests increased screening needs for certain conditions.
                      Consider discussing genetic risk assessment with your provider.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommended Follow-ups */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🔍 Recommended Follow-ups</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                    <h4 className="font-medium text-red-400 mb-2">High Priority</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Schedule follow-up for symptom severity assessment</li>
                      <li>• Discuss family history with primary care provider</li>
                      <li>• Consider sleep study evaluation</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <h4 className="font-medium text-orange-400 mb-2">Medium Priority</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Review current exercise routine</li>
                      <li>• Assess stress management techniques</li>
                      <li>• Update medication list</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <h4 className="font-medium text-green-400 mb-2">Wellness Focus</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Explore nutrition improvements</li>
                      <li>• Consider mindfulness practices</li>
                      <li>• Build social support network</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="bg-gray-900 rounded-xl p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">💡 AI-Powered Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                    <h4 className="font-medium text-purple-400 mb-2">Next Best Question</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      &ldquo;How has your energy level changed over the past month?&rdquo;
                    </p>
                    <button className="w-full px-3 py-2 bg-purple-500 hover:bg-purple-600 rounded text-sm font-medium transition">
                      Ask This Question
                    </button>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                    <h4 className="font-medium text-blue-400 mb-2">Assessment Priority</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Focus on cardiovascular risk factors based on family history and lifestyle patterns.
                    </p>
                    <button className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded text-sm font-medium transition">
                      Start Assessment
                    </button>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                    <h4 className="font-medium text-green-400 mb-2">Wellness Opportunity</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Strong potential for sleep quality improvement through simple habit changes.
                    </p>
                    <button className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 rounded text-sm font-medium transition">
                      Explore Options
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-orange-400">📊 Response Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Response Statistics */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📈 Response Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Total Responses</span>
                    <span className="text-white font-bold">{responses.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Questions Answered</span>
                    <span className="text-white font-bold">{new Set(responses.map(r => r.questionId)).size}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Follow-ups Needed</span>
                    <span className="text-orange-400 font-bold">{responses.filter(r => r.followUpNeeded).length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Completion Rate</span>
                    <span className="text-green-400 font-bold">67%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Average Response Time</span>
                    <span className="text-white font-bold">2.3 min</span>
                  </div>
                </div>
              </div>

              {/* Category Performance */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🎯 Category Performance</h3>
                <div className="space-y-4">
                  {getCategoryStats.map((category) => (
                    <div key={category.id} className="p-3 bg-black/40 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{category.name}</span>
                        <span className="text-sm text-gray-400">{category.answered}/{category.totalQuestions}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                          style={{ width: `${(category.answered / category.totalQuestions) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Effectiveness */}
              <div className="bg-gray-900 rounded-xl p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">🤖 AI Effectiveness Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-lg font-bold text-green-400">94%</div>
                    <div className="text-sm text-gray-400">Question Relevance</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-lg font-bold text-blue-400">87%</div>
                    <div className="text-sm text-gray-400">Response Prediction</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">💡</div>
                    <div className="text-lg font-bold text-purple-400">91%</div>
                    <div className="text-sm text-gray-400">Insight Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">🚀</div>
                    <div className="text-lg font-bold text-orange-400">89%</div>
                    <div className="text-sm text-gray-400">User Engagement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Question Response Modal */}
        {selectedQuestion && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">Answer Question</h2>
                  <button
                    onClick={() => setSelectedQuestion(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Question</h3>
                    <p className="text-white bg-black/40 rounded-lg p-4">{selectedQuestion.question}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Context</h3>
                    <p className="text-gray-300 bg-black/40 rounded-lg p-4">{selectedQuestion.context}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">AI Rationale</h3>
                    <p className="text-blue-300 bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                      {selectedQuestion.aiRationale}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">Your Response</h3>
                    <textarea
                      value={currentResponse}
                      onChange={(e) => setCurrentResponse(e.target.value)}
                      placeholder="Type your response here..."
                      className="w-full h-32 bg-black/40 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  {selectedQuestion.followUpQuestions && selectedQuestion.followUpQuestions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-300 mb-2">Potential Follow-up Questions</h3>
                      <div className="space-y-2">
                        {selectedQuestion.followUpQuestions.map((followUp, idx) => (
                          <div key={idx} className="text-gray-400 bg-black/40 rounded-lg p-3">
                            • {followUp}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-4">
                    <button
                      onClick={() => setSelectedQuestion(null)}
                      className="px-4 py-2 text-gray-400 hover:text-white transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleQuestionResponse(selectedQuestion.id, currentResponse)}
                      disabled={!currentResponse.trim()}
                      className="px-6 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition"
                    >
                      Submit Response
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Conversation Modal */}
        {activeConversation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">{activeConversation.title}</h2>
                  <button
                    onClick={() => setActiveConversation(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <p className="text-gray-400">{activeConversation.description}</p>

                  <div className="bg-black/40 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white font-medium">Progress</span>
                      <span className="text-gray-400">
                        {activeConversation.currentIndex} of {activeConversation.questions.length} questions
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        style={{ width: `${(activeConversation.currentIndex / activeConversation.questions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-center py-8">
                    <p className="text-gray-400">Conversation flow interface would be implemented here</p>
                    <p className="text-sm text-gray-500 mt-2">This would guide users through sequential questions with adaptive logic</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}