export type PathEntrySource = "home_strip" | "nav" | "shop_lane";

export function normalizePathEntrySource(
  raw: string | string[] | undefined | null,
): PathEntrySource {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === "home_strip" || v === "shop_lane" || v === "nav") return v;
  return "nav";
}
