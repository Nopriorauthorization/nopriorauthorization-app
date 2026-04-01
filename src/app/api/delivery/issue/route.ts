import { NextRequest, NextResponse } from "next/server";
import { getDeliveryProductBySlugAsync } from "@/lib/delivery/catalog";
import { issueDeliveryToken } from "@/lib/delivery/token";

function isAuthorized(request: NextRequest): boolean {
  const configured = process.env.DELIVERY_ADMIN_KEY?.trim();
  if (!configured) return false;
  const provided = request.headers.get("x-delivery-admin-key")?.trim();
  return Boolean(provided && provided === configured);
}

/**
 * Manual/admin delivery issuance endpoint.
 * Future Etsy order automation can call this same route once order ingestion is live.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    productSlug?: string;
    buyerEmail?: string;
    orderRef?: string;
    expiresInDays?: number;
  };

  const productSlug = body.productSlug?.trim();
  const buyerEmail = body.buyerEmail?.trim().toLowerCase();
  const orderRef = body.orderRef?.trim();

  if (!productSlug || !buyerEmail) {
    return NextResponse.json(
      { error: "productSlug and buyerEmail are required." },
      { status: 400 }
    );
  }

  const product = await getDeliveryProductBySlugAsync(productSlug);
  if (!product) {
    return NextResponse.json(
      { error: `No imported delivery product found for slug "${productSlug}".` },
      { status: 404 }
    );
  }

  const token = issueDeliveryToken({
    productSlug,
    buyerEmail,
    orderRef,
    expiresInDays: body.expiresInDays,
  });

  const origin = request.nextUrl.origin;

  return NextResponse.json({
    ok: true,
    productSlug,
    productTitle: product.productTitle,
    deliveryUrl: `${origin}/delivery/${token}`,
    templateCount: product.templateCount,
  });
}
