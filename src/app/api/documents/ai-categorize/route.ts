import { NextRequest, NextResponse } from "next/server";
import { smartCategorize, getCategoryDisplay } from "@/lib/documents/ai-categorization";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, filename, mimeType } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Get AI analysis
    const analysis = smartCategorize(title, filename, mimeType);
    const categoryDisplay = getCategoryDisplay(analysis.suggestedCategory);

    // Get all category options with display info
    const allCategories = ['LAB', 'IMAGING', 'VISIT_NOTE', 'DISCHARGE', 'OTHER'].map(cat => ({
      value: cat,
      ...getCategoryDisplay(cat)
    }));

    return NextResponse.json({
      analysis: {
        suggestedCategory: analysis.suggestedCategory,
        confidence: analysis.confidence,
        keywords: analysis.keywords,
        reasoning: analysis.reasoning,
        display: categoryDisplay
      },
      categories: allCategories
    });
  } catch (error) {
    console.error("Error analyzing document:", error);
    return NextResponse.json(
      { error: "Failed to analyze document" },
      { status: 500 }
    );
  }
}