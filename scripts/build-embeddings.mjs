import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Missing OPENAI_API_KEY");
  process.exit(1);
}

const client = new OpenAI({ apiKey });
const baseDir = path.join(process.cwd(), "src", "content", "mascots");
const files = fs.readdirSync(baseDir).filter((file) => file.endsWith(".json"));

async function embedText(text) {
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8000),
  });
  return response.data?.[0]?.embedding ?? [];
}

function buildText(entry) {
  return [
    entry.title,
    entry.summary,
    entry.body,
    (entry.tags || []).join(" "),
    (entry.keywords || []).join(" "),
  ]
    .join(" ")
    .trim();
}

for (const file of files) {
  const fullPath = path.join(baseDir, file);
  const raw = fs.readFileSync(fullPath, "utf8");
  const entries = JSON.parse(raw);

  for (const entry of entries) {
    const text = buildText(entry);
    entry.embedding = await embedText(text);
    console.log(`Embedded ${entry.id}`);
  }

  fs.writeFileSync(fullPath, JSON.stringify(entries, null, 2) + "\n");
}
