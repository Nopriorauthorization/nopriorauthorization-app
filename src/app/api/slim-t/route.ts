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

    const response = await generateChatResponse(message, "slim-t");

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Slim-T error:", error);
    return NextResponse.json(
      { error: "Slim-T is thinking… try again." },
      { status: 500 }
    );
  }
}
