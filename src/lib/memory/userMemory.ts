import crypto from "crypto";
import prisma from "@/lib/db";

export type MemoryPayload = {
  goals: string[];
  preferences: {
    tone?: "calm" | "direct" | "supportive" | "witty";
    depth?: "concise" | "detailed";
    expertAffinity?: string;
  };
  topicsDiscussed: string[];
};

const DEFAULT_MEMORY: MemoryPayload = {
  goals: [],
  preferences: {},
  topicsDiscussed: [],
};

const GOAL_PATTERNS = [
  /my goal is (.+)/i,
  /i want to (.+)/i,
  /i'm trying to (.+)/i,
  /i am trying to (.+)/i,
];

const PREFERENCE_PATTERNS = [
  { pattern: /keep it short/i, depth: "concise" as const },
  { pattern: /keep it concise/i, depth: "concise" as const },
  { pattern: /give me the details/i, depth: "detailed" as const },
  { pattern: /more detail/i, depth: "detailed" as const },
  { pattern: /be direct/i, tone: "direct" as const },
  { pattern: /be calm/i, tone: "calm" as const },
  { pattern: /be supportive/i, tone: "supportive" as const },
  { pattern: /be witty/i, tone: "witty" as const },
];

const TOPIC_TAGS: Array<{ tag: string; pattern: RegExp }> = [
  { tag: "botox", pattern: /\bbotox|neuromodulator|tox\b/i },
  { tag: "fillers", pattern: /\bfiller|ha filler|biostimulator\b/i },
  { tag: "peptides", pattern: /\bpeptide|bpc-157|tb-500|sermorelin\b/i },
  { tag: "hormones", pattern: /\bhormone|testosterone|estrogen|progesterone\b/i },
  { tag: "weight-loss", pattern: /\bweight loss|glp-1|semaglutide|tirzepatide\b/i },
  { tag: "safety", pattern: /\bsafety|red flags|consent\b/i },
];

export function getOrCreateAnonId(existing?: string | null) {
  if (existing) return existing;
  return crypto.randomUUID();
}

export async function getMemory({
  userId,
  anonId,
}: {
  userId?: string | null;
  anonId?: string | null;
}) {
  if (userId) {
    return prisma.userMemory.findUnique({ where: { userId } });
  }
  if (anonId) {
    return prisma.userMemory.findUnique({ where: { anonId } });
  }
  return null;
}

export async function upsertMemory({
  userId,
  anonId,
  payload,
  disclaimerAcknowledged,
}: {
  userId?: string | null;
  anonId?: string | null;
  payload: MemoryPayload;
  disclaimerAcknowledged?: boolean;
}) {
  if (!userId && !anonId) return null;

  return prisma.userMemory.upsert({
    where: userId ? { userId } : { anonId: anonId! },
    update: {
      goals: payload.goals,
      preferences: payload.preferences,
      topicsDiscussed: payload.topicsDiscussed,
      ...(disclaimerAcknowledged !== undefined
        ? { disclaimerAcknowledged }
        : {}),
    },
    create: {
      userId,
      anonId,
      goals: payload.goals,
      preferences: payload.preferences,
      topicsDiscussed: payload.topicsDiscussed,
      disclaimerAcknowledged: disclaimerAcknowledged ?? false,
    },
  });
}

export async function mergeMemory({
  userId,
  anonId,
}: {
  userId: string;
  anonId: string;
}) {
  const anonMemory = await prisma.userMemory.findUnique({ where: { anonId } });
  if (!anonMemory) return null;

  const existing = await prisma.userMemory.findUnique({ where: { userId } });
  const merged = mergePayloads(
    normalizePayload(existing),
    normalizePayload(anonMemory)
  );

  await prisma.userMemory.upsert({
    where: { userId },
    update: {
      goals: merged.goals,
      preferences: merged.preferences,
      topicsDiscussed: merged.topicsDiscussed,
    },
    create: {
      userId,
      goals: merged.goals,
      preferences: merged.preferences,
      topicsDiscussed: merged.topicsDiscussed,
      disclaimerAcknowledged: anonMemory.disclaimerAcknowledged,
    },
  });

  await prisma.userMemory.delete({ where: { anonId } });
  return merged;
}

