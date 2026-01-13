import { generateChatResponse } from "./generateChatResponse";

export async function generatePeppiResponse(userMessage: string) {
  return generateChatResponse(userMessage, "peppi");
}
