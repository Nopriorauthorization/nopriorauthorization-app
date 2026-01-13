import { NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/ai/generateChatResponse";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message;
    const mascot = body.mascot;
    const tier = body.tier === "premium" ? "premium" : "free";

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const aiResponse = await generateChatResponse(message, mascot, tier);

    return NextResponse.json({
      response: aiResponse,
      sessionId: "local-debug-session",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
