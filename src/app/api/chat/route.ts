import { NextResponse, type NextRequest } from "next/server";
import { generateChatResponse } from "@/lib/ai/generateChatResponse";

const ALLOWED_ORIGINS = new Set([
  "https://nopriorauthorization.com",
  "https://www.nopriorauthorization.com",
]);

function withCors(response: NextResponse, origin: string | null) {
  const allowOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : "*";
  response.headers.set("Access-Control-Allow-Origin", allowOrigin);
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
}

export async function OPTIONS(request: NextRequest) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

export async function POST(request: NextRequest) {
  try {
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

    const aiResponse = await generateChatResponse(message, mascot, tier);

    return withCors(
      NextResponse.json({
      response: aiResponse,
      sessionId: "local-debug-session",
      }),
      request.headers.get("origin")
    );
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
