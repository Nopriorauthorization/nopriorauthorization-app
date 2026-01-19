import { createWorker } from "tesseract.js";
import * as pdfParse from "pdf-parse";

/**
 * Extract text from a PDF file
 * First tries native text extraction, falls back to OCR if needed
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Try using pdf-parse for native text extraction
    const data = await (pdfParse as any)(buffer);
    
    // If we got meaningful text, return it
    if (data.text && data.text.trim().length > 100) {
      return data.text;
    }
    
    // If very little text was found, the PDF might be image-based
    // Fall back to OCR
    console.warn("PDF has minimal text, falling back to OCR");
    return await extractTextFromImage(buffer);
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    // Fall back to OCR
    return await extractTextFromImage(buffer);
  }
}

/**
 * Extract text from an image using OCR
 */
export async function extractTextFromImage(buffer: Buffer): Promise<string> {
  const worker = await createWorker("eng");
  
  try {
    const { data: { text } } = await worker.recognize(buffer);
    return text;
  } finally {
    await worker.terminate();
  }
}

/**
 * Main entry point for text extraction
 * Routes to appropriate handler based on MIME type
 */
export async function extractText(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === "application/pdf") {
    return await extractTextFromPDF(buffer);
  } else if (mimeType === "image/jpeg" || mimeType === "image/png") {
    return await extractTextFromImage(buffer);
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
}
