import { NextRequest, NextResponse } from 'next/server';

// DEPRECATED: This endpoint is no longer used for document processing
// Documents are now processed client-side for HIPAA compliance
// Use /api/vault/lab-decoder/upload-results instead

// POST /api/vault/lab-decoder - DEPRECATED
// This endpoint no longer processes documents directly
export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: 'Document processing has moved to client-side for HIPAA compliance',
      message: 'Please use the client-side OCR processing and upload results via /api/vault/lab-decoder/upload-results',
      hipaaCompliant: true
    },
    { status: 410 } // Gone
  );
}

// GET /api/vault/lab-decoder - Get user's lab documents
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'Lab documents are now accessed via /api/vault/lab-decoder/upload-results',
      hipaaCompliant: true
    },
    { status: 301 } // Moved Permanently
  );
}