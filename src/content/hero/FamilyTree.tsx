"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { FiEdit3, FiPlus, FiX, FiZoomIn, FiZoomOut, FiShare2, FiDownload, FiUsers, FiZap, FiHeart, FiActivity, FiTrendingUp, FiCamera, FiMic, FiFileText, FiTarget, FiCalendar, FiMapPin } from 'react-icons/fi';

// Enhanced Family Tree Types
type FamilyMember = {
  id: string;
  name: string;
  relationship: 'self' | 'parent' | 'child' | 'sibling' | 'grandparent' | 'spouse' | 'aunt' | 'uncle' | 'cousin' | 'other';
  birthYear?: number;
  deathYear?: number;
  healthNotes?: string;
  photo?: string;
  avatar?: string;
  position: { x: number; y: number };
  generation: number;
  isExpanded: boolean;
  isVisible: boolean;
  children: string[];
  parents: string[];
  spouse?: string;
  healthInsights?: {
    geneticRisks: string[];
    preventiveCare: string[];
    familyPatterns: string[];
    aiConfidence: number;
  };
  medicalHistory?: MedicalEvent[];
  voiceNotes?: VoiceNote[];
  attachments?: Attachment[];
  lastUpdated?: Date;
  addedBy?: string;
};

type MedicalEvent = {
  id: string;
  type: 'diagnosis' | 'treatment' | 'screening' | 'surgery' | 'medication' | 'lifestyle';
  title: string;
  description: string;
  date: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ongoing: boolean;
};

type VoiceNote = {
  id: string;
  title: string;
  duration: number;
  transcript: string;
  recordedAt: Date;
  tags: string[];
};

type Attachment = {
  id: string;
  name: string;
  type: 'photo' | 'document' | 'scan' | 'report';
  url: string;
  uploadedAt: Date;
  size: number;
};

type TreeView = 'tree' | 'timeline' | 'health-map' | 'generations';
type AddMemberFlow = {
  step: 'relationship' | 'details' | 'health' | 'confirm';
  relationship?: FamilyMember['relationship'];
  tempMember?: Partial<FamilyMember>;
};

// Enhanced relationship configurations
const RELATIONSHIP_CONFIG = {
  self: {
    name: 'You',
    icon: '👤',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-500/10 to-purple-500/10',
    borderColor: 'border-purple-500/30',
    description: 'Your health journey'
  },
  parent: {
    name: 'Parent',
    icon: '👨‍👩‍👧‍👦',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-500/10 to-blue-500/10',
    borderColor: 'border-blue-500/30',
    description: 'Foundation of your health story'
  },
  child: {
    name: 'Child',
    icon: '👶',
    color: 'from-green-500 to-green-600',
    bgColor: 'from-green-500/10 to-green-500/10',
    borderColor: 'border-green-500/30',
    description: 'Future generations'
  },
  sibling: {
    name: 'Sibling',
    icon: '👫',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'from-orange-500/10 to-orange-500/10',
    borderColor: 'border-orange-500/30',
    description: 'Shared family history'
  },
  grandparent: {
    name: 'Grandparent',
    icon: '👴',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'from-indigo-500/10 to-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    description: 'Roots of your family tree'
  },
  spouse: {
    name: 'Spouse',
    icon: '💕',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'from-pink-500/10 to-pink-500/10',
    borderColor: 'border-pink-500/30',
    description: 'Life partner'
  },
  aunt: {
    name: 'Aunt',
    icon: '👩',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'from-teal-500/10 to-teal-500/10',
    borderColor: 'border-teal-500/30',
    description: 'Extended family connections'
  },
  uncle: {
    name: 'Uncle',
    icon: '👨',
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'from-cyan-500/10 to-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    description: 'Extended family connections'
  },
  cousin: {
    name: 'Cousin',
    icon: '👥',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'from-emerald-500/10 to-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    description: 'Family branches'
  },
  other: {
    name: 'Other',
    icon: '🌟',
    color: 'from-gray-500 to-gray-600',
    bgColor: 'from-gray-500/10 to-gray-500/10',
    borderColor: 'border-gray-500/30',
    description: 'Special family connections'
  }
};

