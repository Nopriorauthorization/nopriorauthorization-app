import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db';
import { type LabResult } from '@/lib/client-ocr-service';

type ProcessedResult = {
  documentId: string;
  fileName: string;
  labResults: LabResult[];
  ocrConfidence: number;
  processingTime: number;
};

type UploadRequest = {
  results: ProcessedResult[];
};

// POST /api/vault/lab-decoder/upload-results - Store processed lab results
export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { results }: UploadRequest = await request.json();

    if (!results || !Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        { error: 'No results provided' },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const savedDocuments = [];

    // Process each result
    for (const result of results) {
      try {
        // Create lab document record
        const labDocument = await prisma.labDocument.create({
          data: {
            id: result.documentId,
            userId,
            fileName: result.fileName,
            ocrConfidence: result.ocrConfidence,
            processingTime: result.processingTime,
            labResults: {
              create: result.labResults.map(labResult => ({
                id: labResult.id,
                testName: labResult.testName,
                normalizedTestName: labResult.normalizedTestName,
                value: typeof labResult.value === 'number' ? labResult.value : parseFloat(labResult.value.toString()),
                unit: labResult.unit,
                referenceRange: labResult.referenceRange,
                status: labResult.status,
                collectionDate: new Date(labResult.collectionDate),
                trendDirection: labResult.trendDirection,
                insightTags: labResult.insightTags,
                familyContextTags: labResult.familyContextTags,
                providerNote: labResult.providerNote,
                plainExplanation: labResult.plainExplanation,
                clinicalContext: labResult.clinicalContext,
                familyRelevance: labResult.familyRelevance,
                watchItems: labResult.watchItems
              }))
            }
          },
          include: {
            labResults: true
          }
        });

        savedDocuments.push({
          id: labDocument.id,
          fileName: labDocument.fileName,
          labResultsCount: labDocument.labResults.length,
          ocrConfidence: labDocument.ocrConfidence
        });

        console.log(`Saved lab document ${result.documentId} with ${result.labResults.length} results for user ${userId}`);

      } catch (error) {
        console.error(`Failed to save lab document ${result.documentId}:`, error);
        // Continue processing other documents even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully saved ${savedDocuments.length} lab documents`,
      documents: savedDocuments
    });

  } catch (error) {
    console.error('Upload results API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/vault/lab-decoder/upload-results - Get user's processed lab documents
export async function GET(request: NextRequest) {
  try {
    // Verify user authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get user's lab documents
    const labDocuments = await prisma.labDocument.findMany({
      where: { userId },
      include: {
        labResults: {
          orderBy: { collectionDate: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      documents: labDocuments
    });

  } catch (error) {
    console.error('Get lab documents API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}