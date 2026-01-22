"use client";

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUpload,
  FiMic,
  FiMicOff,
  FiPlay,
  FiPause,
  FiFileText,
  FiImage,
  FiVideo,
  FiX,
  FiCheck,
  FiClock,
  FiUser,
  FiCalendar,
  FiTag,
  FiPlus,
  FiDownload,
  FiShare2,
  FiTrash2
} from 'react-icons/fi';

// Types for the rich health timeline
type MediaType = 'photo' | 'voice' | 'document' | 'video';

type TimelineEntry = {
  id: string;
  type: MediaType;
  title: string;
  description: string;
  date: string;
  timestamp: number;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  duration?: number; // for voice/video
  transcript?: string;
  aiSummary?: string;
  tags: string[];
  category: string;
  privacy: 'private' | 'family' | 'providers';
  aiInsights?: string[];
  thumbnail?: string;
};

type UploadState = {
  isUploading: boolean;
  progress: number;
  error?: string;
};

export default function RichHealthTimeline() {
  const [entries, setEntries] = useState<TimelineEntry[]>([
    // Sample data to show functionality
    {
      id: '1',
      type: 'photo',
      title: 'Recent X-Ray Results',
      description: 'Chest X-ray showing clear lungs',
      date: '2026-01-20',
      timestamp: Date.now() - 86400000, // 1 day ago
      fileUrl: '/api/placeholder/xray.jpg',
      fileName: 'chest_xray_2026.jpg',
      fileSize: 2048000,
      tags: ['x-ray', 'chest', 'lungs', 'normal'],
      category: 'Imaging',
      privacy: 'providers',
      thumbnail: '/api/placeholder/xray-thumb.jpg'
    },
    {
      id: '2',
      type: 'voice',
      title: 'Morning Symptom Check',
      description: 'Daily health check-in',
      date: '2026-01-21',
      timestamp: Date.now() - 3600000, // 1 hour ago
      duration: 45,
      transcript: "Good morning. I've been having this persistent headache since yesterday afternoon. It's a dull ache behind my eyes, and I've also been feeling quite fatigued...",
      aiSummary: "Patient reports persistent headache and fatigue. Symptoms began yesterday afternoon.",
      tags: ['headache', 'fatigue', 'symptoms'],
      category: 'Daily Check-in',
      privacy: 'private',
      aiInsights: ['Headache pattern suggests possible eye strain or dehydration']
    }
  ]);

  const [activeTab, setActiveTab] = useState<'timeline' | 'upload'>('timeline');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadState, setUploadState] = useState<UploadState>({ isUploading: false, progress: 0 });
  const [selectedEntry, setSelectedEntry] = useState<TimelineEntry | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Voice recording functionality
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);

        const newEntry: TimelineEntry = {
          id: Date.now().toString(),
          type: 'voice',
          title: 'Voice Note',
          description: 'Recorded health note',
          date: new Date().toISOString().split('T')[0],
          timestamp: Date.now(),
          fileUrl: url,
          duration: recordingTime,
          tags: [],
          category: 'Voice Notes',
          privacy: 'private'
        };

        setEntries(prev => [newEntry, ...prev]);
        setRecordingTime(0);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, [recordingTime]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  }, [isRecording]);

  // File upload functionality
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploadState({ isUploading: true, progress: 0 });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 20, 95)
        }));
      }, 200);

      // Simulate upload completion
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadState({ isUploading: false, progress: 100 });

        const fileType = file.type.startsWith('image/') ? 'photo' :
                        file.type.startsWith('video/') ? 'video' : 'document';

        const newEntry: TimelineEntry = {
          id: Date.now().toString() + i,
          type: fileType,
          title: file.name,
          description: `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} uploaded`,
          date: new Date().toISOString().split('T')[0],
          timestamp: Date.now(),
          fileUrl: URL.createObjectURL(file),
          fileName: file.name,
          fileSize: file.size,
          tags: [],
          category: fileType === 'photo' ? 'Photos' : fileType === 'video' ? 'Videos' : 'Documents',
          privacy: 'private',
          thumbnail: fileType === 'photo' ? URL.createObjectURL(file) : undefined
        };

        setEntries(prev => [newEntry, ...prev]);
        setUploadState({ isUploading: false, progress: 0 });
      }, 2000);
    }
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeIcon = (type: MediaType) => {
    switch (type) {
      case 'photo': return FiImage;
      case 'voice': return FiMic;
      case 'video': return FiVideo;
      case 'document': return FiFileText;
      default: return FiFileText;
    }
  };

  const getTypeColor = (type: MediaType) => {
    switch (type) {
      case 'photo': return 'from-blue-500 to-cyan-500';
      case 'voice': return 'from-green-500 to-emerald-500';
      case 'video': return 'from-purple-500 to-pink-500';
      case 'document': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Rich Health Timeline
          </h1>
          <p className="text-gray-400 text-lg">
            Upload photos, record voice notes, and attach documents to build your complete health story
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                activeTab === 'timeline'
                  ? 'bg-white text-purple-900'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Health Timeline
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                activeTab === 'upload'
                  ? 'bg-white text-purple-900'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Add Entry
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'timeline' ? (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Timeline */}
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500"></div>

                {entries.map((entry, index) => {
                  const IconComponent = getTypeIcon(entry.type);
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative flex items-start gap-6 mb-8"
                    >
                      {/* Timeline dot */}
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getTypeColor(entry.type)} flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      {/* Content card */}
                      <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:border-purple-500/50 transition cursor-pointer"
                           onClick={() => setSelectedEntry(entry)}>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">{entry.title}</h3>
                            <p className="text-gray-400 mb-3">{entry.description}</p>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <div className="flex items-center gap-1 mb-1">
                              <FiCalendar className="w-4 h-4" />
                              {entry.date}
                            </div>
                            {entry.duration && (
                              <div className="flex items-center gap-1">
                                <FiClock className="w-4 h-4" />
                                {formatDuration(entry.duration)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tags */}
                        {entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {entry.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* AI Summary */}
                        {entry.aiSummary && (
                          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <FiTag className="w-4 h-4 text-purple-400" />
                              <span className="text-purple-300 font-medium text-sm">AI Summary</span>
                            </div>
                            <p className="text-gray-300 text-sm">{entry.aiSummary}</p>
                          </div>
                        )}

                        {/* Thumbnail for photos */}
                        {entry.thumbnail && (
                          <div className="mt-4">
                            <img
                              src={entry.thumbnail}
                              alt={entry.title}
                              className="w-32 h-32 object-cover rounded-lg border border-white/20"
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* File Upload */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FiUpload className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Upload Files</h3>
                  <p className="text-gray-400">Photos, documents, videos, and medical records</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadState.isUploading}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50"
                >
                  {uploadState.isUploading ? 'Uploading...' : 'Choose Files'}
                </button>

                {uploadState.isUploading && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadState.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-center text-sm text-gray-400 mt-2">
                      {Math.round(uploadState.progress)}% complete
                    </p>
                  </div>
                )}
              </div>

              {/* Voice Recording */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    {isRecording ? (
                      <FiMic className="w-8 h-8 text-red-400 animate-pulse" />
                    ) : (
                      <FiMic className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Voice Notes</h3>
                  <p className="text-gray-400">Record symptoms, observations, and health updates</p>
                  {isRecording && (
                    <div className="mt-4 text-2xl font-mono text-red-400">
                      {formatDuration(recordingTime)}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <FiMic className="w-5 h-5" />
                        Start Recording
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 transition"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <FiMicOff className="w-5 h-5" />
                        Stop Recording
                      </div>
                    </button>
                  )}

                  <div className="text-center text-sm text-gray-400">
                    Voice notes are automatically transcribed and summarized with AI
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entry Detail Modal */}
        <AnimatePresence>
          {selectedEntry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedEntry(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getTypeColor(selectedEntry.type)} flex items-center justify-center`}>
                      {React.createElement(getTypeIcon(selectedEntry.type), { className: "w-6 h-6 text-white" })}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedEntry.title}</h2>
                      <p className="text-gray-400">{selectedEntry.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                {/* File details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Date</div>
                    <div className="text-white font-medium">{selectedEntry.date}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Category</div>
                    <div className="text-white font-medium">{selectedEntry.category}</div>
                  </div>
                  {selectedEntry.fileSize && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">File Size</div>
                      <div className="text-white font-medium">{formatFileSize(selectedEntry.fileSize)}</div>
                    </div>
                  )}
                  {selectedEntry.duration && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Duration</div>
                      <div className="text-white font-medium">{formatDuration(selectedEntry.duration)}</div>
                    </div>
                  )}
                </div>

                {/* Transcript/Summary */}
                {selectedEntry.transcript && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Transcript</h3>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-gray-300 text-sm leading-relaxed">{selectedEntry.transcript}</p>
                    </div>
                  </div>
                )}

                {selectedEntry.aiSummary && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">AI Summary</h3>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                      <p className="text-purple-200">{selectedEntry.aiSummary}</p>
                    </div>
                  </div>
                )}

                {/* AI Insights */}
                {selectedEntry.aiInsights && selectedEntry.aiInsights.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">AI Insights</h3>
                    <div className="space-y-2">
                      {selectedEntry.aiInsights.map((insight, index) => (
                        <div key={index} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <p className="text-blue-200 text-sm">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedEntry.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  {selectedEntry.fileUrl && (
                    <button className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition">
                      <div className="flex items-center justify-center gap-2">
                        <FiDownload className="w-4 h-4" />
                        Download
                      </div>
                    </button>
                  )}
                  <button className="flex-1 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition">
                    <div className="flex items-center justify-center gap-2">
                      <FiShare2 className="w-4 h-4" />
                      Share
                    </div>
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