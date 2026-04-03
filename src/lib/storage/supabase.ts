import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEFAULT_BUCKET = "documents";

export const documentsBucket =
  process.env.SUPABASE_DOCUMENTS_BUCKET ?? DEFAULT_BUCKET;

/** Public bucket for Facebook Graph image URLs (create in Supabase as public read). */
export const socialPostsBucket =
  process.env.SUPABASE_SOCIAL_BUCKET ?? "social-posts";

const SOCIAL_IMAGE_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_SOCIAL_IMAGE_BYTES = 8 * 1024 * 1024;

const hasSupabaseCredentials =
  typeof SUPABASE_URL === "string" &&
  SUPABASE_URL.length > 0 &&
  typeof SUPABASE_SERVICE_ROLE_KEY === "string" &&
  SUPABASE_SERVICE_ROLE_KEY.length > 0;

const supabaseStorage = hasSupabaseCredentials
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    })
  : null;

function ensureSupabase() {
  if (!supabaseStorage) {
    throw new Error(
      "Supabase storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return supabaseStorage;
}

export async function uploadToBucket({
  path,
  data,
  mimeType,
}: {
  path: string;
  data: Buffer;
  mimeType: string;
}) {
  const client = ensureSupabase();
  const { error } = await client.storage
    .from(documentsBucket)
    .upload(path, data, {
      contentType: mimeType,
      upsert: false,
    });
  if (error) throw error;
  return path;
}

export async function createSignedUrl(
  path: string,
  expiresIn: number
): Promise<string> {
  const client = ensureSupabase();
  const { data, error } = await client.storage
    .from(documentsBucket)
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

/**
 * Upload an image to the public social bucket and return a stable HTTPS URL for Facebook Graph.
 * Bucket must exist and allow public read (Supabase Storage → bucket → Public).
 */
export async function uploadPublicSocialImage(
  data: Buffer,
  mimeType: string
): Promise<{ path: string; publicUrl: string }> {
  const ext = SOCIAL_IMAGE_MIME_TO_EXT[mimeType];
  if (!ext) {
    throw new Error(
      `Unsupported image type: ${mimeType}. Use JPEG, PNG, WebP, or GIF.`
    );
  }
  if (data.length > MAX_SOCIAL_IMAGE_BYTES) {
    throw new Error("Image too large (max 8 MB).");
  }

  const client = ensureSupabase();
  const path = `facebook/${randomUUID()}.${ext}`;
  const { error: upErr } = await client.storage
    .from(socialPostsBucket)
    .upload(path, data, {
      contentType: mimeType,
      upsert: false,
    });
  if (upErr) throw upErr;

  const { data: pub } = client.storage
    .from(socialPostsBucket)
    .getPublicUrl(path);
  if (!pub?.publicUrl) {
    throw new Error("Could not build public URL — is the bucket public?");
  }
  return { path, publicUrl: pub.publicUrl };
}
