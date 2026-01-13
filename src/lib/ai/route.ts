import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { BEAU_TOX_SYSTEM_PROMPT } from "@/lib/ai/beauToxPrompt";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const message = body?.message;
        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: 'Missing or invalid "message" in request body' }, { status: 400 });
        }

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Anthropic API key not configured" }, { status: 500 });
        }

        const anthropic = new Anthropic({ apiKey });

        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 500,
            system: BEAU_TOX_SYSTEM_PROMPT,
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
        });

        // response.content shape can vary; handle common cases defensively
        let reply = "";
        if (Array.isArray(response.content)) {
            reply = response.content[0]?.text ?? "";
        } else if (typeof response.content === "object" && response.content !== null) {
            // @ts-ignore
            reply = response.content.text ?? "";
        } else if (typeof response.content === "string") {
            // @ts-ignore
            reply = response.content;
        }

        return NextResponse.json({ reply });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Unknown error" },
            { status: 500 }
        );
    }
}