import prisma from "@/lib/db";

export type ManifestTemplateInput = {
  id: string;
  name: string;
  description: string;
  canvaTemplateUrl: string;
  format?: string;
  pages?: number;
  category?: string;
  _deliveryType?: string;
};

export type ManifestInput = {
  productId: string;
  displayName: string;
  description?: string;
  version?: string;
  priceUSD?: number;
  etsySku: string;
  templates: ManifestTemplateInput[];
  deliveryNote?: string;
  expirationDays?: number;
  [key: string]: unknown;
};

/** URL counts as delivery-ready (Canva edit link or hosted HTML form). */
export function isDeliveryReadyUrl(url: string | null | undefined): boolean {
  if (!url || url === "PLACEHOLDER_CANVA_URL") return false;
  return (
    url.startsWith("https://www.canva.com/") || url.startsWith("/forms/")
  );
}

export function countFilledTemplates(
  templates: ManifestTemplateInput[]
): number {
  return templates.filter((t) => isDeliveryReadyUrl(t.canvaTemplateUrl)).length;
}

export function validateManifestPayload(
  data: unknown
): { valid: true; manifest: ManifestInput } | { valid: false; error: string } {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Not a valid JSON object" };
  }

  const m = data as Record<string, unknown>;

  if (!m.productId || typeof m.productId !== "string") {
    return { valid: false, error: "Missing productId" };
  }
  if (!m.displayName || typeof m.displayName !== "string") {
    return { valid: false, error: "Missing displayName" };
  }
  if (!m.etsySku || typeof m.etsySku !== "string") {
    return { valid: false, error: "Missing etsySku" };
  }
  if (!Array.isArray(m.templates) || m.templates.length === 0) {
    return { valid: false, error: "Missing or empty templates array" };
  }
  if (!/^[a-z0-9-]+$/.test(m.productId)) {
    return {
      valid: false,
      error:
        "productId must contain lowercase letters, numbers, and hyphens only",
    };
  }

  return { valid: true, manifest: data as ManifestInput };
}

export async function persistDeliveryManifest(
  incoming: ManifestInput,
  actor: { id: string; email: string }
): Promise<{
  templatesTotal: number;
  templatesFilled: number;
  deliveryReady: boolean;
}> {
  const filledTemplates = countFilledTemplates(incoming.templates);

  await prisma.analytics.create({
    data: {
      event: `delivery_manifest:${incoming.productId}`,
      userId: actor.id === "demo-admin" ? null : actor.id,
      metadata: {
        ...incoming,
        _importedViaAdmin: true,
        _importedBy: actor.email,
        _importedAt: new Date().toISOString(),
        _importStatus:
          filledTemplates === incoming.templates.length
            ? "ready"
            : `partial_${filledTemplates}_of_${incoming.templates.length}`,
      },
    },
  });

  return {
    templatesTotal: incoming.templates.length,
    templatesFilled: filledTemplates,
    deliveryReady: filledTemplates === incoming.templates.length,
  };
}
