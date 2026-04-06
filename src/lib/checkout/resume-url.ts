import { STUDY_GUIDE_NCLEX_SLUG } from "@/config/study-guides.config";

export function getCheckoutResumeUrl(origin: string, productSlug: string, source: string): string {
  if (source === "study_guides" || productSlug === STUDY_GUIDE_NCLEX_SLUG) {
    return `${origin}/nclex-bundle`;
  }
  return `${origin}/shop/${encodeURIComponent(productSlug)}`;
}