// Enhanced mock data with richer health insights
const mockFamilyMembers: FamilyMember[] = [
  {
    id: 'self',
    name: 'Alex Rivera',
    relationship: 'self',
    birthYear: 1990,
    position: { x: 400, y: 300 },
    generation: 0,
    isExpanded: true,
    isVisible: true,
    children: [],
    parents: ['father', 'mother'],
    healthNotes: 'Focus on preventive care and regular check-ups. Recent focus on mental wellness and stress management.',
    avatar: 'AR',
    lastUpdated: new Date(),
    medicalHistory: [
      {
        id: 'mh1',
        type: 'screening',
        title: 'Annual Physical',
        description: 'Comprehensive health screening - all normal',
        date: new Date('2024-03-15'),
        severity: 'low',
        ongoing: false
      },
      {
        id: 'mh2',
        type: 'treatment',
        title: 'Therapy Sessions',
        description: 'Cognitive behavioral therapy for anxiety management',
        date: new Date('2023-09-01'),
        severity: 'medium',
        ongoing: true
      }
    ],
    healthInsights: {
      geneticRisks: ['Family history of heart disease', 'Increased risk for certain cancers', 'Potential anxiety predisposition'],
      preventiveCare: ['Annual cardiovascular screening', 'Regular cancer screenings', 'Mental health check-ups', 'Genetic counseling'],
      familyPatterns: ['Longevity in maternal line', 'Autoimmune conditions in paternal line', 'Mental health awareness across generations'],
      aiConfidence: 87
    }
  },
  {
    id: 'father',
    name: 'Marcus Rivera',
    relationship: 'parent',
    birthYear: 1960,
    position: { x: 300, y: 150 },
    generation: -1,
    isExpanded: false,
    isVisible: true,
    children: ['self', 'sibling1'],
    parents: ['grandfather-pat', 'grandmother-pat'],
    avatar: 'MR',
    healthNotes: 'Heart disease diagnosed at age 55, successfully managed with medication and lifestyle changes.',
    medicalHistory: [
      {
        id: 'fh1',
        type: 'diagnosis',
        title: 'Coronary Artery Disease',
        description: 'Diagnosed via stress test and cardiac catheterization',
        date: new Date('2015-06-20'),
        severity: 'high',
        ongoing: true
      },
      {
        id: 'fh2',
        type: 'treatment',
        title: 'Cardiac Rehabilitation',
        description: 'Completed 12-week program with excellent results',
        date: new Date('2015-08-01'),
        severity: 'medium',
        ongoing: false
      }
    ],
    healthInsights: {
      geneticRisks: ['Cardiovascular disease', 'Type 2 diabetes', 'Hypertension'],
      preventiveCare: ['Regular cardiology visits', 'Blood pressure monitoring', 'Cholesterol management', 'Diabetes screening'],
      familyPatterns: ['Early onset heart disease', 'Diabetes in multiple generations', 'Strong paternal heart disease history'],
      aiConfidence: 92
    }
  },
  {
    id: 'mother',
    name: 'Elena Rivera',
    relationship: 'parent',
    birthYear: 1965,
    position: { x: 500, y: 150 },
    generation: -1,
    isExpanded: false,
    isVisible: true,
    children: ['self', 'sibling1'],
    parents: ['grandfather-mat', 'grandmother-mat'],
    avatar: 'ER',
    healthNotes: 'Breast cancer survivor, excellent health overall. Strong advocate for preventive care.',
    medicalHistory: [
      {
        id: 'mh1',
        type: 'diagnosis',
        title: 'Breast Cancer',
        description: 'Stage I invasive ductal carcinoma',
        date: new Date('2018-11-15'),
        severity: 'high',
        ongoing: false
      },
      {
        id: 'mh2',
        type: 'treatment',
        title: 'Breast Cancer Treatment',
        description: 'Lumpectomy followed by radiation and hormone therapy',
        date: new Date('2019-01-10'),
        severity: 'high',
        ongoing: false
      }
    ],
    healthInsights: {
      geneticRisks: ['Breast cancer', 'Osteoporosis', 'Thyroid conditions'],
      preventiveCare: ['Annual mammograms', 'Bone density scans', 'Regular wellness visits', 'Genetic testing'],
      familyPatterns: ['Strong maternal health', 'Longevity patterns', 'Cancer survivorship'],
      aiConfidence: 89
    }
  },
  {
    id: 'sibling1',
    name: 'Sophia Rivera',
    relationship: 'sibling',
    birthYear: 1992,
    position: { x: 600, y: 300 },
    generation: 0,
    isExpanded: false,
    isVisible: true,
    children: ['niece1'],
    parents: ['father', 'mother'],
    avatar: 'SR',
    healthNotes: 'Healthy lifestyle, focuses on fitness and nutrition. Recently completed marathon training.',
    medicalHistory: [
      {
        id: 'sh1',
        type: 'lifestyle',
        title: 'Marathon Training',
        description: 'Completed first full marathon - Boston 2024',
        date: new Date('2024-04-15'),
        severity: 'low',
        ongoing: false
      }
    ],
    healthInsights: {
      geneticRisks: ['Lower risk profile', 'Family cancer history', 'Potential athletic performance genetics'],
      preventiveCare: ['Regular health screenings', 'Fitness tracking', 'Nutrition monitoring'],
      familyPatterns: ['Healthy lifestyle choices', 'Preventive care focus', 'Athletic family tendencies'],
      aiConfidence: 78
    }
  }
];

