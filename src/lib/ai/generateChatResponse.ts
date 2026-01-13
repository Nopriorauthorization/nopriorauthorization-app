import OpenAI from "openai";
import { getMascotConfig, type MascotId } from "./mascotPrompts";
import {
  formatLibraryContext,
  getRelevantEntries,
  type LibraryTier,
} from "./library";
import { detectMascot } from "./routing";
import { getSafetyResponse, needsSafetyResponse } from "./safety";

let openaiClient: OpenAI | null = null;

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

export async function generateChatResponse(
  userMessage: string,
  mascotId?: string,
  tier: LibraryTier = "free",
  memoryContext?: string
) {
  const openai = getOpenAIClient();

  const appendDisclaimer = (text: string) => {
    if (text.includes("\n---\n")) return text;
    return `${text}\n\n---\nThis is educational information only, not medical advice. Always consult a licensed healthcare provider for personalized guidance.`;
  };

  if (needsSafetyResponse(userMessage)) {
    return appendDisclaimer(getSafetyResponse());
  }

  let activeMascotId = mascotId;
  const detected = await detectMascot(userMessage);
  if (!activeMascotId && detected.mascotId) {
    activeMascotId = detected.mascotId;
  }

  if (activeMascotId && detected.mascotId && activeMascotId !== detected.mascotId && detected.score > 0.62) {
    return `This sounds more like ${getMascotConfig(detected.mascotId).name}. Want me to switch?`;
  }

  const mascot = getMascotConfig(activeMascotId);
  const entries = await getRelevantEntries(mascot.id, userMessage, {
    tier,
    maxEntries: tier === "premium" ? 5 : 3,
  });
  if (entries.length === 0) {
    const fallback = detected.mascotId
      ? getMascotConfig(detected.mascotId).name
      : "another mascot";
    return appendDisclaimer(
      `That topic is a bit outside my lane. ${fallback} is a better fit for this question.`
    );
  }
  const libraryContext = formatLibraryContext(entries);
  const memoryBlock = memoryContext ? `${memoryContext}\n` : "";
  const responseRules =
    tier === "premium"
      ? "Keep the response clear and focused. Use 2-4 short paragraphs and one optional bullet list."
      : "Keep the response short (under 120 words), friendly, and easy to scan. Use up to 2 short paragraphs and optionally one bullet list.";

  const response = await openai.responses.create({
    model: mascot.model ?? "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              `${mascot.systemPrompt}\n\n` +
              memoryBlock +
              "LIBRARY CONTEXT (use only if relevant; do not mention the library):\n" +
              `${libraryContext}\n\n` +
              "RESPONSE RULES:\n" +
              `${responseRules}\n` +
              "Avoid overwhelming the user. Offer one gentle follow-up question only if clarification would help.",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: userMessage,
          },
        ],
      },
    ],
    temperature: mascot.temperature ?? 0.5,
  });

  const output = response.output_text?.trim() ?? "";
  return appendDisclaimer(output);
}
