import { NextRequest, NextResponse } from "next/server";
import { CANVA_PROFILE_URL, getCanvaEnv } from "@/lib/canva/oauth";

export async function GET(req: NextRequest) {
  const cfg = getCanvaEnv();
  if (!cfg) {
    return NextResponse.json(
      { error: "Missing Canva environment configuration." },
      { status: 503 }
    );
  }

  const accessToken = req.cookies.get("canva_access_token")?.value;
  if (!accessToken) {
    return NextResponse.json(
      { error: "Not connected to Canva yet. Visit /canva and connect first." },
      { status: 401 }
    );
  }

  const res = await fetch(CANVA_PROFILE_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    return NextResponse.json(
      {
        connected: true,
        error: "Canva profile probe failed.",
        status: res.status,
        data: body,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    connected: true,
    data: body,
  });
}
