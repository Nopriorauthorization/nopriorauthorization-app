import { NextRequest, NextResponse } from "next/server";
import { resolveDocumentIdentity } from "@/lib/documents/server";
import { uploadImage } from "@/lib/storage/media";

// POST - Upload a photo
export async function POST(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);

    if (!identity.userId && !identity.anonId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const photoFile = formData.get("photo") as File | null;
    const title = formData.get("title") as string | null;
    const category = formData.get("category") as string | null;

    if (!photoFile) {
      return NextResponse.json(
        { error: "Photo file is required" },
        { status: 400 }
      );
    }

    // Upload photo to Supabase Storage
    const userId = identity.userId || identity.anonId || "anonymous";
    const photoBuffer = Buffer.from(await photoFile.arrayBuffer());

    const { path, url } = await uploadImage({
      userId,
      file: photoBuffer,
      mimeType: photoFile.type,
    });

    // Return photo metadata with signed URL
    return NextResponse.json({
      success: true,
      photo: {
        path,
        url,
        mimeType: photoFile.type,
        size: photoFile.size,
        title,
        category,
      },
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload photo" },
      { status: 500 }
    );
  }
}
