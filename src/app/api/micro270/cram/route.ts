/**
 * POST /api/micro270/cram
 *
 * Accepts student notes, calls Claude to generate professor-style
 * micro exam questions, returns a JSON array of Q&A objects.
 *
 * Auth: requires micro270_bank cookie (proves purchase).
 * Tier:  micro270_tier cookie determines cram limit (3 or unlimited).
 *        Usage counting is client-side (localStorage) for v1.
 */
export const dynamic = "force-dynamic";

import Anthropic from "@anthropic-ai/sdk";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  MICRO270_BANK_COOKIE,
  MICRO270_BANK_COOKIE_VALUE,
  MICRO270_TIER_COOKIE,
  MICRO270_TIER_BUNDLE,
  MICRO270_TIER_FULL,
} from "@/config/micro270-sales.config";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const SYSTEM_PROMPT = `You are a microbiology professor building an exam-prep question bank from student notes.

Given the student's notes, generate exactly 15 multiple-choice questions. Rules:
- Write scenario-based or clinical stems — not "What is X?" style
- Provide exactly 4 choices labeled A, B, C, D
- Identify the single correct answer
- Write a 2–3 sentence explanation covering why the answer is correct AND why the top distractor is wrong
- Set examTrap: true whenever the question tests a common misconception or easy-to-mix-up distinction

Return ONLY a valid JSON array, no markdown, no commentary:
[
  {
    "q": "question stem",
    "choices": { "A": "...", "B": "...", "C": "...", "D": "..." },
    "correct": "A",
    "explanation": "...",
    "examTrap": false
  }
]`;

export type CramQuestion = {
  q: string;
  choices: Record<string, string>;
  correct: string;
  explanation: string;
  examTrap: boolean;
};

export async function POST(req: NextRequest) {
  // Auth check
  const jar = cookies();
  const hasBank = jar.get(MICRO270_BANK_COOKIE)?.value === MICRO270_BANK_COOKIE_VALUE;
  if (!hasBank) {
    return NextResponse.json(
      { error: "Purchase required. Activate your access from your delivery email." },
      { status: 403 }
    );
  }

  const tier = jar.get(MICRO270_TIER_COOKIE)?.value;
  const hasCramAccess = tier === MICRO270_TIER_BUNDLE || tier === MICRO270_TIER_FULL;
  if (!hasCramAccess) {
    return NextResponse.json(
      { error: "AI cram tool requires the $67 or $97 tier." },
      { status: 403 }
    );
  }

  if (!anthropic) {
    return NextResponse.json(
      { error: "AI service not configured." },
      { status: 503 }
    );
  }

  let body: { notes?: string };
  try {
    body = (await req.json()) as { notes?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const notes = body.notes?.trim() ?? "";
  if (!notes || notes.length < 50) {
    return NextResponse.json(
      { error: "Please paste at least 50 characters of notes." },
      { status: 400 }
    );
  }
  if (notes.length > 20000) {
    return NextResponse.json(
      { error: "Notes too long — please keep it under 20,000 characters." },
      { status: 400 }
    );
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Here are my microbiology notes:\n\n${notes}`,
        },
      ],
    });

    const text = response.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") {
      throw new Error("No text response from Claude");
    }

    let questions: CramQuestion[];
    try {
      questions = JSON.parse(text.text) as CramQuestion[];
    } catch {
      // Claude occasionally wraps JSON in backticks — strip them
      const cleaned = text.text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      questions = JSON.parse(cleaned) as CramQuestion[];
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Unexpected response format");
    }

    return NextResponse.json({ questions, tier });
  } catch (err) {
    console.error("[micro270/cram] Claude error:", err);
    if (err instanceof Anthropic.APIError && err.status === 429) {
      return NextResponse.json({ error: "Too many requests — try again in a moment." }, { status: 429 });
    }
    return NextResponse.json({ error: "Failed to generate questions. Please try again." }, { status: 500 });
  }
}
