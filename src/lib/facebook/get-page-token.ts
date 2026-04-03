import prisma from "@/lib/db";
import { readFacebookEnv } from "@/lib/facebook/env";

export type FacebookTokenSource = "database" | "env";

/**
 * Page token for Graph calls: OAuth-stored row wins, else FB_PAGE_ACCESS_TOKEN env.
 */
export async function getFacebookPageAccessContext(): Promise<{
  pageId: string;
  accessToken: string;
  source: FacebookTokenSource;
} | null> {
  const pageId = readFacebookEnv("FB_PAGE_ID");
  if (!pageId) return null;

  const row = await prisma.facebookPageCredential.findUnique({
    where: { pageId },
    select: { accessToken: true },
  });
  const dbTok = row?.accessToken?.trim();
  if (dbTok) {
    return { pageId, accessToken: dbTok, source: "database" };
  }

  const envTok = readFacebookEnv("FB_PAGE_ACCESS_TOKEN");
  if (envTok) {
    return { pageId, accessToken: envTok, source: "env" };
  }

  return null;
}
