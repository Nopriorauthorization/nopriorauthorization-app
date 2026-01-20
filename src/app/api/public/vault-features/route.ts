export async function GET() {
  return Response.json({
    features: [],
    stats: { documents: 0, chats: 0, appointments: 0, decoded: 0 },
    vaultName: null,
    isEmpty: true,
  });
}
