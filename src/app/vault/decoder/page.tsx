"use client";

import React, { useState, useEffect, useRef } from "react";
import { DocumentCategory } from "@prisma/client";

type DecodedDocument = {
  id: string;
  title: string;
  category: string;
  docDate: string | null;
  createdAt: string;
  hasDecoded: boolean;
  termCount: number;
};

type DecodeResult = {
  id: string;
  summary: string;
  keyTerms: Array<{
    term: string;
    definition: string;
    category: string;
  }>;
  questions: string[];
  nextSteps: string[];
  safetyNote: string;
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

export default function TreatmentDecoderPage() {
  const [state, setState] = useState<DecoderState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DocumentCategory>(DocumentCategory.OTHER);
  const [docDate, setDocDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [decodeResult, setDecodeResult] = useState<DecodeResult | null>(null);
  const [recentDocuments, setRecentDocuments] = useState<DecodedDocument[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load recently decoded documents on mount
  useEffect(() => {
    loadRecentDocuments();
  }, []);

  const loadRecentDocuments = async () => {
    try {
      setIsLoadingRecent(true);
      const response = await fetch("/api/documents?decoded=true&limit=10");
      if (response.ok) {
        const data = await response.json();
        setRecentDocuments(data.documents || []);
      }
    } catch (err) {
      console.error("Failed to load recent documents:", err);
    } finally {
      setIsLoadingRecent(false);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF, PNG, or JPG file");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size must be under ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      return;
    }

    setSelectedFile(file);
    setTitle(file.name);
    setState("fileSelected");
    setError(null);
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };

  const handleDecode = async () => {
    if (!selectedFile) return;

    try {
      setState("uploading");
      setError(null);

      // Upload the document
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", title || selectedFile.name);
      formData.append("category", category);
      if (docDate) {
        formData.append("docDate", docDate);
      }

      const uploadResponse = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Failed to upload document");
      }

      const uploadData = await uploadResponse.json();
      const documentId = uploadData.document.id;
      setCurrentDocumentId(documentId);

      // Now decode it
      setState("decoding");
      const decodeResponse = await fetch("/api/decoder/decode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentId }),
      });

      if (!decodeResponse.ok) {
        const errorData = await decodeResponse.json();
        throw new Error(errorData.error || "Failed to decode document");
      }

      const decodeData = await decodeResponse.json();
      setDecodeResult(decodeData.decode);
      setState("results");
      
      // Reload recent documents
      loadRecentDocuments();
    } catch (err) {
      console.error("Decode error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setState("error");
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setTitle("");
    setCategory(DocumentCategory.OTHER);
    setDocDate("");
    setError(null);
    setDecodeResult(null);
    setCurrentDocumentId(null);
    setState("idle");
  };

  const handleViewDocument = async (documentId: string) => {
    try {
      setState("decoding");
      const response = await fetch(`/api/documents/${documentId}/decode`);
      
      if (!response.ok) {
        throw new Error("Failed to load document");
      }

      const data = await response.json();
      setDecodeResult(data.decode);
      setCurrentDocumentId(documentId);
      setState("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load document");
      setState("error");
    }
  };

  const handleSaveToBlueprint = async () => {
    // TODO: Implement Blueprint integration
    alert("Save to Blueprint coming soon!");
  };

  const handleAddToProviderPacket = async () => {
    // TODO: Implement Provider Packet integration
    alert("Add to Provider Packet coming soon!");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🏥 Treatment Decoder</h1>
          <p className="text-gray-400">
            Upload your medical documents and get them decoded into plain English
          </p>
        </div>

        {/* Upload Section */}
        {(state === "idle" || state === "fileSelected" || state === "error") && (
          <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl border border-white/20 p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Upload Document</h2>

            {/* File input (hidden) */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            {/* Camera input (hidden, mobile only) */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            {!selectedFile ? (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={handleChooseFile}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition"
                  >
                    📁 Choose File
                  </button>
                  <button
                    onClick={handleTakePhoto}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition"
                  >
                    📷 Take Photo
                  </button>
                </div>
                <p className="text-sm text-gray-400 text-center">
                  Accepts PDF, JPG, or PNG (max 20MB)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* File info */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{selectedFile.name}</span>
                    <button
                      onClick={handleReset}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="text-sm text-gray-400">
                    {selectedFile.type} • {(selectedFile.size / 1024).toFixed(1)} KB
                  </div>
                </div>

                {/* Optional fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Title (optional)
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter document title..."
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-pink-500"
                    >
                      <option value={DocumentCategory.OTHER}>Other</option>
                      <option value={DocumentCategory.LAB}>Lab Result</option>
                      <option value={DocumentCategory.IMAGING}>Imaging</option>
                      <option value={DocumentCategory.VISIT_NOTE}>Visit Note</option>
                      <option value={DocumentCategory.DISCHARGE}>Discharge Summary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Document Date (optional)
                    </label>
                    <input
                      type="date"
                      value={docDate}
                      onChange={(e) => setDocDate(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                {/* Decode button */}
                <button
                  onClick={handleDecode}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition"
                >
                  🔍 Decode Document
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Loading States */}
        {(state === "uploading" || state === "decoding") && (
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-white/20 p-8 mb-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mb-4"></div>
              <h2 className="text-2xl font-semibold mb-2">
                {state === "uploading" ? "Uploading Document..." : "Decoding Document..."}
              </h2>
              <p className="text-gray-400">
                {state === "uploading"
                  ? "Securely uploading your document to private storage"
                  : "Extracting text and analyzing with AI... This may take 30-60 seconds"}
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {state === "results" && decodeResult && (
          <div className="space-y-6 mb-8">
            {/* Summary */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30 p-6">
              <h2 className="text-2xl font-semibold mb-4">📋 Plain-English Summary</h2>
              <p className="text-gray-200 leading-relaxed">{decodeResult.summary}</p>
            </div>

            {/* Key Terms */}
            <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-xl border border-orange-500/30 p-6">
              <h2 className="text-2xl font-semibold mb-4">🔑 Key Terms Explained</h2>
              <div className="space-y-4">
                {decodeResult.keyTerms.map((term, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-orange-300">{term.term}</span>
                      <span className="text-xs px-2 py-1 bg-orange-500/20 rounded text-orange-300">
                        {term.category}
                      </span>
                    </div>
                    <p className="text-gray-300">{term.definition}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/30 p-6">
              <h2 className="text-2xl font-semibold mb-4">❓ Questions to Ask Your Provider</h2>
              <ul className="space-y-3">
                {decodeResult.questions.map((question, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-blue-400 mt-1">{idx + 1}.</span>
                    <span className="text-gray-200">{question}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30 p-6">
              <h2 className="text-2xl font-semibold mb-4">✅ What to Do Next</h2>
              <ul className="space-y-3">
                {decodeResult.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-purple-400">✓</span>
                    <span className="text-gray-200">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety Note */}
            {decodeResult.safetyNote && (
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/30 p-6">
                <h2 className="text-2xl font-semibold mb-4">⚠️ Important Safety Note</h2>
                <p className="text-gray-200 leading-relaxed">{decodeResult.safetyNote}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSaveToBlueprint}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition"
              >
                💾 Save to Blueprint
              </button>
              <button
                onClick={handleAddToProviderPacket}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition"
              >
                📦 Add to Provider Packet
              </button>
            </div>

            <button
              onClick={handleReset}
              className="w-full px-6 py-3 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition"
            >
              ← Decode Another Document
            </button>
          </div>
        )}

        {/* How It Works */}
        <div className="mb-8 bg-white/5 rounded-xl border border-white/10 p-6">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">📤</div>
              <h3 className="font-semibold mb-2">1. Upload</h3>
              <p className="text-sm text-gray-400">
                Choose a PDF or take a photo of your medical document
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-semibold mb-2">2. AI Analysis</h3>
              <p className="text-sm text-gray-400">
                Our AI extracts text and translates medical jargon into plain English
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">✨</div>
              <h3 className="font-semibold mb-2">3. Get Insights</h3>
              <p className="text-sm text-gray-400">
                Receive a summary, term definitions, questions, and next steps
              </p>
            </div>
          </div>
        </div>

        {/* Recently Decoded Documents */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h2 className="text-2xl font-semibold mb-4">📚 Recently Decoded Documents</h2>
          
          {isLoadingRecent ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : recentDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No decoded documents yet. Upload your first document above!
            </div>
          ) : (
            <div className="space-y-3">
              {recentDocuments.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => handleViewDocument(doc.id)}
                  className="w-full text-left bg-white/5 hover:bg-white/10 rounded-lg p-4 border border-white/10 hover:border-pink-500/50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{doc.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span>{doc.category}</span>
                        <span>•</span>
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                        {doc.termCount > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-orange-400">{doc.termCount} terms decoded</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-pink-400">→</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
