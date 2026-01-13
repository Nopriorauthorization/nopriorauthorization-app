import { NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/ai/generateChatResponse";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await generateChatResponse(message, "filla-grace");

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Filla Grace error:", error);
    return NextResponse.json(
      { error: "Filla Grace is thinking… try again." },
      { status: 500 }
    );
  }
}
