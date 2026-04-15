import { createClient } from "@supabase/supabase-js";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export const dynamic = "force-dynamic";

const BUCKET = "micro270-chapters";
const PUBLIC_DIR = path.join(process.cwd(), "public/micro270");

export type Micro270ChapterRow = {
  ch: number;
  title: string;
  file: string;
  total: number;
  built: boolean;
  supabaseUrl: string | null;
};

function hasLocalChapter(file: string): boolean {
  return existsSync(path.join(PUBLIC_DIR, file));
}

function mergeChapter(
  ch: Omit<Micro270ChapterRow, "supabaseUrl">,
  uploadedNames: Set<string> | null,
  baseUrl: string | null
): Micro270ChapterRow {
  const localOk = hasLocalChapter(ch.file);
  const remoteOk = uploadedNames?.has(ch.file) ?? false;
  const built = localOk || remoteOk;
  const supabaseUrl =
    remoteOk && !localOk && baseUrl ? `${baseUrl}/${ch.file}` : null;
  return { ...ch, built, supabaseUrl };
}

async function loadManifest(): Promise<
  Omit<Micro270ChapterRow, "supabaseUrl">[]
> {
  const manifestPath = path.join(PUBLIC_DIR, "chapters.json");
  const raw = await readFile(manifestPath, "utf8");
  const parsed = JSON.parse(raw) as Omit<Micro270ChapterRow, "supabaseUrl">[];
  if (!Array.isArray(parsed)) {
    throw new Error("Invalid chapters manifest");
  }
  return parsed;
}

/**
 * built = chapter HTML exists locally under public/micro270/ OR appears in
 * Supabase bucket when configured. supabaseUrl is only set when the file is
 * on Storage but not local (local files stay same-origin).
 */
export async function GET() {
  let manifest: Omit<Micro270ChapterRow, "supabaseUrl">[];
  try {
    manifest = await loadManifest();
  } catch (e) {
    console.error("micro270 manifest read error", e);
    return NextResponse.json(
      { error: "Chapters manifest missing or invalid" },
      { status: 500 }
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    const chapters = manifest.map((ch) => mergeChapter(ch, null, null));
    return NextResponse.json(chapters);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const { data: files, error } = await supabase.storage.from(BUCKET).list();

  if (error) {
    console.error("micro270 storage list error", error.message);
    const chapters = manifest.map((ch) => mergeChapter(ch, null, null));
    return NextResponse.json(chapters);
  }

  const uploadedNames = new Set(
    (files ?? [])
      .filter((f) => f.name?.toLowerCase().endsWith(".html"))
      .map((f) => f.name)
  );

  const baseUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}`;

  const chapters = manifest.map((ch) =>
    mergeChapter(ch, uploadedNames, baseUrl)
  );

  return NextResponse.json(chapters);
}
