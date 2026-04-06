export const dynamic = "force-dynamic";

import { requireAdmin } from "@/lib/auth/admin-guard";
import { ProductFunnelsAdmin } from "./ProductFunnelsAdmin";

export default async function AdminProductFunnelsPage() {
  await requireAdmin("/admin/product-funnels");

  return (
    <div className="min-h-screen bg-black text-white">
      <ProductFunnelsAdmin />
    </div>
  );
}
