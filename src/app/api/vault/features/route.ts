export const runtime = "nodejs";

export async function GET() {
  // Bypass authentication for this public route
  return Response.json({
    features: [],
    stats: { documents: 0, chats: 0, appointments: 0, decoded: 0 },
    vaultName: null,
    isEmpty: true,
  });
}
// Force redeploy
