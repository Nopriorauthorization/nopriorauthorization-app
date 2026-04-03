const GRAPH_VERSION = "v21.0";

export type FacebookPublishResult = {
  id?: string;
  post_id?: string;
  [key: string]: unknown;
};

/**
 * Publish immediately to the Hello Gorgeous Facebook Page (Graph API).
 * Uses FB_PAGE_ID / FB_PAGE_ACCESS_TOKEN from Vercel (no separate NPA Page).
 * Requires FB_PAGE_ID and FB_PAGE_ACCESS_TOKEN.
 */
export async function publishToFacebookPage(opts: {
  message: string;
  imageUrl?: string | null;
}): Promise<FacebookPublishResult> {
  const pageToken = process.env.FB_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FB_PAGE_ID;
  if (!pageToken?.trim() || !pageId?.trim()) {
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
    const data = (await res.json()) as FacebookPublishResult & {
      error?: { message?: string };
    };
    if (!res.ok || data.error) {
      throw new Error(data.error?.message ?? JSON.stringify(data));
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
  const data = (await res.json()) as FacebookPublishResult & {
    error?: { message?: string };
  };
  if (!res.ok || data.error) {
    throw new Error(data.error?.message ?? JSON.stringify(data));
  }
  return data;
}
