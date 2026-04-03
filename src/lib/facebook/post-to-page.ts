import { getFacebookPageAccessContext } from "@/lib/facebook/get-page-token";

export { readFacebookEnv } from "@/lib/facebook/env";

const GRAPH_VERSION = "v21.0";

export type FacebookPublishResult = {
  id?: string;
  post_id?: string;
  [key: string]: unknown;
};

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
 * Uses OAuth-stored token if present, else FB_PAGE_ACCESS_TOKEN + FB_PAGE_ID.
 */
export async function publishToFacebookPage(opts: {
  message: string;
  imageUrl?: string | null;
}): Promise<FacebookPublishResult> {
  const ctx = await getFacebookPageAccessContext();
  if (!ctx) {
    throw new Error(
      "No Page token — use Connect Facebook on /admin/social or set FB_PAGE_ID and FB_PAGE_ACCESS_TOKEN"
    );
  }
  const { pageId, accessToken: pageToken } = ctx;

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
