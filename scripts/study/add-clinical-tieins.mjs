#!/usr/bin/env node
/**
 * Adds clinicalTieIn to every flashcard in anatomy-data.ts.
 * Uses OpenAI to generate 1-sentence nursing-relevant clinical tie-ins per batch.
 * Safe to re-run — skips cards that already have a clinicalTieIn.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const DATA_FILE = path.join(ROOT, "src/lib/study/anatomy-data.ts");
const PROGRESS_FILE = path.join(ROOT, "scripts/study/clinical-tieins-progress.json");

const OPENAI_KEY = process.env.OPENAI_API_KEY?.trim();
if (!OPENAI_KEY) { console.error("Missing OPENAI_API_KEY"); process.exit(1); }

async function callOpenAI(prompt) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${OPENAI_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0.4,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return JSON.parse(data.choices[0].message.content);
}

async function generateTieIns(lectureTitle, flashcards) {
  const cardList = flashcards
    .map((fc, i) => `${i}: term="${fc.term}" definition="${fc.definition.slice(0, 120)}"`)
    .join("\n");

  const prompt = `You are a nursing educator writing clinical tie-ins for A&P flashcards.

Lecture: "${lectureTitle}"

For each flashcard below, write ONE concise sentence (under 25 words) that connects the concept to nursing practice — a clinical scenario, assessment finding, drug mechanism, patient teaching moment, or why a nurse must know this.

Be specific and practical. Do NOT restate the definition. Use clinical language a nursing student would recognize.

Return JSON: { "tieins": ["sentence0", "sentence1", ...] } — one string per card, in order.

Cards:
${cardList}`;

  const result = await callOpenAI(prompt);
  return result.tieins;
}

// Load progress cache
let progress = {};
if (fs.existsSync(PROGRESS_FILE)) {
  progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8"));
}

function saveProgress() {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// Parse anatomy-data.ts to extract lectures
const src = fs.readFileSync(DATA_FILE, "utf8");

// Extract the JSON course object
const courseStart = src.indexOf("export const anatomyCourse: Course = ");
const objectStart = src.indexOf("{", courseStart);

// Find matching brace
let depth = 0, objectEnd = -1;
for (let i = objectStart; i < src.length; i++) {
  if (src[i] === "{") depth++;
  else if (src[i] === "}") { depth--; if (depth === 0) { objectEnd = i; break; } }
}

const courseJson = src.slice(objectStart, objectEnd + 1);
const course = JSON.parse(courseJson);

// Process each lecture
let totalUpdated = 0;
for (const lecture of course.lectures) {
  const cacheKey = lecture.id;
  const needsUpdate = lecture.flashcards.some(fc => !fc.clinicalTieIn);

  if (!needsUpdate) {
    console.log(`[${lecture.id}] All cards already have tie-ins — skipping`);
    continue;
  }

  const uncached = lecture.flashcards.filter(fc => !progress[`${lecture.id}:${fc.term}`]);

  if (uncached.length > 0) {
    console.log(`[${lecture.id}] Generating ${uncached.length} tie-ins for "${lecture.title}"...`);
    try {
      const tieins = await generateTieIns(lecture.title, uncached);
      uncached.forEach((fc, i) => {
        progress[`${lecture.id}:${fc.term}`] = tieins[i] || "";
      });
      saveProgress();
      console.log(`  ✓ Generated ${tieins.length} tie-ins`);
    } catch (e) {
      console.error(`  ✗ Failed for ${lecture.id}:`, e.message);
      continue;
    }
  }

  // Apply tie-ins to lecture flashcards
  for (const fc of lecture.flashcards) {
    const key = `${lecture.id}:${fc.term}`;
    if (progress[key]) {
      fc.clinicalTieIn = progress[key];
      totalUpdated++;
    }
  }
}

console.log(`\nTotal cards updated: ${totalUpdated}`);

// Reconstruct the file
const newCourseJson = JSON.stringify(course, null, 2);
const newSrc =
  src.slice(0, objectStart) +
  newCourseJson +
  src.slice(objectEnd + 1);

fs.writeFileSync(DATA_FILE, newSrc);
console.log("✓ anatomy-data.ts updated");
