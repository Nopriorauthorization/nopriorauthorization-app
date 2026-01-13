import { generatePeppiResponse } from "@/lib/ai/generatePeppiResponse";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await generatePeppiResponse(message);

    return Response.json({ response });
  } catch (err: any) {
    console.error("PEPPI API ERROR 👉", err);

    return Response.json(
      {
        error: err?.message || "Unknown Peppi error",
        stack: err?.stack || null,
      },
      { status: 500 }
    );
  }
}

