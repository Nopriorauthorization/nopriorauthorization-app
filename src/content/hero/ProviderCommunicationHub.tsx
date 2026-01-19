"use client";

import React, { useState, useEffect, useRef } from 'react';
import { format, isToday, isYesterday, differenceInMinutes } from 'date-fns';

// Communication types
type Message = {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderType: 'patient' | 'provider';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: Attachment[];
  replyTo?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isEncrypted: boolean;
};

type Attachment = {
  id: string;
  filename: string;
  fileSize: number;
  fileType: string;
  url: string;
  thumbnailUrl?: string;
};

type Thread = {
  id: string;
  providerId: string;
  providerName: string;
  providerSpecialty: string;
  subject: string;
  status: 'active' | 'closed' | 'archived';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  lastActivity: string;
  unreadCount: number;
  messages: Message[];
  participants: string[];
  tags: string[];
  isStarred: boolean;
  autoArchiveDate?: string;
};

// Sample data
const threads: Thread[] = [
  {
    id: 'thread-1',
    providerId: 'provider-1',
    providerName: 'Dr. Sarah Chen',
    providerSpecialty: 'Internal Medicine',
    subject: 'Annual Physical Results & Follow-up',
    status: 'active',
    priority: 'normal',
    lastActivity: '2024-06-18T14:30:00Z',
    unreadCount: 2,
    participants: ['patient-1', 'provider-1'],
    tags: ['annual-physical', 'lab-results'],
    isStarred: true,
    messages: [
      {
        id: 'msg-1',
        threadId: 'thread-1',
        senderId: 'provider-1',
        senderName: 'Dr. Sarah Chen',
        senderType: 'provider',
        content: 'Hi! I wanted to follow up on your annual physical from last week. Overall, your results look excellent. Your blood pressure has improved significantly since our last visit.',
        timestamp: '2024-06-17T10:00:00Z',
        status: 'read',
        priority: 'normal',
        isEncrypted: true
      },
      {
        id: 'msg-2',
        threadId: 'thread-1',
        senderId: 'patient-1',
        senderName: 'You',
        senderType: 'patient',
        content: 'That\'s great news! I\'ve been really focused on the lifestyle changes we discussed. What about my cholesterol levels?',
        timestamp: '2024-06-17T15:30:00Z',
        status: 'delivered',
        priority: 'normal',
        isEncrypted: true
      },
      {
        id: 'msg-3',
        threadId: 'thread-1',
        senderId: 'provider-1',
        senderName: 'Dr. Sarah Chen',
        senderType: 'provider',
        content: 'Your cholesterol has dropped to 185 mg/dL - down from 210! The LDL is now 110, which is much better. Keep up the great work with the Mediterranean diet.',
        timestamp: '2024-06-18T09:15:00Z',
        status: 'delivered',
        priority: 'normal',
        isEncrypted: true
      },
      {
        id: 'msg-4',
        threadId: 'thread-1',
        senderId: 'provider-1',
        senderName: 'Dr. Sarah Chen',
        senderType: 'provider',
        content: 'I\'ve attached your complete lab results for your records. Let\'s schedule your next follow-up in 6 months unless you have any concerns before then.',
        timestamp: '2024-06-18T14:30:00Z',
        status: 'sent',
        priority: 'normal',
        isEncrypted: true,
        attachments: [{
          id: 'att-1',
          filename: 'Lab_Results_June_2024.pdf',
          fileSize: 245760,
          fileType: 'application/pdf',
          url: '/attachments/lab-results-june-2024.pdf'
        }]
      }
    ]
  },
  {
    id: 'thread-2',
    providerId: 'provider-2',
    providerName: 'Dr. Michael Torres',
    providerSpecialty: 'Endocrinology',
    subject: 'Diabetes Management - Medication Adjustment',
    status: 'active',
    priority: 'high',
    lastActivity: '2024-06-18T16:45:00Z',
    unreadCount: 1,
    participants: ['patient-1', 'provider-2'],
    tags: ['diabetes', 'medication', 'metformin'],
    isStarred: false,
    messages: [
      {
        id: 'msg-5',
        threadId: 'thread-2',
        senderId: 'provider-2',
        senderName: 'Dr. Michael Torres',
        senderType: 'provider',
        content: 'Based on your excellent HbA1c of 5.8%, I\'m adjusting your Metformin dose. Please reduce to 500mg twice daily instead of three times. Monitor your blood sugar and let me know if you notice any changes.',
        timestamp: '2024-06-18T16:45:00Z',
        status: 'sent',
        priority: 'high',
        isEncrypted: true
      }
    ]
  },
  {
    id: 'thread-3',
    providerId: 'provider-4',
    providerName: 'Dr. Lisa Rodriguez',
    providerSpecialty: 'Cardiology',
    subject: 'Cardiology Consultation Preparation',
    status: 'active',
    priority: 'normal',
    lastActivity: '2024-06-18T11:20:00Z',
    unreadCount: 0,
    participants: ['patient-1', 'provider-4'],
    tags: ['cardiology', 'consultation', 'blood-pressure'],
    isStarred: false,
    messages: [
      {
        id: 'msg-6',
        threadId: 'thread-3',
        senderId: 'provider-4',
        senderName: 'Dr. Lisa Rodriguez',
        senderType: 'provider',
        content: 'Hello! I received the referral from Dr. Chen regarding your blood pressure management. Please bring a log of your home BP readings from the past 2 weeks to our appointment on July 25th.',
        timestamp: '2024-06-18T11:20:00Z',
        status: 'read',
        priority: 'normal',
        isEncrypted: true
      }
    ]
  }
];

