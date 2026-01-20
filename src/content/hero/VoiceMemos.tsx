"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';

// Voice Memos Types
type VoiceMemo = {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  transcript: string;
  aiSummary: string;
  category: 'symptoms' | 'medication' | 'appointments' | 'feelings' | 'insights' | 'other';
  tags: string[];
  createdAt: string;
  lastModified: string;
  privacy: 'private' | 'shared' | 'public';
  aiInsights: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
};

type RecordingState = 'idle' | 'recording' | 'paused' | 'processing';

type AudioAnalysis = {
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  keywords: string[];
  topics: string[];
  urgency: 'low' | 'medium' | 'high';
  followUp: string[];
};

// Mock data for demonstration
const mockVoiceMemos: VoiceMemo[] = [
  {
    id: 'memo-1',
    title: 'Morning Symptom Check',
    description: 'Daily check-in about headache and fatigue',
    audioUrl: '/api/placeholder/audio',
    duration: 45,
    transcript: "Good morning. I've been having this persistent headache since yesterday afternoon. It's a dull ache behind my eyes, and I've also been feeling quite fatigued. Took my blood pressure medication as usual. The headache seems to be worse when I'm looking at screens. Might need to take a break from work today.",
    aiSummary: "Patient reports persistent headache and fatigue. Symptoms began yesterday afternoon. Headache described as dull ache behind eyes, worse with screen time. Blood pressure medication taken as scheduled. Suggests taking break from work.",
    category: 'symptoms',
    tags: ['headache', 'fatigue', 'screen time', 'medication'],
    createdAt: '2026-01-20T08:30:00Z',
    lastModified: '2026-01-20T08:30:00Z',
    privacy: 'private',
    aiInsights: [
      'Headache pattern suggests possible eye strain or dehydration',
      'Fatigue may be related to headache or medication side effects',
      'Screen time reduction recommended for symptom management'
    ],
    sentiment: 'neutral'
  },
  {
    id: 'memo-2',
    title: 'Medication Side Effects',
    description: 'Noting reactions to new blood pressure medication',
    audioUrl: '/api/placeholder/audio',
    duration: 62,
    transcript: "Just wanted to record that I've started the new blood pressure medication yesterday. So far, I've noticed some dizziness when I stand up quickly, and I've been feeling a bit more tired than usual. Also, my mouth feels dry. I hope these side effects lessen over time. I'll give it a few more days before calling the doctor.",
    aiSummary: "Patient started new blood pressure medication yesterday. Experiencing dizziness upon standing, increased fatigue, and dry mouth. Plans to monitor symptoms for a few days before contacting healthcare provider.",
    category: 'medication',
    tags: ['blood pressure', 'dizziness', 'fatigue', 'dry mouth', 'new medication'],
    createdAt: '2026-01-19T20:15:00Z',
    lastModified: '2026-01-19T20:15:00Z',
    privacy: 'private',
    aiInsights: [
      'Common side effects of blood pressure medication: dizziness, fatigue, dry mouth',
      'Orthostatic hypotension possible - advise caution when standing',
      'Monitor symptoms for 3-5 days, contact provider if symptoms worsen'
    ],
    sentiment: 'neutral'
  },
  {
    id: 'memo-3',
    title: 'Doctor Appointment Follow-up',
    description: 'Recording key points from cardiology appointment',
    audioUrl: '/api/placeholder/audio',
    duration: 78,
    transcript: "Just got back from my cardiology appointment. Dr. Smith reviewed my recent test results and said my cholesterol levels have improved significantly since starting the new statin. Blood pressure is well controlled. He wants me to continue the current regimen and come back in 3 months. Also reminded me about the importance of regular exercise and diet.",
    aiSummary: "Cardiology follow-up appointment completed. Cholesterol levels improved on statin therapy. Blood pressure well controlled. Follow-up scheduled in 3 months. Emphasized importance of exercise and diet.",
    category: 'appointments',
    tags: ['cardiology', 'cholesterol', 'blood pressure', 'statin', 'follow-up'],
    createdAt: '2026-01-18T14:45:00Z',
    lastModified: '2026-01-18T14:45:00Z',
    privacy: 'shared',
    aiInsights: [
      'Positive progress on lipid management',
      'Blood pressure control maintained',
      'Lifestyle factors remain important for cardiovascular health'
    ],
    sentiment: 'positive'
  },
  {
    id: 'memo-4',
    title: 'Feeling Anxious Today',
    description: 'Expressing concerns about upcoming procedure',
    audioUrl: '/api/placeholder/audio',
    duration: 39,
    transcript: "I'm feeling really anxious today about the cardiac stress test next week. I keep thinking about what if something shows up on the test. I know it's just routine, but I can't help worrying. Maybe I should talk to someone about this anxiety. It's affecting my sleep and concentration.",
    aiSummary: "Patient expressing significant anxiety about upcoming cardiac stress test. Concerned about potential findings. Anxiety impacting sleep and concentration. Considering seeking support for anxiety management.",
    category: 'feelings',
    tags: ['anxiety', 'stress test', 'worry', 'sleep', 'concentration'],
    createdAt: '2026-01-17T19:20:00Z',
    lastModified: '2026-01-17T19:20:00Z',
    privacy: 'private',
    aiInsights: [
      'Pre-procedure anxiety is common and normal',
      'Anxiety affecting sleep and cognitive function',
      'Consider anxiety management strategies or counseling',
      'Reassurance about routine nature of stress test may help'
    ],
    sentiment: 'negative'
  }
];

