"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { format, addDays } from 'date-fns';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { FiEdit3, FiCheck, FiX, FiPlus, FiUpload, FiDownload, FiShare2, FiZap, FiTarget, FiClock, FiUsers, FiMic, FiImage, FiFileText, FiList, FiCheckSquare } from 'react-icons/fi';

// Enhanced types for the interactive provider packet
type PacketTemplate = 'comprehensive' | 'focused' | 'followup' | 'urgent' | 'preventive' | 'specialist';
type PacketStatus = 'draft' | 'ready' | 'shared' | 'archived' | 'collaborating';
type ComplianceLevel = 'hipaa' | 'standard' | 'minimal';
type SectionType = 'text' | 'list' | 'form' | 'upload' | 'checklist' | 'voice' | 'gallery' | 'timeline';

interface ProviderPacket {
  id: string;
  template: PacketTemplate;
  status: PacketStatus;
  complianceLevel: ComplianceLevel;
  createdAt: Date;
  updatedAt: Date;
  sharedWith: string[];
  collaborators: Collaborator[];
  sections: PacketSection[];
  metadata: {
    visitType: string;
    urgency: 'routine' | 'urgent' | 'asap';
    estimatedDuration: number;
    preparationTime: number;
    aiConfidence: number;
    lastCollaboratorActivity?: Date;
  };
}

interface Collaborator {
  id: string;
  name: string;
  role: 'patient' | 'caregiver' | 'provider';
  avatar?: string;
  lastActive: Date;
  permissions: string[];
}

interface PacketSection {
  id: string;
  title: string;
  type: SectionType;
  required: boolean;
  completed: boolean;
  data: any;
  aiSuggestions?: string[];
  aiGenerated?: boolean;
  lastEdited?: Date;
  editor?: string;
  attachments?: Attachment[];
  voiceNotes?: VoiceNote[];
}

interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document';
  url: string;
  uploadedAt: Date;
  size: number;
}

interface VoiceNote {
  id: string;
  duration: number;
  transcript: string;
  recordedAt: Date;
}

// Beautiful template configurations with rich metadata
const PACKET_TEMPLATES = {
  comprehensive: {
    name: 'Comprehensive Visit',
    description: 'Full health assessment with detailed preparation',
    icon: '🏥',
    color: 'from-blue-500 to-purple-600',
    bgColor: 'from-blue-500/10 to-purple-500/10',
    borderColor: 'border-blue-500/30',
    sections: [
      'Chief Concern & Symptoms',
      'Medical History Timeline',
      'Current Medications & Supplements',
      'Recent Labs & Vital Signs',
      'Lifestyle & Wellness Factors',
      'Goals & Expectations',
      'Preparation Checklist',
      'Questions for Provider'
    ],
    estimatedTime: 45,
    aiFeatures: ['Symptom analysis', 'Medication interactions', 'Risk assessment']
  },
  focused: {
    name: 'Focused Consultation',
    description: 'Targeted visit for specific health concern',
    icon: '🎯',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'from-green-500/10 to-emerald-500/10',
    borderColor: 'border-green-500/30',
    sections: [
      'Primary Concern Details',
      'Relevant Medical History',
      'Current Status & Progress',
      'Supporting Documentation',
      'Questions for Provider',
      'Preparation Checklist'
    ],
    estimatedTime: 25,
    aiFeatures: ['Concern prioritization', 'Documentation analysis']
  },
  followup: {
    name: 'Follow-up Visit',
    description: 'Post-treatment or routine follow-up',
    icon: '📈',
    color: 'from-orange-500 to-red-600',
    bgColor: 'from-orange-500/10 to-red-500/10',
    borderColor: 'border-orange-500/30',
    sections: [
      'Progress Update',
      'Current Symptoms Assessment',
      'Medication Changes & Side Effects',
      'Treatment Response',
      'Questions & Concerns',
      'Preparation Checklist'
    ],
    estimatedTime: 20,
    aiFeatures: ['Progress tracking', 'Side effect analysis']
  },
  urgent: {
    name: 'Urgent Care',
    description: 'Immediate attention needed',
    icon: '🚨',
    color: 'from-red-500 to-pink-600',
    bgColor: 'from-red-500/10 to-pink-500/10',
    borderColor: 'border-red-500/30',
    sections: [
      'Urgent Concern Details',
      'Current Symptoms & Severity',
      'Immediate Needs & Requests',
      'Emergency Contacts',
      'Medical History Summary',
      'Preparation Checklist'
    ],
    estimatedTime: 15,
    aiFeatures: ['Urgency assessment', 'Emergency preparation']
  },
  preventive: {
    name: 'Preventive Care',
    description: 'Routine screening and prevention',
    icon: '🛡️',
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'from-teal-500/10 to-cyan-500/10',
    borderColor: 'border-teal-500/30',
    sections: [
      'Screening History',
      'Risk Factors Assessment',
      'Preventive Goals',
      'Family History',
      'Lifestyle Review',
      'Questions for Provider',
      'Preparation Checklist'
    ],
    estimatedTime: 30,
    aiFeatures: ['Risk calculation', 'Prevention planning']
  },
  specialist: {
    name: 'Specialist Consultation',
    description: 'Referral preparation for specialist care',
    icon: '👨‍⚕️',
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'from-purple-500/10 to-indigo-500/10',
    borderColor: 'border-purple-500/30',
    sections: [
      'Referral Reason & Symptoms',
      'Primary Care Summary',
      'Relevant Medical Records',
      'Current Medications',
      'Specialist Questions',
      'Preparation Checklist'
    ],
    estimatedTime: 35,
    aiFeatures: ['Specialty matching', 'Record summarization']
  }
};

