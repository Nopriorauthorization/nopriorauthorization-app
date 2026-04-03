const GRAPH_VERSION = "v21.0";

export type FacebookPublishResult = {
  id?: string;
  post_id?: string;
  [key: string]: unknown;
};

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

function formatGraphError(data: unknown): string {
  const d = data as {
    error?: {
      message?: string;
      type?: string;
      code?: number;
      error_subcode?: number;
      fbtrace_id?: string;
    };
  };
  if (!d?.error) {
    try {
      return typeof data === "string" ? data : JSON.stringify(data);
    } catch {
      return "Unknown Graph API error";
    }
  }
  const e = d.error;
  const parts = [e.message, e.type && `(${e.type})`].filter(Boolean) as string[];
  if (e.code != null) parts.push(`code ${e.code}`);
  if (e.error_subcode != null) parts.push(`subcode ${e.error_subcode}`);
  if (e.fbtrace_id) parts.push(`trace ${e.fbtrace_id}`);
  return parts.join(" · ");
}

/**
 * Publish immediately to the Hello Gorgeous Facebook Page (Graph API).
 * Uses FB_PAGE_ID / FB_PAGE_ACCESS_TOKEN from Vercel (no separate NPA Page).
 * Requires FB_PAGE_ID and FB_PAGE_ACCESS_TOKEN.
 */
export async function publishToFacebookPage(opts: {
  message: string;
  imageUrl?: string | null;
}): Promise<FacebookPublishResult> {
  const pageToken = readFacebookEnv("FB_PAGE_ACCESS_TOKEN");
  const pageId = readFacebookEnv("FB_PAGE_ID");
  if (!pageToken || !pageId) {
    throw new Error("FB_PAGE_ACCESS_TOKEN and FB_PAGE_ID must be set");
  }

  const message = (opts.message ?? "").trim();
  const imageUrl = opts.imageUrl?.trim() || null;

  if (!message && !imageUrl) {
    throw new Error("Caption or image URL is required");
  }

  const base = `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}`;

  if (imageUrl) {
    const body = new URLSearchParams();
    body.set("url", imageUrl);
    body.set("access_token", pageToken);
    if (message) body.set("caption", message);

    const res = await fetch(`${base}/photos`, {
      method: "POST",
      body,
    });
    let data: FacebookPublishResult & { error?: { message?: string } };
    try {
      data = (await res.json()) as typeof data;
    } catch {
      throw new Error(`Facebook returned non-JSON (HTTP ${res.status})`);
    }
    if (!res.ok || data.error) {
      throw new Error(formatGraphError(data));
    }
    return data;
  }

  const body = new URLSearchParams();
  body.set("message", message);
  body.set("access_token", pageToken);

  const res = await fetch(`${base}/feed`, {
    method: "POST",
    body,
  });
  let data: FacebookPublishResult & { error?: { message?: string } };
  try {
    data = (await res.json()) as typeof data;
  } catch {
    throw new Error(`Facebook returned non-JSON (HTTP ${res.status})`);
  }
  if (!res.ok || data.error) {
    throw new Error(formatGraphError(data));
  }
  return data;
}