export default function VoiceMemos() {
  const [activeTab, setActiveTab] = useState<'memos' | 'record' | 'analytics' | 'insights'>('memos');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMemo, setSelectedMemo] = useState<VoiceMemo | null>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const categories = [
    { id: 'all', name: 'All Memos', icon: '🎙️', color: 'from-gray-500 to-gray-600' },
    { id: 'symptoms', name: 'Symptoms', icon: '🤒', color: 'from-red-500 to-red-600' },
    { id: 'medication', name: 'Medication', icon: '💊', color: 'from-blue-500 to-blue-600' },
    { id: 'appointments', name: 'Appointments', icon: '📅', color: 'from-green-500 to-green-600' },
    { id: 'feelings', name: 'Feelings', icon: '💭', color: 'from-purple-500 to-purple-600' },
    { id: 'insights', name: 'Insights', icon: '💡', color: 'from-orange-500 to-orange-600' },
    { id: 'other', name: 'Other', icon: '📝', color: 'from-gray-500 to-gray-600' }
  ];

  const filteredMemos = useMemo(() => {
    let filtered = mockVoiceMemos;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(memo => memo.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(memo =>
        memo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memo.transcript.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const getCategoryColor = (category: VoiceMemo['category']) => {
    const colors = {
      symptoms: 'from-red-500 to-red-600',
      medication: 'from-blue-500 to-blue-600',
      appointments: 'from-green-500 to-green-600',
      feelings: 'from-purple-500 to-purple-600',
      insights: 'from-orange-500 to-orange-600',
      other: 'from-gray-500 to-gray-600'
    };
    return colors[category];
  };

  const getSentimentColor = (sentiment: VoiceMemo['sentiment']) => {
    const colors = {
      positive: 'text-green-400',
      neutral: 'text-gray-400',
      negative: 'text-red-400'
    };
    return colors[sentiment];
  };

  const getPrivacyColor = (privacy: VoiceMemo['privacy']) => {
    const colors = {
      private: 'text-gray-400',
      shared: 'text-blue-400',
      public: 'text-green-400'
    };
    return colors[privacy];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setRecordingState('recording');
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const pauseRecording = () => {
    setRecordingState('paused');
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  const stopRecording = () => {
    setRecordingState('processing');
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    // Simulate processing
    setTimeout(() => {
      setRecordingState('idle');
      setRecordingTime(0);
    }, 3000);
  };

  const playAudio = (memoId: string) => {
    if (isPlaying === memoId) {
      setIsPlaying(null);
      audioRef.current?.pause();
    } else {
      setIsPlaying(memoId);
      // In a real implementation, you would load and play the audio
    }
  };

  const getMemoStats = useMemo(() => {
    const total = mockVoiceMemos.length;
    const totalDuration = mockVoiceMemos.reduce((acc, memo) => acc + memo.duration, 0);
    const avgDuration = total > 0 ? Math.round(totalDuration / total) : 0;
    const categoryBreakdown = categories.slice(1).map(cat => ({
      ...cat,
      count: mockVoiceMemos.filter(memo => memo.category === cat.id).length
    }));

    return {
      total,
      totalDuration,
      avgDuration,
      categoryBreakdown
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
            Voice Memos
          </h1>
          <p className="text-gray-400">
            Audio health documentation with AI transcription and insights
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900 p-1 rounded-lg">
          {[
            { id: 'memos', label: 'Voice Memos', icon: '🎙️' },
            { id: 'record', label: 'Record New', icon: '⏺️' },
            { id: 'analytics', label: 'Analytics', icon: '📊' },
            { id: 'insights', label: 'AI Insights', icon: '🧠' }
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

        {/* Memos Tab */}
        {activeTab === 'memos' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search memos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                  <div className="absolute right-3 top-2.5 text-gray-400">🔍</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {filteredMemos.length} of {mockVoiceMemos.length} memos
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                  {category.id !== 'all' && (
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                      {mockVoiceMemos.filter(m => m.category === category.id).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Memos List */}
            <div className="space-y-4">
              {filteredMemos.map((memo) => (
                <div
                  key={memo.id}
                  className="bg-gray-900 rounded-xl p-6 cursor-pointer hover:bg-gray-800 transition"
                  onClick={() => setSelectedMemo(memo)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{memo.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${getCategoryColor(memo.category)} text-white`}>
                          {memo.category}
                        </span>
                        <span className={`text-sm ${getSentimentColor(memo.sentiment)}`}>
                          {memo.sentiment}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{memo.description}</p>

                      {/* Audio Player */}
                      <div className="flex items-center space-x-4 mb-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playAudio(memo.id);
                          }}
                          className="flex items-center space-x-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm font-medium transition"
                        >
                          <span>{isPlaying === memo.id ? '⏸️' : '▶️'}</span>
                          <span>{formatDuration(memo.duration)}</span>
                        </button>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full w-0"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400 mb-2">
                        {new Date(memo.createdAt).toLocaleDateString()}
                      </div>
                      <div className={`text-xs ${getPrivacyColor(memo.privacy)}`}>
                        {memo.privacy}
                      </div>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-medium text-purple-400 mb-2">AI Summary</h4>
                    <p className="text-gray-300 text-sm">{memo.aiSummary}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {memo.tags.slice(0, 4).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {memo.tags.length > 4 && (
                        <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                          +{memo.tags.length - 4} more
                        </span>
                      )}
                    </div>
                    <button className="text-sm text-blue-400 hover:text-blue-300">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Record Tab */}
        {activeTab === 'record' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-purple-400 mb-4">🎙️ Record New Voice Memo</h2>

              {/* Recording Interface */}
              <div className="max-w-md mx-auto bg-gray-900 rounded-xl p-8">
                <div className="text-center mb-8">
                  <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 transition-all ${
                    recordingState === 'recording'
                      ? 'bg-red-500 animate-pulse'
                      : recordingState === 'paused'
                      ? 'bg-orange-500'
                      : recordingState === 'processing'
                      ? 'bg-blue-500'
                      : 'bg-gray-700'
                  }`}>
                    {recordingState === 'recording' ? '🎙️' :
                     recordingState === 'paused' ? '⏸️' :
                     recordingState === 'processing' ? '⚙️' : '⏺️'}
                  </div>

                  <div className="text-2xl font-mono text-white mb-2">
                    {formatDuration(recordingTime)}
                  </div>

                  <div className="text-sm text-gray-400 mb-6">
                    {recordingState === 'idle' && 'Tap to start recording'}
                    {recordingState === 'recording' && 'Recording... Tap to pause'}
                    {recordingState === 'paused' && 'Paused. Tap to resume'}
                    {recordingState === 'processing' && 'Processing your memo...'}
                  </div>
                </div>

                {/* Recording Controls */}
                <div className="flex justify-center space-x-4 mb-8">
                  {recordingState === 'idle' && (
                    <button
                      onClick={startRecording}
                      className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition"
                    >
                      Start Recording
                    </button>
                  )}

                  {recordingState === 'recording' && (
                    <>
                      <button
                        onClick={pauseRecording}
                        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition"
                      >
                        Pause
                      </button>
                      <button
                        onClick={stopRecording}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition"
                      >
                        Stop & Save
                      </button>
                    </>
                  )}

                  {recordingState === 'paused' && (
                    <>
                      <button
                        onClick={startRecording}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition"
                      >
                        Resume
                      </button>
                      <button
                        onClick={stopRecording}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition"
                      >
                        Stop & Save
                      </button>
                    </>
                  )}
                </div>

                {/* Recording Tips */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">💡 Recording Tips</h3>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li>• Find a quiet environment for best results</li>
                    <li>• Speak clearly and at a normal pace</li>
                    <li>• Include specific details about symptoms or experiences</li>
                    <li>• Mention dates, times, and severity levels</li>
                    <li>• Record immediately after appointments or important events</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-orange-400">📊 Voice Memo Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overview Stats */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Overview Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Total Memos</span>
                    <span className="text-white font-bold">{getMemoStats.total}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Total Duration</span>
                    <span className="text-white font-bold">{formatDuration(getMemoStats.totalDuration)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Average Length</span>
                    <span className="text-white font-bold">{formatDuration(getMemoStats.avgDuration)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                    <span className="text-gray-300">Recording Frequency</span>
                    <span className="text-white font-bold">4.2/week</span>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Category Distribution</h3>
                <div className="space-y-3">
                  {getMemoStats.categoryBreakdown.map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{category.icon}</span>
                        <span className="text-white">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${category.color} h-2 rounded-full`}
                            style={{ width: `${(category.count / getMemoStats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-gray-400 text-sm w-6">{category.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sentiment Analysis */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Sentiment Trends</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-400 font-medium">Positive</span>
                      <span className="text-green-400">25%</span>
                    </div>
                    <p className="text-sm text-gray-300">Appointment outcomes, treatment progress</p>
                  </div>
                  <div className="p-4 bg-gray-500/10 rounded-lg border border-gray-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 font-medium">Neutral</span>
                      <span className="text-gray-400">50%</span>
                    </div>
                    <p className="text-sm text-gray-300">Symptom reports, medication updates</p>
                  </div>
                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-red-400 font-medium">Negative</span>
                      <span className="text-red-400">25%</span>
                    </div>
                    <p className="text-sm text-gray-300">Anxiety, side effects, concerns</p>
                  </div>
                </div>
              </div>

              {/* Usage Patterns */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Usage Patterns</h3>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">🌅</div>
                    <div className="text-lg font-bold text-white">Morning</div>
                    <div className="text-sm text-gray-400">Most active time</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">🤒</div>
                    <div className="text-lg font-bold text-white">Symptoms</div>
                    <div className="text-sm text-gray-400">Most common topic</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">📅</div>
                    <div className="text-lg font-bold text-white">Daily</div>
                    <div className="text-sm text-gray-400">Recording frequency</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">⏱️</div>
                    <div className="text-lg font-bold text-white">45s</div>
                    <div className="text-sm text-gray-400">Avg duration</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-green-400">🧠 AI-Powered Insights</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pattern Recognition */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🔍 Health Patterns Detected</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <h4 className="font-medium text-blue-400 mb-2">Symptom Timing</h4>
                    <p className="text-sm text-gray-300">
                      Headaches most frequently reported in the morning (67% of cases).
                      May indicate sleep-related issues or morning blood pressure patterns.
                    </p>
                  </div>
                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <h4 className="font-medium text-purple-400 mb-2">Medication Adherence</h4>
                    <p className="text-sm text-gray-300">
                      Consistent medication timing mentioned in 89% of medication-related memos.
                      Positive correlation with symptom control.
                    </p>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <h4 className="font-medium text-green-400 mb-2">Emotional Trends</h4>
                    <p className="text-sm text-gray-300">
                      Anxiety levels peak before medical appointments and decrease post-appointment.
                      Suggests anticipatory anxiety pattern.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actionable Insights */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">💡 Actionable Recommendations</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <h4 className="font-medium text-orange-400 mb-2">Morning Routine Optimization</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Consider morning meditation or light exercise to reduce headache frequency.
                      73% reduction in morning headaches reported with routine changes.
                    </p>
                    <button className="w-full px-3 py-2 bg-orange-500 hover:bg-orange-600 rounded text-sm font-medium transition">
                      Create Reminder
                    </button>
                  </div>
                  <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                    <h4 className="font-medium text-cyan-400 mb-2">Appointment Preparation</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Prepare questions in advance to reduce pre-appointment anxiety.
                      Voice memos show 45% reduction in anxiety when questions prepared.
                    </p>
                    <button className="w-full px-3 py-2 bg-cyan-500 hover:bg-cyan-600 rounded text-sm font-medium transition">
                      Generate Questions
                    </button>
                  </div>
                  <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
                    <h4 className="font-medium text-pink-400 mb-2">Sleep Quality Focus</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Sleep mentioned in 78% of memos. Consider sleep tracking to identify patterns.
                      Better sleep correlates with reduced symptom severity.
                    </p>
                    <button className="w-full px-3 py-2 bg-pink-500 hover:bg-pink-600 rounded text-sm font-medium transition">
                      Start Sleep Tracking
                    </button>
                  </div>
                </div>
              </div>

              {/* Voice Analysis Summary */}
              <div className="bg-gray-900 rounded-xl p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">🎵 Voice Analysis Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-lg font-bold text-green-400">96%</div>
                    <div className="text-sm text-gray-400">Transcription Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">🧠</div>
                    <div className="text-lg font-bold text-blue-400">89%</div>
                    <div className="text-sm text-gray-400">Insight Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-lg font-bold text-purple-400">92%</div>
                    <div className="text-sm text-gray-400">Real-time Processing</div>
                  </div>
                  <div className="text-center p-4 bg-black/40 rounded-lg">
                    <div className="text-2xl mb-2">👥</div>
                    <div className="text-lg font-bold text-orange-400">87%</div>
                    <div className="text-sm text-gray-400">User Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Memo Detail Modal */}
        {selectedMemo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">{selectedMemo.title}</h2>
                  <button
                    onClick={() => setSelectedMemo(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded text-sm font-medium bg-gradient-to-r ${getCategoryColor(selectedMemo.category)} text-white`}>
                      {selectedMemo.category}
                    </span>
                    <span className={`text-sm ${getSentimentColor(selectedMemo.sentiment)}`}>
                      {selectedMemo.sentiment} sentiment
                    </span>
                    <span className={`text-sm ${getPrivacyColor(selectedMemo.privacy)}`}>
                      {selectedMemo.privacy}
                    </span>
                  </div>

                  {/* Audio Player */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <button
                        onClick={() => playAudio(selectedMemo.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-medium transition"
                      >
                        <span>{isPlaying === selectedMemo.id ? '⏸️' : '▶️'}</span>
                        <span>Play Audio</span>
                      </button>
                      <span className="text-gray-400">{formatDuration(selectedMemo.duration)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full w-0"></div>
                    </div>
                  </div>

                  {/* Transcript */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">📝 Full Transcript</h3>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <p className="text-gray-300 leading-relaxed">{selectedMemo.transcript}</p>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400 mb-3">🧠 AI Summary</h3>
                    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                      <p className="text-gray-300">{selectedMemo.aiSummary}</p>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div>
                    <h3 className="text-lg font-semibold text-green-400 mb-3">💡 AI Insights</h3>
                    <div className="space-y-3">
                      {selectedMemo.aiInsights.map((insight, idx) => (
                        <div key={idx} className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                          <p className="text-gray-300 text-sm">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">🏷️ Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMemo.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gray-700">
                    <span>Created: {new Date(selectedMemo.createdAt).toLocaleString()}</span>
                    <span>Last modified: {new Date(selectedMemo.lastModified).toLocaleString()}</span>
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