export default function InteractiveProviderPacket() {
  const [currentPacket, setCurrentPacket] = useState<ProviderPacket | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PacketTemplate | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCollaborateModal, setShowCollaborateModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  // Initialize packet from template
  const createPacketFromTemplate = useCallback((template: PacketTemplate): ProviderPacket => {
    const templateConfig = PACKET_TEMPLATES[template];
    const sections: PacketSection[] = templateConfig.sections.map(sectionName => ({
      id: crypto.randomUUID(),
      title: sectionName,
      type: getSectionType(sectionName),
      required: isSectionRequired(sectionName),
      completed: false,
      data: getInitialSectionData(sectionName),
      aiSuggestions: getAISuggestions(sectionName),
      aiGenerated: false
    }));

    return {
      id: crypto.randomUUID(),
      template,
      status: 'draft',
      complianceLevel: 'hipaa',
      createdAt: new Date(),
      updatedAt: new Date(),
      sharedWith: [],
      collaborators: [{
        id: 'current-user',
        name: 'You',
        role: 'patient',
        lastActive: new Date(),
        permissions: ['edit', 'share', 'delete']
      }],
      sections,
      metadata: {
        visitType: templateConfig.name,
        urgency: template === 'urgent' ? 'urgent' : 'routine',
        estimatedDuration: templateConfig.estimatedTime,
        preparationTime: 0,
        aiConfidence: 85
      }
    };
  }, []);

  // Helper functions
  const getSectionType = (sectionName: string): SectionType => {
    const typeMap: Record<string, SectionType> = {
      'Chief Concern & Symptoms': 'text',
      'Medical History Timeline': 'timeline',
      'Current Medications & Supplements': 'list',
      'Recent Labs & Vital Signs': 'upload',
      'Lifestyle & Wellness Factors': 'form',
      'Goals & Expectations': 'text',
      'Preparation Checklist': 'checklist',
      'Questions for Provider': 'list',
      'Primary Concern Details': 'text',
      'Relevant Medical History': 'timeline',
      'Current Status & Progress': 'form',
      'Supporting Documentation': 'gallery',
      'Progress Update': 'text',
      'Current Symptoms Assessment': 'form',
      'Medication Changes & Side Effects': 'list',
      'Treatment Response': 'text',
      'Urgent Concern Details': 'voice',
      'Current Symptoms & Severity': 'form',
      'Immediate Needs & Requests': 'list',
      'Emergency Contacts': 'form',
      'Medical History Summary': 'text',
      'Screening History': 'timeline',
      'Risk Factors Assessment': 'form',
      'Preventive Goals': 'text',
      'Family History': 'form',
      'Lifestyle Review': 'form',
      'Referral Reason & Symptoms': 'text',
      'Primary Care Summary': 'text',
      'Relevant Medical Records': 'gallery',
      'Specialist Questions': 'list'
    };
    return typeMap[sectionName] || 'text';
  };

  const isSectionRequired = (sectionName: string): boolean => {
    const requiredSections = [
      'Chief Concern & Symptoms', 'Urgent Concern Details', 'Current Symptoms & Severity',
      'Preparation Checklist', 'Emergency Contacts', 'Referral Reason & Symptoms'
    ];
    return requiredSections.includes(sectionName);
  };

  const getInitialSectionData = (sectionName: string): any => {
    return {};
  };

  const getAISuggestions = (sectionName: string): string[] => {
    const suggestions: Record<string, string[]> = {
      'Chief Concern & Symptoms': [
        'Be specific about when symptoms started and their frequency',
        'Rate pain on a scale of 1-10 and note what makes it better/worse',
        'Include any patterns you\'ve noticed in your symptoms'
      ],
      'Preparation Checklist': [
        'Bring your insurance card and photo ID',
        'Make a list of all current medications with dosages',
        'Gather recent lab results or test results',
        'Write down questions you want to ask your provider'
      ],
      'Questions for Provider': [
        'What are the possible causes of my symptoms?',
        'What tests or treatments do you recommend?',
        'How long will it take to see improvement?',
        'What are the potential side effects?'
      ]
    };
    return suggestions[sectionName] || [];
  };

  // Handle template selection with animation
  const handleTemplateSelect = (template: PacketTemplate) => {
    const packet = createPacketFromTemplate(template);
    setCurrentPacket(packet);
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
  };

  // Update section data with real-time sync
  const updateSection = (sectionId: string, data: any) => {
    if (!currentPacket) return;

    const updatedSections = currentPacket.sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            data,
            completed: isSectionComplete(section.title, data),
            lastEdited: new Date(),
            editor: 'You'
          }
        : section
    );

    setCurrentPacket({
      ...currentPacket,
      sections: updatedSections,
      updatedAt: new Date()
    });
  };

  // Enhanced completion check
  const isSectionComplete = (sectionName: string, data: any): boolean => {
    if (!data) return false;

    switch (sectionName) {
      case 'Preparation Checklist':
        return Array.isArray(data) && data.length > 0;
      case 'Chief Concern & Symptoms':
      case 'Urgent Concern Details':
        return typeof data === 'string' && data.trim().length > 10;
      default:
        return Object.keys(data).length > 0 || (typeof data === 'string' && data.trim().length > 0);
    }
  };

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    if (!currentPacket) return 0;
    const completedSections = currentPacket.sections.filter(s => s.completed).length;
    return Math.round((completedSections / currentPacket.sections.length) * 100);
  };

  // Save packet with enhanced feedback
  const savePacket = async () => {
    if (!currentPacket) return;

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentPacket({
        ...currentPacket,
        updatedAt: new Date()
      });
      // Show success animation
    } catch (error) {
      console.error('Failed to save packet:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with animated background */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-2">
                Interactive Provider Packet
              </h1>
              <p className="text-gray-400 text-lg">
                AI-Powered Preparation for Your Healthcare Visit
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

          {/* Progress Overview */}
          {currentPacket && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
            >
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <FiTarget className="w-5 h-5 text-blue-400" />
                  <span className="text-2xl font-bold text-blue-400">{getCompletionPercentage()}%</span>
                </div>
                <div className="text-sm text-gray-400">Complete</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${getCompletionPercentage()}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                <div className="flex items-center justify-between mb-2">
                  <FiClock className="w-5 h-5 text-green-400" />
                  <span className="text-2xl font-bold text-green-400">{currentPacket.metadata.estimatedDuration}</span>
                </div>
                <div className="text-sm text-gray-400">Min Visit</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <FiUsers className="w-5 h-5 text-purple-400" />
                  <span className="text-2xl font-bold text-purple-400">{currentPacket.collaborators.length}</span>
                </div>
                <div className="text-sm text-gray-400">Collaborators</div>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-4 border border-orange-500/20">
                <div className="flex items-center justify-between mb-2">
                  <FiZap className="w-5 h-5 text-orange-400" />
                  <span className="text-2xl font-bold text-orange-400">{currentPacket.metadata.aiConfidence}%</span>
                </div>
                <div className="text-sm text-gray-400">AI Confidence</div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* AI Assistant Panel */}
        <AnimatePresence>
          {showAIPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <FiZap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-400">Harmony AI Assistant</h3>
                    <p className="text-sm text-gray-400">Real-time guidance for your visit preparation</p>
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
                  <h4 className="font-medium text-green-400 mb-2">💡 Smart Suggestions</h4>
                  <p className="text-sm text-gray-300">Based on your symptoms, consider asking about thyroid function tests.</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-400 mb-2">📊 Data Insights</h4>
                  <p className="text-sm text-gray-300">Your blood pressure trend shows improvement over the last month.</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-medium text-orange-400 mb-2">🎯 Next Steps</h4>
                  <p className="text-sm text-gray-300">Complete your medication list to unlock personalized interaction warnings.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Template Selector */}
        <AnimatePresence>
          {showTemplateSelector && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Visit Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(PACKET_TEMPLATES).map(([key, template]) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`bg-gradient-to-br ${template.bgColor} rounded-xl border-2 ${template.borderColor} p-6 cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/10`}
                    onClick={() => handleTemplateSelect(key as PacketTemplate)}
                  >
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-3">{template.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Duration:</span>
                        <span className="font-medium">{template.estimatedTime} min</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Sections:</span>
                        <span className="font-medium">{template.sections.length}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.aiFeatures.map((feature, idx) => (
                        <span key={idx} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <button className={`w-full bg-gradient-to-r ${template.color} text-white py-3 rounded-lg font-medium transition-all hover:shadow-lg`}>
                      Select Template
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Packet Builder */}
        {currentPacket && !showTemplateSelector && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Packet Status */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900 rounded-xl p-6"
              >
                <h3 className="font-semibold mb-4 flex items-center">
                  <FiTarget className="w-5 h-5 mr-2 text-purple-400" />
                  Packet Status
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      currentPacket.status === 'ready' ? 'bg-green-900 text-green-300' :
                      currentPacket.status === 'draft' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-blue-900 text-blue-300'
                    }`}>
                      {currentPacket.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Last Saved</span>
                    <span className="text-sm text-gray-300">
                      {format(currentPacket.updatedAt, 'MMM d, h:mm a')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Collaborators</span>
                    <div className="flex -space-x-2">
                      {currentPacket.collaborators.slice(0, 3).map((collab, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs font-bold"
                          title={collab.name}
                        >
                          {collab.name.charAt(0)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-900 rounded-xl p-6"
              >
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={savePacket}
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Progress'}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowShareModal(true)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                  >
                    <FiShare2 className="w-4 h-4" />
                    <span>Share with Provider</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCollaborateModal(true)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                  >
                    <FiUsers className="w-4 h-4" />
                    <span>Add Collaborator</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Section Progress */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-900 rounded-xl p-6"
              >
                <h3 className="font-semibold mb-4">Section Progress</h3>
                <div className="space-y-3">
                  {currentPacket.sections.map((section, idx) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                        activeSection === section.id ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-gray-800/50 hover:bg-gray-800'
                      }`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          section.completed ? 'bg-green-500' :
                          section.required ? 'bg-red-500' : 'bg-gray-500'
                        }`} />
                        <span className="text-sm font-medium truncate">{section.title}</span>
                      </div>
                      {section.required && (
                        <span className="text-xs bg-red-900 text-red-300 px-2 py-1 rounded">Required</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <Reorder.Group
                axis="y"
                values={currentPacket.sections}
                onReorder={(newSections) => setCurrentPacket({...currentPacket, sections: newSections})}
                className="space-y-6"
              >
                {currentPacket.sections.map((section, idx) => (
                  <Reorder.Item
                    key={section.id}
                    value={section}
                    className="relative"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`bg-gray-900 rounded-xl border-2 transition-all duration-300 ${
                        activeSection === section.id ? 'border-purple-500 shadow-lg shadow-purple-500/10' :
                        section.completed ? 'border-green-500/50' :
                        section.required ? 'border-red-500/50' : 'border-gray-700'
                      }`}
                    >
                      {/* Section Header */}
                      <div className="p-6 border-b border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              section.type === 'text' ? 'bg-blue-500/20 text-blue-400' :
                              section.type === 'list' ? 'bg-green-500/20 text-green-400' :
                              section.type === 'checklist' ? 'bg-purple-500/20 text-purple-400' :
                              section.type === 'upload' ? 'bg-orange-500/20 text-orange-400' :
                              section.type === 'voice' ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {section.type === 'text' && <FiEdit3 className="w-5 h-5" />}
                              {section.type === 'list' && <FiList className="w-5 h-5" />}
                              {section.type === 'checklist' && <FiCheckSquare className="w-5 h-5" />}
                              {section.type === 'upload' && <FiUpload className="w-5 h-5" />}
                              {section.type === 'voice' && <FiMic className="w-5 h-5" />}
                              {section.type === 'gallery' && <FiImage className="w-5 h-5" />}
                              {section.type === 'timeline' && <FiFileText className="w-5 h-5" />}
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold">{section.title}</h3>
                              <p className="text-gray-400 text-sm capitalize">{section.type} Section</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {section.required && (
                              <span className="bg-red-900 text-red-300 px-3 py-1 rounded-full text-xs font-medium">
                                Required
                              </span>
                            )}
                            {section.completed && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-green-500 text-white p-2 rounded-full"
                              >
                                <FiCheck className="w-4 h-4" />
                              </motion.div>
                            )}
                          </div>
                        </div>

                        {/* AI Suggestions */}
                        {section.aiSuggestions && section.aiSuggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4"
                          >
                            <h4 className="font-medium text-blue-400 mb-2 flex items-center">
                              <FiZap className="w-4 h-4 mr-2" />
                              AI Suggestions
                            </h4>
                            <ul className="space-y-2">
                              {section.aiSuggestions.map((suggestion, idx) => (
                                <motion.li
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="flex items-start text-sm text-blue-300"
                                >
                                  <span className="text-blue-500 mr-2 mt-1">•</span>
                                  {suggestion}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </div>

                      {/* Section Content */}
                      <div className="p-6">
                        <EnhancedSectionContent
                          section={section}
                          onUpdate={(data) => updateSection(section.id, data)}
                          isActive={activeSection === section.id}
                        />
                      </div>
                    </motion.div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          </div>
        )}

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
                <h3 className="text-xl font-semibold mb-4 text-pink-400">Share Provider Packet</h3>
                <p className="text-gray-400 mb-6">
                  Securely share your preparation packet with your healthcare provider.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Provider Email
                    </label>
                    <input
                      type="email"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      placeholder="provider@clinic.com"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none"
                    />
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="font-medium text-blue-400 mb-2">🔒 Security Features</h4>
                    <ul className="text-sm text-blue-300 space-y-1">
                      <li>• End-to-end encryption</li>
                      <li>• HIPAA compliant sharing</li>
                      <li>• Provider-only access</li>
                      <li>• Automatic expiration</li>
                    </ul>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowShareModal(false);
                      setShareEmail('');
                    }}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (shareEmail) {
                        // Handle sharing logic
                        setShowShareModal(false);
                        setShareEmail('');
                      }
                    }}
                    disabled={!shareEmail}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg text-sm font-medium disabled:opacity-50 transition"
                  >
                    Send Secure Link
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collaborate Modal */}
        <AnimatePresence>
          {showCollaborateModal && (
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
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Add Collaborator</h3>
                <p className="text-gray-400 mb-6">
                  Invite family members or caregivers to help prepare for your visit.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="family@member.com"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Relationship
                    </label>
                    <select className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none">
                      <option>Spouse/Partner</option>
                      <option>Parent</option>
                      <option>Child</option>
                      <option>Sibling</option>
                      <option>Caregiver</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowCollaborateModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCollaborateModal(false)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg text-sm font-medium transition"
                  >
                    Send Invitation
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Enhanced Section Content Component with rich interactions
function EnhancedSectionContent({
  section,
  onUpdate,
  isActive
}: {
  section: PacketSection;
  onUpdate: (data: any) => void;
  isActive: boolean;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

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

  switch (section.type) {
    case 'text':
      return (
        <div className="space-y-4">
          <textarea
            value={section.data || ''}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder={`Describe your ${section.title.toLowerCase()} in detail...`}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
            rows={6}
          />
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{(section.data || '').length} characters</span>
            <button className="text-purple-400 hover:text-purple-300 flex items-center space-x-1">
              <FiMic className="w-4 h-4" />
              <span>Voice to Text</span>
            </button>
          </div>
        </div>
      );

    case 'list':
      return (
        <div className="space-y-3">
          {(section.data || []).map((item: string, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-sm font-bold">
                {idx + 1}
              </div>
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newData = [...(section.data || [])];
                  newData[idx] = e.target.value;
                  onUpdate(newData);
                }}
                className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="Enter item..."
              />
              <button
                onClick={() => {
                  const newData = (section.data || []).filter((_: any, i: number) => i !== idx);
                  onUpdate(newData);
                }}
                className="text-red-400 hover:text-red-300 p-1"
              >
                <FiX className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onUpdate([...(section.data || []), ''])}
            className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg py-3 text-gray-400 hover:text-white transition flex items-center justify-center space-x-2"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Item</span>
          </motion.button>
        </div>
      );

    case 'checklist':
      const checklistItems = [
        'Bring insurance card and ID',
        'List of current medications with dosages',
        'Recent lab results or test results',
        'Questions you want to ask your provider',
        'Medical history summary',
        'Allergy information',
        'Previous treatment records',
        'Emergency contact information'
      ];

      return (
        <div className="space-y-3">
          {checklistItems.map((item, idx) => (
            <motion.label
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition cursor-pointer"
            >
              <input
                type="checkbox"
                checked={(section.data || []).includes(item)}
                onChange={(e) => {
                  const currentData = section.data || [];
                  if (e.target.checked) {
                    onUpdate([...currentData, item]);
                  } else {
                    onUpdate(currentData.filter((i: string) => i !== item));
                  }
                }}
                className="w-5 h-5 rounded border-gray-600 text-purple-500 focus:ring-purple-500 focus:ring-2"
              />
              <span className="text-gray-300">{item}</span>
            </motion.label>
          ))}
        </div>
      );

    case 'upload':
      return (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
            <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-300">Upload Medical Documents</p>
              <p className="text-gray-400">PDF, JPG, PNG up to 10MB each</p>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              id={`file-upload-${section.id}`}
            />
            <label
              htmlFor={`file-upload-${section.id}`}
              className="inline-block mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium cursor-pointer hover:shadow-lg transition"
            >
              Choose Files
            </label>
          </div>

          {/* Uploaded files preview */}
          {section.attachments && section.attachments.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-300">Uploaded Files</h4>
              {section.attachments.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FiFileText className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                  </div>
                  <button className="text-red-400 hover:text-red-300">
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case 'voice':
      return (
        <div className="space-y-4">
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRecording(!isRecording)}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold transition-all ${
                isRecording
                  ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg'
              }`}
            >
              {isRecording ? (
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse mb-1"></div>
                  <span className="text-xs">{recordingTime}s</span>
                </div>
              ) : (
                <FiMic className="w-8 h-8" />
              )}
            </motion.button>
            <p className="mt-4 text-gray-400">
              {isRecording ? 'Recording... Tap to stop' : 'Tap to start voice recording'}
            </p>
          </div>

          {/* Voice notes */}
          {section.voiceNotes && section.voiceNotes.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-300">Voice Notes</h4>
              {section.voiceNotes.map((note, idx) => (
                <div key={idx} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">
                      {format(note.recordedAt, 'MMM d, h:mm a')}
                    </span>
                    <span className="text-xs text-purple-400">{note.duration}s</span>
                  </div>
                  <p className="text-sm text-gray-300">{note.transcript}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="text-center py-8 text-gray-400">
          <FiFileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Content type not yet implemented</p>
        </div>
      );
  }
}