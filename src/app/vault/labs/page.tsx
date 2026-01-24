"use client";
export const dynamic = 'force-dynamic';
import React, { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiUpload,
  FiFile,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrendingUp,
  FiArrowRight,
  FiShield,
  FiActivity
} from 'react-icons/fi';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useSubscription } from '@/hooks/useSubscription';
import { getMaxLabHistory } from '@/lib/subscription';
import { UpgradePrompt } from '@/components/subscription/UpgradePrompt';

type LabResult = {
  id: string;
  labType: string;
  date: string;
  keyFindings: string[];
  flaggedValues: Array<{
    test: string;
    value: string;
    range: string;
    status: 'normal' | 'high' | 'low' | 'critical';
  }>;
  confidenceLevel: number;
  summary: string;
  recommendations: string[];
  createdAt: string;
};

type DecoderState =
  | "idle"
  | "fileSelected"
  | "uploading"
  | "decoding"
  | "results"
  | "error";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export default function LabsPage() {
  const [state, setState] = useState<DecoderState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [labDate, setLabDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentLabId, setCurrentLabId] = useState<string | null>(null);
  const [labResult, setLabResult] = useState<LabResult | null>(null);
  const [recentLabs, setRecentLabs] = useState<LabResult[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { tier, isLoading: subscriptionLoading } = useSubscription();

  // Load recent lab results
  useEffect(() => {
    loadRecentLabs();
  }, []);

  const loadRecentLabs = async () => {
    try {
      setIsLoadingRecent(true);
      // This would load from your vault lab results API
      // For now, we'll simulate with empty array
      setRecentLabs([]);
    } catch (error) {
      console.error('Error loading recent labs:', error);
    } finally {
      setIsLoadingRecent(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 20MB");
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF or image file");
      return;
    }

    setSelectedFile(file);
    setTitle(file.name.replace(/\.[^/.]+$/, ""));
    setState("fileSelected");
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setState("uploading");
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title);
      formData.append('labDate', labDate);
      formData.append('type', 'lab-result');

      const response = await fetch('/api/vault/lab-decoder/upload-results', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setCurrentLabId(result.id);
      setState("decoding");

      // Start decoding process
      await handleDecode(result.id);

    } catch (error) {
      console.error('Upload error:', error);
      setError("Failed to upload lab results. Please try again.");
      setState("error");
    }
  };

  const handleDecode = async (labId: string) => {
    try {
      const response = await fetch('/api/vault/lab-decoder/decode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labId }),
      });

      if (!response.ok) {
        throw new Error('Decoding failed');
      }

      const result = await response.json();

      // Save metadata to vault context
      await saveLabMetadata(result);

      setLabResult(result);
      setState("results");

    } catch (error) {
      console.error('Decode error:', error);
      setError("Failed to decode lab results. Please try again.");
      setState("error");
    }
  };

  const saveLabMetadata = async (result: LabResult) => {
    try {
      await fetch('/api/vault/labs/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          labId: result.id,
          labType: result.labType,
          date: result.date,
          keyFindings: result.keyFindings,
          flaggedValues: result.flaggedValues,
          confidenceLevel: result.confidenceLevel
        }),
      });
    } catch (error) {
      console.error('Error saving lab metadata:', error);
    }
  };

  const resetForm = () => {
    setState("idle");
    setSelectedFile(null);
    setTitle("");
    setLabDate("");
    setError(null);
    setCurrentLabId(null);
    setLabResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-400';
      case 'high': return 'text-yellow-400';
      case 'low': return 'text-blue-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <FiCheckCircle className="w-4 h-4 text-green-400" />;
      case 'critical': return <FiAlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <FiTrendingUp className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumb className="mb-6" />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Lab Decoder
              </h1>
              <p className="text-gray-400">
                Upload your lab results and get AI-powered analysis in plain language
              </p>
              <p className="text-sm text-cyan-400 mt-2">
                📊 This feeds your Health Blueprint with structured lab data
              </p>
            </div>

            <div className="hidden md:block">
              <Image
                src="/mascots/LABDECODERMASCOT.PNG"
                alt="Lab Decoder Mascot"
                width={120}
                height={120}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 p-8"
            >
              {state === "idle" && (
                <div className="text-center">
                  <div className="mb-6">
                    <FiUpload className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Upload Lab Results</h2>
                    <p className="text-gray-400">PDF files, images, or lab reports up to 20MB</p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="lab-file-input"
                  />

                  <label
                    htmlFor="lab-file-input"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all cursor-pointer"
                  >
                    <FiFile className="w-5 h-5" />
                    Choose Lab File
                  </label>
                </div>
              )}

              {state === "fileSelected" && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <FiFile className="w-8 h-8 text-cyan-400" />
                    <div className="flex-1">
                      <p className="font-semibold">{selectedFile?.name}</p>
                      <p className="text-sm text-gray-400">
                        {(selectedFile?.size ? (selectedFile.size / 1024 / 1024).toFixed(1) : 0)} MB
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Lab Report Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        placeholder="e.g., Comprehensive Metabolic Panel"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Lab Date</label>
                      <input
                        type="date"
                        value={labDate}
                        onChange={(e) => setLabDate(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleUpload}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition"
                    >
                      Decode Lab Results
                    </button>
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 border border-gray-600 rounded-lg text-gray-400 hover:text-white transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {(state === "uploading" || state === "decoding") && (
                <div className="text-center">
                  <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-lg font-semibold">
                    {state === "uploading" ? "Uploading lab results..." : "Analyzing your labs..."}
                  </p>
                  <p className="text-gray-400 mt-2">
                    This may take a moment as we process your results
                  </p>
                </div>
              )}

              {state === "error" && (
                <div className="text-center">
                  <FiAlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Decoding Failed</h2>
                  <p className="text-gray-400 mb-6">{error}</p>
                  <button
                    onClick={resetForm}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            {state === "results" && labResult && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FiCheckCircle className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold text-green-400">Analysis Complete</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Lab Type</p>
                    <p className="font-semibold">{labResult.labType}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="font-semibold">{new Date(labResult.date).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Confidence</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                          style={{ width: `${labResult.confidenceLevel}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{labResult.confidenceLevel}%</span>
                    </div>
                  </div>

                  {labResult.flaggedValues.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Flagged Values</p>
                      <div className="space-y-2">
                        {labResult.flaggedValues.slice(0, 3).map((flag, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {getStatusIcon(flag.status)}
                            <span className={getStatusColor(flag.status)}>
                              {flag.test}: {flag.value} ({flag.status})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/vault/blueprint"
                  className="block w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center px-4 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition"
                >
                  View in Blueprint →
                </Link>
              </motion.div>
            )}

            {/* Recent Labs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 p-6 mt-6"
            >
              <h3 className="text-lg font-bold mb-4">Recent Lab Results</h3>

              {isLoadingRecent ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-gray-700 h-16 rounded-lg"></div>
                  ))}
                </div>
              ) : recentLabs.length > 0 ? (
                <div className="space-y-3">
                  {recentLabs.slice(0, getMaxLabHistory(tier)).map((lab) => (
                    <div key={lab.id} className="bg-gray-800/50 rounded-lg p-3">
                      <p className="font-semibold text-sm">{lab.labType}</p>
                      <p className="text-xs text-gray-400">{new Date(lab.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                  {tier === 'FREE' && recentLabs.length > getMaxLabHistory(tier) && (
                    <UpgradePrompt feature="lab_history" />
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No recent lab results</p>
              )}
            </motion.div>
          </div>
        </div>

        {/* Full Results Display */}
        {state === "results" && labResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Detailed Analysis</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Summary */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Summary</h3>
                <p className="text-gray-300 leading-relaxed">{labResult.summary}</p>
              </div>

              {/* Key Findings */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Key Findings</h3>
                <ul className="space-y-2">
                  {labResult.keyFindings.map((finding, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <FiCheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {labResult.recommendations.map((rec, index) => (
                    <div key={index} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <p className="text-blue-300">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Confirmation Message */}
        {state === "results" && labResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <FiCheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Lab Successfully Added to Your Vault
                </h3>
                <p className="text-white/80 mb-4">
                  This lab has been added to your Vault and considered in your Blueprint.
                </p>
                <button
                  onClick={() => window.location.href = '/vault/blueprint'}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 hover:text-blue-200 transition-colors text-sm font-medium"
                >
                  View how this impacts your Blueprint →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Mascot Message - Only show after results */}
        {state === "results" && labResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <Image
                src="/mascots/LABDECODERMASCOT.PNG"
                alt="Lab Decoder Mascot"
                width={48}
                height={48}
                className="rounded-lg flex-shrink-0"
              />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-purple-300 mb-1">Beau-Tox</h4>
                <p className="text-white/90 text-sm leading-relaxed">
                  Great work! I've analyzed your lab results and added them to your Health Blueprint.
                  Your insights are now personalized and ready to help guide your health decisions.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}