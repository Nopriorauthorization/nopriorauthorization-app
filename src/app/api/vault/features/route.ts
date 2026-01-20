import { NextRequest, NextResponse } from 'next/server';
import { resolveDocumentIdentity } from '@/lib/documents/server';

export async function GET(req: NextRequest) {
  try {
    const identity = await resolveDocumentIdentity(req);
    
    return NextResponse.json({
      features: [],
      stats: { documents: 0, chats: 0, appointments: 0, decoded: 0 },
      vaultName: null,
      isEmpty: true,
      debug: {
        userId: !!identity.userId,
        anonId: !!identity.anonId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json({
      features: [],
      stats: { documents: 0, chats: 0, appointments: 0, decoded: 0 },
      vaultName: null,
      isEmpty: true,
      error: String(error)
    });
  }
}
