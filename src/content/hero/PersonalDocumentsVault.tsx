"use client";

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUpload,
  FiFile,
  FiLock,
  FiUnlock,
  FiEye,
  FiEyeOff,
  FiDownload,
  FiShare2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiFilter,
  FiX
} from 'react-icons/fi';

interface PersonalDocument {
  id: string;
  name: string;
  type: 'insurance' | 'license' | 'medical' | 'financial' | 'legal' | 'other';
  file: File | null;
  url?: string;
  isLocked: boolean;
  sharedWith: string[]; // provider IDs
  uploadedAt: Date;
  size: number;
  category: string;
}

interface DocumentCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

const documentCategories: DocumentCategory[] = [
  {
    id: 'insurance',
    name: 'Insurance',
    icon: '🛡️',
    color: 'from-blue-500 to-cyan-500',
    description: 'Health insurance cards, policies, claims'
  },
  {
    id: 'license',
    name: 'ID & License',
    icon: '🪪',
    color: 'from-green-500 to-emerald-500',
    description: 'Driver\'s license, passport, government ID'
  },
  {
    id: 'medical',
    name: 'Medical Records',
    icon: '🏥',
    color: 'from-red-500 to-pink-500',
    description: 'Medical history, test results, records'
  },
  {
    id: 'financial',
    name: 'Financial',
    icon: '💰',
    color: 'from-yellow-500 to-orange-500',
    description: 'Banking info, payment methods, financial docs'
  },
  {
    id: 'legal',
    name: 'Legal Documents',
    icon: '⚖️',
    color: 'from-purple-500 to-indigo-500',
    description: 'Wills, powers of attorney, legal agreements'
  },
  {
    id: 'other',
    name: 'Other',
    icon: '📄',
    color: 'from-gray-500 to-slate-500',
    description: 'Miscellaneous important documents'
  }
];

