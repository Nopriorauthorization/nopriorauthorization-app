import fs from "node:fs";
import path from "node:path";
import { getEmbedding } from "./openaiEmbeddings";

export type LibraryTier = "free" | "premium";

export type LibraryEntry = {
  id: string;
  mascotId: string;
  tier: LibraryTier;
  title: string;
  summary: string;
  body: string;
  tags: string[];
  keywords: string[];
  embedding?: number[];
};

type LibraryOptions = {
  tier?: LibraryTier;
  maxEntries?: number;
};

let cachedEntries: LibraryEntry[] | null = null;

function loadLibraryEntries(): LibraryEntry[] {
  if (cachedEntries) return cachedEntries;

  const baseDir = path.join(process.cwd(), "src", "content", "mascots");
  if (!fs.existsSync(baseDir)) {
    cachedEntries = [];
    return cachedEntries;
  }

  const files = fs
    .readdirSync(baseDir)
    .filter((file) => file.endsWith(".json"));

  const entries = files.flatMap((file) => {
    const fullPath = path.join(baseDir, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(raw) as LibraryEntry[];
  });

  cachedEntries = entries;
  return entries;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let aNorm = 0;
  let bNorm = 0;
  for (let i = 0; i < a.length; i += 1) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    dot += av * bv;
    aNorm += av * av;
    bNorm += bv * bv;
  }
  if (!aNorm || !bNorm) return 0;
  return dot / (Math.sqrt(aNorm) * Math.sqrt(bNorm));
}

function buildEntryText(entry: LibraryEntry): string {
  return [
    entry.title,
    entry.summary,
    entry.body,
    entry.tags.join(" "),
    entry.keywords.join(" "),
  ]
    .join(" ")
    .trim();
}

export async function getRelevantEntries(
  mascotId: string,
  userMessage: string,
  options: LibraryOptions = {}
): Promise<LibraryEntry[]> {
  const tier = options.tier ?? "free";
  const maxEntries = options.maxEntries ?? (tier === "premium" ? 5 : 3);
  const entries = loadLibraryEntries().filter(
    (entry) =>
      entry.mascotId === mascotId &&
      (entry.tier === "free" || tier === "premium")
  );

  if (entries.length === 0) return [];

  const userEmbedding = await getEmbedding(userMessage);
  if (!userEmbedding) return entries.slice(0, maxEntries);

  const scored = entries
    .map((entry) => {
      const embedding =
        entry.embedding && entry.embedding.length > 0
          ? entry.embedding
          : undefined;
      return {
        entry,
        score: embedding ? cosineSimilarity(userEmbedding, embedding) : 0,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, maxEntries);

  return scored.map((item) => item.entry);
}

export async function getBestMascotByLibrary(
  userMessage: string
): Promise<{ mascotId: string | null; score: number }> {
  const entries = loadLibraryEntries();
  if (entries.length === 0) return { mascotId: null, score: 0 };

  const userEmbedding = await getEmbedding(userMessage);
  if (!userEmbedding) return { mascotId: null, score: 0 };

  let bestMascot: string | null = null;
  let bestScore = 0;

  for (const entry of entries) {
    if (!entry.embedding || entry.embedding.length === 0) continue;
    const score = cosineSimilarity(userEmbedding, entry.embedding);
    if (score > bestScore) {
      bestScore = score;
      bestMascot = entry.mascotId;
    }
  }

  return { mascotId: bestMascot, score: bestScore };
}

export function formatLibraryContext(entries: LibraryEntry[]): string {
  if (entries.length === 0) return "No relevant library entries found.";

  return entries
    .map(
      (entry) =>
        `- ${entry.title}: ${entry.summary}\n  Key idea: ${entry.body}`
    )
    .join("\n");
}

export function getEntryTextForEmbedding(entry: LibraryEntry): string {
  return buildEntryText(entry);
}
