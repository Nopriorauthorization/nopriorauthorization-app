import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // For now, return empty vault data for all users (anonymous access)
  // This bypasses authentication issues until middleware is fixed
  return NextResponse.json({
    features: [],
    stats: { documents: 0, chats: 0, appointments: 0, decoded: 0 },
    vaultName: null,
    isEmpty: true,
  });
}
// Force redeploy
