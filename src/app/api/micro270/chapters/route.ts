import { createClient } from "@supabase/supabase-js";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import path from "path";
import {
  MICRO270_BANK_COOKIE,
  MICRO270_BANK_COOKIE_VALUE,
} from "@/config/micro270-sales.config";

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
  /** Launch in free hub without purchase (see chapters.json). */
  freeHubAccess: boolean;
  /** Launch allowed for this request (free preview or micro270_bank cookie). */
  hubLaunchAllowed: boolean;
};

type ManifestChapter = {
  ch: number;
  title: string;
  file: string;
  total: number;
  built?: boolean;
  freeHubAccess?: boolean;
};

function hasLocalChapter(file: string): boolean {
  return existsSync(path.join(PUBLIC_DIR, file));
}

function mergeChapter(
  ch: ManifestChapter,
  uploadedNames: Set<string> | null,
  baseUrl: string | null
): Omit<Micro270ChapterRow, "hubLaunchAllowed"> & { freeHubAccess: boolean } {
  const localOk = hasLocalChapter(ch.file);
  const remoteOk = uploadedNames?.has(ch.file) ?? false;
  const built = localOk || remoteOk;
  const supabaseUrl =
    remoteOk && !localOk && baseUrl ? `${baseUrl}/${ch.file}` : null;
  const freeHubAccess = Boolean(ch.freeHubAccess);
  return { ...ch, built, supabaseUrl, freeHubAccess };
}

async function loadManifest(): Promise<ManifestChapter[]> {
  const manifestPath = path.join(PUBLIC_DIR, "chapters.json");
  const raw = await readFile(manifestPath, "utf8");
  const parsed = JSON.parse(raw) as ManifestChapter[];
  if (!Array.isArray(parsed)) {
    throw new Error("Invalid chapters manifest");
  }
  return parsed;
}

function applyHubGate(
  row: Omit<Micro270ChapterRow, "hubLaunchAllowed"> & {
    freeHubAccess: boolean;
  },
  hasBankCookie: boolean
): Micro270ChapterRow {
  const hubLaunchAllowed = row.freeHubAccess || hasBankCookie;
  return {
    ...row,
    hubLaunchAllowed,
    supabaseUrl: hubLaunchAllowed ? row.supabaseUrl : null,
  };
}

/**
 * built = chapter HTML exists locally under public/micro270/ OR appears in
 * Supabase bucket when configured. hubLaunchAllowed gates Launch / URLs for
 * unpaid visitors (see middleware on /micro270/*.html).
 */
export async function GET() {
  let manifest: ManifestChapter[];
  try {
    manifest = await loadManifest();
  } catch (e) {
    console.error("micro270 manifest read error", e);
    return NextResponse.json(
      { error: "Chapters manifest missing or invalid" },
      { status: 500 }
    );
  }

  const hasBankCookie =
    cookies().get(MICRO270_BANK_COOKIE)?.value === MICRO270_BANK_COOKIE_VALUE;

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const mapWithGate = (
    rows: Array<
      Omit<Micro270ChapterRow, "hubLaunchAllowed"> & { freeHubAccess: boolean }
    >
  ) => rows.map((r) => applyHubGate(r, hasBankCookie));

  if (!supabaseUrl || !serviceKey) {
    const chapters = mapWithGate(manifest.map((ch) => mergeChapter(ch, null, null)));
    return NextResponse.json(chapters);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const { data: files, error } = await supabase.storage.from(BUCKET).list();

  if (error) {
    console.error("micro270 storage list error", error.message);
    const chapters = mapWithGate(manifest.map((ch) => mergeChapter(ch, null, null)));
    return NextResponse.json(chapters);
  }

  const uploadedNames = new Set(
    (files ?? [])
      .filter((f) => f.name?.toLowerCase().endsWith(".html"))
      .map((f) => f.name)
  );

  const baseUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}`;

  const chapters = mapWithGate(
    manifest.map((ch) => mergeChapter(ch, uploadedNames, baseUrl))
  );

  return NextResponse.json(chapters);
}
