"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUpload,
  FiFileText,
  FiMessageSquare,
  FiSave,
  FiSearch,
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiX,
  FiDownload,
  FiShare2,
  FiUser,
  FiUsers,
  FiZap,
  FiTarget,
  FiCalendar,
  FiChevronRight,
  FiPlus,
  FiMinus,
  FiActivity,
  FiHeart,
  FiCpu,
  FiDroplet,
  FiThermometer,
  FiBarChart3,
  FiTrendingDown,
  FiTrendingUp as FiTrendingUpIcon,
  FiShield,
  FiAlertCircle,
  FiInfo,
  FiArrowUp,
  FiArrowDown,
  FiMinus as FiNeutral,
  FiPlay,
  FiPause
} from 'react-icons/fi';
import Image from 'next/image';

// Enhanced types for comprehensive family health analysis
type FamilyMember = {
  id: string;
  name: string;
  relationship: string;
  age: number;
  conditions: string[];
  geneticMarkers?: string[];
  riskFactors: string[];
};

type GeneticInsight = {
  id: string;
  category: string;
  originalText: string;
  decodedMeaning: string;
  relatedConditions: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  clinicalInsights: {
    whatThisMeans: string;
    whyItMatters: string;
    actionableSteps: string[];
  };
  familyPatterns: {
    inheritance: string;
    prevalence: number;
    prevention: string[];
  };
};

type ConversationMessage = {
  id: string;
  type: 'user' | 'root';
  content: string;
  timestamp: Date;
};

type SavedInsight = {
  id: string;
  title: string;
  content: string;
  category: string;
  savedAt: Date;
};

