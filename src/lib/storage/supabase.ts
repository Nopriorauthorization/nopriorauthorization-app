import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEFAULT_BUCKET = "documents";

export const documentsBucket =
  process.env.SUPABASE_DOCUMENTS_BUCKET ?? DEFAULT_BUCKET;

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
