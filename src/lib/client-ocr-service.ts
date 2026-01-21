import { createWorker, Worker } from 'tesseract.js';

export type OCRResult = {
  text: string;
  confidence: number;
  boundingBox?: any;
};

export type LabResult = {
  id: string;
  testName: string;
  normalizedTestName: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  status: 'low' | 'normal' | 'high';
  collectionDate: string;
  sourceDocumentId: string;
  trendDirection: 'up' | 'down' | 'stable';
  insightTags: string[];
  familyContextTags: string[];
  providerNote?: string;
  plainExplanation?: string;
  clinicalContext?: string;
  familyRelevance?: string;
  watchItems?: string[];
};

class ClientSideOCRService {
  private worker: Worker | null = null;
  private isInitialized = false;

  /**
   * Initialize the Tesseract worker
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.worker = await createWorker('eng');
      await this.worker.setParameters({
        tessedit_pageseg_mode: '6', // Uniform block of text
        tessedit_ocr_engine_mode: '2', // Tesseract + LSTM engine
      });
      this.isInitialized = true;
      console.log('Client-side OCR initialized successfully');
    } catch (error) {
      console.error('Failed to initialize client-side OCR:', error);
      throw error;
    }
  }

  /**
   * Extract text from image/PDF using client-side OCR
   */
  async extractTextFromFile(file: File): Promise<OCRResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.worker) {
      throw new Error('OCR worker not initialized');
    }

    try {
      // Convert file to image URL for Tesseract
      const imageUrl = URL.createObjectURL(file);

      const result = await this.worker.recognize(imageUrl);

      // Clean up the object URL
      URL.revokeObjectURL(imageUrl);

      return {
        text: result.data.text,
        confidence: result.data.confidence / 100, // Convert to 0-1 scale
        boundingBox: result.data.words?.map(word => word.bbox) || []
      };

    } catch (error) {
      console.error('Client-side OCR processing error:', error);
      throw error;
    }
  }

  /**
   * Parse lab results from extracted text
   */
  parseLabResults(text: string, sourceDocumentId: string): LabResult[] {
    const results: LabResult[] = [];
    const lines = text.split('\n').filter(line => line.trim());

    // Common lab test patterns
    const labTestPatterns = [
      // Pattern: Test Name: Value Unit (Reference Range)
      /(\w+(?:\s+\w+)*?):\s*([0-9.]+)\s*([a-zA-Z/%]+)?\s*\(?([0-9.-]+(?:\s*-\s*[0-9.-]+)?)?\)?/gi,

      // Pattern: Test Name Value Unit Reference
      /(\w+(?:\s+\w+)*?)\s+([0-9.]+)\s*([a-zA-Z/%]+)?\s+([0-9.-]+(?:\s*-\s*[0-9.-]+)?)/gi,

      // Pattern with status indicators
      /(\w+(?:\s+\w+)*?)\s+([0-9.]+)\s*([a-zA-Z/%]+)?\s*\(?([0-9.-]+(?:\s*-\s*[0-9.-]+)?)?\)?\s*(LOW|HIGH|NORMAL|ABNORMAL)?/gi
    ];

    for (const line of lines) {
      for (const pattern of labTestPatterns) {
        const matches = [...line.matchAll(pattern)];
        for (const match of matches) {
          const [, testName, value, unit, referenceRange, status] = match;

          if (testName && value) {
            // Normalize test names
            const normalizedTestName = this.normalizeTestName(testName);

            // Determine status
            const resultStatus = this.determineStatus(
              parseFloat(value),
              referenceRange,
              status
            );

            // Generate insights and context
            const insights = this.generateInsights(normalizedTestName, parseFloat(value), resultStatus);

            results.push({
              id: `${sourceDocumentId}-${results.length}`,
              testName: testName.trim(),
              normalizedTestName,
              value: parseFloat(value),
              unit: unit || '',
              referenceRange: referenceRange || '',
              status: resultStatus,
              collectionDate: new Date().toISOString().split('T')[0],
              sourceDocumentId,
              trendDirection: 'stable', // Would be calculated with historical data
              insightTags: insights.tags,
              familyContextTags: insights.familyTags,
              providerNote: insights.providerNote,
              plainExplanation: insights.explanation,
              clinicalContext: insights.clinicalContext,
              familyRelevance: insights.familyRelevance,
              watchItems: insights.watchItems
            });
          }
        }
      }
    }

    return results;
  }

  private normalizeTestName(testName: string): string {
    const normalizations: Record<string, string> = {
      'glucose': 'Glucose',
      'hba1c': 'Hemoglobin A1c',
      'hgba1c': 'Hemoglobin A1c',
      'cholesterol': 'Total Cholesterol',
      'hdl': 'HDL Cholesterol',
      'ldl': 'LDL Cholesterol',
      'triglycerides': 'Triglycerides',
      'creatinine': 'Creatinine',
      'bun': 'Blood Urea Nitrogen',
      'egfr': 'eGFR',
      'tsh': 'TSH',
      't4': 'Free T4',
      't3': 'Free T3',
      'vitamin d': 'Vitamin D',
      'b12': 'Vitamin B12',
      'iron': 'Iron',
      'ferritin': 'Ferritin',
      'cbc': 'Complete Blood Count',
      'wbc': 'White Blood Cell Count',
      'rbc': 'Red Blood Cell Count',
      'hemoglobin': 'Hemoglobin',
      'hematocrit': 'Hematocrit',
      'platelets': 'Platelet Count'
    };

    const lowerName = testName.toLowerCase().trim();
    return normalizations[lowerName] || testName;
  }

  private determineStatus(value: number, referenceRange: string, statusText?: string): 'low' | 'normal' | 'high' {
    // If explicit status is provided
    if (statusText) {
      const lowerStatus = statusText.toLowerCase();
      if (lowerStatus.includes('low')) return 'low';
      if (lowerStatus.includes('high')) return 'high';
      if (lowerStatus.includes('normal')) return 'normal';
    }

    // Parse reference range
    if (referenceRange) {
      const rangeMatch = referenceRange.match(/([0-9.-]+)\s*-\s*([0-9.-]+)/);
      if (rangeMatch) {
        const [, min, max] = rangeMatch;
        const minVal = parseFloat(min);
        const maxVal = parseFloat(max);

        if (value < minVal) return 'low';
        if (value > maxVal) return 'high';
        return 'normal';
      }
    }

    return 'normal'; // Default fallback
  }

  private generateInsights(testName: string, value: number, status: string): {
    tags: string[];
    familyTags: string[];
    providerNote?: string;
    explanation?: string;
    clinicalContext?: string;
    familyRelevance?: string;
    watchItems?: string[];
  } {
    const insights = {
      tags: [] as string[],
      familyTags: [] as string[],
      watchItems: [] as string[]
    };

    // Generate insights based on test type and results
    switch (testName.toLowerCase()) {
      case 'glucose':
        if (status === 'high') {
          insights.tags.push('diabetes-risk', 'metabolic');
          insights.familyTags.push('family-history-diabetes');
          insights.watchItems.push('Monitor blood sugar regularly', 'Consider lifestyle modifications');
        }
        break;

      case 'hemoglobin a1c':
        if (status === 'high') {
          insights.tags.push('diabetes', 'long-term-glucose');
          insights.familyTags.push('genetic-predisposition');
          insights.watchItems.push('Discuss with endocrinologist', 'Consider medication management');
        }
        break;

      case 'total cholesterol':
        if (status === 'high') {
          insights.tags.push('cardiovascular-risk', 'lipid-disorder');
          insights.familyTags.push('family-heart-disease');
          insights.watchItems.push('LDL particle testing', 'Cardiac risk assessment');
        }
        break;

      case 'creatinine':
        if (status === 'high') {
          insights.tags.push('kidney-function', 'renal');
          insights.watchItems.push('eGFR calculation', 'Urine protein testing');
        }
        break;

      case 'tsh':
        if (status !== 'normal') {
          insights.tags.push('thyroid-function', 'endocrine');
          insights.watchItems.push('Free T4 and T3 levels', 'Thyroid antibodies');
        }
        break;

      case 'vitamin d':
        if (status === 'low') {
          insights.tags.push('bone-health', 'immune-function');
          insights.watchItems.push('Calcium and phosphorus levels', 'Bone density scan if indicated');
        }
        break;
    }

    // Add status-based tags
    if (status === 'high') insights.tags.push('elevated');
    if (status === 'low') insights.tags.push('deficient');

    return insights;
  }

  /**
   * Clean up resources
   */
  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
    }
  }
}

// Export singleton instance
export const clientSideOCRService = new ClientSideOCRService();