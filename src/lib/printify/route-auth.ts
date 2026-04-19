import { NextRequest } from "next/server";

/** POST /api/printify/order and GET /api/printify/blueprints — automation or admin. */
export function authorizePrintifyAdminOrKey(req: NextRequest): boolean {
  const adminKey = process.env.DELIVERY_ADMIN_KEY?.trim();
  const orderKey = process.env.PRINTIFY_ORDER_API_KEY?.trim();
  const provided =
    req.headers.get("x-delivery-admin-key")?.trim() ||
    req.headers.get("x-printify-order-key")?.trim();
  if (!provided) return false;
  if (adminKey && provided === adminKey) return true;
  if (orderKey && provided === orderKey) return true;
  return false;
}
