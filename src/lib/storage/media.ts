import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MEDIA_BUCKET = "user-media";

// File size limits (in bytes)
const MAX_AUDIO_SIZE = 15 * 1024 * 1024; // 15MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

// Allowed MIME types
const ALLOWED_AUDIO_TYPES = [
  "audio/webm",
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/m4a",
];

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

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

/**
 * Validate file size and MIME type
 */
export function validateFile(
  file: File | Buffer,
  mimeType: string,
  type: "audio" | "image"
): { valid: boolean; error?: string } {
  const size = file instanceof File ? file.size : file.length;
  const maxSize = type === "audio" ? MAX_AUDIO_SIZE : MAX_IMAGE_SIZE;
  const allowedTypes =
    type === "audio" ? ALLOWED_AUDIO_TYPES : ALLOWED_IMAGE_TYPES;

  if (size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${maxSize / 1024 / 1024}MB limit`,
    };
  }

  if (!allowedTypes.includes(mimeType)) {
    return {
      valid: false,
      error: `Unsupported file type: ${mimeType}`,
    };
  }

  return { valid: true };
}

/**
 * Generate user-scoped storage path
 */
export function generateStoragePath(
  userId: string,
  type: "voice-memos" | "photos" | "misc",
  extension: string
): string {
  const uuid = randomUUID();
  return `${userId}/${type}/${uuid}${extension}`;
}

/**
 * Upload audio file to Supabase Storage
 */
export async function uploadAudio({
  userId,
  file,
  mimeType,
}: {
  userId: string;
  file: Buffer | File;
  mimeType: string;
}): Promise<{ path: string; url: string }> {
  const client = ensureSupabase();

  // Validate file
  const validation = validateFile(file, mimeType, "audio");
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Generate path with proper extension
  const extension = getExtensionFromMimeType(mimeType);
  const path = generateStoragePath(userId, "voice-memos", extension);

  // Upload to Supabase
  const { error } = await client.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) throw error;

  // Generate signed URL (valid for 15 minutes)
  const signedUrl = await createSignedUrl(path, 900);

  return { path, url: signedUrl };
}

/**
 * Upload image file to Supabase Storage
 */
export async function uploadImage({
  userId,
  file,
  mimeType,
}: {
  userId: string;
  file: Buffer | File;
  mimeType: string;
}): Promise<{ path: string; url: string }> {
  const client = ensureSupabase();

  // Validate file
  const validation = validateFile(file, mimeType, "image");
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Generate path with proper extension
  const extension = getExtensionFromMimeType(mimeType);
  const path = generateStoragePath(userId, "photos", extension);

  // Upload to Supabase
  const { error } = await client.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) throw error;

  // Generate signed URL (valid for 15 minutes)
  const signedUrl = await createSignedUrl(path, 900);

  return { path, url: signedUrl };
}

/**
 * Create signed URL for private file access
 */
export async function createSignedUrl(
  path: string,
  expiresIn: number = 900 // 15 minutes default
): Promise<string> {
  const client = ensureSupabase();
  const { data, error } = await client.storage
    .from(MEDIA_BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error) throw error;
  return data.signedUrl;
}

/**
 * Delete file from storage
 */
export async function deleteFile(path: string): Promise<void> {
  const client = ensureSupabase();
  const { error } = await client.storage.from(MEDIA_BUCKET).remove([path]);

  if (error) throw error;
}

/**
 * Get file extension from MIME type
 */
function getExtensionFromMimeType(mimeType: string): string {
  const extensions: Record<string, string> = {
    "audio/webm": ".webm",
    "audio/mpeg": ".mp3",
    "audio/mp3": ".mp3",
    "audio/mp4": ".m4a",
    "audio/m4a": ".m4a",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };

  return extensions[mimeType] || "";
}

/**
 * Extract storage path from signed URL
 */
export function extractPathFromUrl(url: string): string | null {
  try {
    // Supabase signed URLs have the path before the token
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/object\/sign\/user-media\/(.+)/);
    return pathMatch ? pathMatch[1] : null;
  } catch {
    return null;
  }
}
