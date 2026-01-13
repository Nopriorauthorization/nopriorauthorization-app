import OpenAI from "openai";

let client: OpenAI | null = null;

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!client) {
    client = new OpenAI({ apiKey });
  }
  return client;
}

export async function getEmbedding(text: string): Promise<number[] | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8000),
  });

  return response.data?.[0]?.embedding ?? null;
}
