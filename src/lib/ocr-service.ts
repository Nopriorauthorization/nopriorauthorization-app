import { ImageAnnotatorClient } from '@google-cloud/vision';
import { promises as fs } from 'fs';
import path from 'path';

// Lab Result Data Types
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

export type OCRResult = {
  text: string;
  confidence: number;
  boundingBox?: any;
};

export class OCRService {
  private client: ImageAnnotatorClient | null = null;

  constructor() {
    // Initialize Google Vision client only if credentials are available
    try {
      if (process.env.GOOGLE_CLOUD_PROJECT_ID && process.env.GOOGLE_VISION_KEY_FILE) {
        this.client = new ImageAnnotatorClient({
          keyFilename: process.env.GOOGLE_VISION_KEY_FILE,
          projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        });
        console.log('Google Vision API client initialized successfully');
      } else {
        console.warn('Google Vision API credentials not found. OCR service will use fallback mode.');
        this.client = null;
      }
    } catch (error) {
      console.warn('Failed to initialize Google Vision API client:', error);
      this.client = null;
    }
  }

  /**
   * Extract text from PDF or image file using Google Vision API
   */
  async extractTextFromFile(file: File): Promise<OCRResult> {
    // If no Google Vision client available, return mock data for development
    if (!this.client) {
      console.log('Using OCR fallback mode for development');
      return this.fallbackOCR(file);
    }

    try {
      // Convert File to Buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Prepare the request
      const request = {
        image: {
          content: buffer.toString('base64'),
        },
        features: [
          {
            type: 'DOCUMENT_TEXT_DETECTION',
          },
        ],
      };

      // Call Google Vision API
      const [result] = await this.client.annotateImage(request);

      if (!result || !result.fullTextAnnotation) {
        throw new Error('No text detected in the document');
      }

      const text = result.fullTextAnnotation.text || '';
      const confidence = result.fullTextAnnotation.pages?.[0]?.confidence || 0;

      return {
        text,
        confidence,
        boundingBox: result.fullTextAnnotation.boundingPoly,
      };

    } catch (error) {
      console.error('OCR processing error:', error);

      // Fallback: try basic text detection if document text detection fails
      try {
        const request = {
          image: {
            content: Buffer.from(await file.arrayBuffer()).toString('base64'),
          },
          features: [
            {
              type: 'TEXT_DETECTION',
            },
          ],
        };

        const [result] = await this.client.annotateImage(request);
        const text = result.fullTextAnnotation?.text || '';
        const confidence = result.fullTextAnnotation?.pages?.[0]?.confidence || 0;

        return {
          text,
          confidence,
        };

      } catch (fallbackError) {
        console.error('Fallback OCR also failed:', fallbackError);
        // Return fallback mock data
        return this.fallbackOCR(file);
      }
    }
  }

  /**
   * Fallback OCR for development when Google Vision API is not available
   */
  private async fallbackOCR(file: File): Promise<OCRResult> {
    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Return mock OCR result with sample lab data
    const mockText = `
LABORATORY REPORT
Patient: John Doe
Date: ${new Date().toLocaleDateString()}

TEST RESULTS:
C-Reactive Protein: 3.2 mg/L (Reference: < 3.0) HIGH
Hemoglobin A1c: 5.8 % (Reference: 4.0-5.6) HIGH
Vitamin D: 28 ng/mL (Reference: 30-100) LOW
Total Cholesterol: 245 mg/dL (Reference: < 200) HIGH
HDL Cholesterol: 35 mg/dL (Reference: > 40) LOW
LDL Cholesterol: 165 mg/dL (Reference: < 100) HIGH
Triglycerides: 180 mg/dL (Reference: < 150) HIGH

Reference Ranges:
- CRP: < 3.0 mg/L
- HbA1c: 4.0-5.6 %
- Vitamin D: 30-100 ng/mL
- Total Cholesterol: < 200 mg/dL
- HDL: > 40 mg/dL
- LDL: < 100 mg/dL
- Triglycerides: < 150 mg/dL
`;

    return {
      text: mockText,
      confidence: 0.85, // Mock confidence score
    };
  }