export async function resetMemory({
  userId,
  anonId,
}: {
  userId?: string | null;
  anonId?: string | null;
}) {
  if (userId) {
    await prisma.userMemory.deleteMany({ where: { userId } });
  }
  if (anonId) {
    await prisma.userMemory.deleteMany({ where: { anonId } });
  }
}

export function buildMemoryPrompt(memory: MemoryPayload | null) {
  if (!memory) return "";
  const { goals, preferences, topicsDiscussed } = memory;
  const chunks: string[] = [];

  if (goals.length) {
    chunks.push(`Goals: ${goals.join("; ")}`);
  }
  if (Object.keys(preferences).length) {
    const prefs = [
      preferences.tone ? `tone=${preferences.tone}` : null,
      preferences.depth ? `depth=${preferences.depth}` : null,
      preferences.expertAffinity
        ? `expert_affinity=${preferences.expertAffinity}`
        : null,
    ]
      .filter(Boolean)
      .join(", ");
    if (prefs) chunks.push(`Preferences: ${prefs}`);
  }
  if (topicsDiscussed.length) {
    chunks.push(`Topics discussed: ${topicsDiscussed.join(", ")}`);
  }

  if (!chunks.length) return "";
  return `USER MEMORY (do not mention explicitly):\n${chunks.join("\n")}\n`;
}

export function updateMemoryFromMessage(
  message: string,
  mascotId?: string,
  existing?: MemoryPayload
) {
  const payload = existing ? { ...existing } : { ...DEFAULT_MEMORY };
  payload.goals = [...payload.goals];
  payload.topicsDiscussed = [...payload.topicsDiscussed];
  payload.preferences = { ...payload.preferences };

  const goal = extractGoal(message);
  if (goal && !payload.goals.includes(goal)) {
    payload.goals.push(goal);
  }

  const preference = extractPreference(message);
  if (preference?.tone) {
    payload.preferences.tone = preference.tone;
  }
  if (preference?.depth) {
    payload.preferences.depth = preference.depth;
  }

  if (mascotId && mascotId !== "founder") {
    payload.preferences.expertAffinity = mascotId;
  }

  const topicTags = extractTopics(message);
  for (const tag of topicTags) {
    if (!payload.topicsDiscussed.includes(tag)) {
      payload.topicsDiscussed.push(tag);
    }
  }

  return payload;
}

function normalizePayload(memory: any): MemoryPayload {
  if (!memory) return { ...DEFAULT_MEMORY };
  return {
    goals: Array.isArray(memory.goals) ? memory.goals : [],
    preferences: typeof memory.preferences === "object" && memory.preferences !== null
      ? memory.preferences
      : {},
    topicsDiscussed: Array.isArray(memory.topicsDiscussed)
      ? memory.topicsDiscussed
      : [],
  };
}

function mergePayloads(base: MemoryPayload, incoming: MemoryPayload) {
  return {
    goals: Array.from(new Set([...base.goals, ...incoming.goals])),
    preferences: { ...base.preferences, ...incoming.preferences },
    topicsDiscussed: Array.from(
      new Set([...base.topicsDiscussed, ...incoming.topicsDiscussed])
    ),
  };
}

function extractGoal(message: string) {
  for (const pattern of GOAL_PATTERNS) {
    const match = message.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }
  return null;
}

function extractPreference(message: string) {
  for (const entry of PREFERENCE_PATTERNS) {
    if (entry.pattern.test(message)) {
      return {
        tone: entry.tone,
        depth: entry.depth,
      };
    }
  }
  return null;
}

function extractTopics(message: string) {
  return TOPIC_TAGS.filter((entry) => entry.pattern.test(message)).map(
    (entry) => entry.tag
  );
}
