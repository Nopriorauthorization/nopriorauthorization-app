import React, { useState, useCallback } from 'react';
import { useLabDocumentProcessor, type LabProcessingResult } from '@/hooks/useLabDocumentProcessor';
import HIPAAConsentModal from '@/components/HIPAAConsentModal';

interface LabDocumentUploaderProps {
  onResultsProcessed?: (results: LabProcessingResult[]) => void;
  className?: string;
}

export default function LabDocumentUploader({
  onResultsProcessed,
  className = ''
}: LabDocumentUploaderProps) {
  const {
    processLabDocuments,
    isProcessing,
    progress,
    results,
    reset,
    consentRequired,
    consentGiven,
    grantConsent,
    revokeConsent
  } = useLabDocumentProcessor();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = useCallback((files: File[]) => {
    // Filter for valid file types
    const validFiles = files.filter(file =>
      file.type.includes('pdf') ||
      file.type.includes('image/') ||
      file.name.toLowerCase().endsWith('.pdf') ||
      file.name.toLowerCase().endsWith('.jpg') ||
      file.name.toLowerCase().endsWith('.jpeg') ||
      file.name.toLowerCase().endsWith('.png')
    );

    if (validFiles.length !== files.length) {
      console.warn(`${files.length - validFiles.length} invalid files were filtered out`);
    }

    setSelectedFiles(validFiles);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleProcessClick = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    if (consentRequired && !consentGiven) {
      setShowConsentModal(true);
      return;
    }

    try {
      const processingResults = await processLabDocuments(selectedFiles);
      onResultsProcessed?.(processingResults);
    } catch (error) {
      console.error('Processing failed:', error);
      // Error is already handled in the hook
    }
  }, [selectedFiles, consentRequired, consentGiven, processLabDocuments, onResultsProcessed]);

  const handleConsentAccept = useCallback(async () => {
    grantConsent();
    setShowConsentModal(false);

    // Auto-start processing after consent
    if (selectedFiles.length > 0) {
      try {
        const processingResults = await processLabDocuments(selectedFiles);
        onResultsProcessed?.(processingResults);
      } catch (error) {
        console.error('Processing failed after consent:', error);
      }
    }
  }, [grantConsent, selectedFiles, processLabDocuments, onResultsProcessed]);

  const handleConsentDecline = useCallback(() => {
    setShowConsentModal(false);
    revokeConsent();
  }, [revokeConsent]);

  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
    reset();
  }, [reset]);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lab Document Processor</h2>
        <p className="text-gray-600">
          Upload your lab results for HIPAA-compliant analysis and insights.
          All processing happens in your browser - your data never leaves your device.
        </p>
      </div>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📄</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Drop your lab documents here
          </h3>
          <p className="text-gray-600 mb-4">
            Supports PDF files and images (JPG, PNG)
          </p>
        </div>

        <input
          type="file"
          multiple
          accept=".pdf,image/*"
          onChange={handleFileInputChange}
          disabled={isProcessing}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Choose Files
        </label>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Selected Files ({selectedFiles.length})
            </h3>
            <button
              onClick={clearFiles}
              disabled={isProcessing}
              className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {file.type.includes('pdf') ? '📄' : '🖼️'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  disabled={isProcessing}
                  className="text-gray-400 hover:text-red-500 disabled:opacity-50"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processing Progress */}
      {isProcessing && (
        <div className="mt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="font-medium text-blue-900">{progress.message}</span>
            </div>

            <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.progress}%` }}
              ></div>
            </div>

            <div className="text-sm text-blue-700">
              {progress.currentFile && (
                <span>Processing: {progress.currentFile}</span>
              )}
              {progress.totalFiles && progress.currentFileIndex && (
                <span className="ml-2">
                  ({progress.currentFileIndex} of {progress.totalFiles})
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {results.length > 0 && !isProcessing && (
        <div className="mt-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Processing Complete</h3>
            <div className="text-sm text-green-800">
              <p>
                Successfully processed {results.filter(r => r.success).length} of {results.length} documents
              </p>
              <p>
                Total lab results extracted: {results.reduce((sum, r) => sum + r.labResults.length, 0)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleProcessClick}
          disabled={selectedFiles.length === 0 || isProcessing}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
        >
          {isProcessing ? 'Processing...' : 'Process Documents'}
        </button>

        {consentGiven && (
          <button
            onClick={revokeConsent}
            disabled={isProcessing}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Revoke Consent
          </button>
        )}
      </div>

      {/* HIPAA Consent Modal */}
      <HIPAAConsentModal
        isOpen={showConsentModal}
        onAccept={handleConsentAccept}
        onDecline={handleConsentDecline}
        isProcessing={isProcessing}
      />
    </div>
  );
}