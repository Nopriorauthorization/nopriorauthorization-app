/**
 * Homepage audience strip A/B — persisted in localStorage (per browser).
 * Destinations unchanged; copy only. IDs for GA4 / GTM: `experiment_variant`.
 */

export type AbLetter = "a" | "b";

const LS_HEADLINE = "npa_ab_home_headline";
const LS_CTA_STUDENT = "npa_ab_home_cta_student";
const LS_CTA_PROVIDER = "npa_ab_home_cta_provider";

/** Set by inline layout script before React; keeps first paint aligned with persisted LS. */
export const HOME_STRIP_VARIANTS_WINDOW_KEY = "__NPA_HOME_STRIP_VARIANTS__";

/** Session flag: last strip experiment id (for path entry + engagement breakdown). */
export const SESSION_EXPERIMENT_KEY = "npa_path_experiment_variant";

function pickAb(storageKey: string): AbLetter {
  if (typeof window === "undefined") return "a";
  const existing = window.localStorage.getItem(storageKey);
  if (existing === "a" || existing === "b") return existing;
  const next: AbLetter = Math.random() < 0.5 ? "a" : "b";
  window.localStorage.setItem(storageKey, next);
  return next;
}

export type HomeStripVariants = {
  headline: AbLetter;
  ctaStudent: AbLetter;
  ctaProvider: AbLetter;
};

declare global {
  interface Window {
    __NPA_HOME_STRIP_VARIANTS__?: HomeStripVariants;
  }
}

function isHomeStripVariants(v: unknown): v is HomeStripVariants {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  const ok = (x: unknown) => x === "a" || x === "b";
  return ok(o.headline) && ok(o.ctaStudent) && ok(o.ctaProvider);
}

export function readHomeStripVariants(): HomeStripVariants {
  if (typeof window !== "undefined") {
    const fromWindow = window.__NPA_HOME_STRIP_VARIANTS__;
    if (isHomeStripVariants(fromWindow)) return fromWindow;
  }
  return {
    headline: pickAb(LS_HEADLINE),
    ctaStudent: pickAb(LS_CTA_STUDENT),
    ctaProvider: pickAb(LS_CTA_PROVIDER),
  };
}

/**
 * Inline IIFE for <head>: mirrors `pickAb` + sets `window.__NPA_HOME_STRIP_VARIANTS__`.
 * Must stay in sync with keys and assignment logic in this module.
 */
export function getHomeStripAbInitScript(): string {
  const hk = JSON.stringify(LS_HEADLINE);
  const sk = JSON.stringify(LS_CTA_STUDENT);
  const pk = JSON.stringify(LS_CTA_PROVIDER);
  return `(function(){function p(k){try{var v=localStorage.getItem(k);if(v==="a"||v==="b")return v;v=Math.random()<0.5?"a":"b";localStorage.setItem(k,v);return v;}catch(e){return"a";}}var h=p(${hk}),ss=p(${sk}),sp=p(${pk});window.${HOME_STRIP_VARIANTS_WINDOW_KEY}={headline:h,ctaStudent:ss,ctaProvider:sp};})();`;
}

/** Compact id, e.g. `h_a_ss_b_sp_a` — use as single `experiment_variant` dimension. */
export function homeStripExperimentId(v: HomeStripVariants): string {
  return `h_${v.headline}_ss_${v.ctaStudent}_sp_${v.ctaProvider}`;
}

export function persistExperimentForPathSession(experimentId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SESSION_EXPERIMENT_KEY, experimentId);
  } catch {
    /* quota / private mode */
  }
}

export function readExperimentFromSession(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const v = window.sessionStorage.getItem(SESSION_EXPERIMENT_KEY);
    return v && v.length > 0 ? v : undefined;
  } catch {
    return undefined;
  }
}
