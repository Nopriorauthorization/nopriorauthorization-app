import { generateChatResponse } from "./generateChatResponse";

export async function generateBeauToxResponse(userMessage: string) {
  return generateChatResponse(userMessage, "beau-tox");
}