export default function InteractiveRoot() {
  const [activeTab, setActiveTab] = useState<'upload' | 'analyze' | 'chat' | 'save'>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [geneticInsights, setGeneticInsights] = useState<GeneticInsight[]>([]);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [savedInsights, setSavedInsights] = useState<SavedInsight[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<GeneticInsight | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sample family data for demo
  const sampleFamilyMembers: FamilyMember[] = [
    {
      id: '1',
      name: 'John Doe',
      relationship: 'Father',
      age: 65,
      conditions: ['Hypertension', 'Type 2 Diabetes'],
      geneticMarkers: ['APOE-e4', 'BRCA1'],
      riskFactors: ['Smoking', 'Sedentary lifestyle']
    },
    {
      id: '2',
      name: 'Jane Doe',
      relationship: 'Mother',
      age: 62,
      conditions: ['Osteoporosis', 'Thyroid disorder'],
      geneticMarkers: ['COL1A1', 'TG'],
      riskFactors: ['Vitamin D deficiency']
    }
  ];

  // Sample genetic insights
  const sampleInsights: GeneticInsight[] = [
    {
      id: '1',
      category: 'Cardiovascular Risk',
      originalText: 'APOE-e4 genetic marker present',
      decodedMeaning: 'Elevated risk for Alzheimer\'s disease and cardiovascular issues',
      relatedConditions: ['Alzheimer\'s', 'Heart Disease', 'Stroke'],
      severity: 'high',
      confidence: 92,
      clinicalInsights: {
        whatThisMeans: 'The APOE-e4 gene variant increases your risk for late-onset Alzheimer\'s disease by 3-8 times compared to the general population.',
        whyItMatters: 'Early awareness allows for preventive lifestyle changes and regular cognitive assessments.',
        actionableSteps: [
          'Regular cardiovascular exercise (150 minutes/week)',
          'Mediterranean diet rich in omega-3 fatty acids',
          'Annual cognitive assessments starting at age 50',
          'Consider genetic counseling for family planning'
        ]
      },
      familyPatterns: {
        inheritance: 'Autosomal dominant with variable penetrance',
        prevalence: 15,
        prevention: ['Lifestyle modification', 'Regular monitoring', 'Early intervention']
      }
    }
  ];

  // Load sample data on mount
  useEffect(() => {
    setFamilyMembers(sampleFamilyMembers);
    setGeneticInsights(sampleInsights);
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  }, []);

  const processFamilyData = async () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setGeneticInsights(sampleInsights);
      setActiveTab('analyze');
      setIsProcessing(false);
    }, 2000);
  };

  const sendMessage = async () => {
    if (!currentQuestion.trim()) return;

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentQuestion,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    setCurrentQuestion('');

    // Simulate Root's response
    setTimeout(() => {
      const rootResponse: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        type: 'root',
        content: `Based on your family's genetic profile, I recommend focusing on cardiovascular health monitoring. Your family has a pattern of hypertension that appears in multiple generations. Would you like me to explain the specific genetic markers involved?`,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, rootResponse]);
    }, 1000);
  };

  const saveInsight = (insight: GeneticInsight) => {
    const savedInsight: SavedInsight = {
      id: Date.now().toString(),
      title: insight.category,
      content: insight.decodedMeaning,
      category: 'Genetic Analysis',
      savedAt: new Date()
    };
    setSavedInsights(prev => [...prev, savedInsight]);
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <FiAlertTriangle className="w-5 h-5 text-red-400" />;
      case 'high': return <FiTrendingUp className="w-5 h-5 text-orange-400" />;
      case 'medium': return <FiInfo className="w-5 h-5 text-yellow-400" />;
      default: return <FiCheckCircle className="w-5 h-5 text-green-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Interactive Root - Family Health Intelligence
          </h1>
          <p className="text-gray-400 text-lg">
            Upload family health data, discover genetic patterns, chat with Root, and save personalized insights
          </p>

          {/* Root Mascot with Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 mb-8 relative"
          >
            <div className="relative inline-block">
              <Image
                src="/mascots/FAMILYTREEMASCOT.PNG"
                alt="Root Family Tree Mascot - Your family health guide"
                width={180}
                height={180}
                className="mx-auto rounded-full shadow-2xl"
                priority
              />
              <button
                onClick={() => setShowVideoModal(true)}
                className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white p-3 rounded-full hover:from-emerald-600 hover:to-green-600 transition shadow-lg"
              >
                <FiPlay className="w-5 h-5" />
              </button>
            </div>
            <p className="text-emerald-300 mt-4 font-medium">🌳 Click to watch Root explain family health patterns</p>
          </motion.div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1">
            {[
              { id: 'upload', label: 'Upload Family Data', icon: FiUpload },
              { id: 'analyze', label: 'Genetic Analysis', icon: FiCpu },
              { id: 'chat', label: 'Ask Root', icon: FiMessageSquare },
              { id: 'save', label: 'Saved Insights', icon: FiSave }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                <div className="text-center">
                  <FiUpload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2 text-white">Upload Family Health Data</h2>
                  <p className="text-gray-400 mb-6">Import genetic reports, family medical history, or health records</p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.txt,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-600 transition"
                  >
                    Choose Files
                  </button>
                </div>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Uploaded Files</h3>
                  <div className="space-y-3">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                        <FiFileText className="w-8 h-8 text-purple-400" />
                        <div className="flex-1">
                          <p className="text-white font-medium">{file.name}</p>
                          <p className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <FiCheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={processFamilyData}
                    disabled={isProcessing}
                    className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-600 transition disabled:opacity-50"
                  >
                    {isProcessing ? 'Analyzing Family Data...' : 'Analyze Family Patterns'}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Analyze Tab */}
          {activeTab === 'analyze' && (
            <motion.div
              key="analyze"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {geneticInsights.length === 0 ? (
                <div className="text-center py-12">
                  <FiCpu className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Analysis Available</h3>
                  <p className="text-gray-400">Upload family health data first to get genetic insights</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {geneticInsights.map((insight) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:border-emerald-500/50 transition cursor-pointer"
                      onClick={() => setSelectedInsight(insight)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          {getSeverityIcon(insight.severity)}
                          <div>
                            <h3 className="text-xl font-bold text-white">{insight.category}</h3>
                            <p className="text-gray-400">{insight.originalText}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400 mb-1">Confidence</div>
                          <div className="text-white font-medium">{insight.confidence}%</div>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4">{insight.decodedMeaning}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {insight.relatedConditions.slice(0, 3).map((condition, index) => (
                          <span key={index} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
                            {condition}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          saveInsight(insight);
                        }}
                        className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                      >
                        💾 Save Insight
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
            >
              {/* Chat Header */}
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src="/mascots/FAMILYTREEMASCOT.PNG"
                  alt="Root"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">Chat with Root</h3>
                  <p className="text-gray-400 text-sm">Your family health pattern expert</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto mb-4 space-y-4">
                {conversation.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <FiMessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Ask me anything about your family's health patterns and genetic insights</p>
                  </div>
                ) : (
                  conversation.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-lg p-4 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white/10 text-white'
                      }`}>
                        <p>{message.content}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask Root about your family health patterns..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-600 transition"
                >
                  Ask
                </button>
              </div>
            </motion.div>
          )}

          {/* Save Tab */}
          {activeTab === 'save' && (
            <motion.div
              key="save"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {savedInsights.length === 0 ? (
                <div className="text-center py-12">
                  <FiSave className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Saved Insights</h3>
                  <p className="text-gray-400">Save genetic insights to reference later</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {savedInsights.map((insight) => (
                    <div key={insight.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-white">{insight.title}</h3>
                        <span className="text-xs text-gray-400">
                          {insight.savedAt.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3">{insight.content}</p>
                      <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
                        {insight.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Insight Detail Modal */}
        <AnimatePresence>
          {selectedInsight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedInsight(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 border border-white/20 rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {getSeverityIcon(selectedInsight.severity)}
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedInsight.category}</h2>
                      <p className="text-gray-400">{selectedInsight.originalText}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedInsight(null)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                {/* Clinical Insights */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">Clinical Insights</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-2">What This Means</h4>
                      <p className="text-blue-200">{selectedInsight.clinicalInsights.whatThisMeans}</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-300 mb-2">Why It Matters</h4>
                      <p className="text-yellow-200">{selectedInsight.clinicalInsights.whyItMatters}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <h4 className="font-semibold text-green-300 mb-2">Actionable Steps</h4>
                      <ul className="text-green-200 space-y-1">
                        {selectedInsight.clinicalInsights.actionableSteps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-400 mt-1">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Family Patterns */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">Family Pattern Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-300 mb-2">Inheritance</h4>
                      <p className="text-purple-200 text-sm">{selectedInsight.familyPatterns.inheritance}</p>
                    </div>
                    <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-4">
                      <h4 className="font-semibold text-pink-300 mb-2">Family Prevalence</h4>
                      <p className="text-pink-200 text-sm">{selectedInsight.familyPatterns.prevalence}% of family</p>
                    </div>
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                      <h4 className="font-semibold text-indigo-300 mb-2">Prevention Focus</h4>
                      <p className="text-indigo-200 text-sm">{selectedInsight.familyPatterns.prevention[0]}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Modal */}
        <AnimatePresence>
          {showVideoModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowVideoModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 border border-white/20 rounded-2xl p-8 max-w-4xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Image
                      src="/mascots/FAMILYTREEMASCOT.PNG"
                      alt="Root"
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-white">Root Explains Family Health Patterns</h2>
                      <p className="text-gray-400">Understanding your genetic inheritance</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowVideoModal(false)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                  <video
                    ref={videoRef}
                    src="/videos/roots-intro.mp4"
                    className="w-full h-full object-cover rounded-xl"
                    controls
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    onEnded={() => setIsVideoPlaying(false)}
                  />
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowVideoModal(false)}
                    className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowVideoModal(false);
                      setActiveTab('chat');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition"
                  >
                    Ask Root Questions
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}