export default function InteractiveFamilyTree() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(mockFamilyMembers);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [currentView, setCurrentView] = useState<TreeView>('tree');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [addMemberFlow, setAddMemberFlow] = useState<AddMemberFlow>({ step: 'relationship' });
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 800, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCollaborateModal, setShowCollaborateModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // Voice recording simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Calculate family health statistics
  const getFamilyStats = () => {
    const totalMembers = familyMembers.length;
    const healthConditions = familyMembers.reduce((acc, member) => {
      return acc + (member.medicalHistory?.length || 0);
    }, 0);
    const avgLifespan = familyMembers
      .filter(m => m.birthYear && m.deathYear)
      .reduce((acc, m) => acc + (m.deathYear! - m.birthYear!), 0) /
      familyMembers.filter(m => m.birthYear && m.deathYear).length || 82;

    return { totalMembers, healthConditions, avgLifespan };
  };

  const handleMemberClick = useCallback((member: FamilyMember) => {
    setSelectedMember(member);
  }, []);

  const handleExpandCollapse = useCallback((memberId: string) => {
    setFamilyMembers(prev => prev.map(member =>
      member.id === memberId
        ? { ...member, isExpanded: !member.isExpanded }
        : member
    ));
  }, []);

  const handleAddMember = useCallback(() => {
    setIsAddingMember(true);
    setAddMemberFlow({ step: 'relationship' });
  }, []);

  const handleRelationshipSelect = useCallback((relationship: FamilyMember['relationship']) => {
    setAddMemberFlow({
      step: 'details',
      relationship,
      tempMember: {
        id: `temp-${Date.now()}`,
        name: '',
        relationship,
        position: { x: 400, y: 300 },
        generation: 0,
        isExpanded: false,
        isVisible: true,
        children: [],
        parents: []
      }
    });
  }, []);

  const handleMemberSubmit = useCallback(() => {
    if (addMemberFlow.tempMember) {
      const newMember: FamilyMember = {
        ...addMemberFlow.tempMember,
        id: `member-${Date.now()}`,
        position: {
          x: Math.random() * 400 + 200,
          y: Math.random() * 300 + 150
        },
        lastUpdated: new Date(),
        addedBy: 'You'
      } as FamilyMember;

      setFamilyMembers(prev => [...prev, newMember]);
      setIsAddingMember(false);
      setAddMemberFlow({ step: 'relationship' });
    }
  }, [addMemberFlow]);

  const renderTreeConnections = () => {
    const connections: JSX.Element[] = [];

    familyMembers.forEach(member => {
      // Parent-child connections
      member.children.forEach(childId => {
        const child = familyMembers.find(m => m.id === childId);
        if (child && child.isVisible) {
          connections.push(
            <motion.line
              key={`${member.id}-${child.id}`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              x1={member.position.x}
              y1={member.position.y + 40}
              x2={child.position.x}
              y2={child.position.y - 40}
              stroke="#6366f1"
              strokeWidth="3"
              className="drop-shadow-sm"
            />
          );
        }
      });

      // Spouse connections
      if (member.spouse) {
        const spouse = familyMembers.find(m => m.id === member.spouse);
        if (spouse && spouse.isVisible) {
          connections.push(
            <motion.line
              key={`${member.id}-spouse-${spouse.id}`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              x1={member.position.x + 40}
              y1={member.position.y}
              x2={spouse.position.x - 40}
              y2={spouse.position.y}
              stroke="#ec4899"
              strokeWidth="4"
              className="drop-shadow-sm"
            />
          );
        }
      }
    });

    return connections;
  };

  const stats = getFamilyStats();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with enhanced design */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm border-b border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent mb-2">
                Interactive Family Tree
              </h1>
              <p className="text-gray-400 text-lg">
                Your family's health story, beautifully visualized
              </p>
            </div>

            {/* AI Assistant Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAIPanel(!showAIPanel)}
              className={`p-3 rounded-full transition-all ${
                showAIPanel
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <FiZap className={`w-6 h-6 ${showAIPanel ? 'text-white' : 'text-purple-400'}`} />
            </motion.button>
          </div>

          {/* Family Statistics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/10 rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <FiUsers className="w-5 h-5 text-purple-400" />
                <span className="text-2xl font-bold text-purple-400">{stats.totalMembers}</span>
              </div>
              <div className="text-sm text-gray-400">Family Members</div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/10 rounded-xl p-4 border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <FiActivity className="w-5 h-5 text-blue-400" />
                <span className="text-2xl font-bold text-blue-400">{stats.healthConditions}</span>
              </div>
              <div className="text-sm text-gray-400">Health Events</div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-500/10 rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <FiTrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-2xl font-bold text-green-400">{Math.round(stats.avgLifespan)}</span>
              </div>
              <div className="text-sm text-gray-400">Avg Lifespan</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/10 rounded-xl p-4 border border-orange-500/20">
              <div className="flex items-center justify-between mb-2">
                <FiHeart className="w-5 h-5 text-orange-400" />
                <span className="text-2xl font-bold text-orange-400">87%</span>
              </div>
              <div className="text-sm text-gray-400">Health Insights</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {showAIPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-purple-500/20"
          >
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <FiZap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-400">Harmony AI Assistant</h3>
                    <p className="text-sm text-gray-400">Intelligent insights about your family's health patterns</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIPanel(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-medium text-green-400 mb-2">🧬 Genetic Patterns</h4>
                  <p className="text-sm text-gray-300">Strong cardiovascular risk pattern detected in paternal line. Consider early screening.</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-400 mb-2">🎯 Prevention Priority</h4>
                  <p className="text-sm text-gray-300">Based on family history, prioritize annual cancer screenings starting at age 40.</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-medium text-orange-400 mb-2">📊 Missing Data</h4>
                  <p className="text-sm text-gray-300">Add maternal grandparents to improve risk assessment accuracy by 23%.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-6">
        {/* View Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-900 rounded-xl p-1 border border-gray-700">
              {[
                { id: 'tree', label: 'Family Tree', icon: '🌳' },
                { id: 'timeline', label: 'Health Timeline', icon: '📅' },
                { id: 'health-map', label: 'Health Map', icon: '🗺️' },
                { id: 'generations', label: 'Generations', icon: '👪' }
              ].map((view) => (
                <motion.button
                  key={view.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView(view.id as TreeView)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    currentView === view.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span>{view.icon}</span>
                  <span>{view.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gray-900 rounded-xl p-2 border border-gray-700">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FiZoomOut className="w-4 h-4 text-gray-400" />
              </motion.button>
              <span className="text-sm text-gray-300 min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FiZoomIn className="w-4 h-4 text-gray-400" />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddMember}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Member</span>
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tree Canvas */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800"
            >
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {currentView === 'tree' && 'Family Tree Visualization'}
                  {currentView === 'timeline' && 'Health Timeline'}
                  {currentView === 'health-map' && 'Health Risk Map'}
                  {currentView === 'generations' && 'Generational View'}
                </h2>
              </div>

              <div className="relative h-[600px] overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                <svg
                  ref={svgRef}
                  viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
                  className="w-full h-full cursor-move"
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                >
                  {/* Animated background */}
                  <defs>
                    <radialGradient id="bg-gradient" cx="50%" cy="50%">
                      <stop offset="0%" stopColor="#1f2937" stopOpacity="1" />
                      <stop offset="100%" stopColor="#111827" stopOpacity="1" />
                    </radialGradient>
                    <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#bg-gradient)" />
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />

                  {/* Animated connections */}
                  {renderTreeConnections()}

                  {/* Family Members */}
                  {familyMembers.filter(m => m.isVisible).map((member, idx) => (
                    <motion.g
                      key={member.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className="cursor-pointer"
                    >
                      {/* Enhanced member node */}
                      <motion.circle
                        cx={member.position.x}
                        cy={member.position.y}
                        r="45"
                        className={`transition-all duration-300 hover:scale-110 ${
                          selectedMember?.id === member.id ? 'drop-shadow-2xl' : ''
                        }`}
                        style={{
                          fill: `url(#gradient-${member.relationship})`,
                          filter: selectedMember?.id === member.id
                            ? 'drop-shadow(0 8px 16px rgba(168, 85, 247, 0.4))'
                            : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                        }}
                        onClick={() => handleMemberClick(member)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      />

                      {/* Gradient definitions */}
                      <defs>
                        <radialGradient id={`gradient-${member.relationship}`} cx="40%" cy="30%">
                          <stop offset="0%" stopColor={RELATIONSHIP_CONFIG[member.relationship].color.split(' ')[0].replace('from-', '')} stopOpacity="1" />
                          <stop offset="70%" stopColor={RELATIONSHIP_CONFIG[member.relationship].color.split(' ')[1].replace('to-', '')} stopOpacity="0.9" />
                          <stop offset="100%" stopColor={RELATIONSHIP_CONFIG[member.relationship].color.split(' ')[1].replace('to-', '')} stopOpacity="0.7" />
                        </radialGradient>
                      </defs>

                      {/* Avatar or Icon */}
                      {member.avatar ? (
                        <text
                          x={member.position.x}
                          y={member.position.y + 8}
                          textAnchor="middle"
                          className="text-lg font-bold fill-white pointer-events-none select-none"
                        >
                          {member.avatar}
                        </text>
                      ) : (
                        <text
                          x={member.position.x}
                          y={member.position.y + 5}
                          textAnchor="middle"
                          className="text-3xl pointer-events-none select-none"
                        >
                          {RELATIONSHIP_CONFIG[member.relationship].icon}
                        </text>
                      )}

                      {/* Member Name */}
                      <text
                        x={member.position.x}
                        y={member.position.y + 70}
                        textAnchor="middle"
                        className="text-sm font-semibold fill-gray-200 pointer-events-none select-none"
                      >
                        {member.name.split(' ')[0]}
                      </text>

                      {/* Health indicator */}
                      {member.medicalHistory && member.medicalHistory.length > 0 && (
                        <motion.circle
                          cx={member.position.x + 30}
                          cy={member.position.y - 30}
                          r="8"
                          fill="#ef4444"
                          className="animate-pulse"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.1 + 0.3 }}
                        />
                      )}

                      {/* Expand/Collapse Button */}
                      {(member.children.length > 0 || member.parents.length > 0) && (
                        <motion.circle
                          cx={member.position.x + 35}
                          cy={member.position.y - 35}
                          r="14"
                          fill="white"
                          stroke="#6366f1"
                          strokeWidth="3"
                          className="cursor-pointer hover:fill-blue-50 transition-all duration-300"
                          onClick={() => handleExpandCollapse(member.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        />
                      )}

                      {(member.children.length > 0 || member.parents.length > 0) && (
                        <text
                          x={member.position.x + 35}
                          y={member.position.y - 30}
                          textAnchor="middle"
                          className="text-sm font-bold fill-blue-600 pointer-events-none select-none cursor-pointer"
                          onClick={() => handleExpandCollapse(member.id)}
                        >
                          {member.isExpanded ? '−' : '+'}
                        </text>
                      )}
                    </motion.g>
                  ))}
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Member Details Panel */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedMember ? (
                <motion.div
                  key={selectedMember.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-800"
                >
                  {/* Member Header */}
                  <div className="text-center mb-6">
                    <motion.div
                      className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-r ${RELATIONSHIP_CONFIG[selectedMember.relationship].color} flex items-center justify-center text-4xl mb-4 shadow-lg`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {selectedMember.avatar || RELATIONSHIP_CONFIG[selectedMember.relationship].icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-1">{selectedMember.name}</h3>
                    <p className="text-gray-300 capitalize mb-2">{selectedMember.relationship}</p>
                    {selectedMember.birthYear && (
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                        <FiCalendar className="w-4 h-4" />
                        <span>
                          {selectedMember.birthYear}
                          {selectedMember.deathYear && ` - ${selectedMember.deathYear}`}
                          {!selectedMember.deathYear && ` (${new Date().getFullYear() - selectedMember.birthYear} years old)`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Health Insights */}
                  {selectedMember.healthInsights && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4 mb-6"
                    >
                      <div className="bg-gradient-to-r from-purple-500/10 to-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                        <h4 className="font-semibold text-purple-400 mb-3 flex items-center">
                          <FiZap className="w-4 h-4 mr-2" />
                          AI Health Insights
                        </h4>
                        <div className="text-sm text-purple-300 mb-2">
                          Confidence: {selectedMember.healthInsights.aiConfidence}%
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-red-400 mb-2 flex items-center">
                          <FiTarget className="w-4 h-4 mr-2" />
                          Genetic Risks
                        </h4>
                        <div className="space-y-2">
                          {selectedMember.healthInsights.geneticRisks.map((risk, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="text-sm text-gray-300 bg-red-900/20 rounded-lg p-3 border border-red-500/20"
                            >
                              {risk}
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2 flex items-center">
                          <FiHeart className="w-4 h-4 mr-2" />
                          Preventive Care
                        </h4>
                        <div className="space-y-2">
                          {selectedMember.healthInsights.preventiveCare.map((care, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 + 0.2 }}
                              className="text-sm text-gray-300 bg-blue-900/20 rounded-lg p-3 border border-blue-500/20"
                            >
                              {care}
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-green-400 mb-2 flex items-center">
                          <FiTrendingUp className="w-4 h-4 mr-2" />
                          Family Patterns
                        </h4>
                        <div className="space-y-2">
                          {selectedMember.healthInsights.familyPatterns.map((pattern, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 + 0.4 }}
                              className="text-sm text-gray-300 bg-green-900/20 rounded-lg p-3 border border-green-500/20"
                            >
                              {pattern}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Medical History */}
                  {selectedMember.medicalHistory && selectedMember.medicalHistory.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mb-6"
                    >
                      <h4 className="font-semibold text-orange-400 mb-3 flex items-center">
                        <FiActivity className="w-4 h-4 mr-2" />
                        Medical History
                      </h4>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {selectedMember.medicalHistory.map((event, idx) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`text-sm rounded-lg p-3 border ${
                              event.severity === 'high' ? 'bg-red-900/20 border-red-500/20 text-red-300' :
                              event.severity === 'medium' ? 'bg-orange-900/20 border-orange-500/20 text-orange-300' :
                              'bg-blue-900/20 border-blue-500/20 text-blue-300'
                            }`}
                          >
                            <div className="font-medium mb-1">{event.title}</div>
                            <div className="text-xs opacity-80 mb-2">{event.description}</div>
                            <div className="flex items-center justify-between text-xs">
                              <span>{event.date.toLocaleDateString()}</span>
                              <span className={`px-2 py-1 rounded-full ${
                                event.ongoing ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                              }`}>
                                {event.ongoing ? 'Ongoing' : 'Resolved'}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <FiEdit3 className="w-4 h-4" />
                      <span>Edit Details</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsRecording(!isRecording)}
                      className={`w-full px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
                        isRecording
                          ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <FiMic className="w-4 h-4" />
                      <span>{isRecording ? `Recording... ${recordingTime}s` : 'Add Voice Note'}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowShareModal(true)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <FiShare2 className="w-4 h-4" />
                      <span>Share Insights</span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-gray-900 rounded-2xl shadow-2xl p-8 text-center border border-gray-800"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="text-7xl mb-4"
                  >
                    👆
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2">Select a Family Member</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Click on anyone in your family tree to explore their health journey, genetic insights, and medical history.
                  </p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-4 text-xs text-gray-500"
                  >
                    💡 Pro tip: Use the AI assistant to get personalized health recommendations
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Enhanced Add Member Modal */}
      <AnimatePresence>
        {isAddingMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl max-w-2xl w-full border border-gray-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Add Family Member</h2>
                  <button
                    onClick={() => setIsAddingMember(false)}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                {addMemberFlow.step === 'relationship' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <p className="text-gray-300 mb-6 text-lg">
                      Who would you like to add to your family tree? Choose their relationship to help us provide better health insights.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(RELATIONSHIP_CONFIG).map(([relationship, config]) => (
                        <motion.button
                          key={relationship}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRelationshipSelect(relationship as FamilyMember['relationship'])}
                          className={`p-4 bg-gradient-to-br ${config.bgColor} border-2 ${config.borderColor} rounded-xl hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 text-white group`}
                        >
                          <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{config.icon}</div>
                          <div className="text-sm font-medium capitalize mb-1">{config.name}</div>
                          <div className="text-xs text-gray-400">{config.description}</div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {addMemberFlow.step === 'details' && addMemberFlow.tempMember && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <p className="text-gray-300 mb-6">
                      Tell us about {addMemberFlow.tempMember.name || 'them'}. Even partial information helps build your family's health story.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">
                            Their Full Name
                          </label>
                          <input
                            type="text"
                            placeholder="Enter their name"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none text-white placeholder-gray-400 transition-colors"
                            value={addMemberFlow.tempMember.name || ''}
                            onChange={(e) => setAddMemberFlow(prev => ({
                              ...prev,
                              tempMember: { ...prev.tempMember!, name: e.target.value }
                            }))}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">
                            Birth Year (optional)
                          </label>
                          <input
                            type="number"
                            placeholder="e.g., 1985"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none text-white placeholder-gray-400 transition-colors"
                            value={addMemberFlow.tempMember.birthYear || ''}
                            onChange={(e) => setAddMemberFlow(prev => ({
                              ...prev,
                              tempMember: { ...prev.tempMember!, birthYear: parseInt(e.target.value) || undefined }
                            }))}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">
                            Health Notes (optional)
                          </label>
                          <textarea
                            placeholder="Share what you know about their health journey..."
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none resize-none text-white placeholder-gray-400 transition-colors"
                            rows={4}
                            value={addMemberFlow.tempMember.healthNotes || ''}
                            onChange={(e) => setAddMemberFlow(prev => ({
                              ...prev,
                              tempMember: { ...prev.tempMember!, healthNotes: e.target.value }
                            }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                          <h4 className="font-medium text-purple-400 mb-2 flex items-center">
                            <FiZap className="w-4 h-4 mr-2" />
                            AI Assistance
                          </h4>
                          <p className="text-sm text-purple-300">
                            As you add details, our AI will automatically generate health insights and risk assessments based on your family's patterns.
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
                          <h4 className="font-medium text-blue-400 mb-2 flex items-center">
                            <FiCamera className="w-4 h-4 mr-2" />
                            Coming Soon
                          </h4>
                          <p className="text-sm text-blue-300">
                            Upload photos, add voice notes, and attach medical documents to create a rich health timeline.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-8">
                      <button
                        onClick={() => setAddMemberFlow({ step: 'relationship' })}
                        className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      >
                        Back
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleMemberSubmit}
                        disabled={!addMemberFlow.tempMember.name?.trim()}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg flex items-center justify-center space-x-2"
                      >
                        <FiPlus className="w-4 h-4" />
                        <span>Add to Family Tree</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-semibold mb-4 text-pink-400">Share Family Insights</h3>
              <p className="text-gray-400 mb-6">
                Securely share health insights with family members or healthcare providers.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="family@member.com"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="font-medium text-blue-400 mb-2">🔒 Privacy Features</h4>
                  <ul className="text-sm text-blue-300 space-y-1">
                    <li>• HIPAA compliant sharing</li>
                    <li>• Granular permission controls</li>
                    <li>• Encrypted communication</li>
                    <li>• Automatic access expiration</li>
                  </ul>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg text-sm font-medium disabled:opacity-50 transition"
                >
                  Send Secure Link
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}