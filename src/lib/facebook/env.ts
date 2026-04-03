/** Trim and strip a single layer of wrapping quotes (common when pasting into Vercel). */
export function readFacebookEnv(name: string): string {
  const raw = process.env[name];
  if (raw == null || raw === "") return "";
  let s = raw.trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}
