import { NextResponse } from "next/server";
import { generateBeauToxResponse } from "@/lib/ai/generateBeauToxResponse";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await generateBeauToxResponse(message);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Beau-Tox error:", error);
    return NextResponse.json(
      { error: "Beau-Tox is thinking… try again." },
      { status: 500 }
    );
  }
}
