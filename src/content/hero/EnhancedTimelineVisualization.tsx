"use client";

import React from 'react';
import { format } from 'date-fns';

// Enhanced timeline event types
type TimelineEvent = {
  id: string;
  type: 'appointment' | 'document' | 'chat' | 'lab' | 'medication' | 'milestone';
  title: string;
  description?: string;
  date: string;
  category?: string;
  provider?: string;
  status?: 'completed' | 'upcoming' | 'cancelled';
  importance?: 'low' | 'medium' | 'high';
  outcome?: 'positive' | 'neutral' | 'concerning';
  tags?: string[];
};

// Sample enhanced timeline data
const timelineEvents: TimelineEvent[] = [
  {
    id: '1',
    type: 'milestone',
    title: 'Weight Loss Goal Achieved',
    description: 'Reached target weight of 160 lbs - down 8 lbs since January',
    date: '2024-06-15',
    status: 'completed',
    importance: 'high',
    outcome: 'positive',
    tags: ['weight-loss', 'goal-achieved']
  },
  {
    id: '2',
    type: 'lab',
    title: 'Comprehensive Metabolic Panel',
    description: 'HbA1c: 5.8% (excellent), Cholesterol: 180 mg/dL (improved)',
    date: '2024-06-10',
    provider: 'Dr. Sarah Chen, MD',
    status: 'completed',
    importance: 'high',
    outcome: 'positive',
    tags: ['diabetes', 'cholesterol', 'preventive-care']
  },
  {
    id: '3',
    type: 'appointment',
    title: 'Endocrinology Follow-up',
    description: 'Discussed medication adjustments and lifestyle changes',
    date: '2024-06-08',
    provider: 'Dr. Michael Torres, Endocrinologist',
    status: 'completed',
    importance: 'medium',
    outcome: 'positive',
    tags: ['diabetes', 'medication', 'follow-up']
  },
  {
    id: '4',
    type: 'chat',
    title: 'Discussed Hormone Therapy with Harmony',
    description: 'Explored bio-identical hormone options and safety considerations',
    date: '2024-06-05',
    status: 'completed',
    importance: 'medium',
    outcome: 'neutral',
    tags: ['hormones', 'menopause', 'consultation']
  },
  {
    id: '5',
    type: 'document',
    title: 'MRI Brain Scan Results',
    description: 'No significant findings - headache investigation complete',
    date: '2024-06-01',
    provider: 'Regional Imaging Center',
    status: 'completed',
    importance: 'high',
    outcome: 'positive',
    tags: ['imaging', 'headaches', 'neurological']
  },
  {
    id: '6',
    type: 'medication',
    title: 'Started Metformin 500mg',
    description: 'Beginning diabetes management with lifestyle support',
    date: '2024-05-25',
    provider: 'Dr. Sarah Chen, MD',
    status: 'completed',
    importance: 'high',
    outcome: 'positive',
    tags: ['diabetes', 'medication', 'treatment-start']
  },
  {
    id: '7',
    type: 'appointment',
    title: 'Annual Physical Exam',
    description: 'Comprehensive health assessment and preventive screening',
    date: '2024-05-15',
    provider: 'Dr. Sarah Chen, MD',
    status: 'completed',
    importance: 'high',
    outcome: 'neutral',
    tags: ['annual-exam', 'preventive-care', 'screening']
  }
];

const getEventIcon = (type: TimelineEvent['type']) => {
  const icons = {
    appointment: '🏥',
    document: '📋',
    chat: '💬',
    lab: '🧪',
    medication: '💊',
    milestone: '🎯'
  };
  return icons[type];
};

const getEventColor = (type: TimelineEvent['type'], outcome?: string) => {
  if (outcome === 'positive') return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
  if (outcome === 'concerning') return 'from-red-500/20 to-orange-500/20 border-red-500/30';
  
  const colors = {
    appointment: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    document: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    chat: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
    lab: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    medication: 'from-orange-500/20 to-yellow-500/20 border-orange-500/30',
    milestone: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30'
  };
  return colors[type];
};

const getImportanceStyle = (importance?: string) => {
  switch (importance) {
    case 'high': return 'ring-2 ring-pink-500/50';
    case 'medium': return 'ring-1 ring-blue-500/50';
    default: return '';
  }
};

