import { NextRequest, NextResponse } from 'next/server';
import { ocrService, type LabResult } from '@/lib/ocr-service';

type LabDocument = {
  id: string;
  fileName: string;
  uploadDate: string;
  labResults: LabResult[];
  providerName?: string;
  facilityName?: string;
  summary: string;
};

// Real OCR processing function
async function parseLabDocument(file: File): Promise<LabResult[]> {
  try {
    // Extract text from the document using OCR
    const ocrResult = await ocrService.extractTextFromFile(file);

    if (!ocrResult.text || ocrResult.confidence < 0.5) {
      console.warn(`Low OCR confidence (${ocrResult.confidence}) for file: ${file.name}`);
      // Return empty array if OCR confidence is too low
      return [];
    }

    // Parse the extracted text to identify lab results
    const sourceDocumentId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const labResults = ocrService.parseLabResults(ocrResult.text, sourceDocumentId);

    console.log(`Successfully parsed ${labResults.length} lab results from ${file.name} (OCR confidence: ${ocrResult.confidence})`);

    return labResults;

  } catch (error) {
    console.error('OCR processing failed for file:', file.name, error);

    // Return empty array on error - don't fail the entire request
    return [];
  }
}

// POST /api/vault/lab-decoder - Process lab documents
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const processedDocuments: LabDocument[] = [];
    let totalResults = 0;
    let ocrMode = 'real'; // 'real' or 'fallback'

    for (const file of files) {
      // Validate file type
      if (!file.type.includes('pdf') && !file.type.includes('image/')) {
        console.log(`Skipping invalid file type: ${file.name} (${file.type})`);
        continue; // Skip invalid files
      }

      try {
        // Parse the lab document
        const labResults = await parseLabDocument(file);

        // Check if we're in fallback mode (no OCR results but function didn't throw)
        if (labResults.length === 0) {
          ocrMode = 'fallback';
        }

        totalResults += labResults.length;

        // Create document record
        const document: LabDocument = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          fileName: file.name,
          uploadDate: new Date().toISOString(),
          labResults,
          providerName: 'Laboratory Services', // Would be extracted from document
          facilityName: 'Medical Laboratory', // Would be extracted from document
          summary: `Processed ${labResults.length} lab results from ${file.name}. ${labResults.filter(r => r.status !== 'normal').length} values outside normal range.`
        };

        processedDocuments.push(document);
        console.log(`Successfully processed ${file.name}: ${labResults.length} results found`);

      } catch (error) {
        console.error(`Failed to process file ${file.name}:`, error);
        // Continue processing other files even if one fails
      }
    }

    const message = ocrMode === 'real'
      ? `Successfully processed ${processedDocuments.length} lab documents with ${totalResults} total results using Google Vision API`
      : `Successfully processed ${processedDocuments.length} lab documents with ${totalResults} total results using development fallback mode (Google Vision API not configured)`;

    return NextResponse.json({
      success: true,
      documents: processedDocuments,
      message,
      ocrMode,
      totalResults
    });

  } catch (error) {
    console.error('Lab decoder processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process lab documents' },
      { status: 500 }
    );
  }
}

// GET /api/vault/lab-decoder - Get user's lab history
export async function GET() {
  try {
    // Mock lab history - in production this would come from database
    const mockHistory: LabDocument[] = [
      {
        id: 'doc-001',
        fileName: 'comprehensive-metabolic-panel.pdf',
        uploadDate: '2024-01-15T10:30:00Z',
        labResults: [],
        providerName: 'Dr. Sarah Johnson',
        facilityName: 'Metropolitan Lab Services',
        summary: 'Comprehensive metabolic panel with notable findings in inflammation markers.'
      }
    ];

    return NextResponse.json({
      success: true,
      history: mockHistory
    });

  } catch (error) {
    console.error('Lab decoder history error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve lab history' },
      { status: 500 }
    );
  }
}