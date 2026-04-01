import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const access = req.cookies.get("canva_access_token")?.value;
  const refresh = req.cookies.get("canva_refresh_token")?.value;
  const scope = req.cookies.get("canva_scope")?.value;

  return NextResponse.json({
    connected: Boolean(access || refresh),
    hasAccessToken: Boolean(access),
    hasRefreshToken: Boolean(refresh),
    scope: scope || null,
  });
}