export default function EnhancedTimelineVisualization() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = React.useState('6months');
  const [hoveredEvent, setHoveredEvent] = React.useState<string | null>(null);

  const filteredEvents = timelineEvents.filter(event => {
    if (selectedCategory === 'all') return true;
    return event.type === selectedCategory || event.tags?.includes(selectedCategory);
  });

  // Calculate health journey progress
  const totalEvents = filteredEvents.length;
  const positiveOutcomes = filteredEvents.filter(e => e.outcome === 'positive').length;
  const progressPercentage = Math.round((positiveOutcomes / totalEvents) * 100);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Health Journey Timeline
              </h1>
              <p className="text-gray-400">
                Your interactive health story with visual milestones and progress tracking
              </p>
            </div>
            
            {/* Health Progress Ring */}
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="#374151"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="url(#gradient)"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${(progressPercentage / 100) * 220} 220`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#ec4899'}} />
                    <stop offset="100%" style={{stopColor: '#8b5cf6'}} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{progressPercentage}%</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-black border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
          >
            <option value="all">All Events</option>
            <option value="appointment">Appointments</option>
            <option value="lab">Lab Results</option>
            <option value="document">Documents</option>
            <option value="chat">Chat Sessions</option>
            <option value="medication">Medications</option>
            <option value="milestone">Milestones</option>
          </select>
          
          <select 
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="bg-black border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Enhanced Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 to-purple-500"></div>
          
          {/* Timeline Events */}
          <div className="space-y-8">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className={`relative flex items-start transition-all duration-300 ${
                  hoveredEvent === event.id ? 'scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredEvent(event.id)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                {/* Timeline Node */}
                <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${getEventColor(event.type, event.outcome)} border-2 ${getImportanceStyle(event.importance)}`}>
                  <span className="text-2xl">{getEventIcon(event.type)}</span>
                  
                  {/* Importance Indicator */}
                  {event.importance === 'high' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-xs">!</span>
                    </div>
                  )}
                </div>

                {/* Event Content */}
                <div className={`ml-6 flex-1 bg-gradient-to-br ${getEventColor(event.type, event.outcome)} rounded-xl p-6 border transition-all duration-300 ${hoveredEvent === event.id ? 'shadow-2xl shadow-pink-500/20' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {format(new Date(event.date), 'MMMM dd, yyyy')}
                        {event.provider && ` • ${event.provider}`}
                      </p>
                    </div>
                    
                    {/* Outcome Indicator */}
                    {event.outcome && (
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.outcome === 'positive' ? 'bg-green-500/20 text-green-300' :
                        event.outcome === 'concerning' ? 'bg-red-500/20 text-red-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {event.outcome}
                      </div>
                    )}
                  </div>
                  
                  {event.description && (
                    <p className="text-gray-200 mb-4 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                  
                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-black/30 text-gray-300 text-xs rounded-full border border-gray-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Interactive Actions */}
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <button className="text-pink-400 hover:text-pink-300 transition">
                      View Details
                    </button>
                    {event.type === 'document' && (
                      <button className="text-blue-400 hover:text-blue-300 transition">
                        Download
                      </button>
                    )}
                    {event.type === 'chat' && (
                      <button className="text-purple-400 hover:text-purple-300 transition">
                        Continue Chat
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Journey Statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl p-6 border border-pink-500/20">
            <h4 className="font-semibold text-white mb-2">Journey Progress</h4>
            <div className="text-2xl font-bold text-pink-400 mb-1">{progressPercentage}%</div>
            <p className="text-sm text-gray-300">Positive health outcomes</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
            <h4 className="font-semibold text-white mb-2">Total Events</h4>
            <div className="text-2xl font-bold text-blue-400 mb-1">{filteredEvents.length}</div>
            <p className="text-sm text-gray-300">Health activities tracked</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
            <h4 className="font-semibold text-white mb-2">This Month</h4>
            <div className="text-2xl font-bold text-green-400 mb-1">
              {filteredEvents.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).length}
            </div>
            <p className="text-sm text-gray-300">Recent activities</p>
          </div>
        </div>
      </div>
    </div>
  );
}