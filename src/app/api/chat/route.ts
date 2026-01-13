import { NextResponse, type NextRequest } from "next/server";
import { generateChatResponse } from "@/lib/ai/generateChatResponse";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import {
  buildMemoryPrompt,
  getMemory,
  getOrCreateAnonId,
  mergeMemory,
  updateMemoryFromMessage,
  upsertMemory,
} from "@/lib/memory/userMemory";

const ALLOWED_ORIGINS = new Set([
  "https://nopriorauthorization.com",
  "https://www.nopriorauthorization.com",
]);

function withCors(response: NextResponse, origin: string | null) {
  const isAllowed = origin && ALLOWED_ORIGINS.has(origin);
  const allowOrigin = isAllowed ? origin : "https://app.nopriorauthorization.com";
  response.headers.set("Access-Control-Allow-Origin", allowOrigin);
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Access-Control-Max-Age", "86400");
  if (isAllowed) {
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }
  return response;
}

export async function OPTIONS(request: NextRequest) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;
    const existingAnonId = request.cookies.get("npa_uid")?.value ?? null;
    const anonId = getOrCreateAnonId(existingAnonId);
    const shouldSetCookie = !existingAnonId;

    const body = await request.json();
    const message = body.message;
    const mascot = body.mascot;
    const tier = body.tier === "premium" ? "premium" : "free";

    if (!message || typeof message !== "string") {
      return withCors(
        NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
        ),
        request.headers.get("origin")
      );
    }

    if (userId && existingAnonId) {
      await mergeMemory({ userId, anonId });
    }

    const memoryRecord = await getMemory({
      userId: userId ?? undefined,
      anonId: userId ? undefined : anonId,
    });
    const memoryPayload = memoryRecord
      ? updateMemoryFromMessage(message, mascot, {
          goals: Array.isArray(memoryRecord.goals)
            ? (memoryRecord.goals as string[])
            : [],
          preferences:
            typeof memoryRecord.preferences === "object" &&
            memoryRecord.preferences !== null
              ? (memoryRecord.preferences as {
                  tone?: "calm" | "direct" | "supportive" | "witty";
                  depth?: "concise" | "detailed";
                  expertAffinity?: string;
                })
              : {},
          topicsDiscussed: Array.isArray(memoryRecord.topicsDiscussed)
            ? (memoryRecord.topicsDiscussed as string[])
            : [],
        })
      : updateMemoryFromMessage(message, mascot);

    if (!memoryRecord?.optOut) {
      await upsertMemory({
        userId: userId ?? undefined,
        anonId: userId ? undefined : anonId,
        payload: memoryPayload,
      });
    }

    const memoryContext = memoryRecord?.optOut
      ? ""
      : buildMemoryPrompt(memoryPayload);
    const aiResponse = await generateChatResponse(
      message,
      mascot,
      tier,
      memoryContext
    );

    const response = withCors(
      NextResponse.json({
        response: aiResponse,
        sessionId: "local-debug-session",
      }),
      request.headers.get("origin")
    );
    if (shouldSetCookie && !userId) {
      response.cookies.set("npa_uid", anonId, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }
    return response;
  } catch (error) {
    console.error("Chat API error:", error);
    return withCors(
      NextResponse.json(
        { error: "Failed to process message" },
        { status: 500 }
      ),
      request.headers.get("origin")
    );
  }
}