export default function ProviderCommunicationHub() {
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'unread'>('all');
  const [showCompose, setShowCompose] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredThreads = threads.filter(thread => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!thread.subject.toLowerCase().includes(query) && 
          !thread.providerName.toLowerCase().includes(query) &&
          !thread.messages.some(msg => msg.content.toLowerCase().includes(query))) {
        return false;
      }
    }
    
    if (filterStatus === 'unread' && thread.unreadCount === 0) return false;
    if (filterStatus === 'active' && thread.status !== 'active') return false;
    
    return true;
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedThread?.messages]);

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM dd, h:mm a');
    }
  };

  const getThreadLastActivity = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const minutesAgo = differenceInMinutes(now, date);
    
    if (minutesAgo < 1) return 'Just now';
    if (minutesAgo < 60) return `${minutesAgo}m ago`;
    if (minutesAgo < 1440) return `${Math.floor(minutesAgo / 60)}h ago`;
    
    return format(date, 'MMM dd');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-yellow-400 bg-yellow-500/20';
      case 'normal': return 'text-blue-400 bg-blue-500/20';
      case 'low': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-blue-400 bg-blue-500/20';
    }
  };

  const getStatusColor = (status: Message['status']) => {
    switch (status) {
      case 'sent': return 'text-gray-400';
      case 'delivered': return 'text-blue-400';
      case 'read': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const handleSendMessage = () => {
    if (!selectedThread || (!newMessage.trim() && selectedFiles.length === 0)) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      threadId: selectedThread.id,
      senderId: 'patient-1',
      senderName: 'You',
      senderType: 'patient',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      status: 'sent',
      priority: 'normal',
      isEncrypted: true,
      attachments: selectedFiles.map((file, index) => ({
        id: `att-${Date.now()}-${index}`,
        filename: file.name,
        fileSize: file.size,
        fileType: file.type,
        url: URL.createObjectURL(file)
      }))
    };

    // In real app, this would update the thread via API
    selectedThread.messages.push(newMsg);
    selectedThread.lastActivity = newMsg.timestamp;

    setNewMessage('');
    setSelectedFiles([]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="h-screen flex">
        {/* Sidebar - Thread List */}
        <div className="w-80 bg-gradient-to-b from-gray-900 to-black border-r border-gray-800 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Provider Messages
            </h1>
            
            {/* Search */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:border-pink-500 focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-gray-500">🔍</span>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              {['all', 'active', 'unread'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterStatus(filter as any)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    filterStatus === filter
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter === 'active' ? 'Active' : 'Unread'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCompose(true)}
              className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition"
            >
              + New Message
            </button>
          </div>

          {/* Thread List */}
          <div className="flex-1 overflow-y-auto">
            {filteredThreads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                className={`p-4 border-b border-gray-800 cursor-pointer transition-all duration-200 hover:bg-gray-800/50 ${
                  selectedThread?.id === thread.id ? 'bg-pink-500/10 border-r-2 border-r-pink-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white text-sm">{thread.providerName}</h3>
                    {thread.isStarred && <span className="text-yellow-400">⭐</span>}
                    {thread.unreadCount > 0 && (
                      <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getThreadLastActivity(thread.lastActivity)}
                  </div>
                </div>
                
                <p className="text-gray-400 text-xs mb-2">{thread.providerSpecialty}</p>
                
                <p className="text-white text-sm font-medium mb-2 line-clamp-1">
                  {thread.subject}
                </p>
                
                <p className="text-gray-400 text-sm line-clamp-2">
                  {thread.messages[thread.messages.length - 1]?.content}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex flex-wrap gap-1">
                    {thread.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {thread.priority !== 'normal' && (
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(thread.priority)}`}>
                      {thread.priority.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {selectedThread ? (
            <>
              {/* Thread Header */}
              <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold text-white">{selectedThread.subject}</h2>
                      {selectedThread.isStarred && <span className="text-yellow-400">⭐</span>}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedThread.priority)}`}>
                        {selectedThread.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>👨‍⚕️ {selectedThread.providerName}</span>
                      <span>🏥 {selectedThread.providerSpecialty}</span>
                      <span>🔒 End-to-end encrypted</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 transition">
                      Archive
                    </button>
                    <button className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded text-sm hover:bg-blue-500/30 transition">
                      Schedule
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  {selectedThread.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedThread.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderType === 'patient' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-md ${message.senderType === 'patient' ? 'order-2' : 'order-1'}`}>
                      <div className={`p-4 rounded-2xl ${
                        message.senderType === 'patient'
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-sm'
                          : 'bg-gray-800 text-white rounded-bl-sm'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium opacity-80">
                            {message.senderName}
                          </span>
                          <span className="text-xs opacity-60">
                            {formatMessageTime(message.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.attachments.map((attachment) => (
                              <div key={attachment.id} className="flex items-center gap-3 p-2 bg-black/20 rounded-lg">
                                <div className="text-2xl">📎</div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium">{attachment.filename}</div>
                                  <div className="text-xs opacity-60">{formatFileSize(attachment.fileSize)}</div>
                                </div>
                                <button className="px-2 py-1 bg-white/20 rounded text-xs hover:bg-white/30 transition">
                                  Download
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            {message.isEncrypted && <span className="text-xs">🔒</span>}
                            {message.priority !== 'normal' && (
                              <span className={`px-1 py-0.5 rounded text-xs ${getPriorityColor(message.priority)}`}>
                                {message.priority}
                              </span>
                            )}
                          </div>
                          
                          {message.senderType === 'patient' && (
                            <div className={`flex items-center gap-1 text-xs ${getStatusColor(message.status)}`}>
                              {message.status === 'sent' && '📤'}
                              {message.status === 'delivered' && '✓'}
                              {message.status === 'read' && '✓✓'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <div className="p-6 border-t border-gray-800 bg-gray-900">
                {/* File Attachments Preview */}
                {selectedFiles.length > 0 && (
                  <div className="mb-4 p-3 bg-black/30 rounded-lg">
                    <h4 className="text-sm font-medium text-white mb-2">Attachments ({selectedFiles.length})</h4>
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-gray-800 rounded">
                          <span className="text-xl">📎</span>
                          <div className="flex-1">
                            <div className="text-sm text-white">{file.name}</div>
                            <div className="text-xs text-gray-400">{formatFileSize(file.size)}</div>
                          </div>
                          <button
                            onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                            className="text-red-400 hover:text-red-300"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-end gap-3">
                  <div className="flex-1 min-h-[44px] bg-black/50 border border-gray-700 rounded-lg flex items-center">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your secure message..."
                      rows={1}
                      className="flex-1 bg-transparent px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-gray-400 hover:text-white transition mr-2"
                      title="Attach files"
                    >
                      📎
                    </button>
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() && selectedFiles.length === 0}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>🔒 End-to-end encrypted</span>
                    <span>📋 HIPAA compliant</span>
                  </div>
                  <span>Press Enter to send, Shift+Enter for new line</span>
                </div>
              </div>
            </>
          ) : (
            /* No Thread Selected */
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-2xl font-semibold text-white mb-2">Secure Provider Communications</h3>
                <p className="text-gray-400 mb-6">Select a conversation to start secure, HIPAA-compliant messaging with your healthcare providers</p>
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>🔒</span>
                    <span>End-to-end encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📋</span>
                    <span>HIPAA compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔔</span>
                    <span>Real-time notifications</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}