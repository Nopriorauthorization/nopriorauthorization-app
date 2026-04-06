import { STUDY_GUIDE_NCLEX_SLUG } from "@/config/study-guides.config";

export function getCheckoutResumeUrl(
  origin: string,
  productSlug: string,
  source: string,
  opts?: { funnelSessionId?: string | null },
): string {
  if (source === "study_guides" || productSlug === STUDY_GUIDE_NCLEX_SLUG) {
    return `${origin}/nclex-bundle`;
  }
  if (opts?.funnelSessionId) {
    return `${origin}/shop/${encodeURIComponent(productSlug)}/funnel`;
  }
  return `${origin}/shop/${encodeURIComponent(productSlug)}`;
}