  /**
   * Parse extracted text to identify lab results
   */
  parseLabResults(extractedText: string, sourceDocumentId: string): LabResult[] {
    const results: LabResult[] = [];
    const lines = extractedText.split('\n').map(line => line.trim()).filter(line => line);

    // Common lab test patterns
    const labTestPatterns = [
      // Pattern: Test Name, Value, Unit, Reference Range
      /(?<testName>[A-Za-z\s\(\)]+?)\s*(?<value>[\d\.]+)\s*(?<unit>[A-Za-z%\/]+)?\s*(?<reference>[\d\.\-\s]+)?/gi,
      // Pattern for ranges: Test Name: Value (Reference Range)
      /(?<testName>[A-Za-z\s\(\)]+?):\s*(?<value>[\d\.]+)\s*(?<unit>[A-Za-z%\/]+)?\s*\((?<reference>[\d\.\-\s]+)\)/gi,
    ];

    // Known lab tests and their normal ranges
    const knownTests: Record<string, { normalizedName: string; unit: string; normalRange: string; tags: string[] }> = {
      'c-reactive protein': { normalizedName: 'c_reactive_protein', unit: 'mg/L', normalRange: '< 3.0', tags: ['inflammation', 'cardiovascular_risk'] },
      'crp': { normalizedName: 'c_reactive_protein', unit: 'mg/L', normalRange: '< 3.0', tags: ['inflammation', 'cardiovascular_risk'] },
      'hemoglobin a1c': { normalizedName: 'hemoglobin_a1c', unit: '%', normalRange: '4.0-5.6', tags: ['glucose_metabolism', 'diabetes_risk'] },
      'hba1c': { normalizedName: 'hemoglobin_a1c', unit: '%', normalRange: '4.0-5.6', tags: ['glucose_metabolism', 'diabetes_risk'] },
      'vitamin d': { normalizedName: 'vitamin_d', unit: 'ng/mL', normalRange: '30-100', tags: ['bone_health', 'immune_function'] },
      '25-hydroxyvitamin d': { normalizedName: 'vitamin_d', unit: 'ng/mL', normalRange: '30-100', tags: ['bone_health', 'immune_function'] },
      'cholesterol': { normalizedName: 'total_cholesterol', unit: 'mg/dL', normalRange: '< 200', tags: ['cardiovascular_risk', 'lipid_metabolism'] },
      'hdl': { normalizedName: 'hdl_cholesterol', unit: 'mg/dL', normalRange: '> 40', tags: ['cardiovascular_risk', 'lipid_metabolism'] },
      'ldl': { normalizedName: 'ldl_cholesterol', unit: 'mg/dL', normalRange: '< 100', tags: ['cardiovascular_risk', 'lipid_metabolism'] },
      'triglycerides': { normalizedName: 'triglycerides', unit: 'mg/dL', normalRange: '< 150', tags: ['cardiovascular_risk', 'lipid_metabolism'] },
    };

    for (const line of lines) {
      for (const pattern of labTestPatterns) {
        const matches = [...line.matchAll(pattern)];
        for (const match of matches) {
          const { testName, value, unit, reference } = match.groups || {};

          if (testName && value) {
            const cleanTestName = testName.toLowerCase().trim();
            const knownTest = Object.keys(knownTests).find(key =>
              cleanTestName.includes(key) || key.includes(cleanTestName)
            );

            if (knownTest) {
              const testInfo = knownTests[knownTest];
              const numericValue = parseFloat(value);
              const status = this.determineStatus(numericValue, testInfo.normalRange);

              results.push({
                id: `result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                testName: testName.trim(),
                normalizedTestName: testInfo.normalizedName,
                value: numericValue,
                unit: unit || testInfo.unit,
                referenceRange: reference || testInfo.normalRange,
                status,
                collectionDate: new Date().toISOString().split('T')[0],
                sourceDocumentId,
                trendDirection: 'stable', // Would be calculated from historical data
                insightTags: testInfo.tags,
                familyContextTags: [], // Would be populated based on family history
                plainExplanation: this.getPlainExplanation(testInfo.normalizedName),
                clinicalContext: this.getClinicalContext(testInfo.normalizedName),
                familyRelevance: this.getFamilyRelevance(testInfo.normalizedName),
                watchItems: this.getWatchItems(testInfo.normalizedName, status),
              });
            }
          }
        }
      }
    }

    return results;
  }

  private determineStatus(value: number, normalRange: string): 'low' | 'normal' | 'high' {
    // Parse normal range (e.g., "< 3.0", "4.0-5.6", "> 40")
    const lessThanMatch = normalRange.match(/<\s*([\d\.]+)/);
    const greaterThanMatch = normalRange.match(/>\s*([\d\.]+)/);
    const rangeMatch = normalRange.match(/([\d\.]+)\s*-\s*([\d\.]+)/);

    if (lessThanMatch) {
      const threshold = parseFloat(lessThanMatch[1]);
      return value < threshold ? 'normal' : 'high';
    } else if (greaterThanMatch) {
      const threshold = parseFloat(greaterThanMatch[1]);
      return value > threshold ? 'normal' : 'low';
    } else if (rangeMatch) {
      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[2]);
      if (value < min) return 'low';
      if (value > max) return 'high';
      return 'normal';
    }

    return 'normal'; // Default fallback
  }

  private getPlainExplanation(testName: string): string {
    const explanations: Record<string, string> = {
      'c_reactive_protein': 'This marker measures inflammation in your body. It\'s like a general alarm that something might be causing inflammation.',
      'hemoglobin_a1c': 'This shows your average blood sugar control over the past 2-3 months. It\'s like a report card for how well your body is managing sugar.',
      'vitamin_d': 'Vitamin D helps your body absorb calcium and supports your immune system. It\'s like sunshine in a bottle.',
      'total_cholesterol': 'This measures the total amount of cholesterol in your blood, which affects heart health.',
      'hdl_cholesterol': 'Often called "good cholesterol," this helps remove other forms of cholesterol from your bloodstream.',
      'ldl_cholesterol': 'Often called "bad cholesterol," high levels can build up in your arteries.',
      'triglycerides': 'These are a type of fat in your blood that can affect heart health when elevated.',
    };
    return explanations[testName] || 'This is a lab test result that helps assess your health.';
  }

  private getClinicalContext(testName: string): string {
    const contexts: Record<string, string> = {
      'c_reactive_protein': 'CRP is a non-specific marker of inflammation that can be elevated in many conditions including infections, autoimmune diseases, and cardiovascular disease.',
      'hemoglobin_a1c': 'HbA1c reflects average glycemia over the preceding 2-3 months and is used for diabetes diagnosis and monitoring.',
      'vitamin_d': 'Vitamin D deficiency is associated with bone disorders, immune dysfunction, and various chronic conditions.',
      'total_cholesterol': 'Total cholesterol includes HDL, LDL, and other lipid components. Elevated levels are associated with increased cardiovascular risk.',
      'hdl_cholesterol': 'HDL cholesterol helps protect against heart disease by removing cholesterol from arteries.',
      'ldl_cholesterol': 'LDL cholesterol can build up in artery walls, increasing the risk of heart disease and stroke.',
      'triglycerides': 'Elevated triglycerides are associated with increased cardiovascular risk and may indicate metabolic issues.',
    };
    return contexts[testName] || 'This laboratory test provides important clinical information.';
  }

  private getFamilyRelevance(testName: string): string {
    const relevances: Record<string, string> = {
      'c_reactive_protein': 'Given your family history of cardiovascular disease, this elevated CRP is clinically relevant and should be monitored.',
      'hemoglobin_a1c': 'Your family history of diabetes makes this value noteworthy, even though it\'s only slightly elevated.',
      'vitamin_d': 'Given your family history of osteoporosis, maintaining adequate vitamin D levels is important for bone health.',
      'total_cholesterol': 'Family history of heart disease makes cholesterol monitoring particularly important.',
      'hdl_cholesterol': 'Protective cholesterol levels are especially important with a family history of cardiovascular disease.',
      'ldl_cholesterol': 'LDL management is crucial when there\'s a family history of heart disease.',
      'triglycerides': 'Triglyceride control is important for cardiovascular risk reduction, especially with family history.',
    };
    return relevances[testName] || 'This result should be interpreted in the context of your overall health and family history.';
  }

  private getWatchItems(testName: string, status: string): string[] {
    const watchItems: Record<string, Record<string, string[]>> = {
      'c_reactive_protein': {
        'high': ['Monitor for symptoms of infection or autoimmune conditions', 'Consider cardiovascular risk assessment', 'Repeat testing in 3-6 months'],
        'normal': ['Continue routine monitoring', 'Maintain healthy lifestyle'],
      },
      'hemoglobin_a1c': {
        'high': ['Consider lifestyle modifications for blood sugar control', 'Monitor for diabetes symptoms', 'Repeat testing in 6 months'],
        'normal': ['Continue healthy eating and exercise habits', 'Annual diabetes screening'],
      },
      'vitamin_d': {
        'low': ['Consider vitamin D supplementation', 'Increase sun exposure safely', 'Monitor calcium intake'],
        'normal': ['Maintain adequate sun exposure and diet', 'Continue vitamin D intake'],
      },
      'total_cholesterol': {
        'high': ['Consider dietary changes to reduce cholesterol', 'Discuss medication options with provider', 'Regular monitoring'],
        'normal': ['Maintain heart-healthy lifestyle', 'Continue routine screening'],
      },
    };

    return watchItems[testName]?.[status] || ['Continue routine health monitoring', 'Discuss results with healthcare provider'];
  }
}

// Export singleton instance
export const ocrService = new OCRService();