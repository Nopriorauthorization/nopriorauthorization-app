import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";

export async function GET(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where = identity.userId
      ? { userId: identity.userId, deletedAt: null }
      : { anonId: identity.anonId, deletedAt: null };

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // Build query
    const query: any = { ...where };
    if (category && category !== "all") {
      query.category = category;
    }
    if (search) {
      query.OR = [
        { title: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch documents with decoded info
    const documents = await prisma.document.findMany({
      where: query,
      select: {
        id: true,
        title: true,
        category: true,
        mimeType: true,
        sizeBytes: true,
        docDate: true,
        createdAt: true,
        updatedAt: true,
        decodes: {
          select: {
            id: true,
            createdAt: true,
          },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate stats
    const totalDocuments = documents.length;
    const totalSize = documents.reduce((sum: number, doc: any) => sum + (doc.sizeBytes || 0), 0);
    const totalSizeMB = Math.round(totalSize / (1024 * 1024) * 10) / 10;

    // Category breakdown
    const categoryBreakdown: any = {};
    documents.forEach((doc: any) => {
      const cat = doc.category || "OTHER";
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
    });

    const categories = Object.entries(categoryBreakdown).map(([name, count]) => ({
      name: name.replace(/_/g, " "),
      value: name,
      count,
    }));

    // Recent uploads
    const recentUploads = documents.slice(0, 10).map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      category: doc.category,
      createdAt: doc.createdAt,
      hasDecoded: doc.decodes.length > 0,
    }));

    // Decoded count
    const decodedCount = documents.filter((doc: any) => doc.decodes.length > 0).length;

    const isEmpty = documents.length === 0;

    return NextResponse.json({
      documents,
      stats: {
        total: totalDocuments,
        totalSizeMB,
        decoded: decodedCount,
        categories: categories.length,
      },
      categories,
      recentUploads,
      isEmpty,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
