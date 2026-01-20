import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { resolveDocumentIdentity } from "@/lib/documents/server";
import { extractMedicationsFromText, detectDrugInteractions } from "@/lib/drug-interactions";

// POST - Scan documents for drug interactions
export async function POST(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);

    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where = identity.userId ? { userId: identity.userId } : { anonId: identity.anonId };

    // Get recent documents that might contain medication information
    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20, // Scan last 20 documents
      select: {
        id: true,
        title: true,
        category: true,
      },
    });

    if (documents.length === 0) {
      return NextResponse.json({ interactions: [], message: "No documents to scan" });
    }

    // Extract medications from document titles and categories
    // TODO: In production, parse actual document content or decoded text
    const allMedications = [];
    for (const doc of documents) {
      // For now, we'll use title as a simple text source
      // In production, integrate with document decode or OCR results
      if (doc.title) {
        const meds = await extractMedicationsFromText(doc.title);
        allMedications.push(...meds);
      }
    }

    // Remove duplicates by medication name
    const uniqueMeds = allMedications.filter(
      (med, index, self) =>
        index === self.findIndex((m) => m.name.toLowerCase() === med.name.toLowerCase())
    );

    if (uniqueMeds.length < 2) {
      return NextResponse.json({
        interactions: [],
        message: "Found less than 2 medications. Need multiple medications to check interactions.",
        medications: uniqueMeds,
      });
    }

    // Detect interactions
    const interactions = await detectDrugInteractions(uniqueMeds);

    // Save new red flags to database
    const newFlags = [];
    for (const interaction of interactions) {
      // Check if this flag already exists and is not dismissed
      const existing = await prisma.redFlag.findFirst({
        where: {
          ...where,
          title: interaction.title,
          dismissed: false,
        },
      });

      if (!existing) {
        const flag = await prisma.redFlag.create({
          data: {
            userId: identity.userId || null,
            anonId: identity.anonId || null,
            type: interaction.type,
            severity: interaction.severity,
            title: interaction.title,
            description: interaction.description,
            medications: interaction.medications,
          },
        });
        newFlags.push(flag);
      }
    }

    return NextResponse.json({
      success: true,
      scannedDocuments: documents.length,
      medicationsFound: uniqueMeds.length,
      medications: uniqueMeds,
      interactions,
      newFlags: newFlags.length,
    });
  } catch (error) {
    console.error("Error scanning for interactions:", error);
    return NextResponse.json(
      { error: "Failed to scan for interactions" },
      { status: 500 }
    );
  }
}