export default function PersonalDocumentsVault() {
  const [documents, setDocuments] = useState<PersonalDocument[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PersonalDocument | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data for demonstration
  const mockDocuments: PersonalDocument[] = [
    {
      id: '1',
      name: 'Health Insurance Card',
      type: 'insurance',
      file: null,
      url: '/mock/insurance-card.pdf',
      isLocked: true,
      sharedWith: ['dr-smith', 'clinic-general'],
      uploadedAt: new Date('2024-01-15'),
      size: 245760,
      category: 'insurance'
    },
    {
      id: '2',
      name: 'Driver License',
      type: 'license',
      file: null,
      url: '/mock/drivers-license.pdf',
      isLocked: true,
      sharedWith: [],
      uploadedAt: new Date('2024-01-10'),
      size: 187650,
      category: 'license'
    },
    {
      id: '3',
      name: 'Medical History Summary',
      type: 'medical',
      file: null,
      url: '/mock/medical-history.pdf',
      isLocked: false,
      sharedWith: ['dr-smith'],
      uploadedAt: new Date('2024-01-20'),
      size: 512000,
      category: 'medical'
    }
  ];

  const [allDocuments, setAllDocuments] = useState<PersonalDocument[]>(mockDocuments);

  const filteredDocuments = allDocuments.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      const newDoc: PersonalDocument = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: getDocumentType(file.name),
        file: file,
        isLocked: true, // Default to locked
        sharedWith: [],
        uploadedAt: new Date(),
        size: file.size,
        category: getDocumentType(file.name)
      };

      setAllDocuments(prev => [...prev, newDoc]);
    });
  };

  const getDocumentType = (filename: string): PersonalDocument['type'] => {
    const lower = filename.toLowerCase();
    if (lower.includes('insurance') || lower.includes('policy')) return 'insurance';
    if (lower.includes('license') || lower.includes('id') || lower.includes('driver')) return 'license';
    if (lower.includes('medical') || lower.includes('health') || lower.includes('record')) return 'medical';
    if (lower.includes('bank') || lower.includes('financial') || lower.includes('payment')) return 'financial';
    if (lower.includes('legal') || lower.includes('will') || lower.includes('attorney')) return 'legal';
    return 'other';
  };

  const toggleLock = (docId: string) => {
    setAllDocuments(prev => prev.map(doc =>
      doc.id === docId ? { ...doc, isLocked: !doc.isLocked } : doc
    ));
  };

  const deleteDocument = (docId: string) => {
    setAllDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const shareDocument = (docId: string, providerId: string) => {
    setAllDocuments(prev => prev.map(doc =>
      doc.id === docId
        ? { ...doc, sharedWith: [...doc.sharedWith, providerId] }
        : doc
    ));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryInfo = (categoryId: string) => {
    return documentCategories.find(cat => cat.id === categoryId) || documentCategories[5];
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Personal Documents Vault
              </h1>
              <p className="text-gray-400">
                Securely store, organize, and share your important personal documents
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <span className="text-green-400 text-sm font-medium">
                  🔒 Encrypted & Secure
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Total Documents</p>
                  <p className="text-2xl font-bold text-white">{allDocuments.length}</p>
                </div>
                <div className="text-2xl">📄</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Locked</p>
                  <p className="text-2xl font-bold text-white">
                    {allDocuments.filter(d => d.isLocked).length}
                  </p>
                </div>
                <div className="text-2xl">🔒</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Shared</p>
                  <p className="text-2xl font-bold text-white">
                    {allDocuments.reduce((acc, doc) => acc + doc.sharedWith.length, 0)}
                  </p>
                </div>
                <div className="text-2xl">📤</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-400 text-sm font-medium">Storage Used</p>
                  <p className="text-2xl font-bold text-white">
                    {formatFileSize(allDocuments.reduce((acc, doc) => acc + doc.size, 0))}
                  </p>
                </div>
                <div className="text-2xl">💾</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500 transition"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition"
            >
              <option value="all">All Categories</option>
              {documentCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
              Upload
            </button>
          </div>
        </div>

        {/* Document Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {documentCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-xl border transition-all ${
                selectedCategory === category.id
                  ? `bg-gradient-to-br ${category.color} text-white border-transparent`
                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
              <p className="text-xs opacity-80">{category.description}</p>
            </button>
          ))}
        </div>

        {/* Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mb-8 p-8 border-2 border-dashed rounded-xl transition-all ${
            isDragging
              ? 'border-pink-500 bg-pink-500/10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
        >
          <div className="text-center">
            <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Drop files here or click to upload</h3>
            <p className="text-gray-400 mb-4">
              Support for PDF, images, and documents up to 10MB each
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Choose Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(e) => handleFiles(Array.from(e.target.files || []))}
              className="hidden"
            />
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => {
            const categoryInfo = getCategoryInfo(doc.category);

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700 p-6 hover:border-pink-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${categoryInfo.color}`}>
                      {categoryInfo.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{doc.name}</h3>
                      <p className="text-sm text-gray-400">{formatFileSize(doc.size)}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleLock(doc.id)}
                    className={`p-2 rounded-lg transition ${
                      doc.isLocked
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                  >
                    {doc.isLocked ? <FiLock className="w-4 h-4" /> : <FiUnlock className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>{doc.uploadedAt.toLocaleDateString()}</span>
                  {doc.sharedWith.length > 0 && (
                    <span className="flex items-center gap-1">
                      <FiShare2 className="w-4 h-4" />
                      {doc.sharedWith.length}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedDocument(doc)}
                    className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition flex items-center justify-center gap-2"
                  >
                    <FiEye className="w-4 h-4" />
                    View
                  </button>

                  <button
                    onClick={() => {/* Download logic */}}
                    className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
                  >
                    <FiDownload className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-16">
            <FiFile className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No documents found</h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Upload your first document to get started'
              }
            </p>
          </div>
        )}

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gray-900 rounded-lg max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Upload Document</h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Document Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Health Insurance Card"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500">
                      {documentCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Security Level</label>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition">
                        🔒 Locked (Private)
                      </button>
                      <button className="flex-1 px-3 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-600 transition">
                        🔓 Unlocked (Shareable)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition">
                    Upload Document
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Document Viewer Modal */}
        <AnimatePresence>
          {selectedDocument && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
              >
                <div className="p-6 border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{selectedDocument.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {getCategoryInfo(selectedDocument.category).name} • {formatFileSize(selectedDocument.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedDocument(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="bg-gray-800 rounded-lg p-8 text-center mb-6">
                    <FiFile className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Document preview would appear here</p>
                    <p className="text-sm text-gray-500 mt-2">
                      In production, this would display the actual document content
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition flex items-center justify-center gap-2">
                      <FiDownload className="w-4 h-4" />
                      Download
                    </button>
                    <button className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition flex items-center justify-center gap-2">
                      <FiShare2 className="w-4 h-4" />
                      Share with Provider
                    </button>
                    <button
                      onClick={() => {
                        deleteDocument(selectedDocument.id);
                        setSelectedDocument(null);
                      }}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}