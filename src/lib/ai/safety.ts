const DIAGNOSIS_PATTERNS = [
  /do i have\s+/i,
  /am i\s+(sick|ill|diagnosed)/i,
  /diagnose\s+me/i,
  /what is wrong with me/i,
];

const TREATMENT_PATTERNS = [
  /how much\s+(botox|filler|units?)/i,
  /\b\d+\s*units?\b/i,
  /where should i inject/i,
  /how to inject/i,
  /dose|dosage/i,
  /treatment plan/i,
  /prescribe/i,
];

export function needsSafetyResponse(message: string): boolean {
  return (
    DIAGNOSIS_PATTERNS.some((pattern) => pattern.test(message)) ||
    TREATMENT_PATTERNS.some((pattern) => pattern.test(message))
  );
}

export function getSafetyResponse(): string {
  return [
    "I can share educational context, but I can't diagnose, prescribe, or give treatment instructions.",
    "If this is about your health, the safest next step is a licensed provider who can assess you in person.",
  ].join(" ");
}
