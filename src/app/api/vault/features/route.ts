import { NextResponse } from "next/server";


export async function GET() {
  // Bypass authentication for this public route
  return NextResponse.json({
    features: [],
    stats: { documents: 0, chats: 0, appointments: 0, decoded: 0 },
    vaultName: null,
    isEmpty: true,
  });
}
