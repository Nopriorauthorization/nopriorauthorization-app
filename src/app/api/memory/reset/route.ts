export const dynamic = "force-dynamic";
import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { resetMemory } from "@/lib/memory/userMemory";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;
  const anonId = request.cookies.get("npa_uid")?.value ?? null;

  if (!userId && !anonId) {
    return NextResponse.json(
      { error: "No memory context found." },
      { status: 400 }
    );
  }

  await resetMemory({ userId: userId ?? undefined, anonId: anonId ?? undefined });
  return NextResponse.json({ ok: true });
}
