import { MascotId } from "./mascotPrompts";
import { getBestMascotByLibrary } from "./library";

const KEYWORD_ROUTES: Array<{ mascotId: MascotId; keywords: string[] }> = [
  {
    mascotId: "founder",
    keywords: ["founder", "why this exists", "upsold", "confused", "clarity"],
  },
  { mascotId: "beau-tox", keywords: ["botox", "neuromodulator", "wrinkle"] },
  { mascotId: "peppi", keywords: ["peptide", "bpc-157", "tb-500", "sermorelin"] },
  { mascotId: "filla-grace", keywords: ["filler", "ha filler", "biostimulator"] },
  { mascotId: "f-ill", keywords: ["migration", "overfilled", "dissolve"] },
  { mascotId: "rn-lisa-grace", keywords: ["consent", "red flag", "scope of practice"] },
  { mascotId: "slim-t", keywords: ["metabolism", "glp-1", "ozempic", "weight"] },
  { mascotId: "harmony", keywords: ["hormone", "estrogen", "progesterone", "testosterone"] },
  { mascotId: "ryan", keywords: ["consult", "provider", "it depends", "workflow"] },
];

export function keywordRoute(message: string): MascotId | null {
  const text = message.toLowerCase();
  for (const route of KEYWORD_ROUTES) {
    if (route.keywords.some((keyword) => text.includes(keyword))) {
      return route.mascotId;
    }
  }
  return null;
}

export async function detectMascot(
  message: string
): Promise<{ mascotId: MascotId | null; score: number }> {
  const keywordMascot = keywordRoute(message);
  if (keywordMascot) {
    return { mascotId: keywordMascot, score: 1 };
  }

  const best = await getBestMascotByLibrary(message);
  return {
    mascotId: best.mascotId as MascotId | null,
    score: best.score,
  };
}
