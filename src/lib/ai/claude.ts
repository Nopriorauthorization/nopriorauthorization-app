import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt, containsForbiddenContent } from "./system-prompt";
import type { ChatMessage } from "@/types";

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn("ANTHROPIC_API_KEY is not set - AI chat will not work");
}

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const MAX_TOKENS = 1024;
const MODEL = "claude-sonnet-4-20250514";

export async function generateChatResponse(
  messages: ChatMessage[]
): Promise<string> {
  if (!anthropic) {
    throw new Error("AI service is not configured");
  }

  // Convert messages to Anthropic format
  const anthropicMessages = messages.map((msg) => ({
    role: msg.role as "user" | "assistant",
    content: msg.content,
  }));

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: getSystemPrompt(),
      messages: anthropicMessages,
    });

    // Extract text content
    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from AI");
    }

    let responseText = textContent.text;

    // Safety check: verify response doesn't contain forbidden content
    if (containsForbiddenContent(responseText)) {
      console.warn("Response contained potentially non-compliant content");
      // Add extra disclaimer for flagged responses
      responseText +=
        "\n\n*Note: Please consult a qualified healthcare provider for any specific treatment decisions.*";
    }

    // Ensure disclaimer is present (belt and suspenders)
    if (!responseText.includes("not medical advice")) {
      responseText +=
        "\n\n---\n*This is educational information only—not medical advice. Always consult a licensed healthcare provider for personalized recommendations.*";
    }

    return responseText;
  } catch (error) {
    console.error("Claude API error:", error);

    if (error instanceof Anthropic.APIError) {
      if (error.status === 429) {
        throw new Error("Too many requests. Please try again in a moment.");
      }
      if (error.status === 401) {
        throw new Error("AI service configuration error");
      }
    }

    throw new Error("Failed to generate response. Please try again.");
  }
}

// Rate limiting helper (simple in-memory, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  userId: string,
  maxRequests: number = 20,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
}
