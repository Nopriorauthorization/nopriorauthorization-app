import { NextRequest, NextResponse } from "next/server";
import {
  documentSignedUrlExpires,
  findDocumentForOwner,
  resolveDocumentIdentity,
} from "@/lib/documents/server";
import { createSignedUrl } from "@/lib/storage/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const identity = await resolveDocumentIdentity(request);
  const document = await findDocumentForOwner(params.id, identity);
  const signedUrl = await createSignedUrl(
    document.storagePath,
    documentSignedUrlExpires
  );
  return NextResponse.json({ url: signedUrl });
}
