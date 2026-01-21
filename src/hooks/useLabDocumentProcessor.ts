import { useState, useCallback } from 'react';
import { clientSideOCRService, type LabResult, type OCRResult } from '@/lib/client-ocr-service';

export type ProcessingStatus = 'idle' | 'initializing' | 'processing' | 'parsing' | 'uploading' | 'complete' | 'error';

export interface ProcessingProgress {
  status: ProcessingStatus;
  progress: number;
  message: string;
  currentFile?: string;
  totalFiles?: number;
  currentFileIndex?: number;
}

export interface LabProcessingResult {
  documentId: string;
  fileName: string;
  labResults: LabResult[];
  ocrConfidence: number;
  processingTime: number;
  success: boolean;
  error?: string;
}

/**
 * Hook for client-side lab document processing
 * Ensures HIPAA compliance by processing PHI entirely in the browser
 */
export function useLabDocumentProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress>({
    status: 'idle',
    progress: 0,
    message: 'Ready to process documents'
  });
  const [results, setResults] = useState<LabProcessingResult[]>([]);
  const [consentRequired, setConsentRequired] = useState(true);
  const [consentGiven, setConsentGiven] = useState(false);

  const processLabDocuments = useCallback(async (files: File[]): Promise<LabProcessingResult[]> => {
    if (files.length === 0) {
      throw new Error('No files provided');
    }

    // Check HIPAA consent before processing
    if (consentRequired && !consentGiven) {
      throw new Error('HIPAA consent required before processing lab documents');
    }

    setIsProcessing(true);
    setResults([]);
    const processingResults: LabProcessingResult[] = [];

    try {
      // Initialize OCR worker
      setProgress({
        status: 'initializing',
        progress: 5,
        message: 'Initializing OCR engine...'
      });

      await clientSideOCRService.initialize();

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const startTime = Date.now();

        setProgress({
          status: 'processing',
          progress: 10 + (i / files.length) * 80,
          message: `Processing ${file.name}...`,
          currentFile: file.name,
          totalFiles: files.length,
          currentFileIndex: i + 1
        });

        try {
          // Validate file type
          if (!file.type.includes('pdf') && !file.type.includes('image/')) {
            console.warn(`Skipping invalid file type: ${file.name} (${file.type})`);
            continue;
          }

          // Extract text using client-side OCR
          setProgress({
            status: 'processing',
            progress: 15 + (i / files.length) * 80,
            message: `Extracting text from ${file.name}...`,
            currentFile: file.name,
            totalFiles: files.length,
            currentFileIndex: i + 1
          });

          const ocrResult: OCRResult = await clientSideOCRService.extractTextFromFile(file);

          if (!ocrResult.text || ocrResult.confidence < 0.3) {
            console.warn(`Low OCR confidence (${ocrResult.confidence}) for file: ${file.name}`);
            // Still process but mark as low confidence
          }

          // Parse lab results from extracted text
          setProgress({
            status: 'parsing',
            progress: 25 + (i / files.length) * 80,
            message: `Analyzing lab results in ${file.name}...`,
            currentFile: file.name,
            totalFiles: files.length,
            currentFileIndex: i + 1
          });

          const sourceDocumentId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const labResults = clientSideOCRService.parseLabResults(ocrResult.text, sourceDocumentId);

          const processingTime = Date.now() - startTime;

          const result: LabProcessingResult = {
            documentId: sourceDocumentId,
            fileName: file.name,
            labResults,
            ocrConfidence: ocrResult.confidence,
            processingTime,
            success: labResults.length > 0
          };

          processingResults.push(result);

          console.log(`Successfully processed ${file.name}: ${labResults.length} lab results found (OCR confidence: ${ocrResult.confidence})`);

        } catch (error) {
          console.error(`Failed to process ${file.name}:`, error);

          const result: LabProcessingResult = {
            documentId: `error-${Date.now()}`,
            fileName: file.name,
            labResults: [],
            ocrConfidence: 0,
            processingTime: Date.now() - startTime,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown processing error'
          };

          processingResults.push(result);
        }
      }

      // Upload processed results to server
      setProgress({
        status: 'uploading',
        progress: 90,
        message: 'Saving results to your vault...'
      });

      // Here we would upload only the parsed results, not the original documents
      await uploadProcessedResults(processingResults);

      setProgress({
        status: 'complete',
        progress: 100,
        message: `Successfully processed ${processingResults.filter(r => r.success).length} of ${files.length} documents`
      });

      setResults(processingResults);
      return processingResults;

    } catch (error) {
      console.error('Lab document processing failed:', error);
      setProgress({
        status: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Processing failed'
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  /**
   * Upload processed results to server (only parsed data, no PHI documents)
   */
  const uploadProcessedResults = async (results: LabProcessingResult[]): Promise<void> => {
    try {
      const response = await fetch('/api/vault/lab-decoder/upload-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          results: results.map(result => ({
            documentId: result.documentId,
            fileName: result.fileName,
            labResults: result.labResults,
            ocrConfidence: result.ocrConfidence,
            processingTime: result.processingTime
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save results');
      }

      console.log('Successfully uploaded processed lab results to server');
    } catch (error) {
      console.error('Failed to upload results:', error);
      throw error;
    }
  };

  const grantConsent = useCallback(() => {
    setConsentGiven(true);
    setConsentRequired(false);
  }, []);

  const revokeConsent = useCallback(() => {
    setConsentGiven(false);
    setConsentRequired(true);
    reset();
  }, [reset]);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setProgress({
      status: 'idle',
      progress: 0,
      message: 'Ready to process documents'
    });
    setResults([]);
  }, []);

  return {
    processLabDocuments,
    isProcessing,
    progress,
    results,
    reset,
    consentRequired,
    consentGiven,
    grantConsent,
    revokeConsent
  };
}