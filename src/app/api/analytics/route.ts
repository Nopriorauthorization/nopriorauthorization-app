export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const store = cookies();
    let anonId = store.get('anon_id')?.value ?? store.get('npa_uid')?.value ?? null;
    if (!anonId) {
      const id = (globalThis.crypto ?? require('crypto')).randomUUID();
      // Set both for compatibility
      store.set('anon_id', id, {
        path: '/', httpOnly: true, sameSite: 'lax', secure: true,
        maxAge: 60 * 60 * 24 * 365,
      });
      store.set('npa_uid', id, {
        path: '/', httpOnly: true, sameSite: 'lax', secure: true,
        maxAge: 60 * 60 * 24 * 365,
      });
      anonId = id;
    }

    const body = await req.json().catch(() => null);
    const event = typeof body?.event === 'string' ? body.event.trim() : '';
    if (!event || event.length > 64) {
      return NextResponse.json({ error: 'Invalid event.' }, { status: 400 });
    }

    // Placeholder: persist to DB if available; otherwise accept.
    return NextResponse.json({ success: true, anonId });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Server error' },
      { status: 500 }
    );
  }
}
